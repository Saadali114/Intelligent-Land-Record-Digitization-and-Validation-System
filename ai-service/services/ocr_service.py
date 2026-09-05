"""
Stage 2 — Multilingual OCR with EasyOCR
=========================================
EasyOCR is significantly better than Tesseract for:
  - Devanagari script (Marathi, Hindi)
  - Low-quality / aged scans
  - Mixed-script documents (Marathi + English on same page)
  - Handwritten annotations

Language support map mirrors the Express backend langMap.
OCR results are returned as a single concatenated text string
with word bounding boxes available for future NER highlighting.
"""

# pyrefly: ignore [missing-import]
import easyocr
import numpy as np
from typing import Tuple, List, Dict, Any
import time
import io
from PIL import Image


# EasyOCR language map — mirrors the Express backend langMap
LANG_MAP: Dict[str, List[str]] = {
    "Marathi": ["hi", "en"],   # EasyOCR uses Hindi model for Marathi (same Devanagari script)
    "Hindi": ["hi", "en"],
    "English": ["en"],
    "Gujarati": ["gu", "en"],
    "Bengali": ["bn", "en"],
    "Tamil": ["ta", "en"],
    "Telugu": ["te", "en"],
    "Kannada": ["kn", "en"],
    "Malayalam": ["ml", "en"],
    "Punjabi": ["en"],          # EasyOCR Gurmukhi support limited, fallback to English
    "Odia": ["en"],             # Limited support, fallback
}

# Global reader cache — EasyOCR model loading is expensive (~3–10s first time)
# We cache by language combo to avoid reloading for every request.
_reader_cache: Dict[str, easyocr.Reader] = {}


def get_reader(language: str) -> easyocr.Reader:
    """Get or create a cached EasyOCR reader for the given language."""
    langs = LANG_MAP.get(language, ["hi", "en"])
    cache_key = "+".join(sorted(langs))

    if cache_key not in _reader_cache:
        print(f"[OCR] Loading EasyOCR model for: {langs} (first load ~10s)...")
        _reader_cache[cache_key] = easyocr.Reader(
            langs,
            gpu=False,          # Set to True if CUDA GPU available for 10x speedup
            model_storage_directory="./models",
            download_enabled=True,
            verbose=False,
        )
        print(f"[OCR] Model loaded and cached for: {cache_key}")

    return _reader_cache[cache_key]


def run_easyocr(image_bytes: bytes, language: str = "Marathi") -> Tuple[str, float, int]:
    """
    Run EasyOCR on preprocessed image bytes.

    Returns:
        text          — extracted text as single string
        confidence    — average confidence (0.0 – 1.0)
        char_count    — number of characters extracted
    """
    t0 = time.time()
    reader = get_reader(language)

    # Convert bytes to numpy array for EasyOCR
    nparr = np.frombuffer(image_bytes, np.uint8)
    img_array = np.array(Image.open(io.BytesIO(image_bytes)).convert("RGB"))

    # Run detection + recognition
    results = reader.readtext(
        img_array,
        detail=1,
        paragraph=False,       # Keep lines separate for cadastral form field matching
        width_ths=0.7,         # Merge horizontally close text boxes
        height_ths=0.5,        # Merge vertically close text boxes
        batch_size=4,          # Process 4 text regions at once
    )

    lines = []
    confidences = []

    for item in results:
        if len(item) == 3:
            bbox, text, conf = item
        elif len(item) == 2:
            bbox, text = item
            conf = 0.85
        else:
            continue

        text = text.strip()
        if text and conf > 0.15:  # Filter very low-confidence garbage
            lines.append(text)
            confidences.append(float(conf))

    full_text = "\n".join(lines)
    avg_conf = float(np.mean(confidences)) if confidences else 0.0
    duration_ms = int((time.time() - t0) * 1000)

    print(
        f"[OCR] EasyOCR complete — "
        f"chars: {len(full_text)}, "
        f"confidence: {avg_conf:.2%}, "
        f"time: {duration_ms}ms"
    )

    return full_text, avg_conf, len(full_text)
