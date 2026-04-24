@echo off
echo.
echo ========================================
echo   FREN-EDU APP - Complete Setup
echo ========================================
echo.
echo This will open 3 windows for:
echo 1. AI Service (FastAPI) - Port 8000
echo 2. Proxy Server (Express) - Port 4000
echo 3. Frontend (Next.js) - Port 3000
echo.
echo Opening windows in 3 seconds...
timeout /t 3 /nobreak

start "AI Service" cmd /k call start-ai-service.bat
timeout /t 2 /nobreak

start "Proxy Server" cmd /k call start-proxy.bat
timeout /t 2 /nobreak

start "Next.js Frontend" cmd /k call start-frontend.bat

echo.
echo All services are starting...
echo.
echo Once ready, open: http://localhost:3000
echo.
pause
