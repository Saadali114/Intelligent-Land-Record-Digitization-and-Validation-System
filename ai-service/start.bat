@echo off
title ILRDVS Python AI Microservice (Port 8000)
cd /d "%~dp0"
echo ===================================================
echo Starting ILRDVS AI Microservice on port 8000...
echo Preprocessing: OpenCV | OCR: EasyOCR | NER: Regex
echo ===================================================
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
    python main.py
) else (
    py -3.12 main.py
)
pause
