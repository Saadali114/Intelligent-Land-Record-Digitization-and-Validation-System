"""
Continuous Learning & Dynamic Correction Memory Service
======================================================
Stores and applies human-in-the-loop verifier corrections.
Learns:
  1. OCR token substitution rules (e.g. "Geel" -> "जुन्नर", "के" -> "खेड", "1532" -> "1632")
  2. Dynamic regional gazetteer expansion (newly verified villages, tehsils, surnames)
  3. Field-specific layout correction templates
Persists to: ai-service/data/learned_corrections.json
"""

import os
import json
import re
import time
from typing import Dict, Any, List, Optional
from difflib import SequenceMatcher

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
FEEDBACK_FILE = os.path.join(DATA_DIR, "learned_corrections.json")

DEFAULT_MEMORY = {
    "version": "1.0.0",
    "lastUpdated": "",
    "totalCorrectionsRecorded": 0,
    "tokenReplacements": {
        "geel": "जुन्नर",
        "joel": "जुन्नर",
        "jeel": "जुन्नर",
        "gor": "पुणे",
        "1532": "1632",
    },
    "verifiedVillages": [
        "खेड", "वाघोली", "खडकवासला", "उरुळी कांचन", "शिवणे", "पिरंगुट", "बावधन",
        "खालापूर", "चौक", "वावोशी", "खोपोली", "रसायनी", "पनवेल", "अलिबाग"
    ],
    "verifiedTehsils": [
        "जुन्नर", "खेड", "हवेली", "बारामती", "शिरूर", "मुळशी", "मावळ", "इंदापूर",
        "दौंड", "आंबेगाव", "भोर", "वेल्हे", "पुरंदर", "खालापूर", "पनवेल", "अलिबाग",
        "कर्जत", "पेण", "कल्याण", "ठाणे", "नाशिक", "दिंडोरी", "सिन्नर", "निफाड"
    ],
    "verifiedDistricts": [
        "पुणे", "रायगड", "ठाणे", "नाशिक", "नागपूर", "सातारा", "कोल्हापूर", "सोलापूर"
    ],
    "verifiedSurnames": [
        "शिंदे", "पाटील", "देशमुख", "कुलकर्णी", "जाधव", "मोरे", "पवार", "गायकवाड",
        "चव्हाण", "कदम", "भोसले", "जोशी", "साळुंखे", "खरात", "माने", "वाघ", "जगत"
    ],
    "correctionHistory": []
}


def _ensure_data_file() -> Dict[str, Any]:
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(FEEDBACK_FILE):
        with open(FEEDBACK_FILE, "w", encoding="utf-8") as f:
            json.dump(DEFAULT_MEMORY, f, ensure_ascii=False, indent=2)
        return DEFAULT_MEMORY.copy()
    try:
        with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return DEFAULT_MEMORY.copy()


def _save_data_file(data: Dict[str, Any]) -> None:
    os.makedirs(DATA_DIR, exist_ok=True)
    data["lastUpdated"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    with open(FEEDBACK_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def record_correction(
    document_id: str,
    original_data: Dict[str, Any],
    corrected_data: Dict[str, Any],
    original_ocr_text: Optional[str] = "",
    verifier_remarks: Optional[str] = ""
) -> Dict[str, Any]:
    """
    Analyzes discrepancies between original AI extraction and human verifier corrections.
    Derives token substitution rules and updates the gazetteer.
    """
    memory = _ensure_data_file()
    learned_replacements = {}
    new_villages = []
    new_tehsils = []
    new_surnames = []

    for field, correct_val in corrected_data.items():
        if not correct_val or not isinstance(correct_val, str):
            continue
        correct_clean = correct_val.strip()
        orig_val = str(original_data.get(field, "")).strip()

        if orig_val and orig_val != correct_clean and orig_val.lower() != "not detected":
            # If original was a noise string or OCR typo, associate token replacement
            orig_lower = orig_val.lower()
            if len(orig_val) >= 2 and len(correct_clean) >= 2:
                memory["tokenReplacements"][orig_lower] = correct_clean
                learned_replacements[orig_val] = correct_clean

        # Expand domain gazetteers based on field type
        if field == "village" and correct_clean not in memory["verifiedVillages"]:
            memory["verifiedVillages"].append(correct_clean)
            new_villages.append(correct_clean)
        elif field in ("tehsil", "taluka") and correct_clean not in memory["verifiedTehsils"]:
            memory["verifiedTehsils"].append(correct_clean)
            new_tehsils.append(correct_clean)
        elif field == "ownerName":
            tokens = correct_clean.split()
            if tokens:
                surname = tokens[-1]
                if surname not in memory["verifiedSurnames"] and len(surname) >= 3:
                    memory["verifiedSurnames"].append(surname)
                    new_surnames.append(surname)

    history_entry = {
        "documentId": document_id,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "originalData": original_data,
        "correctedData": corrected_data,
        "learnedReplacements": learned_replacements,
        "newVillages": new_villages,
        "newTehsils": new_tehsils,
        "verifierRemarks": verifier_remarks or "",
    }

    memory["totalCorrectionsRecorded"] += 1
    # Keep last 100 historical logs for analytics
    memory["correctionHistory"].insert(0, history_entry)
    memory["correctionHistory"] = memory["correctionHistory"][:100]

    _save_data_file(memory)
    return {
        "status": "success",
        "learnedReplacementsCount": len(learned_replacements),
        "newVillagesAdded": len(new_villages),
        "newTehsilsAdded": len(new_tehsils),
        "totalCorrectionsRecorded": memory["totalCorrectionsRecorded"]
    }


def apply_learned_corrections(raw_text: str, extracted_fields: Dict[str, Any]) -> Dict[str, Any]:
    """
    Applies learned OCR token replacements and gazetteer validations to raw text and extracted fields.
    """
    memory = _ensure_data_file()
    replacements = memory.get("tokenReplacements", {})

    modified_text = raw_text
    # 1. Apply learned word-boundary replacements on raw text
    for noise, fix in replacements.items():
        if not noise or not fix or len(noise) < 2:
            continue
        pattern = rf'(?i)\b{re.escape(noise)}\b'
        modified_text = re.sub(pattern, fix, modified_text)

    # 2. Check and fix extracted fields directly
    corrected_fields = dict(extracted_fields)
    for field, val in corrected_fields.items():
        if isinstance(val, str) and val:
            val_lower = val.lower().strip()
            if val_lower in replacements:
                corrected_fields[field] = replacements[val_lower]

    return {
        "cleanedText": modified_text,
        "fields": corrected_fields,
        "appliedReplacementsCount": sum(1 for n in replacements if n in raw_text.lower())
    }


def get_feedback_memory() -> Dict[str, Any]:
    """Returns the current feedback memory dictionary."""
    return _ensure_data_file()
