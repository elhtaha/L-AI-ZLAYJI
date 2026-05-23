@echo off
echo Starting Backend...
start cmd /k "cd backend && uvicorn main:app --reload --port 8000"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting in new windows!