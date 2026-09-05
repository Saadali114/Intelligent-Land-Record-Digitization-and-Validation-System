"""
Integration test for the adaptive AI self-correction pipeline and feedback memory loop.
"""
import sys
import json
import os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.join(os.getcwd(), "ai-service"))

from services.feedback_service import record_correction, get_feedback_memory, apply_learned_corrections
from services.adaptive_pipeline import diagnose_extraction_errors

def run_tests():
    print("=== TEST 1: Diagnostic Assessment ===")
    mock_entities_poor = {
        "ownerName": "",
        "surveyNumber": "",
        "village": "",
        "tehsil": "Geel",
        "district": "gor",
        "plotArea": ""
    }
    issues = diagnose_extraction_errors(
        raw_text="गाव: . तालुका: Geel जिल्हा: gor",
        char_count=35,
        avg_confidence=0.48,
        cadastral_data=mock_entities_poor
    )
    print("Detected issues:", issues)
    assert "low_char_yield" in issues
    assert "low_ocr_confidence" in issues
    assert any("missing_core_fields" in issue for issue in issues)

    print("\n=== TEST 2: Human-in-the-loop Correction Recording ===")
    result = record_correction(
        document_id="DOC-TEST-9999",
        original_data={
            "village": "",
            "tehsil": "Geel",
            "district": "gor",
            "ownerName": "Ramsh Ptill"
        },
        corrected_data={
            "village": "ओतूर",
            "tehsil": "जुन्नर",
            "district": "पुणे",
            "ownerName": "Ramesh Patil"
        },
        original_ocr_text="गाव: . तालुका: Geel जिल्हा: gor जमीन मालक Ramsh Ptill",
        verifier_remarks="Corrected misread Geel to Junnar and added village Otur"
    )
    print("Record correction result:", result)
    assert result["status"] == "success"

    mem = get_feedback_memory()
    print("\n=== TEST 3: Feedback Memory State ===")
    print("Total corrections recorded:", mem.get("totalCorrectionsRecorded"))
    print("Learned token replacements:", mem.get("tokenReplacements"))
    assert "ओतूर" in mem.get("verifiedVillages", [])
    assert mem.get("totalCorrectionsRecorded", 0) >= 1

    print("\n=== TEST 4: Applying Learned Corrections to Raw OCR Text ===")
    test_raw_ocr = "गाव :- ओतूर | तालुका :- Geel | जिल्हा :- gor"
    fields_in = {"village": "", "tehsil": "Geel", "district": "gor"}
    applied_res = apply_learned_corrections(test_raw_ocr, fields_in)
    corrected_ocr = applied_res["cleanedText"]
    corrected_fields = applied_res["fields"]
    print("Raw input:       ", test_raw_ocr)
    print("Corrected output:", corrected_ocr)
    print("Corrected fields:", corrected_fields)
    assert "जुन्नर" in corrected_ocr
    assert "पुणे" in corrected_ocr
    assert corrected_fields["tehsil"] == "जुन्नर"
    assert corrected_fields["district"] == "पुणे"

    print("\nALL ADAPTIVE SELF-CORRECTION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
