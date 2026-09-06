"""
Subword Tokenizer and Label Alignment Module
=============================================
Aligns pre-tokenized words and BIO entity tags with Hugging Face subword tokenizers
(XLM-RoBERTa / RoBERTa) using standard -100 masking for continuation tokens.
"""

from typing import List, Dict, Any, Tuple, Optional
import torch

from ..extraction.labels import label_manager


class SubwordAligner:
    """Handles subword tokenization and BIO label alignment for XLM-RoBERTa."""

    def __init__(self, model_name: str = "xlm-roberta-base", max_length: int = 512):
        self.model_name = model_name
        self.max_length = max_length
        self._tokenizer = None

    def get_tokenizer(self):
        if self._tokenizer is None:
            from transformers import AutoTokenizer
            self._tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        return self._tokenizer

    def tokenize_and_align_labels(
        self,
        words: List[str],
        tags: List[str],
        label2id: Optional[Dict[str, int]] = None,
    ) -> Dict[str, torch.Tensor]:
        """
        Tokenizes a single document's words and aligns the corresponding BIO tags.
        Subword pieces beyond the first subtoken of a word are mapped to label -100.
        """
        tokenizer = self.get_tokenizer()
        l2id = label2id or label_manager.label2id

        tokenized_inputs = tokenizer(
            words,
            is_split_into_words=True,
            truncation=True,
            max_length=self.max_length,
            padding="max_length",
            return_tensors="pt"
        )

        word_ids = tokenized_inputs.word_ids(batch_index=0)
        previous_word_idx = None
        label_ids = []

        for word_idx in word_ids:
            if word_idx is None:
                # Special tokens ([CLS], [SEP], [PAD])
                label_ids.append(-100)
            elif word_idx != previous_word_idx:
                # First subword token of the word -> gets the word's true tag
                tag = tags[word_idx] if word_idx < len(tags) else "O"
                label_ids.append(l2id.get(tag, l2id.get("O", 0)))
            else:
                # Subsequent subword piece of the same word -> mask with -100
                label_ids.append(-100)
            previous_word_idx = word_idx

        return {
            "input_ids": tokenized_inputs["input_ids"].squeeze(0),
            "attention_mask": tokenized_inputs["attention_mask"].squeeze(0),
            "labels": torch.tensor(label_ids, dtype=torch.long),
        }
