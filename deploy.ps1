<#
.SYNOPSIS
    Deploy script for Cloudflare Workers Sites
.DESCRIPTION
    This script deploys the music player to Cloudflare Workers using the correct command for Workers Sites
#>

# Function to execute deployment
function Deploy-ToCloudflare {
    Write-Host "=== Deploying to Cloudflare Workers ===" -ForegroundColor Magenta
    
    # Ensure we're in the project directory
    Set-Location -Path $PSScriptRoot
    
    # Check if node_modules exists, if not install dependencies
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        bun install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to install dependencies" -ForegroundColor Red
            return $false
        }
    }
    
    # Deploy using the correct command for Workers Sites
    Write-Host "Deploying with 'npm run deploy'..." -ForegroundColor Green
    npm run deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deployment successful!" -ForegroundColor Green
        return $true
    } else {
        Write-Host "Deployment failed!" -ForegroundColor Red
        return $false
    }
}

# Main execution
try {
    Deploy-ToCloudflare
} catch {
    Write-Host "Deployment script failed with error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}