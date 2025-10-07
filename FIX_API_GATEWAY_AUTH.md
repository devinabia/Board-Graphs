# 🔧 Fix API Gateway Authorization (Quick Guide)

## ⚠️ Current Issue: AWS_IAM Authorization Blocks Public Access

Your API Gateway is using **AWS_IAM** authorization, which blocks public access.

---

## ✅ Fix in 5 Minutes

### Step 1: Open API Gateway Console

1. Go to: https://console.aws.amazon.com/apigateway/
2. Region: Select **US East (Ohio) / us-east-2**
3. Find your API: **electionMetricsApi-API** (or similar)

### Step 2: Change Authorization to NONE

For **EACH** of your 7 APIs:

1. Click on the API name
2. Click **"Resources"** in left menu
3. Click on the resource path (e.g., `/electionMetricsApi`)
4. Click on the HTTP method (GET, POST, or ANY)
5. Click **"Method Request"**
6. Click the pencil icon next to **"Authorization"**
7. Select **"NONE"** from dropdown
8. Click the checkmark to save ✅

### Step 3: Deploy API

After changing authorization for all endpoints:

1. Click **"Actions"** dropdown (top of Resources page)
2. Select **"Deploy API"**
3. Deployment stage: **default**
4. Click **"Deploy"**

### Step 4: Repeat for All 7 APIs

You need to do this for each API:
- electionMetricsApi-API
- topJurisdictionsApi-API
- jurisdictionMapApi-API
- turnoutSeriesApi-API
- queryApi-API
- testClickhouseApi-API
- helloApi-API

---

## 🧪 Test After Fixing

```bash
# Test hello endpoint
curl https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/helloApi

# Should return: {"message":"Hello from AMAC API!"}
# NOT: {"message":"Missing Authentication Token"}
```

If it works, test all endpoints:

```bash
# Test election metrics
curl -X POST https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/electionMetricsApi \
  -H "Content-Type: application/json" \
  -d "{\"election\":\"Nov 2024\"}"
```

Should return data! ✅

---

## 🚀 After API Gateway is Fixed

### Step 1: Commit Frontend Changes

```bash
git add index.html
git commit -m "Configure for Lambda backend functions"
git push origin main
```

### Step 2: Wait for Amplify Deploy (2-3 min)

Amplify will auto-rebuild with the new config.

### Step 3: Test Your App

Visit: `https://main.d2jwaen2uj4ggz.amplifyapp.com`

Open console (F12) - should see:

```
[API Configuration Loaded]
  🌍 Environment: main.d2jwaen2uj4ggz.amplifyapp.com
  📍 BASE_URL: https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default
  🔗 AWS API Gateway: https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default
  ✅ Example API URL: https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/electionMetricsApi
[API] Calling: https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/electionMetricsApi
```

Dashboard should load with data! 🎉

---

## 📊 Summary

| Component | Status | Action |
|-----------|--------|--------|
| Lambda Functions | ✅ Deployed | None needed |
| API Gateway | ⚠️ Needs fix | Change auth to NONE |
| CORS | ⚠️ May need enabling | Enable if browser errors |
| Frontend Config | ✅ Updated | Commit and push |
| Environment Variables | ❓ Check | Verify in each Lambda |

---

## 🔍 Quick Checklist

Before testing on Amplify:

- [ ] Changed authorization to NONE on all 7 APIs
- [ ] Deployed each API Gateway after changes
- [ ] Tested with curl - returns data (not auth error)
- [ ] Enabled CORS if needed
- [ ] Committed index.html changes
- [ ] Pushed to Git
- [ ] Amplify rebuild completed

---

## 🆘 Still Getting Errors?

### Error: "Missing Authentication Token"

**Cause:** Authorization still set to AWS_IAM
**Fix:** Change to NONE and redeploy API

### Error: "Internal server error"

**Cause:** Lambda function error (probably environment variables)
**Fix:** 
1. Go to Lambda Console
2. Click function
3. Configuration → Environment variables
4. Add ClickHouse credentials
5. Test function

### Error: CORS error in browser

**Cause:** CORS not enabled
**Fix:**
1. API Gateway → Resources → Enable CORS
2. Deploy API

---

## ✅ Expected Result

After fixing:

```bash
curl https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/electionMetricsApi
```

Returns:
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

Same data you see locally! ✅

---

**Next:** Run the curl command and tell me what you get! 🚀

