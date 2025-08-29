Write-Host "Starting LLM Agent Chatbot..." -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Setting up database..." -ForegroundColor Yellow
Set-Location backend
python scripts/init_db.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to initialize database" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD'; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -WindowStyle Normal

Write-Host ""
Write-Host "Step 3: Starting frontend..." -ForegroundColor Yellow
Set-Location ../frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "🎉 Project started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Enter to exit this script..." -ForegroundColor Gray
Read-Host

