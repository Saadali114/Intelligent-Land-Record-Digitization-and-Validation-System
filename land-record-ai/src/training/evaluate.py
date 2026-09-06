"""
Model Evaluation Module for Land Record NER
============================================
Calculates exact entity-level Precision, Recall, and F1 scores using seqeval.
Does NOT fabricate metrics. Reports 'No trained model/evaluation results available'
when no checkpoint exists.
"""

import os
import json
from typing import Dict, Any, List, Optional
import torch
import numpy as np

from ..extraction.labels import label_manager


def compute_ner_metrics(
    predictions: List[List[str]],
    references: List[List[str]],
) -> Dict[str, Any]:
    """
    Computes true Precision, Recall, and F1 scores at the entity level.
    Uses seqeval if installed; otherwise computes token-level metrics without inventing values.
    """
    if not predictions or not references:
        return {
            "overall": {"precision": 0.0, "recall": 0.0, "f1": 0.0},
            "per_entity": {},
            "total_evaluated_samples": 0,
        }

    try:
        from seqeval.metrics import (
            precision_score,
            recall_score,
            f1_score,
            classification_report,
        )

        overall_p = float(precision_score(references, predictions))
        overall_r = float(recall_score(references, predictions))
        overall_f1 = float(f1_score(references, predictions))

        # Parse per-entity breakdown from classification report dictionary
        report_dict = classification_report(references, predictions, output_dict=True)
        per_entity = {}
        for ent_name, scores in report_dict.items():
            if ent_name in ("macro avg", "weighted avg", "micro avg"):
                continue
            if isinstance(scores, dict):
                per_entity[ent_name] = {
                    "precision": round(float(scores.get("precision", 0.0)), 4),
                    "recall": round(float(scores.get("recall", 0.0)), 4),
                    "f1": round(float(scores.get("f1-score", 0.0)), 4),
                    "support": int(scores.get("support", 0)),
                }

        return {
            "overall": {
                "precision": round(overall_p, 4),
                "recall": round(overall_r, 4),
                "f1": round(overall_f1, 4),
            },
            "per_entity": per_entity,
            "total_evaluated_samples": len(predictions),
        }
    except ImportError:
        # Fallback: exact token-level match without seqeval
        all_true = [t for seq in references for t in seq]
        all_pred = [t for seq in predictions for t in seq]

        labels = sorted(list(set(all_true) - {"O"}))
        per_entity = {}
        tp_total, fp_total, fn_total = 0, 0, 0

        for lbl in labels:
            tp = sum(1 for p, r in zip(all_pred, all_true) if p == lbl and r == lbl)
            fp = sum(1 for p, r in zip(all_pred, all_true) if p == lbl and r != lbl)
            fn = sum(1 for p, r in zip(all_pred, all_true) if p != lbl and r == lbl)

            p = tp / (tp + fp) if (tp + fp) > 0 else 0.0
            r = tp / (tp + fn) if (tp + fn) > 0 else 0.0
            f1 = 2 * p * r / (p + r) if (p + r) > 0 else 0.0

            clean_name = lbl[2:] if lbl.startswith(("B-", "I-")) else lbl
            per_entity[clean_name] = {
                "precision": round(p, 4),
                "recall": round(r, 4),
                "f1": round(f1, 4),
                "support": tp + fn,
            }
            tp_total += tp
            fp_total += fp
            fn_total += fn

        overall_p = tp_total / (tp_total + fp_total) if (tp_total + fp_total) > 0 else 0.0
        overall_r = tp_total / (tp_total + fn_total) if (tp_total + fn_total) > 0 else 0.0
        overall_f1 = 2 * overall_p * overall_r / (overall_p + overall_r) if (overall_p + overall_r) > 0 else 0.0

        return {
            "overall": {
                "precision": round(overall_p, 4),
                "recall": round(overall_r, 4),
                "f1": round(overall_f1, 4),
            },
            "per_entity": per_entity,
            "total_evaluated_samples": len(predictions),
        }


def format_evaluation_report(metrics: Dict[str, Any]) -> str:
    """Formats the metrics into the standardized CLI report."""
    if not metrics or metrics.get("total_evaluated_samples", 0) == 0:
        return "No trained model/evaluation results available."

    lines = [
        "=" * 50,
        "ENTITY PERFORMANCE",
        "=" * 50,
    ]

    per_entity = metrics.get("per_entity", {})
    for ent, scores in per_entity.items():
        lines.append(
            f"{ent:<18} Precision: {scores['precision']:.2f}\n"
            f"{'':<18} Recall:    {scores['recall']:.2f}\n"
            f"{'':<18} F1:        {scores['f1']:.2f}"
        )

    overall = metrics.get("overall", {})
    lines.append("-" * 50)
    lines.append(
        f"OVERALL PERFORMANCE\n"
        f"Precision: {overall.get('precision', 0.0):.2f}\n"
        f"Recall:    {overall.get('recall', 0.0):.2f}\n"
        f"F1 Score:  {overall.get('f1', 0.0):.2f}"
    )
    lines.append("=" * 50)
    return "\n".join(lines)


def evaluate_model_on_dataset(
    model: Any,
    dataset: Any,
    batch_size: int = 8,
    device: str = "cpu",
) -> Dict[str, Any]:
    """
    Runs full evaluation loop across dataset tensors and returns metrics dictionary.
    """
    from torch.utils.data import DataLoader

    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=False)
    model.to(device)
    model.eval()

    all_preds = []
    all_refs = []
    id2label = label_manager.id2label

    with torch.no_grad():
        for batch in dataloader:
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)

            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            logits = outputs.logits
            preds = torch.argmax(logits, dim=-1)

            # Convert tensors to label lists, skipping masked tokens (-100)
            preds_np = preds.cpu().numpy()
            labels_np = labels.cpu().numpy()

            for i in range(len(labels_np)):
                batch_preds = []
                batch_refs = []
                for p_idx, l_idx in zip(preds_np[i], labels_np[i]):
                    if l_idx != -100:
                        batch_preds.append(id2label.get(p_idx, "O"))
                        batch_refs.append(id2label.get(l_idx, "O"))
                if batch_refs:
                    all_preds.append(batch_preds)
                    all_refs.append(batch_refs)

    return compute_ner_metrics(all_preds, all_refs)
