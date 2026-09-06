"""
Land Record AI - FastAPI Microservice
======================================
Endpoints:
- GET  /health
- POST /extract
- POST /feedback (and POST /api/v1/feedback)
- POST /train
- GET  /model/status
- GET  /annotator (Interactive Web Annotation Studio)
- Document & Annotation management APIs
"""

import os
import sys
import glob
import json
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure root land-record-ai is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.pipeline import land_pipeline, LandRecordInferencePipeline
from src.training.train import train_model
from src.training.model import load_trained_model


app = FastAPI(
    title="Maharashtra Land Record AI",
    description="Domain-Specific AI Microservice for Historical Cadastral Digitization",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------

class FeedbackPayload(BaseModel):
    documentId: str = Field(..., description="Document identifier")
    field: str = Field(..., description="Entity field name, e.g. OWNER_NAME")
    predictedValue: str = Field(..., description="Raw model prediction")
    correctedValue: str = Field(..., description="Human verifier ground-truth correction")
    verifierNotes: Optional[str] = None


class TrainRequest(BaseModel):
    task: str = "ner"
    epochs: int = Field(5, ge=1, le=50)
    batch_size: int = Field(8, ge=1, le=64)
    learning_rate: float = Field(2.0e-5, gt=0.0)
    output_dir: str = "models/land-ner-v1"


class SaveAnnotationPayload(BaseModel):
    document_id: str
    text: str
    entities: List[Dict[str, Any]]


# ---------------------------------------------------------------------------
# System Endpoints
# ---------------------------------------------------------------------------

@app.get("/health")
async def health_check():
    """System health check and GPU acceleration detection."""
    import torch
    cuda_available = torch.cuda.is_available()
    return {
        "status": "ok",
        "service": "Maharashtra Land Record AI",
        "version": "1.0.0",
        "cuda_available": cuda_available,
        "device": torch.cuda.get_device_name(0) if cuda_available else "CPU",
    }


@app.get("/model/status")
async def model_status(model_dir: str = "models/land-ner-v1"):
    """
    Returns the real evaluation status of the model.
    Does NOT claim accuracy if no model is trained.
    """
    model, _, info = load_trained_model(model_dir)
    if model is None:
        return {
            "status": "NOT_TRAINED",
            "message": "No trained model/evaluation results available.",
            "model_dir": model_dir,
            "metrics": None,
        }

    return {
        "status": "TRAINED",
        "model_dir": model_dir,
        "metrics": info.get("metadata", {}),
    }


@app.post("/extract")
async def extract_document(file: UploadFile = File(...)):
    """
    Inference endpoint — receives scanned document image,
    executes image preprocessing, OCR, and Land NER extraction.
    """
    try:
        contents = await file.read()
        filename = file.filename or "document.jpg"
        doc_id = os.path.splitext(filename)[0]

        result = land_pipeline.process(contents, document_id=doc_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction pipeline failed: {str(e)}")


@app.post("/feedback")
@app.post("/api/v1/feedback")
async def record_feedback(payload: FeedbackPayload):
    """
    Human Correction Loop (Requirement 21)
    Saves human verifier corrections to data/corrections/ for future retraining.
    """
    os.makedirs("data/corrections", exist_ok=True)
    corr_file = os.path.join("data", "corrections", "corrections_log.jsonl")

    correction_entry = {
        "documentId": payload.documentId,
        "field": payload.field,
        "predictedValue": payload.predictedValue,
        "correctedValue": payload.correctedValue,
        "verifierNotes": payload.verifierNotes or "",
    }

    with open(corr_file, "a", encoding="utf-8") as f:
        f.write(json.dumps(correction_entry, ensure_ascii=False) + "\n")

    return {
        "success": True,
        "message": f"Correction for document {payload.documentId} logged for active learning retraining.",
    }


@app.post("/train")
async def trigger_training(req: TrainRequest, background_tasks: BackgroundTasks):
    """
    Controlled Training Endpoint (Requirement 22)
    Validates training parameters and runs fine-tuning in background.
    """
    # Verify train directory exists
    if not os.path.exists("data/train"):
        raise HTTPException(status_code=400, detail="Training directory 'data/train' does not exist. Please create and split dataset first.")

    def run_training_job():
        train_model(
            model_name="xlm-roberta-base",
            train_data_path="data/train",
            val_data_path="data/validation",
            output_dir=req.output_dir,
            epochs=req.epochs,
            batch_size=req.batch_size,
            learning_rate=req.learning_rate,
        )

    background_tasks.add_task(run_training_job)
    return {
        "status": "TRAINING_STARTED",
        "output_dir": req.output_dir,
        "message": f"Training job dispatched for {req.epochs} epochs. Check /model/status for updates.",
    }


# ---------------------------------------------------------------------------
# Annotation Tool Support Endpoints
# ---------------------------------------------------------------------------

@app.get("/", response_class=HTMLResponse)
@app.get("/annotator", response_class=HTMLResponse)
async def serve_annotator_ui():
    """Serves the interactive web annotation tool."""
    html_path = os.path.join(os.path.dirname(__file__), "static", "annotator.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>Annotator HTML not found</h1>", status_code=404)


@app.get("/api/v1/documents")
async def list_available_documents():
    """Lists documents available for annotation."""
    docs = []
    for raw_path in glob.glob("data/raw/**/*.*", recursive=True):
        if raw_path.lower().endswith(('.jpg', '.jpeg', '.png')):
            fname = os.path.basename(raw_path)
            doc_id = os.path.splitext(fname)[0]
            dtype = os.path.basename(os.path.dirname(raw_path))
            docs.append({
                "id": doc_id,
                "type": dtype,
                "filename": fname,
                "path": raw_path,
            })
    return docs


@app.get("/api/v1/documents/{doc_id}")
async def get_document_annotation_data(doc_id: str):
    """Returns OCR tokens, full text, and existing annotations for doc_id."""
    ocr_path = os.path.join("data", "ocr", f"{doc_id}.json")
    ann_path = os.path.join("data", "annotations", f"{doc_id}.json")

    tokens = []
    text = ""
    entities = []

    if os.path.exists(ocr_path):
        with open(ocr_path, "r", encoding="utf-8") as f:
            ocr_data = json.load(f)
            tokens = ocr_data.get("tokens", [])
            text = ocr_data.get("full_text", "")

    if os.path.exists(ann_path):
        with open(ann_path, "r", encoding="utf-8") as f:
            ann_data = json.load(f)
            entities = ann_data.get("entities", [])
            if not text:
                text = ann_data.get("text", "")

    return {
        "document_id": doc_id,
        "text": text,
        "tokens": tokens,
        "entities": entities,
        "imageUrl": f"/api/v1/documents/{doc_id}/image",
    }


@app.get("/api/v1/documents/{doc_id}/image")
async def get_document_image(doc_id: str):
    """Serves raw document image."""
    matches = glob.glob(f"data/raw/**/{doc_id}.*", recursive=True)
    if matches and os.path.exists(matches[0]):
        return FileResponse(matches[0])
    raise HTTPException(status_code=404, detail="Image file not found")


@app.post("/api/v1/annotations/save")
async def save_annotation(payload: SaveAnnotationPayload):
    """Saves user annotations to data/annotations/<doc_id>.json."""
    os.makedirs("data/annotations", exist_ok=True)
    ann_path = os.path.join("data", "annotations", f"{payload.document_id}.json")

    with open(ann_path, "w", encoding="utf-8") as f:
        json.dump({
            "document_id": payload.document_id,
            "text": payload.text,
            "entities": payload.entities,
        }, f, indent=2, ensure_ascii=False)

    return {
        "success": True,
        "document_id": payload.document_id,
        "saved_entities_count": len(payload.entities),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
