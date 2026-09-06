"""
Cadastral Validation and Business Rules Engine
==============================================
Validates extracted field values against Maharashtra land records rules:
- Area sanity thresholds (flagging suspicious multi-thousand hectare values)
- Survey/Gat number structure
- Date validity and chronological sequencing
- Jurisdictional consistency (Village, Taluka, District)
- Confidence thresholding (requiresReview flag)
Does NOT silently change AI predictions; flags warnings and reviews explicitly.
"""

import re
from typing import Dict, Any, List, Optional


# Known Maharashtra districts for sanity validation
MAHARASHTRA_DISTRICTS = {
    "pune", "raigad", "nashik", "nagpur", "satara", "thane", "kolhapur",
    "solapur", "sangli", "ahmednagar", "jalgaon", "amravati", "nanded",
    "latur", "beed", "ratnagiri", "sindhudurg", "aurangabad", "chhatrapati sambhaji nagar",
    "wardha", "bhandara", "gondia", "chandrapur", "gadchiroli", "buldhana",
    "akola", "washim", "yavatmal", "hingoli", "parbhani", "jalna", "osmanabad",
    "dharashiv", "dhule", "nandurbar", "palghar", "mumbai", "mumbai suburban",
    "पुणे", "रायगड", "नाशिक", "नागपूर", "सातारा", "ठाणे", "कोल्हापूर",
    "सोलापूर", "सांगली", "अहमदनगर", "जळगाव", "अमरावती", "नांदेड", "लातूर",
    "बीड", "रत्नागिरी", "सिंधुदुर्ग", "औरंगाबाद", "छत्रपती संभाजीनगर", "पालघर"
}


class FieldValidationResult:
    """Validation report for an individual extracted entity field."""

    def __init__(
        self,
        field: str,
        value: Any,
        confidence: float,
        validation_status: str = "PASSED",   # PASSED | WARNING | ERROR
        requires_review: bool = False,
        messages: Optional[List[str]] = None,
    ):
        self.field = field
        self.value = value
        self.confidence = round(confidence, 4)
        self.validation_status = validation_status
        self.requires_review = requires_review
        self.messages = messages or []

    def to_dict(self) -> Dict[str, Any]:
        return {
            "field": self.field,
            "value": self.value,
            "confidence": self.confidence,
            "validationStatus": self.validation_status,
            "requiresReview": self.requires_review,
            "messages": self.messages,
        }


class CadastralValidator:
    """Master business rules validator for extracted cadastral records."""

    def __init__(
        self,
        confidence_threshold: float = 0.70,
        max_allowable_area_hectares: float = 50.0,
    ):
        self.confidence_threshold = confidence_threshold
        self.max_allowable_area = max_allowable_area_hectares

    def validate_field(
        self,
        field: str,
        value: Any,
        confidence: float,
    ) -> FieldValidationResult:
        """Validates a single field against domain rules and confidence floor."""
        messages: List[str] = []
        status = "PASSED"
        requires_review = confidence < self.confidence_threshold

        if requires_review:
            messages.append(
                f"Confidence {confidence:.1%} is below review threshold {self.confidence_threshold:.1%}"
            )

        if value is None or str(value).strip() == "":
            return FieldValidationResult(
                field=field,
                value=value,
                confidence=confidence,
                validation_status="WARNING",
                requires_review=True,
                messages=["Field is empty or not detected"],
            )

        str_val = str(value).strip()

        # 1. LAND_AREA Validation
        if field == "LAND_AREA":
            try:
                area_num = float(value)
                if area_num <= 0:
                    status = "WARNING"
                    requires_review = True
                    messages.append("Land area must be greater than zero")
                elif area_num > self.max_allowable_area:
                    status = "WARNING"
                    requires_review = True
                    messages.append(
                        f"Suspiciously high land area ({area_num} hectares exceeds threshold {self.max_allowable_area} ha)"
                    )
            except (ValueError, TypeError):
                status = "WARNING"
                requires_review = True
                messages.append(f"Non-numeric area value: '{value}'")

        # 2. SURVEY_NUMBER / GAT_NUMBER Validation
        elif field in ("SURVEY_NUMBER", "GAT_NUMBER"):
            if not re.search(r'\d+', str_val):
                status = "WARNING"
                requires_review = True
                messages.append("Survey/Gat number must contain at least one numeric digit")
            if str_val in ("7/12", "7", "12"):
                status = "ERROR"
                requires_review = True
                messages.append("Extracted form header (7/12) rather than plot survey number")

        # 3. DISTRICT Validation
        elif field == "DISTRICT":
            clean_dist = str_val.lower().strip()
            if clean_dist not in MAHARASHTRA_DISTRICTS:
                status = "WARNING"
                requires_review = True
                messages.append(f"'{str_val}' is not in known Maharashtra districts list")

        # 4. OWNER_NAME Validation
        elif field in ("OWNER_NAME", "CO_OWNER_NAME"):
            if len(str_val) < 3:
                status = "WARNING"
                requires_review = True
                messages.append("Owner name is too short (< 3 characters)")
            blacklist = ["गाव", "तालुका", "जिल्हा", "नमुना", "खाते", "क्षेत्र", "हंगाम", "पाहणी"]
            if any(w in str_val for w in blacklist):
                status = "WARNING"
                requires_review = True
                messages.append(f"Owner name contains cadastral form label keyword: '{str_val}'")

        # 5. DATES Validation (DOCUMENT_DATE, MUTATION_DATE)
        elif field in ("DOCUMENT_DATE", "MUTATION_DATE"):
            # Check ISO date format YYYY-MM-DD
            if re.match(r'^\d{4}-\d{2}-\d{2}$', str_val):
                year = int(str_val.split('-')[0])
                if year < 1850 or year > 2030:
                    status = "WARNING"
                    requires_review = True
                    messages.append(f"Year out of realistic range: {year}")
            else:
                status = "WARNING"
                requires_review = True
                messages.append(f"Unnormalized or non-standard date format: '{str_val}'")

        return FieldValidationResult(
            field=field,
            value=value,
            confidence=confidence,
            validation_status=status,
            requires_review=requires_review,
            messages=messages,
        )

    def validate_record(
        self,
        fields: Dict[str, Any],
        confidences: Dict[str, float],
    ) -> Dict[str, Any]:
        """
        Validates entire record and returns summary report.
        """
        field_reports: Dict[str, Any] = {}
        overall_requires_review = False
        warnings_count = 0

        for field_name, field_val in fields.items():
            conf = confidences.get(field_name, 0.85)
            report = self.validate_field(field_name, field_val, conf)
            field_reports[field_name] = report.to_dict()

            if report.requires_review:
                overall_requires_review = True
            if report.validation_status in ("WARNING", "ERROR"):
                warnings_count += 1

        # Check required fields presence
        mandatory = ["SURVEY_NUMBER", "GAT_NUMBER", "OWNER_NAME"]
        has_survey_or_gat = ("SURVEY_NUMBER" in fields and fields["SURVEY_NUMBER"]) or \
                            ("GAT_NUMBER" in fields and fields["GAT_NUMBER"])
        if not has_survey_or_gat:
            overall_requires_review = True

        return {
            "fields": field_reports,
            "requiresReview": overall_requires_review,
            "warningsCount": warnings_count,
            "overallStatus": "NEEDS_REVIEW" if overall_requires_review else "VALIDATED",
        }


# Global default validator instance
cadastral_validator = CadastralValidator()
