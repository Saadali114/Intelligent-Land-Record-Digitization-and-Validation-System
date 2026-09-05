"""
Stage 5 — Duplicate Detection & Registry Anomaly Checks
======================================================
Detects:
  - Exact duplicates (same survey number + same owner in same district)
  - Ownership conflicts (same survey number registered under different owner)
  - Possible subdivisions / partial matches
"""

import difflib
import re
from typing import Dict, Any, Optional
from models import DuplicateCheckRequest, DuplicateCheckResponse


def normalize_str(s: str) -> str:
    return re.sub(r"[\s\-_/]+", "", s.strip().lower()) if s else ""


def check_duplicate(req: DuplicateCheckRequest) -> DuplicateCheckResponse:
    cand_survey = req.surveyNumber.strip()
    cand_owner = req.ownerName.strip()
    cand_district = req.district.strip().lower()

    if not cand_survey or not req.existingRecords:
        return DuplicateCheckResponse(
            isDuplicate=False,
            confidence=0.0,
            matchedRecord=None,
            reason="No existing records or missing survey number for comparison",
        )

    norm_cand_survey = normalize_str(cand_survey)
    best_match: Optional[Dict[str, Any]] = None
    best_conf = 0.0
    duplicate_reason = ""
    is_dup = False

    for rec in req.existingRecords:
        rec_survey = str(rec.get("surveyNumber") or rec.get("khasraNumber") or "").strip()
        rec_owner = str(rec.get("ownerName") or "").strip()
        rec_dist = str(rec.get("district") or "").strip().lower()

        if not rec_survey:
            continue

        # If districts are provided and distinctly different, skip
        if cand_district and rec_dist and cand_district != rec_dist:
            continue

        norm_rec_survey = normalize_str(rec_survey)

        # 1. Exact survey match
        if norm_cand_survey == norm_rec_survey:
            # Check owner similarity
            name_sim = difflib.SequenceMatcher(
                None, cand_owner.lower(), rec_owner.lower()
            ).ratio() if cand_owner and rec_owner else 0.5

            if name_sim >= 0.70:
                # Same survey, same owner -> Duplicate record!
                conf = round(0.85 + (0.15 * name_sim), 2)
                if conf > best_conf:
                    best_conf = conf
                    best_match = rec
                    is_dup = True
                    duplicate_reason = (
                        f"Duplicate land record detected: Survey #{rec_survey} already registered to "
                        f"'{rec_owner}' (similarity: {int(name_sim*100)}%)."
                    )
            elif name_sim < 0.40 and cand_owner and rec_owner:
                # Same survey, different owner -> Title conflict!
                conf = 0.90
                if conf > best_conf:
                    best_conf = conf
                    best_match = rec
                    is_dup = True
                    duplicate_reason = (
                        f"Potential title conflict: Survey #{rec_survey} is already registered under "
                        f"different owner '{rec_owner}'. Candidate owner is '{cand_owner}'."
                    )
            else:
                conf = 0.65
                if conf > best_conf:
                    best_conf = conf
                    best_match = rec
                    is_dup = True
                    duplicate_reason = (
                        f"Survey #{rec_survey} already exists with related owner '{rec_owner}'."
                    )

        # 2. Sub-survey / subdivision overlap (e.g. 45 vs 45/1)
        elif norm_cand_survey.startswith(norm_rec_survey) or norm_rec_survey.startswith(norm_cand_survey):
            if len(norm_cand_survey) > 1 and len(norm_rec_survey) > 1:
                conf = 0.50
                if conf > best_conf:
                    best_conf = conf
                    best_match = rec
                    is_dup = False  # Not necessarily a strict duplicate, but notable
                    duplicate_reason = (
                        f"Cadastral subdivision overlap: Survey #{cand_survey} relates to existing Survey #{rec_survey}."
                    )

    return DuplicateCheckResponse(
        isDuplicate=is_dup,
        confidence=best_conf,
        matchedRecord=best_match,
        reason=duplicate_reason or "No conflicting or duplicate records found in registry.",
    )
