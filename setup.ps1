#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Quick setup script for Halal Gelatin Supply Chain Interface

.DESCRIPTION
    This script sets up and runs the entire application:
    1. Installs dependencies
    2. Deploys the smart contract
    3. Starts the web interface server

.EXAMPLE
    .\setup.ps1
#>

Write-Host "🌾 Halal Gelatin Supply Chain Setup" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Green
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Deploy contract
Write-Host "`n🚀 Deploying smart contract..." -ForegroundColor Green
npm run deploy

# Extract contract address from output
$deploymentOutput = npm run deploy 2>&1
if ($deploymentOutput -match "0x[a-fA-F0-9]{40}") {
    $contractAddress = $matches[0]
    Write-Host "`n✅ Contract deployed at: $contractAddress" -ForegroundColor Green
}

# Start server
Write-Host "`n🎯 Starting web interface server..." -ForegroundColor Green
Write-Host "Opening http://localhost:3000..." -ForegroundColor Cyan

# Start the server and open browser
Start-Process "http://localhost:3000"
npm run server
