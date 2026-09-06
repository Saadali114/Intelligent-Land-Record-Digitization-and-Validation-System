"""
Document Image Enhancement Module
==================================
Algorithms for denoising, CLAHE contrast equalization, adaptive thresholding,
and sharpening for historical and degraded land documents.
"""

import cv2
import numpy as np
from typing import Tuple


def apply_denoising(
    gray: np.ndarray,
    h: float = 10.0,
    template_window_size: int = 7,
    search_window_size: int = 21,
) -> np.ndarray:
    """
    Applies Non-Local Means Denoising to remove scan grain, paper texture, and dust.
    """
    if gray is None or gray.size == 0:
        return gray
    denoised = cv2.fastNlMeansDenoising(
        gray,
        None,
        h=h,
        templateWindowSize=template_window_size,
        searchWindowSize=search_window_size,
    )
    return denoised


def apply_clahe(
    gray: np.ndarray,
    clip_limit: float = 2.0,
    tile_grid_size: Tuple[int, int] = (8, 8),
) -> np.ndarray:
    """
    Applies Contrast Limited Adaptive Histogram Equalization (CLAHE)
    to reveal faded stamps, light handwriting, and old ink.
    """
    if gray is None or gray.size == 0:
        return gray
    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)
    enhanced = clahe.apply(gray)
    return enhanced


def apply_thresholding(
    gray: np.ndarray,
    method: str = "otsu",
) -> np.ndarray:
    """
    Binarizes image into high-contrast black and white text.
    Methods: 'otsu', 'adaptive', 'sauvola_approx'
    """
    if gray is None or gray.size == 0:
        return gray

    if method == "adaptive":
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY, 25, 11
        )
    else:  # Default to Otsu
        # Smooth slightly before Otsu
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)
        _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    return thresh


def apply_sharpening(image: np.ndarray) -> np.ndarray:
    """
    Sharpens strokes using unsharp masking to enhance fine Devanagari matras and dots.
    """
    if image is None or image.size == 0:
        return image

    gaussian = cv2.GaussianBlur(image, (0, 0), 2.0)
    # unsharp mask = image * 1.5 - gaussian * 0.5
    sharpened = cv2.addWeighted(image, 1.4, gaussian, -0.4, 0)
    return sharpened
