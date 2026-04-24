@echo off
cd /d "d:\OneDrive\Documents\GitHub\web-arkom\server"
echo Installing Node dependencies...
npm install --quiet
echo.
echo ✅ Starting Proxy Server on http://localhost:4000
echo.
node proxy.js
pause
