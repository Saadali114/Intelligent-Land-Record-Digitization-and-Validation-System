"""
Master OCR Processor
====================
Coordinates pretrained OCR recognition across PaddleOCR (preferred) and EasyOCR (fallback).
Preserves word-level and line-level bounding boxes, confidence, and page indexing.
"""

import os
import json
import numpy as np
from typing import List, Dict, Any, Optional, Tuple

from .paddle_ocr import PaddleOCREngine


class OCRResult:
    """Standardized OCR response container."""

    def __init__(
        self,
        document_id: str,
        engine_used: str,
        tokens: List[Dict[str, Any]],
        full_text: str,
        page_count: int = 1,
        meta: Optional[Dict[str, Any]] = None,
    ):
        self.document_id = document_id
        self.engine_used = engine_used
        self.tokens = tokens
        self.full_text = full_text
        self.page_count = page_count
        self.meta = meta or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "document_id": self.document_id,
            "engine": self.engine_used,
            "page_count": self.page_count,
            "total_tokens": len(self.tokens),
            "tokens": self.tokens,
            "full_text": self.full_text,
            "meta": self.meta,
        }

    def save(self, file_path: str) -> None:
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(self.to_dict(), f, indent=2, ensure_ascii=False)


class OCRProcessor:
    """Master OCR orchestrator for land documents."""

    def __init__(
        self,
        primary_engine: str = "paddleocr",
        languages: Optional[List[str]] = None,
        use_gpu: bool = False,
    ):
        self.primary_engine = primary_engine.lower()
        self.languages = languages or ["mr", "hi", "en"]
        self.use_gpu = use_gpu

        # Initialize PaddleOCR engine
        self._paddle = PaddleOCREngine(lang="mr", use_gpu=use_gpu)
        self._easyocr_reader = None

    def _get_easyocr(self):
        if self._easyocr_reader is None:
            import easyocr
            # Check for existing local models directory
            candidate_dirs = [
                os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../ai-service/models")),
                os.path.abspath(os.path.join(os.path.dirname(__file__), "../../models")),
                os.path.expanduser("~/.EasyOCR/model"),
            ]
            storage_dir = None
            for d in candidate_dirs:
                if os.path.exists(d) and (os.path.exists(os.path.join(d, "craft_mlt_25k.pth")) or os.path.exists(os.path.join(d, "devanagari.pth"))):
                    storage_dir = d
                    break

            print(f"[OCR] Initializing EasyOCR Devanagari model (storage: {storage_dir or 'default'})...")
            kwargs = {"gpu": self.use_gpu, "verbose": False}
            if storage_dir:
                kwargs["model_storage_directory"] = storage_dir
            self._easyocr_reader = easyocr.Reader(["hi", "en"], **kwargs)
        return self._easyocr_reader

    def _run_easyocr(self, image: np.ndarray, page_num: int = 1) -> List[Dict[str, Any]]:
        reader = self._get_easyocr()
        # detail=1 returns [ [ [x1,y1],[x2,y2],[x3,y3],[x4,y4] ], text, conf ]
        results = reader.readtext(image, detail=1, paragraph=False)
        tokens: List[Dict[str, Any]] = []

        for item in results:
            if len(item) == 3:
                bbox_pts, text_val, conf_val = item
            elif len(item) == 2:
                bbox_pts, text_val = item
                conf_val = 0.80
            else:
                continue

            text_str = str(text_val).strip()
            if not text_str or conf_val < 0.15:
                continue

            pts = np.array(bbox_pts, dtype=np.int32)
            x1 = int(np.min(pts[:, 0]))
            y1 = int(np.min(pts[:, 1]))
            x2 = int(np.max(pts[:, 0]))
            y2 = int(np.max(pts[:, 1]))

            tokens.append({
                "text": text_str,
                "confidence": round(float(conf_val), 4),
                "bbox": [x1, y1, x2, y2],
                "page": page_num,
            })

        return tokens

    def process_image(
        self,
        image: np.ndarray,
        document_id: str = "DOC_001",
        page_num: int = 1,
    ) -> OCRResult:
        """
        Runs OCR using PaddleOCR if available; falls back to EasyOCR.
        """
        engine_used = ""
        tokens: List[Dict[str, Any]] = []

        # Attempt PaddleOCR first if requested
        if self.primary_engine == "paddleocr" and self._paddle.is_available():
            try:
                tokens = self._paddle.run(image, page_num=page_num)
                engine_used = "PaddleOCR"
            except Exception as e:
                print(f"[OCR] PaddleOCR run failed ({e}). Falling back to EasyOCR...")

        # Fallback to EasyOCR
        if not tokens:
            try:
                tokens = self._run_easyocr(image, page_num=page_num)
                engine_used = "EasyOCR-Multilingual"
            except Exception as e:
                print(f"[OCR] EasyOCR also failed: {e}")
                tokens = []
                engine_used = "None"

        # Combine text in natural top-to-bottom, left-to-right order
        # Sort tokens primarily by y1 (vertical) then x1 (horizontal) with threshold
        sorted_tokens = sorted(tokens, key=lambda t: (t["bbox"][1] // 20, t["bbox"][0]))
        full_text = "\n".join([t["text"] for t in sorted_tokens])

        return OCRResult(
            document_id=document_id,
            engine_used=engine_used,
            tokens=sorted_tokens,
            full_text=full_text,
            page_count=1,
            meta={"token_count": len(sorted_tokens)},
        )


# Global default processor instance
ocr_processor = OCRProcessor()
