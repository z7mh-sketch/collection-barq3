@echo off
title Collection Barq - Server + Tunnel
cd /d "%~dp0"

:: Start the local server in the background
start "Collection Barq Server" powershell -ExecutionPolicy Bypass -WindowStyle Minimized -File "%~dp0server.ps1"

:: Wait a moment for server to start
timeout /t 2 /nobreak >nul

:: Start Cloudflare Tunnel (shows the public URL in this window)
echo.
echo =============================================
echo   Starting Cloudflare Tunnel...
echo   Wait for the URL to appear below
echo   Share that URL with your team
echo =============================================
echo.

if exist "%~dp0cloudflared.exe" (
    "%~dp0cloudflared.exe" tunnel --url http://localhost:3030
) else (
    echo [ERROR] cloudflared.exe not found in this folder.
    echo Download it from: https://github.com/cloudflare/cloudflared/releases/latest
    echo Place cloudflared.exe in: %~dp0
    echo.
    pause
)
