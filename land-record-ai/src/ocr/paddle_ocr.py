"""
PaddleOCR Integration Module
=============================
Wraps PaddleOCR for multilingual document text recognition (Marathi, Hindi, English).
Extracts word/line bounding boxes, confidence scores, and page numbers.
"""

from typing import List, Dict, Any, Optional
import numpy as np


class PaddleOCREngine:
    """Wrapper around PaddleOCR preserving bounding box coordinates and confidence."""

    def __init__(self, lang: str = "mr", use_gpu: bool = False):
        self.lang = lang
        self.use_gpu = use_gpu
        self._ocr = None
        self._is_available = None

    def is_available(self) -> bool:
        """Checks if PaddleOCR package and models can be imported and initialized."""
        if self._is_available is not None:
            return self._is_available
        try:
            from paddleocr import PaddleOCR
            self._is_available = True
        except (ImportError, Exception):
            self._is_available = False
        return self._is_available

    def _get_ocr(self):
        if self._ocr is None:
            from paddleocr import PaddleOCR
            # 'mr' (Marathi), 'hi' (Hindi), or 'en' (English)
            self._ocr = PaddleOCR(
                use_angle_cls=True,
                lang=self.lang,
                use_gpu=self.use_gpu,
                show_log=False
            )
        return self._ocr

    def run(self, image: np.ndarray, page_num: int = 1) -> List[Dict[str, Any]]:
        """
        Runs PaddleOCR detection + recognition.

        Returns:
            List of dicts with:
                - text: recognized string
                - confidence: float (0.0 to 1.0)
                - bbox: [x1, y1, x2, y2]
                - page: int
        """
        if not self.is_available():
            raise RuntimeError("PaddleOCR is not installed or available in the current environment.")

        ocr = self._get_ocr()
        results = ocr.ocr(image, cls=True)
        tokens: List[Dict[str, Any]] = []

        if not results or not results[0]:
            return tokens

        for line in results[0]:
            # line format: [ [ [x1,y1], [x2,y2], [x3,y3], [x4,y4] ], (text, confidence) ]
            coords, (text_val, conf_val) = line
            text_str = str(text_val).strip()
            if not text_str:
                continue

            pts = np.array(coords, dtype=np.int32)
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
