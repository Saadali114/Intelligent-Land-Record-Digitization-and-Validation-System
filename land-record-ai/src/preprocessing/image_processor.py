"""
Full Image Preprocessing Pipeline
==================================
Implements the 7-stage OpenCV image enhancement workflow:
Original -> Resize -> Grayscale -> Denoise -> Contrast Enhancement -> Deskew -> Thresholding -> Sharpen.
Configurable to compare raw vs. processed states.
"""

import os
import cv2
import numpy as np
from typing import Dict, Any, Optional, Tuple
from PIL import Image

from .deskew import deskew_document
from .enhancement import apply_denoising, apply_clahe, apply_thresholding, apply_sharpening


class PreprocessingResult:
    """Encapsulates output of the preprocessing pipeline."""
    def __init__(
        self,
        final_image: np.ndarray,
        original_shape: Tuple[int, int],
        processed_shape: Tuple[int, int],
        skew_angle: float,
        stages: Dict[str, np.ndarray],
        steps_log: list,
    ):
        self.final_image = final_image
        self.original_shape = original_shape
        self.processed_shape = processed_shape
        self.skew_angle = skew_angle
        self.stages = stages
        self.steps_log = steps_log

    def save_comparison(self, output_path: str) -> None:
        """Saves side-by-side or stage-by-stage visual inspection image."""
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        raw_gray = self.stages.get("grayscale")
        final = self.final_image

        if raw_gray is not None and final is not None:
            # Resize raw to match final for comparison strip
            h, w = final.shape[:2]
            raw_resized = cv2.resize(raw_gray, (w, h))
            if len(final.shape) == 2:
                final_bgr = cv2.cvtColor(final, cv2.COLOR_GRAY2BGR)
                raw_bgr = cv2.cvtColor(raw_resized, cv2.COLOR_GRAY2BGR)
            else:
                final_bgr = final
                raw_bgr = cv2.cvtColor(raw_resized, cv2.COLOR_GRAY2BGR)

            comparison = np.hstack([raw_bgr, final_bgr])
            cv2.imwrite(output_path, comparison)


class ImageProcessor:
    """Configurable OpenCV Image Processor for Land Record Scans."""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.target_max_dim = self.config.get("target_max_dim", 2200)
        self.enable_deskew = self.config.get("enable_deskew", True)
        self.enable_denoise = self.config.get("enable_denoise", True)
        self.enable_clahe = self.config.get("enable_clahe", True)
        self.enable_binarization = self.config.get("enable_binarization", True)
        self.binarization_method = self.config.get("binarization_method", "otsu")
        self.enable_sharpen = self.config.get("enable_sharpen", True)

    def load_image(self, input_source: Any) -> np.ndarray:
        """Loads image from file path, bytes, or numpy array."""
        if isinstance(input_source, np.ndarray):
            return input_source.copy()
        elif isinstance(input_source, (bytes, bytearray)):
            nparr = np.frombuffer(input_source, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                raise ValueError("Could not decode image from bytes")
            return img
        elif isinstance(input_source, str):
            if not os.path.exists(input_source):
                raise FileNotFoundError(f"Input image not found: {input_source}")
            img = cv2.imread(input_source, cv2.IMREAD_COLOR)
            if img is None:
                raise ValueError(f"OpenCV failed to read image from: {input_source}")
            return img
        else:
            raise TypeError(f"Unsupported image input type: {type(input_source)}")

    def process(self, input_source: Any, record_stages: bool = True) -> PreprocessingResult:
        """
        Executes the full preprocessing pipeline.

        Returns:
            PreprocessingResult with final image and stage snapshots.
        """
        original_img = self.load_image(input_source)
        orig_h, orig_w = original_img.shape[:2]
        stages: Dict[str, np.ndarray] = {}
        steps_log = []

        if record_stages:
            stages["original"] = original_img.copy()

        # Step 1: Resize if too large (preserving aspect ratio)
        img = original_img
        max_dim = max(orig_h, orig_w)
        if max_dim > self.target_max_dim:
            scale = self.target_max_dim / float(max_dim)
            new_w = int(orig_w * scale)
            new_h = int(orig_h * scale)
            img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
            steps_log.append(f"Resize: {orig_w}x{orig_h} -> {new_w}x{new_h}")
        else:
            steps_log.append(f"Dimensions: {orig_w}x{orig_h} (no downscale required)")

        # Step 2: Grayscale conversion
        if len(img.shape) == 3 and img.shape[2] == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            gray = img.copy()
        if record_stages:
            stages["grayscale"] = gray.copy()
        steps_log.append("Converted to Grayscale")

        # Step 3: Denoising
        if self.enable_denoise:
            gray = apply_denoising(gray)
            if record_stages:
                stages["denoised"] = gray.copy()
            steps_log.append("Applied Fast Non-Local Means Denoising")

        # Step 4: Contrast Enhancement (CLAHE)
        if self.enable_clahe:
            gray = apply_clahe(gray)
            if record_stages:
                stages["clahe"] = gray.copy()
            steps_log.append("Applied CLAHE Contrast Equalization")

        # Step 5: Deskewing
        skew_angle = 0.0
        if self.enable_deskew:
            gray, skew_angle = deskew_document(gray)
            if record_stages:
                stages["deskewed"] = gray.copy()
            steps_log.append(f"Deskew Angle Detected: {skew_angle:.2f} deg")

        # Step 6: Binarization (Otsu / Adaptive)
        if self.enable_binarization:
            binary = apply_thresholding(gray, method=self.binarization_method)
            if record_stages:
                stages["binarized"] = binary.copy()
            steps_log.append(f"Applied {self.binarization_method.capitalize()} Binarization")
            working_img = binary
        else:
            working_img = gray

        # Step 7: Sharpening
        if self.enable_sharpen:
            final_img = apply_sharpening(working_img)
            if record_stages:
                stages["sharpened"] = final_img.copy()
            steps_log.append("Applied Stroke Sharpening Kernel")
        else:
            final_img = working_img

        proc_h, proc_w = final_img.shape[:2]
        return PreprocessingResult(
            final_image=final_img,
            original_shape=(orig_h, orig_w),
            processed_shape=(proc_h, proc_w),
            skew_angle=skew_angle,
            stages=stages,
            steps_log=steps_log,
        )


# Global default processor instance
image_processor = ImageProcessor()
