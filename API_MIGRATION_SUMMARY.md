# API Migration Summary - index.html

## ✅ Changes Completed

### 1. Added Centralized API Configuration (Lines 17-44)

Added a configuration object at the top of the HTML file:

```javascript
const API_CONFIG = {
    BASE_URL: '',  // For local dev, set to API Gateway URL for production
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

function getApiUrl(endpoint) {
    return API_CONFIG.BASE_URL + endpoint;
}
```

### 2. Updated All API Calls

Replaced all hardcoded `/api/` paths with the `getApiUrl()` helper function:

#### Before:
```javascript
fetch('/api/election-metrics', { ... })
fetch('/api/top-jurisdictions', { ... })
fetch('/api/jurisdiction-map', { ... })
fetch('/api/turnout-series', { ... })
```

#### After:
```javascript
fetch(getApiUrl(API_CONFIG.ENDPOINTS.ELECTION_METRICS), { ... })
fetch(getApiUrl(API_CONFIG.ENDPOINTS.TOP_JURISDICTIONS), { ... })
fetch(getApiUrl(API_CONFIG.ENDPOINTS.JURISDICTION_MAP), { ... })
fetch(getApiUrl(API_CONFIG.ENDPOINTS.TURNOUT_SERIES), { ... })
```

### 3. API Calls Updated (Total: 12 instances)

| Function/Location | Line | API Call | Status |
|------------------|------|----------|--------|
| `updateView2()` | ~479 | jurisdiction-map | ✅ Updated |
| `updateView()` (1st) | ~532 | jurisdiction-map | ✅ Updated |
| `updateView()` (in head) | ~732 | jurisdiction-map | ✅ Updated |
| `updateView1()` | ~800 | jurisdiction-map | ✅ Updated |
| `updateView()` (2nd) | ~859 | jurisdiction-map | ✅ Updated |
| `refreshKPIs1()` | ~1635 | election-metrics | ✅ Updated |
| `refreshKPIs2()` | ~1672 | election-metrics | ✅ Updated |
| `refreshKPIs2()` | ~1690 | top-jurisdictions | ✅ Updated |
| `refreshKPIs()` | ~1748 | election-metrics | ✅ Updated |
| `refreshKPIs()` | ~1772 | top-jurisdictions | ✅ Updated |
| `loadTurnoutSeries()` | ~1876 | turnout-series | ✅ Updated |
| `loadJurisdictionMap2()` | ~1936 | jurisdiction-map | ✅ Updated |

### 4. Fixed Asset Paths

Updated logo path from `public/assets/` to `assets/` (Line 316):

#### Before:
```html
<img src="public/assets/amac-logo.png" ... />
```

#### After:
```html
<img src="assets/amac-logo.png" ... />
```

## 🎯 How to Use After Deployment

### Local Development (Current State)
```javascript
BASE_URL: '',  // Keep empty
```

All API calls go to relative paths: `/api/election-metrics`

### Production Deployment (After API Gateway Setup)
```javascript
BASE_URL: 'https://abc123xyz.execute-api.us-west-2.amazonaws.com/prod',
```

All API calls go to: `https://abc123xyz.execute-api.us-west-2.amazonaws.com/prod/api/election-metrics`

## 📊 Impact

### Benefits:
- ✅ **Single point of configuration** - Only update BASE_URL once
- ✅ **Easy environment switching** - Toggle between local/staging/production
- ✅ **Type safety** - Centralized endpoint definitions
- ✅ **No scattered changes** - All API calls updated consistently
- ✅ **Future-proof** - Easy to add new endpoints

### Breaking Changes:
- ⚠️ **None for local development** - Works as before with empty BASE_URL
- ⚠️ **Requires configuration** - Must set BASE_URL after API Gateway deployment

## 🔧 Deployment Checklist

- [x] API configuration added to index.html
- [x] All API fetch calls updated
- [x] Asset paths corrected
- [ ] Deploy Lambda functions to AWS
- [ ] Create API Gateway
- [ ] Get API Gateway invoke URL
- [ ] Update `BASE_URL` in production `index.html`
- [ ] Commit and push changes
- [ ] Test all API endpoints in production
- [ ] Verify CORS is working
- [ ] Monitor CloudWatch logs

## 📝 Testing Guide

### Test Locally (Before Deployment)
```bash
# Start local server
npm run dev

# Visit http://localhost:3000
# Check browser console - API calls should go to /api/...
```

### Test Production (After Deployment)
```bash
# Open Amplify URL in browser
# Check browser console - API calls should go to https://...amazonaws.com/prod/api/...

# Verify each endpoint works:
# 1. Dashboard loads
# 2. Election metrics appear
# 3. Map displays correctly
# 4. Jurisdiction data loads
# 5. Charts render properly
```

## 🆘 Troubleshooting

### Issue: API calls still going to /api/ after setting BASE_URL

**Solution:** Clear browser cache and hard reload (Ctrl+Shift+R / Cmd+Shift+R)

### Issue: CORS errors after deployment

**Solution:**
1. Enable CORS in API Gateway
2. Verify Lambda returns proper headers
3. Check API Gateway stage is deployed

### Issue: 404 errors on API calls

**Solution:**
1. Verify API Gateway URL is correct
2. Check endpoint paths match exactly
3. Ensure API Gateway stage name is included in URL

## 📚 Documentation

- **Detailed Guide:** [API_CONFIGURATION_GUIDE.md](./API_CONFIGURATION_GUIDE.md)
- **Quick Start:** [QUICK_START.md](./QUICK_START.md)
- **Full Deployment:** [AMPLIFY_DEPLOYMENT.md](./AMPLIFY_DEPLOYMENT.md)

## ✨ Summary

The `index.html` file has been successfully updated to support AWS Amplify deployment with Lambda functions. All API calls now use a centralized configuration system that can be easily updated with your API Gateway URL after deployment.

**Next Steps:**
1. ✅ Complete - API calls restructured
2. ⏳ Pending - Deploy Lambda functions
3. ⏳ Pending - Create API Gateway
4. ⏳ Pending - Update BASE_URL in index.html
5. ⏳ Pending - Deploy to Amplify

---

**Migration Date:** October 7, 2025  
**Status:** ✅ COMPLETE - Ready for API Gateway Configuration  
**Files Modified:** 
- `index.html` (12 API calls updated)
- `API_CONFIGURATION_GUIDE.md` (new)
- `QUICK_START.md` (updated)
- `API_MIGRATION_SUMMARY.md` (this file)

