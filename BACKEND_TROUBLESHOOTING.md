# 🔍 Backend Troubleshooting - No Records Showing

## Issue: Deployed backend showing no records on Amplify

---

## 📊 Quick Diagnosis Steps

### Step 1: Verify Backend is Actually Deployed

**Question:** Have you deployed backend functions to Amplify yet?

If **NO** → You need to deploy the backend first! See options below.
If **YES** → Continue to Step 2.

### Step 2: Check What's Deployed

Open your Amplify app at: https://main.d2jwaen2uj4ggz.amplifyapp.com

**Open Browser Console (F12)** and look for:

```javascript
[API] Calling: /api/election-metrics
```

Then check the **Network tab**:
- What's the status code? (200, 404, 500?)
- What's the response body?
- Is there a CORS error?

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend Functions Not Deployed (Most Likely) ⚠️

**Symptoms:**
- 404 errors on `/api/*` calls
- "Cannot GET /api/election-metrics"
- Empty responses

**Solution:**
You need to deploy backend functions! Choose one:

#### Option A: Use AWS Lambda + API Gateway (Manual)
You mentioned wanting to use "Amplify deployed backend resources" but these need to be created first.

#### Option B: Deploy Backend to External Service (EASIEST) ⭐

Deploy your `server.js` + `api/` folder to:

**Heroku (Free tier):**
```bash
# Install Heroku CLI
# Then:
git init
heroku create amac-dashboard-api
heroku config:set CLICKHOUSE_URL="https://pod38uxp1w.us-west-2.aws.clickhouse.cloud:8443"
heroku config:set CLICKHOUSE_USER="default"
heroku config:set CLICKHOUSE_PASSWORD="your_password"
heroku config:set CLICKHOUSE_DATABASE="default"
heroku config:set FIXIE_URL="http://fixie:xYDJFj7q8VoSvD1@criterium.usefixie.com:80"
git push heroku main
```

Then update `index.html`:
```javascript
AMPLIFY_APP_URL: 'https://amac-dashboard-api.herokuapp.com',
```

**Render.com (Free tier):**
1. Go to render.com
2. Create new "Web Service"
3. Connect your Git repo
4. Set environment variables
5. Deploy

**Railway.app (Free trial):**
1. Go to railway.app
2. Create new project from GitHub
3. Add environment variables
4. Deploy

---

### Issue 2: Environment Variables Not Set 🔑

**Symptoms:**
- 500 errors
- "Connection failed" messages
- Backend logs show ClickHouse errors

**Solution:**

Backend needs these environment variables:
```bash
CLICKHOUSE_URL=https://pod38uxp1w.us-west-2.aws.clickhouse.cloud:8443
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=your_password_here
CLICKHOUSE_DATABASE=default
FIXIE_URL=http://fixie:xYDJFj7q8VoSvD1@criterium.usefixie.com:80
```

**Where to set them:**

**If using Lambda:**
- AWS Console → Lambda → Your function → Configuration → Environment variables

**If using Amplify Functions:**
```bash
amplify update function
# Choose: Configure environment variables
```

**If using External hosting:**
- Set in Heroku/Render/Railway dashboard

---

### Issue 3: CORS Not Configured ❌

**Symptoms:**
- Browser console shows CORS errors
- "Access-Control-Allow-Origin" errors
- Network tab shows "CORS error"

**Solution:**

Check your API handlers have CORS headers:

```javascript
res.writeHead(200, {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',  // ← Must have this!
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
});
```

---

### Issue 4: API Endpoint Mismatch 🔗

**Symptoms:**
- Frontend calls `/api/election-metrics`
- Backend expects different path
- 404 errors

**Solution:**

Verify your backend routes match:

Your backend (`server.js`) has:
```javascript
'/api/election-metrics' ✅
'/api/top-jurisdictions' ✅
'/api/jurisdiction-map' ✅
'/api/turnout-series' ✅
```

Your frontend calls same paths ✅

---

### Issue 5: ClickHouse Connection Failed 🗄️

**Symptoms:**
- APIs return empty data
- Timeout errors
- "Connection refused"

**Solution:**

1. **Test ClickHouse locally:**
   ```bash
   # Visit: http://localhost:5005/api/test-clickhouse
   # Should show: "ClickHouse connection successful"
   ```

2. **Check ClickHouse allowlist:**
   - Go to ClickHouse Cloud console
   - Settings → IP Access List
   - Add: `0.0.0.0/0` (for testing) or your backend's IP

3. **Verify proxy (Fixie):**
   - Is `FIXIE_URL` set correctly?
   - Is Fixie working?

---

## 🔬 Debugging Commands

### Test API Endpoint Directly

```bash
# Test if backend is responding
curl https://main.d2jwaen2uj4ggz.amplifyapp.com/api/hello

# Expected: {"message":"Hello from AMAC API!","timestamp":"..."}
# If 404: Backend not deployed
# If 500: Backend error (check environment variables)
# If CORS error: CORS not configured
```

### Test Specific Endpoints

```bash
# Test election metrics
curl -X POST https://main.d2jwaen2uj4ggz.amplifyapp.com/api/election-metrics \
  -H "Content-Type: application/json" \
  -d '{"election":"Nov 2024"}'

# Expected: {"data":[...], "row":{...}}
# If empty: ClickHouse connection issue or no data
```

### Check Browser Console Logs

Open https://main.d2jwaen2uj4ggz.amplifyapp.com and check console for:

```javascript
// This tells you where APIs are calling:
[API Configuration Loaded]
  📍 BASE_URL: (relative paths)
  ✅ APIs will call: https://main.d2jwaen2uj4ggz.amplifyapp.com/api/*

// Then look for actual calls:
[API] Calling: /api/election-metrics

// Check Network tab for the response
```

---

## ✅ Quick Fix: Test with Local Backend

While debugging, you can point Amplify frontend to your local backend:

### Temporary Fix (For Testing):

1. Make your local backend accessible (use ngrok):
   ```bash
   # Install ngrok: https://ngrok.com/
   ngrok http 5005
   ```

2. Update `index.html`:
   ```javascript
   AMPLIFY_APP_URL: 'https://abc123.ngrok.io', // Use ngrok URL
   ```

3. Commit and push - Amplify will now call your local backend!

---

## 🎯 Most Likely Issue

Based on your situation, the most likely issue is:

### ❌ Backend Functions Not Deployed Yet

**Evidence:**
- You have local server running (works locally)
- Amplify frontend is deployed (static files)
- But backend functions are NOT deployed to Amplify

**Solution: Deploy Backend to External Service**

This is the **FASTEST** solution:

1. **Deploy to Render.com (5 minutes):**
   - Go to https://render.com
   - Sign up / Login
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Name: `amac-dashboard-api`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Add environment variables (ClickHouse credentials)
   - Click "Create Web Service"
   - Get URL: `https://amac-dashboard-api.onrender.com`

2. **Configure Amplify Rewrite:**
   - Go to Amplify Console
   - Your App → Hosting → Rewrites and redirects
   - Add rule:
     ```
     Source: /api/<*>
     Target: https://amac-dashboard-api.onrender.com/api/<*>
     Type: Proxy (200)
     ```

3. **Done!** APIs will now work on Amplify

---

## 📋 Diagnostic Checklist

Run through this checklist:

- [ ] Backend is deployed somewhere (Lambda, Heroku, Render, etc.)
- [ ] Environment variables are set (ClickHouse credentials)
- [ ] CORS is enabled in API responses
- [ ] API endpoints match frontend calls
- [ ] ClickHouse IP allowlist includes backend IP
- [ ] Proxy (Fixie) is configured if needed
- [ ] Test API endpoint returns data: `curl https://your-backend/api/hello`
- [ ] Amplify rewrite rule is configured (if using external backend)

---

## 🆘 Next Steps

### If Backend IS Deployed:
1. Test API endpoint directly with curl
2. Check backend logs for errors
3. Verify environment variables
4. Test ClickHouse connection

### If Backend NOT Deployed:
1. Choose deployment option (Render.com recommended)
2. Deploy backend
3. Configure Amplify rewrite
4. Test

---

**Tell me:**
1. Have you deployed backend functions yet?
2. What do you see in browser console when visiting Amplify URL?
3. What's the status code when calling `/api/election-metrics`?

I'll help you fix it! 🔧

