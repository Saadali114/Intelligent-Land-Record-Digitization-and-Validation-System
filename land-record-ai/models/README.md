# Land Record AI - Model Version Registry

This directory contains versioned checkpoints, configurations, tokenizers, label mappings, and evaluation reports for trained land-record extraction models.

---

## Current Status

> **Model status: NOT TRAINED**  
> *No trained model/evaluation results available.*  
> Training requires annotating documents using the annotation tool and compiling the dataset via `python scripts/create_dataset.py` before running `python scripts/train.py`.

---

## Model Versioning Standard

Each trained version is saved in its own directory:

```text
models/
├── land-ner-v1/
│   ├── config.json
│   ├── model.safetensors / pytorch_model.bin
│   ├── tokenizer.json / tokenizer_config.json
│   ├── label_mapping.json
│   ├── training_args.json
│   ├── eval_results.json
│   └── dataset_version.json
│
├── land-ner-v2/
└── land-ner-v3/
```

### Version Changelog

| Version | Base Architecture | Dataset Version | Train Docs | Val Docs | Overall F1 | Status | Release Date |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `land-ner-v1` | `xlm-roberta-base` | Pending | 0 | 0 | Pending | Pending | Unreleased |

---

## Evaluation Artifacts Requirements

When training finishes, the training engine automatically generates:
1. `label_mapping.json`: Bidirectional label index (`id2label`, `label2id`).
2. `training_args.json`: Exact hyperparameters (learning rate, batch size, epochs, random seed).
3. `eval_results.json`: Honest metrics computed on the test set:
   - Overall Precision, Recall, and F1.
   - Per-entity Breakdown for all 19 land entity labels.
4. `dataset_version.json`: Checksum, sample count, and metadata summary of the training set used.
