@echo off
REM Helper script to stop SIH26002 Docker containers
echo ========================================================
echo  Stopping all Docker containers...
echo ========================================================

docker compose down

echo.
echo Containers stopped.
pause

