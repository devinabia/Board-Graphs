# 🚀 Deploy Backend NOW - Simple Steps

## Your backend works locally with real data! Let's deploy it.

---

## ⚡ FASTEST: Deploy to Render.com (5 minutes)

### Step 1: Create Account

1. Go to: **https://render.com**
2. Click **"Get Started"**
3. Sign up with GitHub (or email)

### Step 2: Create Web Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** (if needed)
4. Find your repository or paste Git URL
5. Click **"Connect"**

### Step 3: Configure Service

Fill in these fields:

```
Name: amac-dashboard-api
Region: Oregon (US West)
Branch: main
Root Directory: (leave blank)
Runtime: Node
Build Command: npm install
Start Command: node server.js
```

### Step 4: Add Environment Variables

Click **"Advanced"** button, then **"Add Environment Variable"**

Add these (get values from your `.env` file):

```
CLICKHOUSE_URL = https://pod38uxp1w.us-west-2.aws.clickhouse.cloud:8443
CLICKHOUSE_USER = default
CLICKHOUSE_PASSWORD = [your password from .env]
CLICKHOUSE_DATABASE = default
FIXIE_URL = http://fixie:xYDJFj7q8VoSvD1@criterium.usefixie.com:80
PORT = 5005
```

### Step 5: Deploy

1. Scroll down
2. Select **"Free"** plan
3. Click **"Create Web Service"**
4. Wait 3-5 minutes (watch the logs)

### Step 6: Get Your URL

After deployment completes, you'll see:

```
Your service is live at https://amac-dashboard-api.onrender.com
```

### Step 7: Test It

Open terminal and run:

```bash
curl https://amac-dashboard-api.onrender.com/api/hello
```

Should return:
```json
{"message":"Hello from AMAC API!","timestamp":"..."}
```

### Step 8: Configure Amplify to Use It

1. Go to **AWS Amplify Console**: https://console.aws.amazon.com/amplify/
2. Click your app: **amac-dashboard**
3. In left menu: **Hosting** → **Rewrites and redirects**
4. Click **"Add rule"**
5. Fill in:

```
Source address: /api/<*>
Target address: https://amac-dashboard-api.onrender.com/api/<*>
Type: Rewrite (200)
Country code: (leave blank)
```

6. Click **"Save"**

### Step 9: Done! Test Your App

Visit: **https://main.d2jwaen2uj4ggz.amplifyapp.com**

Your dashboard should now load with real data! ✅

---

## 🧪 Verification Commands

Run these to verify everything works:

```bash
# Test backend directly
curl https://amac-dashboard-api.onrender.com/api/hello

# Test through Amplify (after rewrite rule)
curl https://main.d2jwaen2uj4ggz.amplifyapp.com/api/hello

# Test election metrics
curl -X POST https://main.d2jwaen2uj4ggz.amplifyapp.com/api/election-metrics \
  -H "Content-Type: application/json" \
  -d "{\"election\":\"Nov 2024\"}"
```

All should return data! ✅

---

## 📋 Troubleshooting

### Issue: Render says "Build failed"

**Fix:** Check build logs. Most common issues:
- Missing `package.json` (you have it ✅)
- Wrong build command (use `npm install`)

### Issue: Backend starts but crashes

**Fix:** Missing environment variables
- Go to Render Dashboard → Your Service → Environment
- Verify all 5 variables are set
- Click "Manual Deploy" to restart

### Issue: Amplify still shows 404

**Fix:** Rewrite rule not applied yet
- Go to Amplify Console
- Check "Rewrites and redirects" page
- Rule should show with green checkmark
- If not, re-add it

### Issue: CORS errors in browser

**Fix:** Your code already has CORS! ✅
- Check that Render service is running
- Verify rewrite rule type is "Rewrite (200)" not "Redirect"

---

## 💰 Cost

**Render.com Free Tier:**
- ✅ Free forever
- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Sleeps after 15 min of inactivity (wakes on first request)
- ⚠️ First request after sleep takes 30-60 seconds

**To keep it awake (optional):**
Use a ping service like UptimeRobot (free) to ping every 5 minutes.

---

## 🎯 What Happens Now

1. **Frontend (Amplify):**
   - Serves static files (HTML, CSS, JS)
   - Fast CDN delivery
   - `https://main.d2jwaen2uj4ggz.amplifyapp.com`

2. **Backend (Render):**
   - Runs your `server.js` + API handlers
   - Connects to ClickHouse
   - `https://amac-dashboard-api.onrender.com`

3. **Connection:**
   - Amplify rewrite rule proxies `/api/*` to Render
   - Frontend calls `/api/election-metrics`
   - Amplify forwards to Render backend
   - Backend returns data
   - Frontend displays it ✅

---

## ✨ Summary

✅ **Deploy to Render:** 5 minutes
✅ **Configure Amplify rewrite:** 2 minutes
✅ **Test and verify:** 1 minute
🎉 **Total time:** 8 minutes

Your backend will be live with the same data you see locally! 🚀

---

## 🆘 Need Help?

**If stuck on any step, tell me:**
1. Which step number?
2. What error message?
3. Screenshot of the issue?

I'll help you fix it immediately! 💪

