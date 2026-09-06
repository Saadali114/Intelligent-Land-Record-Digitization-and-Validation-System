"""
Unit Tests for Validation Module
"""

import unittest
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.validation.validator import CadastralValidator


class TestValidation(unittest.TestCase):

    def setUp(self):
        self.validator = CadastralValidator(confidence_threshold=0.70, max_allowable_area_hectares=50.0)

    def test_valid_field(self):
        res = self.validator.validate_field("GAT_NUMBER", "145/2A", 0.95)
        self.assertEqual(res.validation_status, "PASSED")
        self.assertFalse(res.requires_review)

    def test_low_confidence_triggers_review(self):
        res = self.validator.validate_field("OWNER_NAME", "राम पाटील", 0.65)
        self.assertTrue(res.requires_review)
        self.assertIn("Confidence 65.0% is below review threshold", res.messages[0])

    def test_suspicious_high_area(self):
        res = self.validator.validate_field("LAND_AREA", 125000, 0.85)
        self.assertEqual(res.validation_status, "WARNING")
        self.assertTrue(res.requires_review)
        self.assertTrue(any("Suspiciously high land area" in m for m in res.messages))

    def test_invalid_survey_header_leak(self):
        res = self.validator.validate_field("SURVEY_NUMBER", "7/12", 0.90)
        self.assertEqual(res.validation_status, "ERROR")
        self.assertTrue(res.requires_review)

    def test_owner_name_form_label_leak(self):
        res = self.validator.validate_field("OWNER_NAME", "गाव नमुना खाते", 0.80)
        self.assertEqual(res.validation_status, "WARNING")
        self.assertTrue(res.requires_review)

    def test_record_level_validation(self):
        fields = {
            "OWNER_NAME": "राम गणपत पाटील",
            "GAT_NUMBER": "145/2A",
            "LAND_AREA": 1.25,
            "DISTRICT": "Pune",
        }
        confs = {
            "OWNER_NAME": 0.91,
            "GAT_NUMBER": 0.95,
            "LAND_AREA": 0.93,
            "DISTRICT": 0.96,
        }
        report = self.validator.validate_record(fields, confs)
        self.assertFalse(report["requiresReview"])
        self.assertEqual(report["overallStatus"], "VALIDATED")


if __name__ == "__main__":
    unittest.main()
