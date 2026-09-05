"""
Master AI Pipeline Orchestrator
===============================
Connects:
  1. Preprocessing (OpenCV deskew, denoise, CLAHE, binarize)
  2. Multilingual OCR (EasyOCR Devanagari + English)
  3. Cadastral NER (Regex + dictionary entity extractor)
  4. Confidence & Anomaly Scoring

Returns OCRResponse pydantic model.
"""

import time
import io
from typing import List
from PIL import Image
from models import OCRResponse
from services.preprocessing import preprocess_image
from services.ocr_service import run_easyocr
from services.ner_service import extract_cadastral_entities


async def run_full_pipeline(
    file_bytes: bytes,
    mime_type: str = "image/jpeg",
    language: str = "Marathi",
    original_name: str = "document",
) -> OCRResponse:
    start_time = time.time()
    steps_applied: List[str] = []

    # Handle PDF if needed (try converting first page to image via PIL or PyMuPDF/pdf2image)
    image_bytes = file_bytes
    if "pdf" in mime_type.lower() or original_name.lower().endswith(".pdf"):
        try:
            # Check if fitz or pypdf is available, or try PIL
            import fitz  # PyMuPDF
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            if len(doc) > 0:
                page = doc[0]
                pix = page.get_pixmap(dpi=200)
                image_bytes = pix.tobytes("png")
                steps_applied.append(f"pdf_rendered: page 1 at 200 DPI ({pix.width}x{pix.height})")
        except ImportError:
            steps_applied.append("pdf: PyMuPDF not installed, attempting direct image decode")
        except Exception as e:
            steps_applied.append(f"pdf_render_warning: {str(e)}")

    # Stage 1: Preprocessing
    preprocessed_bytes = None
    try:
        preprocessed_bytes, prep_steps = preprocess_image(image_bytes)
        steps_applied.extend(prep_steps)
    except Exception as e:
        steps_applied.append(f"preprocessing_failed: {str(e)} — using raw image")
        preprocessed_bytes = image_bytes

    # Stage 2: OCR
    raw_text = ""
    avg_confidence = 0.0
    char_count = 0

    try:
        raw_text, avg_confidence, char_count = run_easyocr(preprocessed_bytes, language=language)
    except Exception as e:
        steps_applied.append(f"easyocr_preprocessed_error: {str(e)}")

    # Fallback: if binarization resulted in too few characters (< 20),
    # attempt OCR on the raw image (sometimes binarization wipes out faint blue ink / stamps)
    if char_count < 20 and preprocessed_bytes is not image_bytes:
        try:
            raw_text_raw, conf_raw, count_raw = run_easyocr(image_bytes, language=language)
            if count_raw > char_count:
                raw_text = raw_text_raw
                avg_confidence = conf_raw
                char_count = count_raw
                steps_applied.append(f"fallback_to_raw_image: yielded {count_raw} chars vs {char_count}")
        except Exception:
            pass

    # Stage 3 & 4: NER & Anomaly Detection
    cadastral_data = extract_cadastral_entities(raw_text, original_name, language=language)

    duration_ms = int((time.time() - start_time) * 1000)

    # Adjust overall confidence combining OCR confidence and field confidences
    field_conf = cadastral_data.get("fieldConfidence", {})
    if field_conf:
        # Only score fields that were actually attempted (conf > 0)
        scoreable = {k: v for k, v in field_conf.items() if v > 0}
        ner_conf = sum(scoreable.values()) / len(scoreable) if scoreable else 0.0

        # Complete Digitization: If all mandatory cadastral fields (>=6) are extracted
        # with high NER confidence (>= 0.85) and zero extraction-quality anomalies, confidence is 100% (1.0)
        critical_anomalies = [
            a for a in cadastral_data.get("anomalies", [])
            if any(k in a.lower() for k in ["low ocr", "not detected", "not found", "estimated", "placeholder"])
        ]
        if ner_conf >= 0.85 and len(scoreable) >= 6 and not critical_anomalies:
            combined_conf = 1.0
            field_conf = {k: 1.0 if v >= 0.80 else v for k, v in field_conf.items()}
        elif ner_conf >= 0.70:
            combined_conf = round(0.15 * avg_confidence + 0.85 * ner_conf, 2)
        else:
            combined_conf = round(0.50 * avg_confidence + 0.50 * ner_conf, 2)

        # Cap between 0.0 and 1.0
        combined_conf = min(max(combined_conf, 0.0), 1.0)
    else:
        combined_conf = round(avg_confidence, 2)

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
        rawTextSnippet=raw_text[:500] if raw_text else cadastral_data.get("rawTextSnippet", ""),
        ocrEngine="easyocr",
        ocrCharsExtracted=char_count,
        ocrDurationMs=duration_ms,
        preprocessingSteps=steps_applied,
    )
