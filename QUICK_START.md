# Quick Start Guide - AWS Amplify Deployment

This is a condensed guide for deploying the AMAC Dashboard to AWS Amplify. For detailed instructions, see [AMPLIFY_DEPLOYMENT.md](./AMPLIFY_DEPLOYMENT.md).

## Prerequisites

- AWS Account
- Git repository (GitHub, GitLab, etc.)
- ClickHouse credentials

## Option 1: Deploy via Amplify Console (Easiest)

### Step 1: Push to Git Repository

```bash
git add .
git commit -m "Prepare for Amplify deployment"
git push origin main
```

### Step 2: Create Amplify App

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Connect your Git repository
4. Select repository and branch
5. Amplify auto-detects `amplify.yml`
6. Click **"Save and deploy"**

### Step 3: Configure Environment Variables

In Amplify Console → Your App → **Environment variables**, add:

```
CLICKHOUSE_URL=https://pod38uxp1w.us-west-2.aws.clickhouse.cloud:8443
CLICKHOUSE_USER=your_username
CLICKHOUSE_PASSWORD=your_password
CLICKHOUSE_DATABASE=default
```

### Step 4: Set Up Lambda Functions

#### Via AWS Console:

1. Go to **AWS Lambda Console**
2. For each function in `amplify/backend/function/`:
   - Create new Lambda function
   - Runtime: **Node.js 18.x**
   - Upload code from the function folder
   - Add environment variables (ClickHouse credentials)
   - Set timeout to **30 seconds**
   - Set memory to **512 MB**

#### Required Functions:
- `queryApi`
- `electionMetricsApi`
- `topJurisdictionsApi`
- `jurisdictionMapApi`
- `turnoutSeriesApi`
- `testClickhouseApi`
- `helloApi`

### Step 5: Create API Gateway

1. Go to **API Gateway Console**
2. Create **REST API**
3. Create resources for each endpoint:

| Path | Method | Lambda Function |
|------|--------|----------------|
| `/api/query` | POST | queryApi |
| `/api/election-metrics` | POST | electionMetricsApi |
| `/api/top-jurisdictions` | POST | topJurisdictionsApi |
| `/api/jurisdiction-map` | POST | jurisdictionMapApi |
| `/api/turnout-series` | GET | turnoutSeriesApi |
| `/api/test-clickhouse` | GET | testClickhouseApi |
| `/api/hello` | GET | helloApi |

4. **Enable CORS** on all methods
5. **Deploy API** → Create new stage: `prod`
6. Note the **Invoke URL** (e.g., `https://abc123.execute-api.us-west-2.amazonaws.com/prod`)

### Step 6: Update API URLs in Code

Replace API calls in `public/index.html` and other HTML files:

**Before:**
```javascript
fetch('/api/election-metrics', { ... })
```

**After:**
```javascript
const API_BASE = 'https://your-api-id.execute-api.us-west-2.amazonaws.com/prod';
fetch(`${API_BASE}/api/election-metrics`, { ... })
```

Or create `public/config.js`:

```javascript
window.API_CONFIG = {
  BASE_URL: 'https://your-api-id.execute-api.us-west-2.amazonaws.com/prod'
};
```

Then in HTML:
```html
<script src="/config.js"></script>
<script>
  const API_BASE = window.API_CONFIG.BASE_URL;
  // Use API_BASE in all fetch calls
</script>
```

### Step 7: Commit and Push

```bash
git add .
git commit -m "Update API endpoints"
git push origin main
```

Amplify will automatically rebuild and redeploy.

---

## Option 2: Deploy via Amplify CLI

### Step 1: Install and Configure

```bash
npm install -g @aws-amplify/cli
amplify configure
```

### Step 2: Initialize Project

```bash
amplify init
```

Settings:
- Project name: `amac-dashboard`
- Environment: `prod`
- Source: `public`
- Distribution: `public`
- Build: `npm run build`

### Step 3: Add Hosting

```bash
amplify add hosting
```

Choose: **Amplify Console** → **Manual deployment**

### Step 4: Deploy

```bash
amplify publish
```

Then follow **Steps 4-6** from Option 1 above for Lambda and API Gateway setup.

---

## Testing Your Deployment

1. Visit your Amplify URL: `https://main.xxxxx.amplifyapp.com`
2. Open browser console (F12)
3. Check for errors
4. Test API endpoints:
   - Navigate through different election periods
   - Change jurisdiction filters
   - Verify map loads correctly

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Enable CORS in API Gateway, check Lambda headers |
| API timeouts | Increase Lambda timeout to 30s, memory to 512MB |
| Assets not loading | Check paths use `/assets/...` (not `/public/assets/`) |
| ClickHouse errors | Verify environment variables in Lambda |

## Next Steps

- [ ] Set up custom domain
- [ ] Add authentication (AWS Cognito)
- [ ] Set up monitoring and alerts
- [ ] Implement caching for API responses
- [ ] Add backup/disaster recovery

---

## Support

- **Detailed Guide**: [AMPLIFY_DEPLOYMENT.md](./AMPLIFY_DEPLOYMENT.md)
- **AWS Amplify Docs**: https://docs.amplify.aws/
- **AWS Support**: AWS Console → Support Center

---

**Deployment Time**: ~30-60 minutes (first time)

**Monthly Cost Estimate**: 
- Amplify Hosting: ~$0 (within free tier for small apps)
- Lambda: ~$0-5 (within free tier for low traffic)
- API Gateway: ~$0-3 (within free tier)
- **Total**: ~$0-10/month (excluding ClickHouse costs)


