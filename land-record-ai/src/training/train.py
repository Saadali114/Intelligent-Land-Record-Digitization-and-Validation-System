"""
Training Engine for Land Record NER
====================================
Fine-tunes XLM-RoBERTa for Token Classification.
Handles GPU/CPU auto-detection, checkpointing, and evaluation tracking.
"""

import os
import sys
import json
import argparse
from typing import Optional, Dict, Any
import torch
from torch.utils.data import DataLoader
from torch.optim import AdamW

from .tokenizer import SubwordAligner
from .dataset import LandRecordNERDataset
from .model import build_model
from .evaluate import evaluate_model_on_dataset, format_evaluation_report
from ..extraction.labels import label_manager


def train_model(
    model_name: str = "xlm-roberta-base",
    train_data_path: str = "data/train",
    val_data_path: Optional[str] = "data/validation",
    output_dir: str = "models/land-ner-v1",
    epochs: int = 5,
    batch_size: int = 8,
    learning_rate: float = 2.0e-5,
    device_override: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Executes the training loop and saves model checkpoint and evaluation metrics.
    """
    # Auto-detect device: CUDA GPU when available, otherwise CPU
    if device_override and device_override.lower() in ("cuda", "cpu"):
        device = device_override.lower()
    else:
        device = "cuda" if torch.cuda.is_available() else "cpu"

    print(f"[Training] Using computing device: {device.upper()}")
    if device == "cuda":
        print(f"[Training] GPU: {torch.cuda.get_device_name(0)}")

    aligner = SubwordAligner(model_name=model_name)
    train_dataset = LandRecordNERDataset(train_data_path, tokenizer_aligner=aligner)

    if len(train_dataset) == 0:
        msg = f"Dataset currently contains {len(train_dataset)} documents. Training cannot proceed until documents are annotated."
        print(f"[Training] {msg}")
        return {"status": "ABORTED", "reason": msg, "samples": 0}

    val_dataset = None
    if val_data_path and os.path.exists(val_data_path):
        val_dataset = LandRecordNERDataset(val_data_path, tokenizer_aligner=aligner)

    print(f"[Training] Loaded {len(train_dataset)} training samples" + (f", {len(val_dataset)} validation samples" if val_dataset else ""))

    # Instantiate model
    print(f"[Training] Initializing base model: {model_name} with Token Classification Head...")
    model = build_model(
        model_name=model_name,
        num_labels=len(label_manager.bio_tags),
        id2label=label_manager.id2label,
        label2id=label_manager.label2id,
    )
    model.to(device)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    optimizer = AdamW(model.parameters(), lr=learning_rate, weight_decay=0.01)

    os.makedirs(output_dir, exist_ok=True)
    best_f1 = -1.0
    history = []

    print(f"[Training] Starting fine-tuning for {epochs} epochs (Batch size: {batch_size}, LR: {learning_rate})...")

    for epoch in range(1, epochs + 1):
        model.train()
        total_loss = 0.0

        for batch_idx, batch in enumerate(train_loader):
            optimizer.zero_grad()
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)

            outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
            loss = outputs.loss
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()

            total_loss += loss.item()

        avg_loss = total_loss / len(train_loader)
        epoch_info = {"epoch": epoch, "train_loss": round(avg_loss, 4)}

        # Validate if validation dataset provided
        if val_dataset and len(val_dataset) > 0:
            val_metrics = evaluate_model_on_dataset(model, val_dataset, batch_size=batch_size, device=device)
            val_f1 = val_metrics["overall"]["f1"]
            epoch_info["val_f1"] = val_f1
            epoch_info["val_precision"] = val_metrics["overall"]["precision"]
            epoch_info["val_recall"] = val_metrics["overall"]["recall"]
            print(f"Epoch {epoch}/{epochs} - Loss: {avg_loss:.4f} | Val F1: {val_f1:.2f} (P: {val_metrics['overall']['precision']:.2f}, R: {val_metrics['overall']['recall']:.2f})")

            if val_f1 > best_f1:
                best_f1 = val_f1
                # Save best checkpoint
                model.save_pretrained(output_dir)
                aligner.get_tokenizer().save_pretrained(output_dir)
        else:
            print(f"Epoch {epoch}/{epochs} - Train Loss: {avg_loss:.4f}")

        history.append(epoch_info)

    # Save final model if not already saved
    if best_f1 == -1.0:
        model.save_pretrained(output_dir)
        aligner.get_tokenizer().save_pretrained(output_dir)

    # Save label mapping & metadata
    with open(os.path.join(output_dir, "label_mapping.json"), "w", encoding="utf-8") as f:
        json.dump({
            "labels": label_manager.get_labels(),
            "bio_tags": label_manager.get_bio_tags(),
            "id2label": label_manager.id2label,
            "label2id": label_manager.label2id,
        }, f, indent=2, ensure_ascii=False)

    training_args = {
        "model_name": model_name,
        "epochs": epochs,
        "batch_size": batch_size,
        "learning_rate": learning_rate,
        "device": device,
        "train_samples": len(train_dataset),
        "val_samples": len(val_dataset) if val_dataset else 0,
        "history": history,
    }
    with open(os.path.join(output_dir, "training_args.json"), "w", encoding="utf-8") as f:
        json.dump(training_args, f, indent=2)

    # Final evaluation on validation set if available
    final_metrics = {}
    if val_dataset and len(val_dataset) > 0:
        final_metrics = evaluate_model_on_dataset(model, val_dataset, batch_size=batch_size, device=device)
        with open(os.path.join(output_dir, "eval_results.json"), "w", encoding="utf-8") as f:
            json.dump(final_metrics, f, indent=2, ensure_ascii=False)
        print("\n" + format_evaluation_report(final_metrics))

    print(f"[Training] Model successfully saved to {output_dir}")
    return {
        "status": "COMPLETED",
        "output_dir": output_dir,
        "training_args": training_args,
        "metrics": final_metrics,
    }
