#!/bin/bash

# Script to install dependencies for all Lambda functions
# Usage: ./scripts/install-lambda-deps.sh

echo "Installing dependencies for Lambda functions..."

# Array of function directories
functions=(
  "queryApi"
  "electionMetricsApi"
  "topJurisdictionsApi"
  "jurisdictionMapApi"
  "turnoutSeriesApi"
  "testClickhouseApi"
  "helloApi"
)

# Base path to functions
FUNCTIONS_PATH="amplify/backend/function"

# Install dependencies for each function
for func in "${functions[@]}"; do
  echo ""
  echo "📦 Installing dependencies for $func..."
  
  if [ -d "$FUNCTIONS_PATH/$func" ]; then
    cd "$FUNCTIONS_PATH/$func" || exit
    
    if [ -f "package.json" ]; then
      npm ci --production
      echo "✅ $func dependencies installed"
    else
      echo "⚠️  No package.json found in $func"
    fi
    
    cd - > /dev/null || exit
  else
    echo "❌ Directory not found: $FUNCTIONS_PATH/$func"
  fi
done

echo ""
echo "✨ All Lambda function dependencies installed!"


