# Maharashtra Land Record AI — Domain-Specific Extraction & Training System

An end-to-end, open, domain-specific AI system designed to digitize, annotate, train, evaluate, and extract structured land information from historical Maharashtra land records:
- **7/12 Satbara (गाव नमुना ७/१२)**
- **8A (गाव नमुना ८-अ)**
- **Ferfar / Mutation Registers (फेरफार नोंदवही)**
- **Sale Deeds & Conveyances (खरेदीखत / बैनामा)**

Supports multilingual text (Marathi, Hindi, English) across aged, noisy, table-based, and skewed historical documents.

---

## 1. System Pipeline Architecture

```text
Real Land Documents
        ↓
Image Preprocessing (OpenCV: Resize, Denoise, CLAHE, Deskew, Binarize, Sharpen)
        ↓
Document Classification (7/12, 8A, Ferfar, Sale Deed)
        ↓
Multilingual OCR (PaddleOCR / EasyOCR)
        ↓
OCR Tokens + Bounding Boxes
        ↓
Web Annotation Studio (Interactive Span Selector & OCR Editor)
        ↓
Dataset Validation (Overlaps, BIO Transitions, Bound Checks)
        ↓
Leak-Free Partitioning (70% Train / 15% Validation / 15% Test)
        ↓
Custom Land Entity Model (XLM-RoBERTa + Token Classification Head)
        ↓
Model Evaluation (Entity Precision, Recall, F1 via seqeval)
        ↓
Entity Normalization & Cadastral Business Validation
        ↓
Confidence Scoring & Human Review Routing (< 0.70 Threshold)
        ↓
Structured Land Record JSON + Bounding Box Visualization
        ↓
Human Correction Loop (data/corrections/ for Active Learning)
```

---

## 2. Dataset Provenance & Privacy Policy

### Permitted Document Sources
1. **Voluntarily Contributed Records**: Documents provided by team members or property holders for verification.
2. **Research & Academic Permissions**: Historical archives obtained with explicit permission.
3. **Authorized Public Datasets**: Official government demo portals, gazettes, and public tenders.
4. **Synthetic / Simulated Datasets**: Clearly watermarked test documents generated via `scripts/generate_synthetic.py`.

### Strict Privacy & Anonymization Rule
> [!IMPORTANT]
> **No PII in Training Datasets**: Private personal identifiers (Aadhaar numbers, phone numbers, bank details, exact private residential addresses) are strictly excluded from dataset metadata and training annotations.

All documents recorded in `data/metadata.csv` track:
```csv
document_id,document_type,language,year,district,taluka,village,source,permission,anonymized,image_quality,notes
```

---

## 3. Directory Structure

```text
land-record-ai/
│
├── data/
│   ├── raw/                 # Ingested raw scans (7_12, ferfar, 8a, sale_deed)
│   ├── processed/           # OpenCV enhanced & deskewed images
│   ├── ocr/                 # OCR token JSONs with [x1, y1, x2, y2] bboxes
│   ├── annotations/         # Entity annotations with character offsets & labels
│   ├── corrections/         # Human feedback logs for continuous active learning
│   ├── train/               # 70% Training partition
│   ├── validation/          # 15% Validation partition
│   ├── test/                # 15% Test partition (unseen templates)
│   └── metadata.csv         # Provenance, quality, and permission ledger
│
├── models/
│   ├── README.md            # Model version registry and honest status report
│   └── land-ner-v1/         # Checkpoints, tokenizer, label mapping, eval metrics
│
├── src/
│   ├── preprocessing/       # image_processor.py, deskew.py, enhancement.py
│   ├── ocr/                 # paddle_ocr.py, ocr_processor.py
│   ├── extraction/          # labels.py (19 standard land entity labels + BIO)
│   ├── normalization/       # normalizer.py (Units, dates, survey numbers)
│   ├── validation/          # validator.py (Area thresholds, review routing)
│   ├── visualization/       # visualizer.py (Bounding box & badge overlay)
│   ├── training/            # dataset.py, tokenizer.py, model.py, train.py, evaluate.py
│   └── pipeline.py          # Master inference pipeline
│
├── scripts/
│   ├── add_document.py      # Ingest scan & update metadata.csv
│   ├── run_ocr.py           # Preprocess & run multilingual OCR
│   ├── create_dataset.py    # Compile annotations into BIO dataset
│   ├── validate_dataset.py  # Check overlaps, missing labels, empty scans
│   ├── split_dataset.py     # Leak-free 70/15/15 template clustering
│   ├── train.py             # CLI model fine-tuning with GPU auto-detect
│   ├── evaluate.py          # Exact entity-level evaluation report
│   ├── dataset_stats.py     # Dataset growth & distribution monitor
│   └── generate_synthetic.py# Fictional demo dataset generator
│
├── api/
│   ├── main.py              # FastAPI server (/health, /extract, /feedback, /train, /model/status)
│   └── static/
│       └── annotator.html   # Web-based Dual-Pane Annotation Studio
│
├── configs/
│   └── default_config.yaml  # Configurable thresholds, paths, and hyperparameters
│
├── tests/                   # Full unit test suite (19 tests)
├── demo.py                  # Standalone CLI inference demo
├── requirements.txt         # Dependencies
└── README.md
```

---

## 4. Land Entity Labels

The system standardizes 19 core Maharashtra cadastral entity labels:

| Label | Description | Marathi Equivalent |
| :--- | :--- | :--- |
| `OWNER_NAME` | Primary landholder / occupant | खातेदार / मालक / भोगवटादार |
| `CO_OWNER_NAME` | Joint owner / family co-holder | सह-खातेदार |
| `SURVEY_NUMBER` | Cadastral survey number | भूमापन क्रमांक |
| `GAT_NUMBER` | Gat plot number | गट क्रमांक |
| `KHATA_NUMBER` | Account / ledger number | खाते क्रमांक |
| `VILLAGE` | Village or Mouje | गाव / मौजे |
| `TALUKA` | Sub-district / Tehsil | तालुका / तहसील |
| `DISTRICT` | District | जिल्हा |
| `LAND_AREA` | Plot surface area numeric value | एकूण क्षेत्रफळ |
| `LAND_AREA_UNIT`| Measurement unit (`hectare`, `are`, `acre`) | क्षेत्र एकक (हेक्टर / आर) |
| `LAND_TYPE` | Tenure / usage classification | जिरायत / बागायत |
| `CROP` | Cultivated crop name | पिकाचे नाव |
| `MUTATION_NUMBER`| Mutation / Ferfar entry ID | शेवटचा फेरफार क्रमांक |
| `MUTATION_DATE` | Mutation entry date | फेरफार दिनांक |
| `DOCUMENT_DATE` | Execution or issue date | नोंदणी / निर्गमित दिनांक |
| `BOUNDARY_NORTH`| Northern plot boundary | उत्तर सीमा |
| `BOUNDARY_SOUTH`| Southern plot boundary | दक्षिण सीमा |
| `BOUNDARY_EAST` | Eastern plot boundary | पूर्व सीमा |
| `BOUNDARY_WEST` | Western plot boundary | पश्चिम सीमा |

---

## 5. Step-by-Step Real Data Workflow

### Step 1: Add a Raw Document
```bash
python scripts/add_document.py \
    --input sample_7_12.jpg \
    --type 7_12 \
    --language Marathi \
    --district Pune \
    --taluka Mulshi \
    --village Hinjawadi \
    --source authorized_contributor \
    --permission true
```

### Step 2: Run Multilingual OCR
```bash
python scripts/run_ocr.py --input data/raw/7_12/DOC_7_12_001.jpg
```
Saves bounding boxes and recognized tokens into `data/ocr/DOC_7_12_001.json`.

### Step 3: Interactive Annotation Tool
Start the annotation studio:
```bash
python -m uvicorn api.main:app --port 8001
```
Open **http://localhost:8001/annotator** in your browser:
- Inspect document scan side-by-side with OCR text.
- Click or drag across OCR words to highlight them.
- Assign an entity label from the dropdown shortcut.
- Correct any OCR misreads in the editor.
- Click **Save Annotations** (persists to `data/annotations/<doc_id>.json`).

### Step 4: Validate Dataset Integrity
```bash
python scripts/validate_dataset.py
```
Checks for:
- Overlapping entity spans
- Out-of-bounds start/end character offsets
- Missing or unsupported labels
- Duplicate document texts
- Invalid BIO tag transitions (`I-` without preceding `B-`)

### Step 5: Compile & Split Dataset
```bash
python scripts/create_dataset.py
python scripts/split_dataset.py
```
Groups documents by template clustering to guarantee that identical templates or duplicate scans never leak across Train, Validation, and Test sets.

### Step 6: Train XLM-RoBERTa Token Classification Head
```bash
python scripts/train.py \
    --task ner \
    --model xlm-roberta-base \
    --epochs 5 \
    --batch-size 8 \
    --learning-rate 2e-5 \
    --output-dir models/land-ner-v1
```
*Automatically detects CUDA GPU when available; otherwise runs on CPU.*

### Step 7: Model Evaluation (Honest Metrics)
```bash
python scripts/evaluate.py --model-dir models/land-ner-v1 --test-data data/test
```
Calculates exact entity-level Precision, Recall, and F1 scores. If no model has been trained yet, it honestly outputs:
```text
No trained model/evaluation results available.
Model status: NOT TRAINED
```

### Step 8: Run Inference Demo
```bash
python demo.py --input data/raw/7_12/DOC_7_12_001.jpg
```

Output format:
```text
========================================
LAND RECORD AI
========================================

Document Type : 7_12
Language      : Marathi, English

Owner Name    : शंकर गणपत पाटील
Gat Number    : 145/2A
Village       : हिंगवडी
Taluka        : मुळशी
District      : पुणे
Land Area     : 1.25 hectare

Confidence    : 93%

Status        : VERIFIED
========================================
```

---

## 6. Continuous Human-in-the-Loop Feedback API

When officers or verifiers correct an AI prediction in production, report it to the feedback endpoint:

```http
POST /api/v1/feedback
Content-Type: application/json

{
  "documentId": "DOC_001",
  "field": "OWNER_NAME",
  "predictedValue": "राम गणपथ पाटील",
  "correctedValue": "राम गणपत पाटील"
}
```

Corrections are automatically stored in `data/corrections/corrections_log.jsonl` and can be compiled into active learning retraining datasets.

---

## 7. Running Unit Tests

```bash
python -m unittest discover -s tests -p "test_*.py"
```
All 19 unit tests cover image preprocessing, deskew angle detection, CLAHE/Otsu enhancement, entity normalization, area sanity thresholds, and end-to-end pipeline classification.
