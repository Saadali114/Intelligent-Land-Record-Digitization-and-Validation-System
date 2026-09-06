"""
Master AI Pipeline Orchestrator
===============================
Connects:
  1. Multi-pass Adaptive Self-Correcting Extraction Pipeline
  2. Error Self-Diagnostics & Strategy Shifts
  3. Dynamic Learned Correction Feedback Memory
  4. Confidence & Anomaly Scoring

Returns OCRResponse pydantic model.
"""

import time
from models import OCRResponse
from services.adaptive_pipeline import run_adaptive_pipeline


async def run_full_pipeline(
    file_bytes: bytes,
    mime_type: str = "image/jpeg",
    language: str = "Marathi",
    original_name: str = "document",
    clean_background: bool = True,
) -> OCRResponse:
    """
    Executes the self-diagnosing, multi-pass adaptive extraction pipeline.
    """
    cadastral_data = await run_adaptive_pipeline(
        file_bytes=file_bytes,
        mime_type=mime_type,
        language=language,
        original_name=original_name,
        clean_background=clean_background,
    )

    field_conf = cadastral_data.get("fieldConfidence", {})
    combined_conf = cadastral_data.get("overallConfidence", 0.85)

    return OCRResponse(
        ownerName=cadastral_data.get("ownerName", ""),
        surveyNumber=cadastral_data.get("surveyNumber", ""),
        khasraNumber=cadastral_data.get("khasraNumber", ""),
        khataNumber=cadastral_data.get("khataNumber", ""),
        plotArea=cadastral_data.get("plotArea", ""),
        village=cadastral_data.get("village", ""),
        tehsil=cadastral_data.get("tehsil", ""),
        district=cadastral_data.get("district", ""),
        landClassification=cadastral_data.get("landClassification", "Agricultural (Jirayat)"),
        ownershipType=cadastral_data.get("ownershipType", "Occupant Class 1 (भोगवटादार वर्ग - १)"),
        mutationNumber=cadastral_data.get("mutationNumber", ""),
        registrationNumber=cadastral_data.get("registrationNumber", ""),
        remarks=cadastral_data.get("remarks", ""),
        entities=cadastral_data.get("entities", {}),
        overallConfidence=combined_conf,
        fieldConfidence=field_conf,
        anomalies=cadastral_data.get("anomalies", []),
        rawTextSnippet=cadastral_data.get("rawTextSnippet", ""),
        ocrEngine=cadastral_data.get("ocrEngine", "EasyOCR-Adaptive-v2.5"),
        ocrCharsExtracted=cadastral_data.get("ocrCharsExtracted", 0),
        ocrDurationMs=cadastral_data.get("ocrDurationMs", 0),
        preprocessingSteps=cadastral_data.get("preprocessingSteps", []),
    )
