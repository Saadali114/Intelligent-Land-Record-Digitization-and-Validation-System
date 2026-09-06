"""
PyTorch Dataset for Land Record Token Classification / NER
===========================================================
Loads annotated JSON or BIO documents and converts them into subword tensors.
"""

import os
import json
import glob
from typing import List, Dict, Any, Optional
import torch
from torch.utils.data import Dataset

from .tokenizer import SubwordAligner
from ..extraction.labels import label_manager, text_and_spans_to_bio


class LandRecordNERDataset(Dataset):
    """PyTorch Dataset for training and evaluating land record token classification models."""

    def __init__(
        self,
        data_source: str,
        tokenizer_aligner: Optional[SubwordAligner] = None,
        label2id: Optional[Dict[str, int]] = None,
    ):
        """
        Args:
            data_source: Path to a single JSON/JSONL dataset file or directory of annotation files.
            tokenizer_aligner: SubwordAligner instance.
            label2id: Mapping from BIO tag to label ID.
        """
        self.data_source = data_source
        self.aligner = tokenizer_aligner or SubwordAligner()
        self.label2id = label2id or label_manager.label2id
        self.examples: List[Dict[str, Any]] = []

        self._load_examples()

    def _load_examples(self) -> None:
        """Parses annotated documents into (words, tags) pairs."""
        if os.path.isfile(self.data_source):
            with open(self.data_source, "r", encoding="utf-8") as f:
                if self.data_source.endswith(".jsonl"):
                    for line in f:
                        if line.strip():
                            self._parse_raw_record(json.loads(line))
                else:
                    data = json.load(f)
                    if isinstance(data, list):
                        for rec in data:
                            self._parse_raw_record(rec)
                    elif isinstance(data, dict):
                        # Could be a single document or container
                        if "examples" in data:
                            for rec in data["examples"]:
                                self._parse_raw_record(rec)
                        else:
                            self._parse_raw_record(data)
        elif os.path.isdir(self.data_source):
            json_files = glob.glob(os.path.join(self.data_source, "*.json"))
            for jf in json_files:
                try:
                    with open(jf, "r", encoding="utf-8") as f:
                        rec = json.load(f)
                        self._parse_raw_record(rec)
                except Exception as e:
                    print(f"[Dataset] Warning: failed to read {jf} ({e})")

    def _parse_raw_record(self, record: Dict[str, Any]) -> None:
        """Normalizes document format into words and tags lists."""
        doc_id = record.get("document_id", "DOC")

        # Format A: Already pre-tokenized words and tags
        if "words" in record and "tags" in record:
            words = record["words"]
            tags = record["tags"]
            if words and len(words) == len(tags):
                self.examples.append({
                    "document_id": doc_id,
                    "words": words,
                    "tags": tags,
                })
                return

        # Format B: Raw text + character entity spans
        if "text" in record and "entities" in record:
            text = record["text"]
            entities = record["entities"]
            bio_tuples = text_and_spans_to_bio(text, entities)
            if bio_tuples:
                words = [t[0] for t in bio_tuples]
                tags = [t[1] for t in bio_tuples]
                self.examples.append({
                    "document_id": doc_id,
                    "words": words,
                    "tags": tags,
                })

    def __len__(self) -> int:
        return len(self.examples)

    def __getitem__(self, idx: int) -> Dict[str, torch.Tensor]:
        ex = self.examples[idx]
        tensors = self.aligner.tokenize_and_align_labels(
            words=ex["words"],
            tags=ex["tags"],
            label2id=self.label2id,
        )
        return tensors
