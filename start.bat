@echo off
title Collection Barq - Server
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -WindowStyle Normal -File "%~dp0server.ps1"
pause
