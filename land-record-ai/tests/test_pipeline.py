"""
Unit Tests for End-to-End Pipeline
"""

import unittest
import numpy as np
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.pipeline import LandRecordInferencePipeline


class TestPipeline(unittest.TestCase):

    def setUp(self):
        self.pipeline = LandRecordInferencePipeline()

    def test_document_classification(self):
        doc_712 = self.pipeline.classify_document("महाराष्ट्र शासन गाव नमुना ७ सातबारा अधिकार अभिलेख")
        self.assertEqual(doc_712, "7_12")

        doc_ferfar = self.pipeline.classify_document("गाव नमुना फेरफार नोंदवही फेरफार क्र. 312/2020")
        self.assertEqual(doc_ferfar, "FERFAR")

        doc_deed = self.pipeline.classify_document("This DEED OF ABSOLUTE SALE executed on...")
        self.assertEqual(doc_deed, "SALE_DEED")

    def test_language_detection(self):
        marathi = self.pipeline.detect_languages("गाव नमुना ७")
        self.assertIn("Marathi", marathi)

        bilingual = self.pipeline.detect_languages("गाव नमुना 7 Village Form")
        self.assertIn("Marathi", bilingual)
        self.assertIn("English", bilingual)

    def test_fallback_entity_extraction(self):
        sample_text = (
            "गाव नमुना ७\n"
            "गाव: हिंजवडी तालुका: मुळशी जिल्हा: पुणे\n"
            "१. जमीन धारकांचे नांव : राम गणपत पाटील\n"
            "२. सर्व्हे / गट नं. : 145/2A\n"
            "३. क्षेत्रफळ : 1.25 हेक्टर\n"
            "४. खाते क्रमांक : 128\n"
        )
        fields, conf = self.pipeline._extract_entities_fallback(sample_text, [])
        self.assertEqual(fields.get("OWNER_NAME"), "राम गणपत पाटील")
        self.assertEqual(fields.get("GAT_NUMBER"), "145/2A")
        self.assertEqual(fields.get("VILLAGE"), "हिंजवडी")
        self.assertEqual(fields.get("TALUKA"), "मुळशी")
        self.assertEqual(fields.get("DISTRICT"), "पुणे")
        self.assertEqual(fields.get("LAND_AREA"), "1.25")


if __name__ == "__main__":
    unittest.main()
