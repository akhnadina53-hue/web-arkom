@echo off
cd /d "d:\OneDrive\Documents\GitHub\web-arkom\apps\web"
echo Installing Node dependencies...
npm install --quiet
echo.
echo ✅ Starting Next.js Frontend on http://localhost:3000
echo.
npm run dev
pause
