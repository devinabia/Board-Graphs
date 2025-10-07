# AWS Amplify Migration Complete ✅

Your AMAC Dashboard has been successfully restructured for AWS Amplify deployment!

## 📋 What Was Done

### ✅ 1. Project Restructure
- Created `public/` directory for static files
- Moved all HTML, CSS, and assets to `public/`
- Updated asset paths from `/public/assets/` to `/assets/`

### ✅ 2. Serverless API Migration
- Converted 7 Node.js API handlers to AWS Lambda functions
- Created individual function packages in `amplify/backend/function/`:
  - `queryApi` - Custom ClickHouse queries
  - `electionMetricsApi` - Election KPI metrics
  - `topJurisdictionsApi` - Top jurisdictions data
  - `jurisdictionMapApi` - Map data by jurisdiction
  - `turnoutSeriesApi` - Turnout time series
  - `testClickhouseApi` - Connection testing
  - `helloApi` - Health check endpoint

### ✅ 3. Configuration Files
- **`amplify.yml`** - Amplify build configuration
- **`package.json`** - Updated with Amplify-specific scripts
- **`.env.template`** - Environment variables template
- **`.gitignore`** - Updated to exclude sensitive files

### ✅ 4. Documentation
- **`QUICK_START.md`** - 30-minute deployment guide
- **`AMPLIFY_DEPLOYMENT.md`** - Comprehensive deployment instructions
- **`README_AMPLIFY.md`** - Project overview and reference
- **`scripts/`** - Helper scripts for Lambda dependencies

### ✅ 5. Lambda Functions
Each function now:
- Uses AWS Lambda event/response format
- Includes proper CORS headers
- Has its own `package.json` with dependencies
- Supports environment variables

## 🚀 Next Steps to Deploy

### Quick Deploy (30-60 minutes)

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Migrate to AWS Amplify structure"
   git push origin main
   ```

2. **Create Amplify App**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your Git repository
   - Amplify will auto-detect `amplify.yml`
   - Click "Save and deploy"

3. **Deploy Lambda Functions**
   - Go to [AWS Lambda Console](https://console.aws.amazon.com/lambda/)
   - Create 7 Lambda functions (one for each API endpoint)
   - Upload code from `amplify/backend/function/<functionName>/`
   - Set environment variables (ClickHouse credentials)
   - Configure: Timeout=30s, Memory=512MB

4. **Create API Gateway**
   - Go to [API Gateway Console](https://console.aws.amazon.com/apigateway/)
   - Create REST API
   - Add resources and methods for each endpoint
   - Enable CORS on all methods
   - Deploy to `prod` stage

5. **Update API URLs**
   - Get API Gateway invoke URL
   - Update `public/index.html` with new API endpoint URLs
   - Commit and push changes

6. **Test Your App**
   - Visit your Amplify URL
   - Test all dashboard functionality
   - Check browser console for errors

## 📁 New File Structure

```
Amplify/
├── amplify/
│   └── backend/
│       └── function/              # Lambda functions (7 total)
│           ├── queryApi/
│           │   ├── index.js
│           │   └── package.json
│           ├── electionMetricsApi/
│           ├── topJurisdictionsApi/
│           ├── jurisdictionMapApi/
│           ├── turnoutSeriesApi/
│           ├── testClickhouseApi/
│           └── helloApi/
│
├── public/                        # Static files for hosting
│   ├── assets/
│   │   ├── *.geojson
│   │   ├── *.png
│   │   └── *.jpg
│   ├── index.html
│   ├── dashboard_*.html
│   ├── login.html
│   ├── test.html
│   └── *.css
│
├── scripts/
│   ├── install-lambda-deps.sh    # Bash script
│   └── install-lambda-deps.ps1   # PowerShell script
│
├── Documentation/
│   ├── QUICK_START.md
│   ├── AMPLIFY_DEPLOYMENT.md
│   ├── README_AMPLIFY.md
│   └── MIGRATION_COMPLETE.md (this file)
│
├── amplify.yml                   # Amplify build config
├── package.json                  # Updated dependencies
├── .env.template                 # Environment template
└── .gitignore                    # Updated ignore rules
```

## 🔧 Required Environment Variables

Set these in AWS Lambda (all functions) and Amplify Console:

```bash
CLICKHOUSE_URL=https://pod38uxp1w.us-west-2.aws.clickhouse.cloud:8443
CLICKHOUSE_USER=your_username
CLICKHOUSE_PASSWORD=your_password
CLICKHOUSE_DATABASE=default
FIXIE_URL=http://your-proxy-url  # Optional
```

## 📖 Documentation Quick Links

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | Fast deployment in 30 minutes |
| [AMPLIFY_DEPLOYMENT.md](./AMPLIFY_DEPLOYMENT.md) | Detailed step-by-step guide |
| [README_AMPLIFY.md](./README_AMPLIFY.md) | Project overview & reference |
| [.env.template](./.env.template) | Environment variables template |

## 🎯 API Gateway Endpoints Mapping

After creating API Gateway, map these endpoints:

| API Gateway Path | Method | Lambda Function | Description |
|-----------------|--------|----------------|-------------|
| `/api/query` | POST | queryApi | Custom queries |
| `/api/election-metrics` | POST | electionMetricsApi | KPI metrics |
| `/api/top-jurisdictions` | POST | topJurisdictionsApi | Top jurisdictions |
| `/api/jurisdiction-map` | POST | jurisdictionMapApi | Map data |
| `/api/turnout-series` | GET | turnoutSeriesApi | Time series |
| `/api/test-clickhouse` | GET | testClickhouseApi | Connection test |
| `/api/hello` | GET/POST | helloApi | Health check |

## ⚠️ Important Notes

### Before Deployment:
1. ✅ Create `.env` file from `.env.template` with your credentials
2. ✅ Test locally with `npm run dev` to ensure everything works
3. ✅ Never commit `.env` file to Git (already in `.gitignore`)

### After Deployment:
1. ⚠️ Update all fetch URLs in HTML files with your API Gateway URL
2. ⚠️ Test each API endpoint individually
3. ⚠️ Set up CloudWatch alarms for Lambda errors
4. ⚠️ Enable API Gateway request/response logging

## 💰 Estimated Monthly Costs

Based on moderate traffic (10,000 requests/month):

| Service | Cost |
|---------|------|
| AWS Amplify Hosting | $0 (free tier) |
| AWS Lambda (7 functions) | $0-2 |
| API Gateway | $0-1 |
| CloudWatch Logs | $0-1 |
| **Total AWS** | **$0-4/month** |

*ClickHouse costs are separate and depend on your usage*

## 🐛 Troubleshooting

### Common Issues & Solutions:

1. **CORS Errors**
   - Enable CORS in API Gateway
   - Verify Lambda functions return CORS headers
   - Check browser console for specific errors

2. **502 Bad Gateway**
   - Check Lambda execution logs in CloudWatch
   - Verify Lambda has correct IAM permissions
   - Ensure Lambda timeout is at least 30s

3. **Assets Not Loading**
   - Verify paths use `/assets/...` (not `/public/assets/...`)
   - Check Amplify build logs
   - Ensure assets are in `public/assets/` directory

4. **ClickHouse Connection Fails**
   - Verify environment variables are set in Lambda
   - Test with `/api/test-clickhouse` endpoint
   - Check ClickHouse credentials and IP whitelist

## ✨ What's Different from Original?

| Before | After |
|--------|-------|
| Node.js Express server | Serverless AWS Lambda |
| Single server process | 7 independent Lambda functions |
| Local file serving | AWS Amplify CDN |
| `/public/assets/` paths | `/assets/` paths |
| `.env` file loaded at runtime | AWS environment variables |
| Single deployment | Frontend + Backend separately |

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Amplify URL loads the dashboard
- ✅ All 7 API endpoints respond correctly
- ✅ Maps display properly with GeoJSON data
- ✅ Election data loads from ClickHouse
- ✅ No console errors in browser
- ✅ Switching elections/jurisdictions works
- ✅ All KPI metrics display correctly

## 📞 Support & Resources

- **Quick Help**: See [QUICK_START.md](./QUICK_START.md)
- **Detailed Guide**: See [AMPLIFY_DEPLOYMENT.md](./AMPLIFY_DEPLOYMENT.md)
- **AWS Amplify Docs**: https://docs.amplify.aws/
- **AWS Lambda Docs**: https://docs.aws.amazon.com/lambda/
- **API Gateway Docs**: https://docs.aws.amazon.com/apigateway/

## 🔐 Security Checklist

Before going to production:

- [ ] Rotate ClickHouse credentials
- [ ] Enable API Gateway authentication
- [ ] Set up AWS WAF rules
- [ ] Enable CloudTrail logging
- [ ] Implement rate limiting
- [ ] Use AWS Secrets Manager for credentials
- [ ] Set up CloudWatch alarms
- [ ] Enable Lambda VPC (if needed)
- [ ] Review IAM permissions
- [ ] Enable HTTPS only

## 📊 Monitoring Setup

After deployment, set up:

1. **CloudWatch Dashboards**
   - Lambda invocations and errors
   - API Gateway request counts
   - Response times and latencies

2. **Alarms**
   - Lambda error rate > 5%
   - API Gateway 5xx errors
   - Lambda timeout rate > 10%

3. **Log Insights**
   - Query Lambda logs for errors
   - Track API Gateway access patterns
   - Monitor ClickHouse query performance

---

## 🚀 Ready to Deploy?

**Option 1: Quick Deploy** (Recommended for first-time)
```bash
# Read the quick start guide
cat QUICK_START.md

# Follow the steps in the guide
```

**Option 2: Detailed Deploy** (Recommended for production)
```bash
# Read the comprehensive guide
cat AMPLIFY_DEPLOYMENT.md

# Follow all steps carefully
```

---

## ✅ Migration Checklist

- [x] Create `public/` directory structure
- [x] Move static files to `public/`
- [x] Convert API handlers to Lambda functions
- [x] Create `amplify.yml` configuration
- [x] Update `package.json` for Amplify
- [x] Update asset paths in HTML files
- [x] Create environment variable template
- [x] Update `.gitignore`
- [x] Create deployment documentation
- [x] Create helper scripts
- [ ] Push to Git repository
- [ ] Deploy to AWS Amplify
- [ ] Create Lambda functions
- [ ] Set up API Gateway
- [ ] Update API URLs in frontend
- [ ] Test deployment
- [ ] Set up monitoring

---

**Migration Date**: October 7, 2025  
**Status**: ✅ COMPLETE - Ready for Deployment  
**Next Action**: Follow [QUICK_START.md](./QUICK_START.md) to deploy

Good luck with your deployment! 🎉

