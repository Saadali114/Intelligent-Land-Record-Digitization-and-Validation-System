"""
Unit Tests for Normalization Module
"""

import unittest
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.normalization.normalizer import (
    normalize_devanagari_digits,
    normalize_survey_number,
    normalize_area_and_unit,
    normalize_date,
    normalize_owner_name,
    normalize_extracted_fields,
)


class TestNormalization(unittest.TestCase):

    def test_devanagari_digit_conversion(self):
        self.assertEqual(normalize_devanagari_digits("१२३४५"), "12345")
        self.assertEqual(normalize_devanagari_digits("०.७५"), "0.75")
        self.assertEqual(normalize_devanagari_digits("१४५/२A"), "145/2A")

    def test_survey_number_normalization(self):
        self.assertEqual(normalize_survey_number("गट नं. 145/2A"), "145/2A")
        self.assertEqual(normalize_survey_number("सर्व्हे नं: 145/2^"), "145/2A")
        self.assertEqual(normalize_survey_number("101/2/व"), "101/2/ब")

    def test_area_and_unit_normalization(self):
        val, unit = normalize_area_and_unit("1.25 हे.")
        self.assertEqual(val, 1.25)
        self.assertEqual(unit, "hectare")

        val2, unit2 = normalize_area_and_unit("2.40", "हेक्टर")
        self.assertEqual(val2, 2.40)
        self.assertEqual(unit2, "hectare")

        val3, unit3 = normalize_area_and_unit("५०० चौ.मी.")
        self.assertEqual(val3, 500.0)
        self.assertEqual(unit3, "sq_meter")

    def test_date_normalization(self):
        self.assertEqual(normalize_date("15/06/2020"), "2020-06-15")
        self.assertEqual(normalize_date("05-11-2022"), "2022-11-05")
        self.assertEqual(normalize_date("2021-01-22"), "2021-01-22")

    def test_owner_name_cleaning(self):
        self.assertEqual(normalize_owner_name("श्री. राम गणपत पाटील"), "राम गणपत पाटील")
        self.assertEqual(normalize_owner_name("१) सुरेश बाबुराव गायकवाड"), "सुरेश बाबुराव गायकवाड")

    def test_full_fields_normalization(self):
        raw = {
            "OWNER_NAME": "श्री: अनिल दत्तात्रय शिंदे",
            "GAT_NUMBER": "गट नं. 204/3^",
            "LAND_AREA": "०.७५ हेक्टर",
            "DOCUMENT_DATE": "22/01/2021",
        }
        norm = normalize_extracted_fields(raw)
        self.assertEqual(norm["OWNER_NAME"], "अनिल दत्तात्रय शिंदे")
        self.assertEqual(norm["GAT_NUMBER"], "204/3A")
        self.assertEqual(norm["LAND_AREA"], 0.75)
        self.assertEqual(norm["LAND_AREA_UNIT"], "hectare")
        self.assertEqual(norm["DOCUMENT_DATE"], "2021-01-22")


if __name__ == "__main__":
    unittest.main()
