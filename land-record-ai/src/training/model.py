"""
XLM-RoBERTa Token Classification Architecture for Land NER
==========================================================
Wraps Hugging Face XLM-RoBERTa with a Token Classification Head
for multilingual Devanagari and English land document entity extraction.
"""

import os
import json
from typing import Dict, Any, Optional, Tuple, List
import torch
import torch.nn as nn

from ..extraction.labels import label_manager


def build_model(
    model_name: str = "xlm-roberta-base",
    num_labels: Optional[int] = None,
    id2label: Optional[Dict[int, str]] = None,
    label2id: Optional[Dict[str, int]] = None,
) -> nn.Module:
    """
    Instantiates XLM-RoBERTa for Token Classification.
    """
    from transformers import AutoModelForTokenClassification, AutoConfig

    id2lbl = id2label or label_manager.id2label
    lbl2id = label2id or label_manager.label2id
    n_labels = num_labels or len(id2lbl)

    config = AutoConfig.from_pretrained(
        model_name,
        num_labels=n_labels,
        id2label=id2lbl,
        label2id=lbl2id,
    )

    model = AutoModelForTokenClassification.from_pretrained(
        model_name,
        config=config,
    )
    return model


def load_trained_model(model_dir: str, device: str = "cpu") -> Tuple[Optional[nn.Module], Optional[Any], Dict[str, Any]]:
    """
    Loads a saved checkpoint directory with model weights, tokenizer, and metadata.
    Returns (model, tokenizer, metadata). If directory does not contain weights, returns (None, None, {}).
    """
    if not os.path.exists(model_dir):
        return None, None, {"status": "NOT_FOUND", "message": "Model directory does not exist"}

    # Check for model weights
    has_weights = os.path.exists(os.path.join(model_dir, "model.safetensors")) or \
                  os.path.exists(os.path.join(model_dir, "pytorch_model.bin"))

    if not has_weights:
        return None, None, {"status": "NOT_TRAINED", "message": "No model weights found in directory"}

    try:
        from transformers import AutoModelForTokenClassification, AutoTokenizer

        tokenizer = AutoTokenizer.from_pretrained(model_dir)
        model = AutoModelForTokenClassification.from_pretrained(model_dir)
        model.to(device)
        model.eval()

        meta_path = os.path.join(model_dir, "eval_results.json")
        meta = {}
        if os.path.exists(meta_path):
            with open(meta_path, "r", encoding="utf-8") as f:
                meta = json.load(f)

        return model, tokenizer, {"status": "READY", "metadata": meta}
    except Exception as e:
        return None, None, {"status": "ERROR", "message": str(e)}
