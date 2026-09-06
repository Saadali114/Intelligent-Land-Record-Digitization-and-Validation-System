"""
Document Deskewing Module
==========================
Detects and corrects rotational skew in scanned cadastral records using
contour minimum area bounding boxes and morphological line analysis.
"""

import cv2
import numpy as np
from typing import Tuple


def detect_skew_angle(gray_image: np.ndarray, max_angle: float = 45.0) -> float:
    """
    Detects skew angle in degrees using minAreaRect on document text contours.

    Returns:
        Skew angle in degrees (positive or negative).
    """
    if gray_image is None or gray_image.size == 0:
        return 0.0

    # Invert image: text becomes white on black background
    thresh = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    # Morphological dilation to merge adjacent letters into horizontal text lines
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (30, 3))
    dilated = cv2.dilate(thresh, kernel, iterations=2)

    # Find contours of horizontal text lines
    contours, _ = cv2.findContours(dilated, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    angles = []

    for c in contours:
        # Filter small noise contours
        if cv2.contourArea(c) < 500:
            continue
        rect = cv2.minAreaRect(c)
        angle = rect[-1]

        # Convert OpenCV minAreaRect angles into range [-45, 45]
        if angle < -45:
            angle = -(90 + angle)
        elif angle > 45:
            angle = 90 - angle
        else:
            angle = -angle

        if abs(angle) <= max_angle and abs(angle) > 0.3:
            angles.append(angle)

    if not angles:
        return 0.0

    # Use median angle to ignore outliers
    median_angle = float(np.median(angles))
    return median_angle


def rotate_image(image: np.ndarray, angle: float, background_color: Tuple[int, int, int] = (255, 255, 255)) -> np.ndarray:
    """
    Rotates image around center point without clipping boundaries.
    """
    if abs(angle) < 0.2:
        return image.copy()

    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)

    # Compute rotation matrix
    M = cv2.getRotationMatrix2D(center, angle, 1.0)

    # Compute new bounding dimensions so corners aren't cropped
    cos = np.abs(M[0, 0])
    sin = np.abs(M[0, 1])
    new_w = int((h * sin) + (w * cos))
    new_h = int((h * cos) + (w * sin))

    # Adjust transformation matrix center
    M[0, 2] += (new_w / 2) - center[0]
    M[1, 2] += (new_h / 2) - center[1]

    border_val = background_color if len(image.shape) == 3 else 255
    rotated = cv2.warpAffine(
        image, M, (new_w, new_h),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=border_val
    )
    return rotated


def deskew_document(image: np.ndarray, max_angle: float = 45.0) -> Tuple[np.ndarray, float]:
    """
    Full deskewing function: detects angle and straightens document.
    """
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image

    angle = detect_skew_angle(gray, max_angle=max_angle)
    if abs(angle) >= 0.3:
        corrected = rotate_image(image, angle)
        return corrected, angle
    return image.copy(), 0.0
