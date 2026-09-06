"""
Document OCR and Entity Overlay Visualizer
==========================================
Renders bounding boxes, entity highlights, and low-confidence visual alerts
directly onto document images.
"""

import cv2
import numpy as np
from typing import List, Dict, Any, Optional
from PIL import Image, ImageDraw, ImageFont

from ..extraction.labels import LABEL_COLORS


def hex_to_bgr(hex_str: str) -> tuple:
    """Converts #RRGGBB hex string to OpenCV (B, G, R) tuple."""
    hex_clean = hex_str.lstrip('#')
    if len(hex_clean) != 6:
        return (0, 128, 255)
    r = int(hex_clean[0:2], 16)
    g = int(hex_clean[2:4], 16)
    b = int(hex_clean[4:6], 16)
    return (b, g, r)


class DocumentVisualizer:
    """Renders visual overlays for OCR tokens and recognized land entities."""

    def __init__(self, low_confidence_threshold: float = 0.70):
        self.low_confidence_threshold = low_confidence_threshold

    def draw_overlays(
        self,
        image: np.ndarray,
        tokens: List[Dict[str, Any]],
        detected_entities: Optional[List[Dict[str, Any]]] = None,
        alpha: float = 0.35,
    ) -> np.ndarray:
        """
        Draws OCR tokens and highlighted entity bounding boxes.

        Args:
            image: Base BGR or Grayscale document image.
            tokens: List of OCR tokens with 'bbox' [x1, y1, x2, y2], 'text', and 'confidence'.
            detected_entities: Optional list of entities mapped to token indices or text.
            alpha: Transparency for filled entity highlighting.

        Returns:
            Annotated BGR image with bounding boxes and entity badges.
        """
        if len(image.shape) == 2:
            canvas = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        else:
            canvas = image.copy()

        overlay = canvas.copy()
        entity_map: Dict[str, str] = {}

        if detected_entities:
            for ent in detected_entities:
                val_str = str(ent.get("value", "")).strip()
                if val_str:
                    entity_map[val_str] = ent.get("label", "ENTITY")

        # Step 1: Draw OCR boxes and highlight recognized entity tokens
        for t in tokens:
            bbox = t.get("bbox", [0, 0, 0, 0])
            x1, y1, x2, y2 = bbox
            text = t.get("text", "").strip()
            conf = float(t.get("confidence", 0.90))

            # Determine entity label if token matches any entity
            matched_label = None
            for ent_text, lbl in entity_map.items():
                if text in ent_text or ent_text in text:
                    matched_label = lbl
                    break

            if matched_label:
                # Color code based on entity
                color_hex = LABEL_COLORS.get(matched_label, "#2563eb")
                bgr_color = hex_to_bgr(color_hex)

                # Filled rectangle on overlay for translucent highlight
                cv2.rectangle(overlay, (x1, y1), (x2, y2), bgr_color, -1)
                # Solid border
                cv2.rectangle(canvas, (x1, y1), (x2, y2), bgr_color, 2)

                # Small label badge above box
                badge_text = f"[{matched_label}]"
                cv2.putText(
                    canvas, badge_text, (x1, max(y1 - 6, 12)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, bgr_color, 1, cv2.LINE_AA
                )
            else:
                # Plain OCR token box (subtle gray)
                is_low_conf = conf < self.low_confidence_threshold
                box_color = (0, 165, 255) if is_low_conf else (180, 180, 180)  # Orange if low confidence
                thickness = 2 if is_low_conf else 1
                cv2.rectangle(canvas, (x1, y1), (x2, y2), box_color, thickness)

                if is_low_conf:
                    cv2.putText(
                        canvas, f"! {conf:.0%}", (x1, max(y1 - 4, 10)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 140, 255), 1, cv2.LINE_AA
                    )

        # Blend the translucent overlay
        cv2.addWeighted(overlay, alpha, canvas, 1 - alpha, 0, canvas)
        return canvas

    def save_visualization(
        self,
        output_path: str,
        image: np.ndarray,
        tokens: List[Dict[str, Any]],
        detected_entities: Optional[List[Dict[str, Any]]] = None,
    ) -> str:
        """Draws overlay and saves image to disk."""
        annotated = self.draw_overlays(image, tokens, detected_entities)
        cv2.imwrite(output_path, annotated)
        return output_path


# Global visualizer instance
document_visualizer = DocumentVisualizer()
