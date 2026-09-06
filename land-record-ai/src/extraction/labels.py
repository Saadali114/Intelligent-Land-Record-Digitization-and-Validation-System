"""
Land Record Entity Labels and BIO Schema
=========================================
Standardizes 19 core Maharashtra cadastral entity labels, BIO token tagging,
and mapping utilities. Extensible for adding new domain labels dynamically.
"""

from typing import List, Dict, Tuple, Optional, Any
import re

# 19 Standard Land Record Entity Labels
DEFAULT_ENTITY_LABELS: List[str] = [
    "OWNER_NAME",
    "CO_OWNER_NAME",
    "SURVEY_NUMBER",
    "GAT_NUMBER",
    "KHATA_NUMBER",
    "VILLAGE",
    "TALUKA",
    "DISTRICT",
    "LAND_AREA",
    "LAND_AREA_UNIT",
    "LAND_TYPE",
    "CROP",
    "MUTATION_NUMBER",
    "MUTATION_DATE",
    "DOCUMENT_DATE",
    "BOUNDARY_NORTH",
    "BOUNDARY_SOUTH",
    "BOUNDARY_EAST",
    "BOUNDARY_WEST",
]

# Color mapping for visualizers and web annotators
LABEL_COLORS: Dict[str, str] = {
    "OWNER_NAME": "#2563eb",       # Blue
    "CO_OWNER_NAME": "#3b82f6",    # Light Blue
    "SURVEY_NUMBER": "#059669",    # Emerald
    "GAT_NUMBER": "#10b981",       # Green
    "KHATA_NUMBER": "#d97706",     # Amber
    "VILLAGE": "#7c3aed",          # Purple
    "TALUKA": "#8b5cf6",           # Light Purple
    "DISTRICT": "#6366f1",         # Indigo
    "LAND_AREA": "#dc2626",        # Red
    "LAND_AREA_UNIT": "#ef4444",   # Light Red
    "LAND_TYPE": "#0891b2",        # Cyan
    "CROP": "#84cc16",             # Lime
    "MUTATION_NUMBER": "#ea580c",  # Orange
    "MUTATION_DATE": "#f97316",    # Light Orange
    "DOCUMENT_DATE": "#64748b",    # Slate
    "BOUNDARY_NORTH": "#0284c7",   # Sky
    "BOUNDARY_SOUTH": "#0284c7",   # Sky
    "BOUNDARY_EAST": "#0284c7",    # Sky
    "BOUNDARY_WEST": "#0284c7",    # Sky
}


class LabelManager:
    """Manages land entity labels, dynamic additions, BIO tags, and ID conversions."""

    def __init__(self, base_labels: Optional[List[str]] = None):
        self._labels: List[str] = list(base_labels or DEFAULT_ENTITY_LABELS)
        self._rebuild_bio_maps()

    def _rebuild_bio_maps(self) -> None:
        """Rebuilds BIO tag list and index maps."""
        self.bio_tags: List[str] = ["O"]
        for label in self._labels:
            self.bio_tags.append(f"B-{label}")
            self.bio_tags.append(f"I-{label}")

        self.label2id: Dict[str, int] = {tag: idx for idx, tag in enumerate(self.bio_tags)}
        self.id2label: Dict[int, str] = {idx: tag for idx, tag in enumerate(self.bio_tags)}

    def get_labels(self) -> List[str]:
        return list(self._labels)

    def get_bio_tags(self) -> List[str]:
        return list(self.bio_tags)

    def add_label(self, new_label: str, color: Optional[str] = None) -> None:
        """Dynamically registers a new entity label."""
        clean_label = new_label.strip().upper().replace(" ", "_")
        if clean_label not in self._labels:
            self._labels.append(clean_label)
            if color:
                LABEL_COLORS[clean_label] = color
            self._rebuild_bio_maps()

    def is_valid_label(self, label: str) -> bool:
        return label in self._labels or label in self.bio_tags


# Global shared instance
label_manager = LabelManager()


def text_and_spans_to_bio(
    text: str,
    entities: List[Dict[str, Any]],
) -> List[Tuple[str, str, int, int]]:
    """
    Converts full text and character-level entity spans into word-level tokens and BIO tags.

    Args:
        text: Raw document text string.
        entities: List of dicts with keys 'start', 'end', 'label'.

    Returns:
        List of tuples: (token_str, bio_tag, char_start, char_end)
    """
    if not text:
        return []

    # Sort entities by start index
    sorted_entities = sorted(entities, key=lambda e: e.get("start", 0))

    # Regex to split on whitespace and punctuation while keeping positions
    # Matches words or non-whitespace token sequences
    token_matches = list(re.finditer(r'\S+', text))
    results: List[Tuple[str, str, int, int]] = []

    for tm in token_matches:
        t_start, t_end = tm.span()
        t_text = tm.group()
        tag = "O"

        # Find if this token overlaps any entity span
        for ent in sorted_entities:
            e_start = ent["start"]
            e_end = ent["end"]
            e_label = ent["label"]

            # Token is inside or overlaps the entity span
            if t_start >= e_start and t_end <= e_end:
                # First token of the entity receives B-, subsequent tokens receive I-
                # Check if this token starts near the entity start
                if t_start == e_start or not results or not results[-1][1].endswith(e_label):
                    tag = f"B-{e_label}"
                else:
                    tag = f"I-{e_label}"
                break
            elif t_start < e_end and t_end > e_start:
                # Partial boundary overlap
                if not results or not results[-1][1].endswith(e_label):
                    tag = f"B-{e_label}"
                else:
                    tag = f"I-{e_label}"
                break

        results.append((t_text, tag, t_start, t_end))

    return results


def bio_to_spans(tokens: List[str], tags: List[str], text: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Converts BIO tag sequence back to entity spans.
    """
    entities: List[Dict[str, Any]] = []
    current_label: Optional[str] = None
    current_tokens: List[str] = []

    for token, tag in zip(tokens, tags):
        if tag.startswith("B-"):
            if current_label and current_tokens:
                entities.append({
                    "label": current_label,
                    "value": " ".join(current_tokens)
                })
            current_label = tag[2:]
            current_tokens = [token]
        elif tag.startswith("I-") and current_label == tag[2:]:
            current_tokens.append(token)
        else:
            if current_label and current_tokens:
                entities.append({
                    "label": current_label,
                    "value": " ".join(current_tokens)
                })
                current_label = None
                current_tokens = []

    if current_label and current_tokens:
        entities.append({
            "label": current_label,
            "value": " ".join(current_tokens)
        })

    return entities
