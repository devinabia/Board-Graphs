# ✅ Deployment Checklist - Amplify Backend

## 🎯 What's Been Done

### ✅ Frontend Configuration (index.html)
- **Configured for Amplify backend:** `https://main.d2jwaen2uj4ggz.amplifyapp.com`
- **Auto-detects environment:** 
  - Local: `http://localhost:5005`
  - Amplify: relative paths `/api/*`
- **Enhanced logging:** Better console output for debugging
- **All API calls updated:** Using `getApiUrl()` helper

### ✅ Build Configuration (amplify.yml)
- **Backend build phase added**
- **Frontend build configured**
- **Static files copied to public/**

### ✅ Documentation Created
- `AMPLIFY_BACKEND_DEPLOYMENT.md` - Full deployment guide
- `AMPLIFY_BACKEND_SETUP.md` - Setup instructions
- `AMPLIFY_BACKEND_QUICK_START.md` - Quick reference
- `DEPLOYMENT_CHECKLIST.md` - This file

---

## 🚀 What You Need To Do Now

### Step 1: Test Locally (RIGHT NOW) ✅

Your server is running! Open your browser:

1. **Visit:** http://localhost:5005
2. **Open Console (F12)** - You should see:
   ```
   [API Configuration Loaded]
     🌍 Environment: localhost
     📍 BASE_URL: http://localhost:5005
     🚀 Amplify App: https://main.d2jwaen2uj4ggz.amplifyapp.com
     📊 API Endpoints: 7 configured
     ✅ APIs will call: http://localhost:5005/api/*
   [API] Calling: http://localhost:5005/api/election-metrics
   [API] Calling: http://localhost:5005/api/top-jurisdictions
   ```

3. **Verify:**
   - ✅ Dashboard loads
   - ✅ API calls work
   - ✅ Data displays correctly

---

### Step 2: Choose Your Backend Deployment Method

#### Option A: Amplify Functions (Recommended) ⭐

**Pros:** Serverless, auto-scaling, integrated with Amplify
**Time:** 30-45 minutes
**Difficulty:** Medium

**Steps:**
1. Install Amplify CLI: `npm install -g @aws-amplify/cli`
2. Initialize: `amplify init`
3. Add API: `amplify add api`
4. Copy API handlers to Lambda function
5. Deploy: `amplify push`

**See:** `AMPLIFY_BACKEND_DEPLOYMENT.md` → Option 1

---

#### Option B: External Backend + Rewrites (Simplest) ⭐⭐⭐

**Pros:** Keep your server.js as-is, easiest to understand
**Time:** 15-20 minutes
**Difficulty:** Easy

**Steps:**
1. Deploy your backend to Heroku/Render/Railway
   - Just deploy the whole project (server.js + api/)
   - Get the URL (e.g., `https://your-app.herokuapp.com`)

2. Configure Amplify Rewrite:
   - Go to Amplify Console → Hosting → Rewrites and redirects
   - Add rule:
     ```
     Source: /api/<*>
     Target: https://your-app.herokuapp.com/api/<*>
     Type: Proxy
     ```

3. Done! APIs will be proxied through Amplify

**See:** `AMPLIFY_BACKEND_DEPLOYMENT.md` → Option 2

---

#### Option C: SSR with Amplify Compute

**Pros:** Deploy everything together
**Time:** 20-30 minutes
**Difficulty:** Easy

**Steps:**
1. Enable Amplify Compute in Console
2. Update amplify.yml (already done!)
3. Push to Git

**See:** `AMPLIFY_BACKEND_DEPLOYMENT.md` → Option 3

---

### Step 3: Commit and Push

```bash
git add .
git commit -m "Configure index.html for Amplify backend deployment"
git push origin main
```

Amplify will auto-deploy the frontend (static files).

---

### Step 4: Deploy Backend (Based on Your Choice)

Pick one of the options above and follow the guide in `AMPLIFY_BACKEND_DEPLOYMENT.md`.

---

### Step 5: Test Production

After backend is deployed:

1. **Visit:** https://main.d2jwaen2uj4ggz.amplifyapp.com
2. **Open Console (F12)** - Should see:
   ```
   [API Configuration Loaded]
     🌍 Environment: main.d2jwaen2uj4ggz.amplifyapp.com
     📍 BASE_URL: (relative paths)
     🚀 Amplify App: https://main.d2jwaen2uj4ggz.amplifyapp.com
     📊 API Endpoints: 7 configured
     ✅ APIs will call: https://main.d2jwaen2uj4ggz.amplifyapp.com/api/*
   [API] Calling: /api/election-metrics
   ```

3. **Test API directly:**
   ```bash
   curl https://main.d2jwaen2uj4ggz.amplifyapp.com/api/hello
   ```

---

## 📊 Current Status

| Component | Status | Next Action |
|-----------|--------|-------------|
| Frontend Code | ✅ Ready | Push to Git |
| API Configuration | ✅ Done | No action needed |
| Build Config | ✅ Updated | No action needed |
| Local Testing | 🧪 Available | Test at localhost:5005 |
| Amplify Deployment | ⏳ Pending | Choose backend option |
| Backend Deployment | ⏳ Pending | Deploy backend functions |

---

## 🎯 Quick Decision Tree

**Do you want the easiest setup?**
→ YES: Use **Option B** (External Backend + Rewrites)
  - Deploy server.js to Heroku
  - Configure rewrite in Amplify Console
  - Done!

**Do you want fully serverless?**
→ YES: Use **Option A** (Amplify Functions)
  - Install Amplify CLI
  - Convert API handlers to Lambda
  - Deploy with `amplify push`

**Do you want everything in one place?**
→ YES: Use **Option C** (SSR Compute)
  - Enable compute in Amplify Console
  - Push to Git
  - Done!

---

## 🔍 What Each File Does

| File | Purpose |
|------|---------|
| `index.html` | Frontend - auto-detects environment for API calls |
| `amplify.yml` | Build configuration for Amplify |
| `server.js` | Local dev server (not deployed to Amplify) |
| `api/*.js` | API handlers (will be Lambda functions) |
| `public/` | Static files deployed to Amplify CDN |

---

## 🆘 Troubleshooting

### Local API not working?
```bash
# Check if server is running
# Visit: http://localhost:5005/api/hello
# Should return: {"message": "Hello from AMAC API!"}
```

### Console shows wrong BASE_URL?
- Check line 27-38 in index.html
- Verify `window.location.hostname`
- Clear browser cache (Ctrl+Shift+R)

### Production API not working after deployment?
- Check Amplify Console logs
- Verify backend functions are deployed
- Test API endpoint directly with curl
- Check CORS configuration

---

## 📚 Documentation Index

1. **DEPLOYMENT_CHECKLIST.md** (this file) - What to do now
2. **AMPLIFY_BACKEND_DEPLOYMENT.md** - Detailed deployment guide
3. **AMPLIFY_BACKEND_SETUP.md** - Setup instructions
4. **AMPLIFY_BACKEND_QUICK_START.md** - Quick reference
5. **QUICK_START.md** - Original deployment guide
6. **AMPLIFY_DEPLOYMENT.md** - Comprehensive guide

---

## ✨ Summary

### ✅ Done:
- Frontend configured for Amplify backend
- Auto-detection of local vs production
- Enhanced debugging logs
- Build configuration updated
- Comprehensive documentation created

### ⏳ Next:
1. Test locally at http://localhost:5005
2. Choose backend deployment method
3. Deploy backend
4. Push frontend to Git
5. Test production

---

**Ready to deploy? Pick an option and follow the guide!** 🚀

**Need help deciding? I recommend Option B (External Backend + Rewrites) - it's the simplest!**

