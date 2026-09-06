"""
Land Record Entity Normalizer
==============================
Post-processing module that normalizes dates, survey/gat numbers, land areas,
and units without replacing the ML model.
"""

import re
from typing import Dict, Any, Optional, Tuple


# Devanagari to ASCII numeral mapping
DEVANAGARI_DIGITS = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
}

# Unit standardization mapping
UNIT_MAPPINGS = {
    "हे.": "hectare",
    "हेक्टर": "hectare",
    "hec": "hectare",
    "hectare": "hectare",
    "hectares": "hectare",
    "ha": "hectare",
    "h": "hectare",
    "आर": "are",
    "are": "are",
    "ares": "are",
    "एकर": "acre",
    "acre": "acre",
    "acres": "acre",
    "चौ.मी.": "sq_meter",
    "चौ.मी": "sq_meter",
    "sq.m": "sq_meter",
    "sqm": "sq_meter",
    "sq_meter": "sq_meter",
    "गुंठा": "guntha",
    "guntha": "guntha",
}


def normalize_devanagari_digits(text: str) -> str:
    """Replaces Devanagari numerals with standard ASCII digits."""
    if not text:
        return text
    result = []
    for ch in text:
        result.append(DEVANAGARI_DIGITS.get(ch, ch))
    return "".join(result)


def normalize_survey_number(val: str) -> str:
    """Normalizes survey/gat number format and removes OCR noise."""
    if not val:
        return ""
    v = normalize_devanagari_digits(str(val)).strip()
    # Replace OCR caret with A
    v = v.replace('^', 'A')
    # Remove leading labels if erroneously included
    v = re.sub(r'^(?:गट\s*नं[॰\.]?|सर्व्हे\s*नं[॰\.]?|सर्वे\s*नं[॰\.]?|gat\s*no\.?|survey\s*no\.?)[\s\:\-\=]*', '', v, flags=re.IGNORECASE)
    # Normalize Marathi sub-division letters: व -> ब
    if v.endswith('/व'):
        v = v[:-2] + '/ब'
    return v.strip().strip('.')


def normalize_area_and_unit(area_str: str, unit_str: Optional[str] = None) -> Tuple[Optional[float], str]:
    """
    Parses area string and extracts clean numeric float and standardized unit.
    Examples:
      '1.25 हे.' -> (1.25, 'hectare')
      '2.4530' with unit 'Hectare' -> (2.453, 'hectare')
    """
    if not area_str:
        return None, "hectare"

    cleaned = normalize_devanagari_digits(str(area_str)).strip()
    extracted_unit = "hectare"

    # Search for embedded unit inside area_str
    for u_key, u_std in UNIT_MAPPINGS.items():
        if re.search(r'\b' + re.escape(u_key) + r'\b|' + re.escape(u_key), cleaned, re.IGNORECASE):
            extracted_unit = u_std
            cleaned = re.sub(re.escape(u_key), '', cleaned, flags=re.IGNORECASE).strip()
            break

    if unit_str:
        u_clean = unit_str.strip().lower()
        for u_key, u_std in UNIT_MAPPINGS.items():
            if u_key.lower() in u_clean:
                extracted_unit = u_std
                break

    # Extract numeric float
    m = re.search(r'([0-9]+(?:\.[0-9]+)?)', cleaned)
    if m:
        try:
            val_num = round(float(m.group(1)), 4)
            return val_num, extracted_unit
        except ValueError:
            pass

    return None, extracted_unit


def normalize_date(date_str: str) -> Optional[str]:
    """
    Converts diverse date formats into ISO-8601 (YYYY-MM-DD).
    Supports DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD.
    """
    if not date_str:
        return None
    d = normalize_devanagari_digits(str(date_str)).strip()
    # Match DD/MM/YYYY or DD-MM-YYYY
    m = re.search(r'\b([0-3]?[0-9])[\/\-\.]([0-1]?[0-9])[\/\-\.](20[0-9]{2}|19[0-9]{2})\b', d)
    if m:
        day, month, year = m.group(1).zfill(2), m.group(2).zfill(2), m.group(3)
        return f"{year}-{month}-{day}"

    # Match YYYY-MM-DD
    m2 = re.search(r'\b(20[0-9]{2}|19[0-9]{2})[\/\-\.]([0-1]?[0-9])[\/\-\.]([0-3]?[0-9])\b', d)
    if m2:
        year, month, day = m2.group(1), m2.group(2).zfill(2), m2.group(3).zfill(2)
        return f"{year}-{month}-{day}"

    return d


def normalize_owner_name(name_str: str) -> str:
    """Strips leading honorifics and extraneous punctuation from owner name."""
    if not name_str:
        return ""
    n = str(name_str).strip()
    # Strip honorifics: श्री, श्रीमती, सौ, Mr., Mrs.
    n = re.sub(r'^(?:(?:श्री|श्रीमती|सौ|स्व|कै|Mr\.?|Mrs\.?|Shri\.?)\s*[\:\.\-\=_]*)+', '', n)
    # Strip list item numerals: 1) or १.
    n = re.sub(r'^[०-९0-9]+[\)\.\-]\s*', '', n)
    # Strip trailing punctuation
    n = n.strip().strip('|').strip('.').strip(':').strip()
    return n


def normalize_extracted_fields(raw_fields: Dict[str, Any]) -> Dict[str, Any]:
    """
    Master normalizer for the extracted dictionary.
    """
    normalized: Dict[str, Any] = dict(raw_fields)

    # 1. Owner Name
    if "OWNER_NAME" in normalized:
        normalized["OWNER_NAME"] = normalize_owner_name(normalized["OWNER_NAME"])
    if "CO_OWNER_NAME" in normalized:
        normalized["CO_OWNER_NAME"] = normalize_owner_name(normalized["CO_OWNER_NAME"])

    # 2. Survey / Gat Number
    if "SURVEY_NUMBER" in normalized:
        normalized["SURVEY_NUMBER"] = normalize_survey_number(normalized["SURVEY_NUMBER"])
    if "GAT_NUMBER" in normalized:
        normalized["GAT_NUMBER"] = normalize_survey_number(normalized["GAT_NUMBER"])

    # 3. Khata Number
    if "KHATA_NUMBER" in normalized:
        clean_khata = normalize_devanagari_digits(str(normalized["KHATA_NUMBER"])).strip()
        m = re.search(r'\d+', clean_khata)
        normalized["KHATA_NUMBER"] = m.group(0) if m else clean_khata

    # 4. Land Area and Unit
    if "LAND_AREA" in normalized:
        unit = normalized.get("LAND_AREA_UNIT")
        num_area, std_unit = normalize_area_and_unit(normalized["LAND_AREA"], unit)
        normalized["LAND_AREA"] = num_area
        normalized["LAND_AREA_UNIT"] = std_unit

    # 5. Dates
    for d_field in ["MUTATION_DATE", "DOCUMENT_DATE"]:
        if d_field in normalized:
            normalized[d_field] = normalize_date(normalized[d_field])

    return normalized
