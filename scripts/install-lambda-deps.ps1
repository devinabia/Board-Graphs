# PowerShell script to install dependencies for all Lambda functions
# Usage: .\scripts\install-lambda-deps.ps1

Write-Host "Installing dependencies for Lambda functions..." -ForegroundColor Cyan

# Array of function directories
$functions = @(
    "queryApi",
    "electionMetricsApi",
    "topJurisdictionsApi",
    "jurisdictionMapApi",
    "turnoutSeriesApi",
    "testClickhouseApi",
    "helloApi"
)

# Base path to functions
$functionsPath = "amplify/backend/function"

# Install dependencies for each function
foreach ($func in $functions) {
    Write-Host ""
    Write-Host "📦 Installing dependencies for $func..." -ForegroundColor Yellow
    
    $funcPath = Join-Path $functionsPath $func
    
    if (Test-Path $funcPath) {
        Push-Location $funcPath
        
        if (Test-Path "package.json") {
            npm ci --production
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ $func dependencies installed" -ForegroundColor Green
            } else {
                Write-Host "❌ Failed to install dependencies for $func" -ForegroundColor Red
            }
        } else {
            Write-Host "⚠️  No package.json found in $func" -ForegroundColor Yellow
        }
        
        Pop-Location
    } else {
        Write-Host "❌ Directory not found: $funcPath" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✨ All Lambda function dependencies installed!" -ForegroundColor Green


