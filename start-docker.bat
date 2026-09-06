@echo off
REM Helper script to start or manage SIH26002 Docker containers
echo ========================================================
echo  SIH26002: Smart Logistics ^& Route Intelligence Platform
echo  Starting all Docker containers...
echo ========================================================

docker compose up -d

echo.
echo Containers started!
echo Frontend:    http://localhost:3000
echo Backend:     http://localhost:3001
echo ML Service:  http://localhost:8000/docs
echo Neo4j:       http://localhost:7474
echo.
pause

