# API Configuration Guide for AWS Amplify Deployment

## Overview

The `index.html` file has been updated with a centralized API configuration system that makes it easy to switch between local development and AWS Lambda/API Gateway endpoints.

## API Configuration Location

At the top of `index.html` (lines 17-44), you'll find the API configuration:

```javascript
const API_CONFIG = {
    // Local development (keep as empty string for relative paths)
    BASE_URL: '',
    
    // Production (uncomment and update with your API Gateway URL after deployment)
    // BASE_URL: 'https://your-api-gateway-id.execute-api.region.amazonaws.com/prod',
    
    // API Endpoints
    ENDPOINTS: {
        HELLO: '/api/hello',
        TEST_CLICKHOUSE: '/api/test-clickhouse',
        QUERY: '/api/query',
        ELECTION_METRICS: '/api/election-metrics',
        TOP_JURISDICTIONS: '/api/top-jurisdictions',
        JURISDICTION_MAP: '/api/jurisdiction-map',
        TURNOUT_SERIES: '/api/turnout-series'
    }
};
```

## How It Works

All API calls in the application now use the `getApiUrl()` helper function:

```javascript
// Old way (hardcoded)
fetch('/api/election-metrics', { ... })

// New way (configurable)
fetch(getApiUrl(API_CONFIG.ENDPOINTS.ELECTION_METRICS), { ... })
```

## Step-by-Step: Updating for AWS Amplify Deployment

### Step 1: Deploy Lambda Functions & API Gateway

First, complete your Lambda and API Gateway deployment:

1. Deploy all Lambda functions from `amplify/backend/function/`
2. Create API Gateway REST API
3. Map endpoints to Lambda functions
4. Deploy API Gateway to `prod` stage
5. Copy the Invoke URL (e.g., `https://abc123xyz.execute-api.us-west-2.amazonaws.com/prod`)

### Step 2: Update API Configuration

Open `public/index.html` and update line 26:

**Before:**
```javascript
BASE_URL: '',
```

**After:**
```javascript
BASE_URL: 'https://your-api-id.execute-api.us-west-2.amazonaws.com/prod',
```

**Example:**
```javascript
const API_CONFIG = {
    // Production API Gateway URL
    BASE_URL: 'https://abc123xyz.execute-api.us-west-2.amazonaws.com/prod',
    
    // API Endpoints (no changes needed)
    ENDPOINTS: {
        HELLO: '/api/hello',
        TEST_CLICKHOUSE: '/api/test-clickhouse',
        QUERY: '/api/query',
        ELECTION_METRICS: '/api/election-metrics',
        TOP_JURISDICTIONS: '/api/top-jurisdictions',
        JURISDICTION_MAP: '/api/jurisdiction-map',
        TURNOUT_SERIES: '/api/turnout-series'
    }
};
```

### Step 3: Commit and Push

```bash
git add public/index.html
git commit -m "Configure API Gateway URLs for production"
git push origin main
```

Amplify will automatically rebuild and deploy with the new configuration.

## Testing the Configuration

### Local Testing (Development Server)

When `BASE_URL` is empty:
```javascript
BASE_URL: '',
```

API calls go to relative paths: `/api/election-metrics`

Run local server:
```bash
npm run dev
```

### Production Testing (After Deployment)

When `BASE_URL` is set:
```javascript
BASE_URL: 'https://abc123xyz.execute-api.us-west-2.amazonaws.com/prod',
```

API calls go to: `https://abc123xyz.execute-api.us-west-2.amazonaws.com/prod/api/election-metrics`

## Verifying API Endpoints

After deployment, test each endpoint:

### 1. Health Check
```bash
curl https://your-api-id.execute-api.region.amazonaws.com/prod/api/hello
```

### 2. ClickHouse Connection Test
```bash
curl https://your-api-id.execute-api.region.amazonaws.com/prod/api/test-clickhouse
```

### 3. Election Metrics
```bash
curl -X POST https://your-api-id.execute-api.region.amazonaws.com/prod/api/election-metrics \
  -H "Content-Type: application/json" \
  -d '{"election":"Nov 2024"}'
```

### 4. Top Jurisdictions
```bash
curl -X POST https://your-api-id.execute-api.region.amazonaws.com/prod/api/top-jurisdictions \
  -H "Content-Type: application/json" \
  -d '{"election":"Nov 2024"}'
```

### 5. Jurisdiction Map
```bash
curl -X POST https://your-api-id.execute-api.region.amazonaws.com/prod/api/jurisdiction-map \
  -H "Content-Type: application/json" \
  -d '{"election":"Nov 2024","jurisdiction":"Counties"}'
```

### 6. Turnout Series
```bash
curl https://your-api-id.execute-api.region.amazonaws.com/prod/api/turnout-series
```

## API Gateway Endpoint Structure

Your API Gateway should have these endpoints:

| HTTP Method | Path | Lambda Function | Description |
|-------------|------|----------------|-------------|
| GET | `/api/hello` | helloApi | Health check |
| GET | `/api/test-clickhouse` | testClickhouseApi | Test ClickHouse connection |
| POST | `/api/query` | queryApi | Custom ClickHouse queries |
| POST | `/api/election-metrics` | electionMetricsApi | Election KPI metrics |
| POST | `/api/top-jurisdictions` | topJurisdictionsApi | Top jurisdictions data |
| POST | `/api/jurisdiction-map` | jurisdictionMapApi | Map data by jurisdiction |
| GET | `/api/turnout-series` | turnoutSeriesApi | Turnout time series |

## Troubleshooting

### Issue: API calls return 404

**Check:**
1. API Gateway URL is correct
2. Stage name is included in URL (`/prod`)
3. Endpoint paths match exactly (case-sensitive)
4. API Gateway has been deployed

### Issue: CORS errors in browser console

**Fix:**
1. Enable CORS in API Gateway for all methods
2. Verify Lambda functions return CORS headers:
   ```javascript
   headers: {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
       'Access-Control-Allow-Headers': 'Content-Type'
   }
   ```

### Issue: API calls work locally but not after Amplify deployment

**Check:**
1. `BASE_URL` is set correctly in deployed version
2. Amplify build completed successfully
3. Browser console for specific error messages
4. Network tab shows requests going to correct URLs

### Issue: Need different URLs for staging vs production

**Solution:** Use environment-based configuration:

```javascript
const API_CONFIG = {
    BASE_URL: window.location.hostname === 'localhost' 
        ? '' // Local development
        : window.location.hostname.includes('staging')
        ? 'https://staging-api.execute-api.region.amazonaws.com/prod' // Staging
        : 'https://production-api.execute-api.region.amazonaws.com/prod', // Production
    
    ENDPOINTS: { /* ... */ }
};
```

## Environment Variables (Alternative Approach)

For more advanced deployments, you can use Amplify environment variables:

### Step 1: Add Environment Variable in Amplify Console

1. Go to Amplify Console → Your App → Environment variables
2. Add: `REACT_APP_API_URL` = `https://your-api-gateway-url`

### Step 2: Update index.html to read from environment

This would require a build step to inject the variable. For a simple static site, the hardcoded approach above is recommended.

## Best Practices

1. **Always test locally first** with `BASE_URL: ''`
2. **Update configuration after deployment**, not before
3. **Keep a backup** of your API Gateway URL
4. **Document the URL** in your deployment notes
5. **Use HTTPS** - never use HTTP for API calls
6. **Test all endpoints** after updating configuration
7. **Monitor API Gateway logs** for errors

## Quick Reference

### Local Development
```javascript
BASE_URL: '',
```

### Production Deployment
```javascript
BASE_URL: 'https://abc123xyz.execute-api.us-west-2.amazonaws.com/prod',
```

### API Call Example
```javascript
// Automatically uses correct URL based on BASE_URL
const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ELECTION_METRICS), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ election: 'Nov 2024' })
});
```

---

## Summary

✅ API configuration is centralized at the top of `index.html`  
✅ Easy to switch between local and production  
✅ All API calls updated to use `getApiUrl()` helper  
✅ No changes needed to endpoint paths  
✅ Simply update `BASE_URL` after API Gateway deployment  

**Next Steps:**
1. Deploy Lambda functions and API Gateway
2. Get your API Gateway invoke URL
3. Update `BASE_URL` in `public/index.html`
4. Commit and push
5. Test in browser after Amplify deployment

---

**Last Updated:** October 2025

