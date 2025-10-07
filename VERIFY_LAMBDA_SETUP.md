# ✅ Verify Your Lambda Functions Setup

## 🎯 You Have Lambda Functions Deployed!

Based on your trigger details:
- **API Gateway:** `https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default`
- **Region:** us-east-2
- **Stage:** default
- **Example Endpoint:** `/electionMetricsApi`

---

## 📋 Verify All 7 Functions Are Deployed

You should have created these Lambda functions:

| Lambda Function | API Endpoint | Expected URL |
|----------------|--------------|--------------|
| electionMetricsApi | `/electionMetricsApi` | `https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/electionMetricsApi` |
| topJurisdictionsApi | `/topJurisdictionsApi` | `https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/topJurisdictionsApi` |
| jurisdictionMapApi | `/jurisdictionMapApi` | `https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/jurisdictionMapApi` |
| turnoutSeriesApi | `/turnoutSeriesApi` | `https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/turnoutSeriesApi` |
| queryApi | `/queryApi` | `https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/queryApi` |
| testClickhouseApi | `/testClickhouseApi` | `https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/testClickhouseApi` |
| helloApi | `/helloApi` | `https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/helloApi` |

---

## 🧪 Test Each Endpoint

Run these curl commands to verify each function works:

### 1. Test Hello (GET)
```bash
curl https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/helloApi
```

**Expected:** `{"message":"Hello from AMAC API!","timestamp":"..."}`

### 2. Test ClickHouse Connection (GET)
```bash
curl https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/testClickhouseApi
```

**Expected:** `{"success":true,"message":"ClickHouse connection successful",...}`

### 3. Test Election Metrics (POST)
```bash
curl -X POST https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/electionMetricsApi \
  -H "Content-Type: application/json" \
  -d "{\"election\":\"Nov 2024\"}"
```

**Expected:** `{"data":[...],"row":{"total_voters":"61817","turnout_pct":52,...}}`

### 4. Test Top Jurisdictions (POST)
```bash
curl -X POST https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/topJurisdictionsApi \
  -H "Content-Type: application/json" \
  -d "{\"election\":\"Nov 2024\"}"
```

**Expected:** `{"county":{...},"congressional":{...},"legislative":{...},"cities":[...]}`

### 5. Test Jurisdiction Map (POST)
```bash
curl -X POST https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/jurisdictionMapApi \
  -H "Content-Type: application/json" \
  -d "{\"election\":\"Nov 2024\",\"jurisdiction\":\"State Level\"}"
```

**Expected:** `{"data":[{"jurisdiction_name":"37","voter_count":"4211",...}]}`

### 6. Test Turnout Series (GET)
```bash
curl https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/turnoutSeriesApi
```

**Expected:** `{"labels":["Aug 2024","Nov 2024"],"data":[18,52]}`

---

## ⚠️ Common Issues

### Issue 1: Authorization Error (AWS_IAM)

Your API uses **AWS_IAM** authorization. This means:

**Problem:** Public access is blocked
**Symptom:** You get: `{"message":"Missing Authentication Token"}`

**Solution:**

You need to change authorization to **NONE** for public access:

1. Go to **API Gateway Console**
2. Select your API: `electionMetricsApi-API`
3. Click **Resources**
4. For each method:
   - Click the method (GET/POST)
   - Click **"Method Request"**
   - Change **Authorization** from `AWS_IAM` to `NONE`
   - Click checkmark to save
5. Click **"Actions"** → **"Deploy API"**
6. Select stage: `default`
7. Click **"Deploy"**

Repeat for ALL 7 Lambda functions!

---

### Issue 2: CORS Not Enabled

**Symptom:** Browser shows CORS errors

**Solution:**

For each API resource:
1. API Gateway Console → Your API → Resources
2. Click on `/electionMetricsApi`
3. Click **"Actions"** → **"Enable CORS"**
4. Accept defaults
5. Click **"Enable CORS and replace existing CORS headers"**
6. Deploy API again

---

### Issue 3: Wrong HTTP Method

**Symptom:** 403 Forbidden or Method Not Allowed

**Solution:**

Verify each Lambda has the correct method:
- `helloApi` - GET
- `testClickhouseApi` - GET  
- `electionMetricsApi` - POST
- `topJurisdictionsApi` - POST
- `jurisdictionMapApi` - POST
- `queryApi` - POST
- `turnoutSeriesApi` - GET

---

## ✅ After Fixing Authorization

Test again with curl. You should get data!

Then your frontend will work automatically because `index.html` is now configured! ✅

---

## 🎯 Final Steps

### 1. Fix API Gateway Authorization

Change all from `AWS_IAM` to `NONE` (see Issue 1 above)

### 2. Enable CORS

Enable for all resources (see Issue 2 above)

### 3. Test with curl

Run the curl commands above - they should return data

### 4. Commit and Push Frontend

```bash
git add index.html
git commit -m "Configure API Gateway endpoints for Lambda functions"
git push origin main
```

### 5. Test on Amplify

Visit: `https://main.d2jwaen2uj4ggz.amplifyapp.com`

Dashboard should load with data! ✅

---

## 🔍 Debug Checklist

- [ ] All 7 Lambda functions deployed
- [ ] All have API Gateway triggers
- [ ] Authorization changed to NONE (not AWS_IAM)
- [ ] CORS enabled on all endpoints
- [ ] API Gateway deployed to stage after changes
- [ ] Environment variables set in all Lambda functions
- [ ] Tested each endpoint with curl
- [ ] index.html updated with correct API Gateway URL
- [ ] Frontend pushed to Git
- [ ] Tested on Amplify URL

---

## 📊 Current Status

✅ **Lambda Functions:** Deployed  
⚠️ **Authorization:** Needs fixing (AWS_IAM → NONE)  
⚠️ **CORS:** Needs enabling  
✅ **Frontend Config:** Updated  
⏳ **Testing:** Pending

---

## 🆘 Quick Test

Run this command right now:

```bash
curl https://0qi3oyu8a2.execute-api.us-east-2.amazonaws.com/default/electionMetricsApi
```

**If you get:** `{"message":"Missing Authentication Token"}`
→ You need to change authorization to NONE (see Issue 1)

**If you get:** `{"message":"Internal server error"}`
→ Lambda has errors - check CloudWatch logs

**If you get:** Data with `{"data":[...], "row":{...}}`
→ It works! Just commit and push frontend

Tell me what you get and I'll help you fix it! 🚀

