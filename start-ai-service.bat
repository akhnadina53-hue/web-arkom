@echo off
cd /d "d:\OneDrive\Documents\GitHub\web-arkom\ai-service"
echo Installing Python dependencies...
python -m pip install -r requirements.txt -q
echo.
echo ✅ Starting AI Service on http://localhost:8000
echo.
python -m uvicorn main:app --reload --port 8000
pause
