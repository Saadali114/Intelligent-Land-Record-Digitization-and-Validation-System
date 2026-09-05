"""
Pydantic models for request/response schemas
"""
from pydantic import BaseModel
from typing import Optional, Dict, List, Any


class OCRResponse(BaseModel):
    # Core cadastral fields
    ownerName: str = ""
    surveyNumber: str = ""
    khasraNumber: str = ""
    khataNumber: str = ""
    plotArea: str = ""
    village: str = ""
    tehsil: str = ""
    district: str = ""
    landClassification: str = "Agricultural (Jirayat)"
    ownershipType: str = "Occupant Class 1 (भोगवटादार वर्ग - १)"
    mutationNumber: str = ""
    registrationNumber: str = ""
    remarks: str = ""
    entities: Dict[str, Any] = {}

    # Quality & meta
    overallConfidence: float = 0.0
    fieldConfidence: Dict[str, float] = {}
    anomalies: List[str] = []
    rawTextSnippet: str = ""
    ocrEngine: str = "easyocr"
    ocrCharsExtracted: int = 0
    ocrDurationMs: int = 0
    preprocessingSteps: List[str] = []


class OCRRequest(BaseModel):
    language: str = "Marathi"
    file_name: str = "document"


class DuplicateCheckRequest(BaseModel):
    surveyNumber: str
    ownerName: str
    district: str
    existingRecords: List[Dict[str, Any]] = []


class DuplicateCheckResponse(BaseModel):
    isDuplicate: bool
    confidence: float
    matchedRecord: Optional[Dict[str, Any]] = None
    reason: str = ""
