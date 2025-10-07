# AMAC Dashboard - AWS Amplify Version

This is the AWS Amplify-ready version of the AMAC Voter Analytics Dashboard.

## 🚀 Quick Links

- **Quick Start**: [QUICK_START.md](./QUICK_START.md) - Get deployed in 30 minutes
- **Detailed Guide**: [AMPLIFY_DEPLOYMENT.md](./AMPLIFY_DEPLOYMENT.md) - Complete deployment documentation

## 📁 Project Structure

```
Amplify/
├── amplify/
│   └── backend/
│       └── function/              # AWS Lambda functions
│           ├── queryApi/          # Custom ClickHouse queries
│           ├── electionMetricsApi/    # Election KPI metrics
│           ├── topJurisdictionsApi/   # Top jurisdictions data
│           ├── jurisdictionMapApi/    # Map data by jurisdiction
│           ├── turnoutSeriesApi/      # Turnout time series
│           ├── testClickhouseApi/     # Connection test
│           └── helloApi/          # Health check
│
├── public/                        # Static files (HTML, CSS, Assets)
│   ├── assets/                   # Images, GeoJSON files
│   ├── index.html                # Main dashboard
│   ├── dashboard_*.html          # Additional dashboards
│   ├── login.html               # Login page
│   ├── test.html                # Test page
│   └── *.css                    # Stylesheets
│
├── api/                          # Original API handlers (reference only)
├── amplify.yml                   # Amplify build configuration
├── package.json                  # Dependencies and scripts
├── .env.template                 # Environment variables template
├── .gitignore                    # Git ignore rules
│
└── Documentation/
    ├── QUICK_START.md           # Quick deployment guide
    └── AMPLIFY_DEPLOYMENT.md    # Detailed deployment guide
```

## ⚡ Key Changes from Original

### 1. **API Structure**
- **Before**: Node.js Express server with API routes
- **After**: AWS Lambda functions with API Gateway

### 2. **Static Files**
- **Before**: Served from root directory
- **After**: Served from `public/` directory

### 3. **Asset Paths**
- **Before**: `/public/assets/...`
- **After**: `/assets/...`

### 4. **Environment Variables**
- **Before**: `.env` file loaded by server
- **After**: AWS Lambda environment variables + Amplify Console env vars

## 🛠️ Development

### Local Development (Original Server)

```bash
# Install dependencies
npm install

# Create .env file from template
cp .env.template .env
# Edit .env with your credentials

# Run development server
npm run dev

# Visit http://localhost:3000
```

### Build for Amplify

```bash
# Build static files and prepare functions
npm run build
```

## 🔧 Configuration

### Required Environment Variables

Set these in:
1. AWS Lambda console for each function
2. AWS Amplify Console → Environment variables

```bash
CLICKHOUSE_URL=https://your-clickhouse-instance.cloud:8443
CLICKHOUSE_USER=your_username
CLICKHOUSE_PASSWORD=your_password
CLICKHOUSE_DATABASE=default
```

### Optional Variables

```bash
FIXIE_URL=http://your-proxy-url  # If using a proxy for ClickHouse
```

## 📊 API Endpoints

After deployment, your API Gateway will expose these endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/query` | POST | Execute custom ClickHouse queries |
| `/api/election-metrics` | POST | Get election metrics (voters, turnout, etc.) |
| `/api/top-jurisdictions` | POST | Get top jurisdictions by count or turnout |
| `/api/jurisdiction-map` | POST | Get map data for jurisdictions |
| `/api/turnout-series` | GET | Get turnout time series data |
| `/api/test-clickhouse` | GET | Test ClickHouse connectivity |
| `/api/hello` | GET/POST | Health check endpoint |

## 🎯 Deployment Steps (Summary)

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Ready for Amplify"
   git push origin main
   ```

2. **Set Up Amplify Hosting**
   - Connect Git repo in Amplify Console
   - Auto-deploy on push

3. **Create Lambda Functions**
   - Deploy 7 Lambda functions from `amplify/backend/function/`
   - Set environment variables
   - Configure timeout (30s) and memory (512MB)

4. **Set Up API Gateway**
   - Create REST API
   - Map endpoints to Lambda functions
   - Enable CORS
   - Deploy to `prod` stage

5. **Update Frontend**
   - Replace API URLs with API Gateway URLs
   - Commit and push

6. **Test**
   - Visit Amplify URL
   - Test all functionality

## 🔒 Security Considerations

- ✅ Never commit `.env` files
- ✅ Use AWS Secrets Manager for production credentials
- ✅ Enable API Gateway authentication (Cognito/API Keys)
- ✅ Implement rate limiting
- ✅ Use AWS WAF for additional protection
- ✅ Rotate credentials regularly

## 📈 Monitoring

### Logs
- **Lambda logs**: CloudWatch → Log groups → `/aws/lambda/<function-name>`
- **Amplify logs**: Amplify Console → Build history
- **API Gateway logs**: Enable in API Gateway settings

### Metrics
- **Lambda**: CloudWatch → Lambda metrics (invocations, errors, duration)
- **API Gateway**: CloudWatch → API Gateway metrics (requests, latency, 4xx/5xx)
- **Amplify**: Amplify Console → Monitoring tab

## 💰 Cost Estimate

Based on low-to-moderate traffic:

| Service | Free Tier | Estimated Cost |
|---------|-----------|----------------|
| Amplify Hosting | 1000 build minutes, 15GB storage | $0-5/month |
| Lambda | 1M requests, 400K GB-seconds | $0-5/month |
| API Gateway | 1M API calls | $0-3/month |
| CloudWatch | Basic monitoring | $0-2/month |
| **Total** | | **$0-15/month** |

*Excludes ClickHouse costs*

## 🐛 Common Issues

### Issue: CORS Errors
**Fix**: Enable CORS in API Gateway + verify Lambda headers

### Issue: 502 Bad Gateway
**Fix**: Check Lambda execution role permissions + logs

### Issue: API Timeout
**Fix**: Increase Lambda timeout from 3s to 30s

### Issue: Assets 404
**Fix**: Verify paths use `/assets/...` not `/public/assets/...`

## 📚 Documentation

- [AWS Amplify Docs](https://docs.amplify.aws/)
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)
- [API Gateway Docs](https://docs.aws.amazon.com/apigateway/)
- [ClickHouse Docs](https://clickhouse.com/docs/)

## 🆘 Support

For deployment issues:
1. Check [AMPLIFY_DEPLOYMENT.md](./AMPLIFY_DEPLOYMENT.md) troubleshooting section
2. Review AWS CloudWatch logs
3. Contact AWS Support or post in AWS Forums

## 📝 License

Copyright © 2025 AMAC. All rights reserved.

---

## ✨ Features

- 📊 Real-time voter analytics dashboard
- 🗺️ Interactive Mapbox visualizations
- 📈 Election turnout trends
- 🏛️ Jurisdiction-level data breakdown
- 🔍 ClickHouse-powered queries
- ⚡ Serverless architecture
- 🌐 Global CDN distribution via Amplify
- 🔒 Secure API access

---

**Version**: 2.0.0 (Amplify)  
**Last Updated**: October 2025


