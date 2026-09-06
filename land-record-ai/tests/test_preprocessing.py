"""
Unit Tests for Image Preprocessing
"""

import unittest
import numpy as np

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.preprocessing.image_processor import ImageProcessor
from src.preprocessing.deskew import detect_skew_angle, rotate_image
from src.preprocessing.enhancement import apply_clahe, apply_denoising, apply_thresholding, apply_sharpening


class TestImagePreprocessing(unittest.TestCase):

    def setUp(self):
        # Create a synthetic test image (200x300 white rectangle with black text simulated bars)
        self.test_img = np.full((200, 300, 3), 255, dtype=np.uint8)
        # Add black horizontal stripes simulating text lines
        self.test_img[40:50, 30:270] = 0
        self.test_img[80:90, 30:270] = 0
        self.test_img[120:130, 30:270] = 0

    def test_deskew_angle_detection(self):
        gray = self.test_img[:, :, 0]
        angle = detect_skew_angle(gray)
        # Horizontal lines should have near-zero skew
        self.assertTrue(abs(angle) < 5.0)

    def test_rotate_image_shape(self):
        rotated = rotate_image(self.test_img, 10.0)
        self.assertEqual(len(rotated.shape), 3)
        # Rotated image bounding box should be at least as large as original
        self.assertGreaterEqual(rotated.shape[0], self.test_img.shape[0])
        self.assertGreaterEqual(rotated.shape[1], self.test_img.shape[1])

    def test_enhancement_functions(self):
        gray = self.test_img[:, :, 0]
        clahe_out = apply_clahe(gray)
        self.assertEqual(clahe_out.shape, gray.shape)

        denoised = apply_denoising(gray)
        self.assertEqual(denoised.shape, gray.shape)

        binary = apply_thresholding(gray, method="otsu")
        self.assertEqual(binary.shape, gray.shape)
        # Binary image should only contain 0 and 255 values
        unique_vals = set(np.unique(binary))
        self.assertTrue(unique_vals.issubset({0, 255}))

        sharpened = apply_sharpening(binary)
        self.assertEqual(sharpened.shape, gray.shape)

    def test_full_processor(self):
        processor = ImageProcessor()
        res = processor.process(self.test_img)
        self.assertIsNotNone(res.final_image)
        self.assertIn("grayscale", res.stages)
        self.assertGreater(len(res.steps_log), 0)


if __name__ == "__main__":
    unittest.main()
