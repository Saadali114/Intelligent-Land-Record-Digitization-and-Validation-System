"""
Stage 1 — OpenCV Image Preprocessing
=====================================
Applies a series of computer vision corrections specifically tuned
for scanned/photographed Indian government land records (7/12 Satbara, 
Mutation Registers, Sale Deeds):

  1. Deskew        — corrects tilt from scanner/camera angle
  2. Denoise       — removes salt-and-pepper and Gaussian noise
  3. CLAHE         — adaptive histogram equalization for uneven lighting
  4. Binarize      — Otsu or adaptive threshold to pure B&W
  5. Morphology    — closes gaps in Devanagari character strokes
  6. Upscale       — ensures ≥300 DPI equivalent for OCR
"""

# pyrefly: ignore [missing-import]
import cv2
import numpy as np
from typing import Tuple, List
import io
from PIL import Image


def bytes_to_cv2(image_bytes: bytes) -> np.ndarray:
    """Convert raw bytes to OpenCV BGR image."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image bytes — unsupported format or corrupt file")
    return img


def cv2_to_bytes(img: np.ndarray, ext: str = ".png") -> bytes:
    """Convert OpenCV image back to PNG bytes."""
    success, buffer = cv2.imencode(ext, img)
    if not success:
        raise ValueError("Could not encode processed image")
    return buffer.tobytes()


def deskew(img: np.ndarray) -> Tuple[np.ndarray, float]:
    """
    Correct document tilt using Hough line detection.
    Returns corrected image and angle in degrees.
    Works well for documents tilted up to ±15°.
    """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img.copy()
    # Edge detection for line finding
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    lines = cv2.HoughLines(edges, 1, np.pi / 180, threshold=100)

    angle = 0.0
    if lines is not None:
        angles = []
        for rho, theta in lines[:, 0]:
            # Convert to degrees, center around 0
            a = np.degrees(theta) - 90
            if -15 < a < 15:  # Only correct small tilts
                angles.append(a)
        if angles:
            angle = float(np.median(angles))

    if abs(angle) > 0.3:  # Only rotate if tilt is significant
        h, w = img.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        img = cv2.warpAffine(
            img, M, (w, h),
            flags=cv2.INTER_CUBIC,
            borderMode=cv2.BORDER_REPLICATE,
        )

    return img, angle


def denoise(img: np.ndarray) -> np.ndarray:
    """
    Remove noise while preserving text edges.
    Uses fastNlMeansDenoisingColored for color images.
    """
    if len(img.shape) == 3:
        return cv2.fastNlMeansDenoisingColored(img, None, h=6, hColor=6, templateWindowSize=7, searchWindowSize=21)
    else:
        return cv2.fastNlMeansDenoising(img, None, h=8, templateWindowSize=7, searchWindowSize=21)


def apply_clahe(img: np.ndarray) -> np.ndarray:
    """
    Contrast Limited Adaptive Histogram Equalization.
    Dramatically improves readability of aged/faded documents
    with uneven lighting from phone photography.
    """
    if len(img.shape) == 3:
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
        l_chan, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
        l_chan = clahe.apply(l_chan)
        lab = cv2.merge((l_chan, a, b))
        return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    else:
        clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
        return clahe.apply(img)


def binarize(img: np.ndarray) -> np.ndarray:
    """
    Convert to pure black-and-white using Otsu's method.
    Falls back to adaptive threshold if Otsu fails (very dark images).
    """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img.copy()

    # Try Otsu's global threshold first
    blur = cv2.GaussianBlur(gray, (3, 3), 0)
    thresh_val, binary = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # If Otsu threshold is extreme (very dark/light image), use adaptive
    if thresh_val < 60 or thresh_val > 200:
        binary = cv2.adaptiveThreshold(
            gray, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            blockSize=31,
            C=10,
        )

    return binary


def close_devanagari_strokes(binary: np.ndarray) -> np.ndarray:
    """
    Morphological closing to connect broken strokes in Devanagari characters.
    The horizontal 'shirorekha' (headline) in Devanagari often breaks in scans.
    """
    # Small horizontal kernel to reconnect broken headline
    kernel_h = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 1))
    closed = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel_h)
    return closed


def upscale_if_needed(img: np.ndarray, target_width: int = 2000) -> Tuple[np.ndarray, float]:
    """
    Upscale image if width is below target (needed for 300+ DPI OCR).
    Returns image and scale factor applied.
    """
    h, w = img.shape[:2]
    if w >= target_width:
        return img, 1.0

    scale = target_width / w
    scale = min(scale, 3.0)  # Never upscale more than 3x to avoid blur
    new_w = int(w * scale)
    new_h = int(h * scale)

    interp = cv2.INTER_CUBIC if scale < 2.0 else cv2.INTER_LANCZOS4
    upscaled = cv2.resize(img, (new_w, new_h), interpolation=interp)
    return upscaled, scale


def preprocess_image(image_bytes: bytes, for_neural_ocr: bool = True) -> Tuple[bytes, List[str]]:
    """
    Full preprocessing pipeline. Returns processed PNG bytes + list of steps applied.
    for_neural_ocr=True (default): Preserves rich gradients, deskew, denoise, and CLAHE
    contrast enhancement, perfectly matched for deep neural network OCR (EasyOCR CRAFT/CRNN).
    for_neural_ocr=False: Applies Otsu binarization and stroke closing for classical engines.
    """
    steps_applied: List[str] = []

    img = bytes_to_cv2(image_bytes)
    steps_applied.append(f"decoded: {img.shape[1]}x{img.shape[0]}px")

    # Step 1: Upscale first (bigger image = better feature resolution)
    img, scale = upscale_if_needed(img, target_width=2000)
    if scale > 1.01:
        steps_applied.append(f"upscaled: {scale:.1f}x → {img.shape[1]}x{img.shape[0]}px")

    # Step 2: Denoise
    img = denoise(img)
    steps_applied.append("denoised: fastNlMeansDenoising")

    # Step 3: CLAHE adaptive contrast enhancement
    img = apply_clahe(img)
    steps_applied.append("clahe: adaptive contrast equalization")

    # Step 4: Deskew
    img, angle = deskew(img)
    if abs(angle) > 0.3:
        steps_applied.append(f"deskewed: {angle:.2f}°")
    else:
        steps_applied.append("deskew: no significant tilt detected")

    if for_neural_ocr:
        # For modern deep neural OCR (EasyOCR / TrOCR), CLAHE-enhanced grayscale/RGB
        # preserves the edge gradients that CRAFT and CRNN need to detect letter boundaries.
        steps_applied.append("optimized_for_neural_ocr: CLAHE + deskew gradient preservation")
        processed_bytes = cv2_to_bytes(img, ".png")
    else:
        # Step 5: Binarize to black/white
        binary = binarize(img)
        steps_applied.append("binarized: Otsu threshold")

        # Step 6: Close broken Devanagari strokes
        binary = close_devanagari_strokes(binary)
        steps_applied.append("morphology: Devanagari stroke closing")
        processed_bytes = cv2_to_bytes(binary, ".png")

    return processed_bytes, steps_applied

