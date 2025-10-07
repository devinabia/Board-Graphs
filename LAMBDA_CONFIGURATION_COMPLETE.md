# ✅ Lambda Backend Configuration COMPLETE

## 🎉 Success! index.html Now Configured for Your Lambda Functions

---

## ✅ What Was Configured

Your `index.html` now calls your deployed AWS Lambda functions:

### Election Metrics API
- **URL:** `https://yzemtcmwi6.execute-api.us-east-2.amazonaws.com/api/electionMetricsApi`
- **Method:** POST
- **Used for:** Total voters, turnout %, new registrations, active districts

### Top Jurisdictions API
- **URL:** `https://79f4zm5zg1.execute-api.us-east-2.amazonaws.com/api/topJurisdictionsApi`
- **Method:** POST
- **Used for:** County, Congressional, Legislative, Cities data

### Other APIs
- **Jurisdiction Map, Turnout Series, Query, Test, Hello**
- Currently fallback to local (will update when you deploy them)

---

## 🧪 Test It Now

### Step 1: Test Lambda Functions Directly

```bash
# Test Election Metrics
curl -X POST https://yzemtcmwi6.execute-api.us-east-2.amazonaws.com/api/electionMetricsApi \
  -H "Content-Type: application/json" \
  -d "{\"election\":\"Nov 2024\"}"

# Test Top Jurisdictions
curl -X POST https://79f4zm5zg1.execute-api.us-east-2.amazonaws.com/api/topJurisdictionsApi \
  -H "Content-Type: application/json" \
  -d "{\"election\":\"Nov 2024\"}"
```

**Expected:** JSON data (same as your local backend shows)

**If you get errors:** Check `FIX_API_GATEWAY_AUTH.md` for authorization fixes

---

### Step 2: Test Locally (Verify It Still Works)

1. Your server is running at: http://localhost:5005
2. Open in browser
3. Open console (F12) - should see:

```
[API Configuration Loaded]
  🌍 Environment: localhost
  💻 Mode: LOCAL DEVELOPMENT
  📊 API Endpoints: 7 configured
  ✅ Election Metrics: http://localhost:5005/api/election-metrics
  ✅ Top Jurisdictions: http://localhost:5005/api/top-jurisdictions
[API] LOCAL → Calling: http://localhost:5005/api/election-metrics
```

Dashboard should load with data ✅

---

### Step 3: Deploy to Amplify

```bash
git add index.html public/
git commit -m "Configure Lambda backend URLs for election-metrics and top-jurisdictions"
git push origin main
```

Wait 2-3 minutes for Amplify to rebuild.

---

### Step 4: Test on Amplify

1. Visit: `https://main.d2jwaen2uj4ggz.amplifyapp.com`
2. Open console (F12) - should see:

```
[API Configuration Loaded]
  🌍 Environment: main.d2jwaen2uj4ggz.amplifyapp.com
  💻 Mode: PRODUCTION (AWS Lambda)
  📊 API Endpoints: 7 configured
  ✅ Election Metrics: https://yzemtcmwi6.execute-api.us-east-2.amazonaws.com/api/electionMetricsApi
  ✅ Top Jurisdictions: https://79f4zm5zg1.execute-api.us-east-2.amazonaws.com/api/topJurisdictionsApi
[API] PROD → Calling: https://yzemtcmwi6.execute-api.us-east-2.amazonaws.com/api/electionMetricsApi
```

3. Check that KPI cards show data:
   - Total Registered Voters: 61,817
   - Current Turnout: 52%
   - New Registrations: 3,779
   - Active Districts: 49

4. Check Top Jurisdictions section shows:
   - County: King County (37,760)
   - Congressional: 9 (16,562)
   - Legislative: 37 (4,211)
   - Cities: SEATTLE, KENT

---

## 📊 Configuration Summary

| API Endpoint | Local URL | Production URL | Status |
|--------------|-----------|----------------|--------|
| Election Metrics | localhost:5005 | yzemtcmwi6...amazonaws.com | ✅ Configured |
| Top Jurisdictions | localhost:5005 | 79f4zm5zg1...amazonaws.com | ✅ Configured |
| Jurisdiction Map | localhost:5005 | localhost:5005 (temp) | ⏳ Todo |
| Turnout Series | localhost:5005 | localhost:5005 (temp) | ⏳ Todo |
| Query | localhost:5005 | localhost:5005 (temp) | ⏳ Todo |
| Test ClickHouse | localhost:5005 | localhost:5005 (temp) | ⏳ Todo |
| Hello | localhost:5005 | localhost:5005 (temp) | ⏳ Todo |

---

## 🎯 What Works Now vs Later

### Works Now (After Deployment):
- ✅ Dashboard loads on Amplify
- ✅ KPI cards show data (from electionMetricsApi)
- ✅ Top Jurisdictions shows data (from topJurisdictionsApi)

### Needs Other Lambda Functions:
- ⏳ Map visualization (needs jurisdictionMapApi)
- ⏳ Turnout chart (needs turnoutSeriesApi)
- ⏳ Custom queries (needs queryApi)

---

## 🚀 As You Deploy More Lambda Functions

When you deploy the other Lambda functions, just update the URLs in `index.html`:

### Example: After deploying jurisdictionMapApi

```javascript
JURISDICTION_MAP: {
    local: 'http://localhost:5005/api/jurisdiction-map',
    production: 'https://abc123.execute-api.us-east-2.amazonaws.com/api/jurisdictionMapApi'  // ← Update this
},
```

Then commit and push! ✅

---

## ⚠️ Important Notes

### 1. Check Lambda Authorization

Both Lambda functions should have **Authorization: NONE** (not AWS_IAM) for public access.

**How to check:**
1. Go to API Gateway Console
2. Find each API
3. Click Resources → Method → Method Request
4. Verify Authorization = NONE

If it's AWS_IAM, change to NONE and redeploy API.

### 2. Verify Environment Variables

Each Lambda needs these:
```
CLICKHOUSE_URL=https://pod38uxp1w.us-west-2.aws.clickhouse.cloud:8443
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=[your password]
CLICKHOUSE_DATABASE=default
FIXIE_URL=http://fixie:xYDJFj7q8VoSvD1@criterium.usefixie.com:80
```

**How to check:**
1. Lambda Console → Your function
2. Configuration → Environment variables
3. Add if missing

### 3. CORS Must Be Enabled

Your Lambda code already has CORS headers ✅
But verify API Gateway has CORS enabled too:

1. API Gateway → Resources
2. Actions → Enable CORS
3. Deploy API

---

## 🧪 Testing Commands

```bash
# Test election metrics
curl -X POST https://yzemtcmwi6.execute-api.us-east-2.amazonaws.com/api/electionMetricsApi \
  -H "Content-Type: application/json" \
  -d "{\"election\":\"Nov 2024\"}"

# Test top jurisdictions  
curl -X POST https://79f4zm5zg1.execute-api.us-east-2.amazonaws.com/api/topJurisdictionsApi \
  -H "Content-Type: application/json" \
  -d "{\"election\":\"Nov 2024\"}"
```

**Expected Response (Election Metrics):**
```json
{
  "data": [{
    "total_voters": "61817",
    "turnout_pct": 52,
    "new_regs": "3779",
    "active_legis": "49",
    "total_legis": "49"
  }],
  "row": {
    "total_voters": "61817",
    "turnout_pct": 52,
    "new_regs": "3779",
    "active_legis": "49",
    "total_legis": "49"
  }
}
```

**Expected Response (Top Jurisdictions):**
```json
{
  "county": { "name": "King County", "count": "37760", "turnout": 49.5 },
  "congressional": { "name": "9", "count": "16562", "turnout": 40.2 },
  "legislative": { "name": "37", "count": "4211", "turnout": 38.7 },
  "cities": [
    { "name": "SEATTLE", "count": "12100", "turnout": 47.6 },
    { "name": "KENT", "count": "3523", "turnout": 38.5 }
  ]
}
```

---

## ✅ Deployment Checklist

- [x] Updated index.html with Lambda URLs
- [x] Copied to public/index.html
- [ ] Tested Lambda functions with curl
- [ ] Fixed authorization if needed
- [ ] Committed changes
- [ ] Pushed to Git
- [ ] Amplify rebuilt
- [ ] Tested on Amplify URL

---

## 🎯 Next Step

1. **Run curl tests** (see above) to verify Lambda works
2. **If successful:** Commit and push
3. **If errors:** Fix authorization (see FIX_API_GATEWAY_AUTH.md)

---

## ✨ Summary

✅ **index.html configured** for 2 Lambda functions  
✅ **Auto-detects** local vs production  
✅ **Flexible structure** for adding more endpoints  
⏳ **Test curl** commands to verify Lambda works  
⏳ **Then commit and push** to deploy  

**You're almost there!** 🚀

Run the curl tests and tell me what you get!

