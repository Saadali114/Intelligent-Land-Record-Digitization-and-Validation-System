"""
ILRDVS Python FastAPI AI Service
=================================
Handles:
  1. OpenCV image preprocessing  (deskew, denoise, binarize)
  2. EasyOCR multilingual OCR    (Marathi, Hindi, English)
  3. Regex + heuristic NER       (cadastral field extraction)
  4. Business validation         (confidence scoring, anomaly checks)
  5. Duplicate detection         (survey # + owner name similarity)

Port: 8000  (called by Express backend at http://localhost:8000)
"""

import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
from dotenv import load_dotenv

load_dotenv()

from services.pipeline import run_full_pipeline
from services.duplicate import check_duplicate
from models import OCRRequest, OCRResponse, DuplicateCheckRequest, DuplicateCheckResponse

app = FastAPI(
    title="ILRDVS AI Service",
    description="Python AI microservice for OCR, NER, and validation of Indian land records",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:3000", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ILRDVS-AI-Service", "version": "1.0.0"}


@app.post("/extract", response_model=OCRResponse)
async def extract_document(
    file: UploadFile = File(...),
    language: str = "Marathi",
    file_name: str = "document",
):
    """
    Main endpoint — receives a raw image/PDF file from Express backend,
    runs the full 5-stage AI pipeline, and returns structured cadastral data.
    """
    try:
        contents = await file.read()
        result = await run_full_pipeline(
            file_bytes=contents,
            mime_type=file.content_type or "image/jpeg",
            language=language,
            original_name=file_name,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI pipeline failed: {str(e)}")


@app.post("/duplicate-check", response_model=DuplicateCheckResponse)
async def duplicate_check(req: DuplicateCheckRequest):
    """
    Checks if a survey number + owner combination already exists in records
    provided from Express (Express sends the candidate + existing records list).
    """
    try:
        result = check_duplicate(req)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Duplicate check failed: {str(e)}")


if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
