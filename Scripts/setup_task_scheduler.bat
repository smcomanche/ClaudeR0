@echo off
REM ============================================================
REM  Best Buy Price Tracker - Task Scheduler Setup
REM  Run this script as Administrator to create a scheduled task
REM  that checks the price every 6 hours.
REM ============================================================

set TASK_NAME=BestBuyPriceTracker
set PYTHON_EXE=C:\Users\shawn\AppData\Local\Programs\Python\Python312\python.exe
set SCRIPT_PATH=%~dp0bestbuy_price_tracker.py
set WORKING_DIR=%~dp0
set LOG_FILE=%~dp0tracker_scheduler.log

echo ============================================================
echo  Best Buy Price Tracker - Task Scheduler Setup
echo ============================================================
echo.
echo Task name:    %TASK_NAME%
echo Python:       %PYTHON_EXE%
echo Script:       %SCRIPT_PATH%
echo Schedule:     Every 6 hours, starting now
echo.

REM Check for admin rights
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] This script needs to run as Administrator.
    echo     Right-click this file and select "Run as administrator".
    pause
    exit /b 1
)

REM Delete existing task if it exists (to allow re-running setup)
schtasks /query /tn "%TASK_NAME%" >nul 2>&1
if %errorlevel% equ 0 (
    echo [*] Removing existing task "%TASK_NAME%"...
    schtasks /delete /tn "%TASK_NAME%" /f >nul 2>&1
)

REM Create the scheduled task
echo [*] Creating scheduled task...
schtasks /create ^
    /tn "%TASK_NAME%" ^
    /tr "\"%PYTHON_EXE%\" \"%SCRIPT_PATH%\" >> \"%LOG_FILE%\" 2>&1" ^
    /sc hourly ^
    /mo 6 ^
    /st 00:00 ^
    /ru "%USERNAME%" ^
    /rl HIGHEST ^
    /f

if %errorlevel% equ 0 (
    echo.
    echo [OK] Scheduled task created successfully!
    echo.
    echo   The tracker will run every 6 hours.
    echo   Output is logged to: %LOG_FILE%
    echo.
    echo   To run it right now:
    echo     schtasks /run /tn "%TASK_NAME%"
    echo.
    echo   To check status:
    echo     schtasks /query /tn "%TASK_NAME%" /v /fo list
    echo.
    echo   To remove it later:
    echo     schtasks /delete /tn "%TASK_NAME%" /f
) else (
    echo.
    echo [!] Failed to create scheduled task. Check the error above.
)

echo.
pause
