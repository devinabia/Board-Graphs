# AWS Amplify Deployment Guide

This guide will help you deploy the AMAC Voter Analytics Dashboard to AWS Amplify.

## Project Structure

The project has been restructured for AWS Amplify deployment:

```
Amplify/
├── amplify/
│   └── backend/
│       └── function/          # Lambda functions
│           ├── queryApi/
│           ├── electionMetricsApi/
│           ├── topJurisdictionsApi/
│           ├── jurisdictionMapApi/
│           ├── turnoutSeriesApi/
│           ├── testClickhouseApi/
│           └── helloApi/
├── public/                     # Static files
│   ├── assets/                # Images, GeoJSON files
│   ├── *.html                 # HTML pages
│   └── *.css                  # Stylesheets
├── amplify.yml                # Amplify build configuration
└── package.json               # Project dependencies
```

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **AWS Amplify CLI**: Install the Amplify CLI globally
   ```bash
   npm install -g @aws-amplify/cli
   ```
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, Bitbucket, etc.)

## Step 1: Configure AWS Amplify CLI

1. Configure Amplify with your AWS credentials:
   ```bash
   amplify configure
   ```

2. Follow the prompts to:
   - Sign in to your AWS Console
   - Create an IAM user with appropriate permissions
   - Set up your access keys

## Step 2: Initialize Amplify in Your Project

1. Navigate to your project directory:
   ```bash
   cd /path/to/Amplify
   ```

2. Initialize Amplify:
   ```bash
   amplify init
   ```

3. Answer the prompts:
   - Project name: `amac-dashboard`
   - Environment: `prod`
   - Default editor: (your choice)
   - App type: `javascript`
   - Framework: `none`
   - Source directory: `public`
   - Distribution directory: `public`
   - Build command: `npm run build`
   - Start command: (leave empty)

## Step 3: Set Up Hosting

1. Add hosting to your Amplify project:
   ```bash
   amplify add hosting
   ```

2. Choose:
   - Hosting with Amplify Console (Managed hosting with custom domains, SSL)
   - Manual deployment

## Step 4: Configure Lambda Functions

Since AWS Amplify doesn't directly support multiple Lambda functions in the `amplify/backend/function` folder structure by default, you have two options:

### Option A: Use AWS Lambda Console (Recommended for this setup)

1. **Create Lambda Functions via AWS Console**:
   - Go to AWS Lambda Console
   - Create a new function for each API endpoint
   - Choose "Author from scratch"
   - Runtime: Node.js 18.x or later
   - Upload the code from each function folder in `amplify/backend/function/`

2. **Set up API Gateway**:
   - Create a new REST API in API Gateway
   - Create resources and methods for each endpoint:
     - `/api/query` → POST → queryApi Lambda
     - `/api/election-metrics` → POST → electionMetricsApi Lambda
     - `/api/top-jurisdictions` → POST → topJurisdictionsApi Lambda
     - `/api/jurisdiction-map` → POST → jurisdictionMapApi Lambda
     - `/api/turnout-series` → GET → turnoutSeriesApi Lambda
     - `/api/test-clickhouse` → GET → testClickhouseApi Lambda
     - `/api/hello` → GET/POST → helloApi Lambda

3. **Enable CORS** on all API Gateway endpoints

4. **Deploy the API** and note the API Gateway URL

### Option B: Use Amplify Functions (Alternative)

1. Add each function using Amplify CLI:
   ```bash
   amplify add function
   ```

2. For each function:
   - Function name: (e.g., `queryApi`)
   - Runtime: NodeJS
   - Function template: Hello World
   - Advanced settings: 
     - Set environment variables
     - Increase timeout to 30 seconds
     - Increase memory to 512MB

3. Copy the code from `amplify/backend/function/<functionName>/index.js` to the generated function

## Step 5: Configure Environment Variables

### For Lambda Functions:

Set these environment variables in AWS Lambda Console or via Amplify CLI:

```bash
CLICKHOUSE_URL=https://pod38uxp1w.us-west-2.aws.clickhouse.cloud:8443
CLICKHOUSE_USER=your_username
CLICKHOUSE_PASSWORD=your_password
CLICKHOUSE_DATABASE=default
FIXIE_URL=http://your-proxy-url (optional, if using proxy)
```

**Important**: Never commit these values to your repository. Use AWS Secrets Manager or Parameter Store for production.

### For Amplify Hosting:

1. Go to AWS Amplify Console
2. Select your app
3. Go to "App settings" → "Environment variables"
4. Add the above environment variables

## Step 6: Update API Endpoints in Frontend

After deploying your API Gateway, you need to update the API endpoints in your HTML files:

1. Open `public/index.html` and other HTML files
2. Find all API calls (e.g., `/api/query`, `/api/election-metrics`, etc.)
3. Replace them with your API Gateway URLs:

```javascript
// Before:
fetch('/api/election-metrics', { ... })

// After:
fetch('https://your-api-gateway-id.execute-api.us-west-2.amazonaws.com/prod/election-metrics', { ... })
```

Or, create a configuration file:

```javascript
// config.js
const API_BASE_URL = 'https://your-api-gateway-id.execute-api.us-west-2.amazonaws.com/prod';

// Usage:
fetch(`${API_BASE_URL}/election-metrics`, { ... })
```

## Step 7: Deploy to Amplify

### Via Amplify Console (Recommended):

1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Connect your Git repository
4. Select your repository and branch
5. Amplify will auto-detect your `amplify.yml` configuration
6. Review the build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: public
       files:
         - '**/*'
   ```
7. Click "Save and deploy"

### Via Amplify CLI:

```bash
amplify publish
```

## Step 8: Verify Deployment

1. After deployment completes, Amplify will provide a URL (e.g., `https://main.xxxxx.amplifyapp.com`)
2. Open the URL in your browser
3. Test all functionality:
   - Dashboard loads correctly
   - Maps display properly
   - API calls work (check browser console for errors)
   - Data loads from ClickHouse

## Troubleshooting

### Issue: API calls fail with CORS errors

**Solution**: 
- Ensure CORS is enabled on API Gateway
- Check that Lambda functions return proper CORS headers
- Verify the `Access-Control-Allow-Origin` header is set to `*` or your domain

### Issue: Lambda timeout errors

**Solution**:
- Increase Lambda timeout in AWS Console (default: 3s, recommended: 30s)
- Increase memory allocation (minimum: 256MB, recommended: 512MB)

### Issue: ClickHouse connection fails

**Solution**:
- Verify environment variables are set correctly in Lambda
- Check ClickHouse credentials and URL
- Ensure Lambda has internet access (check VPC settings if applicable)
- Test with the `/api/test-clickhouse` endpoint

### Issue: Assets not loading (images, GeoJSON)

**Solution**:
- Verify files are in the `public/assets/` directory
- Check that `amplify.yml` includes all asset files
- Ensure asset paths in HTML use relative paths (`/assets/...`)

### Issue: Build fails during deployment

**Solution**:
- Check the Amplify Console build logs
- Verify `package.json` scripts are correct
- Ensure all dependencies are listed in `package.json`
- Try building locally: `npm run build`

## Continuous Deployment

Once connected to Git, Amplify automatically deploys when you push to your repository:

1. Make changes locally
2. Commit and push to Git:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. Amplify automatically detects the change and rebuilds

## Custom Domain

To add a custom domain:

1. Go to Amplify Console → Your App → "Domain management"
2. Click "Add domain"
3. Enter your domain name
4. Follow the DNS configuration instructions
5. Wait for SSL certificate provisioning (can take up to 24 hours)

## Monitoring and Logging

### CloudWatch Logs:
- Lambda function logs: AWS CloudWatch → Log groups → `/aws/lambda/<function-name>`
- Amplify build logs: Amplify Console → Your App → Build history

### Amplify Monitoring:
- Amplify Console → Your App → "Monitoring"
- View traffic, latency, and errors

## Cost Optimization

1. **Lambda**: 
   - First 1M requests/month are free
   - Optimize memory allocation to reduce costs
   
2. **API Gateway**:
   - First 1M API calls/month are free
   - Consider caching responses

3. **Amplify Hosting**:
   - First 15GB storage and 15GB/month transfer are free
   - Optimize images and assets

4. **ClickHouse**:
   - Ensure your ClickHouse Cloud plan matches your usage
   - Consider query optimization to reduce costs

## Security Best Practices

1. **Environment Variables**:
   - Never commit secrets to Git
   - Use AWS Secrets Manager for sensitive data
   - Rotate credentials regularly

2. **API Security**:
   - Add authentication (AWS Cognito, API keys)
   - Implement rate limiting
   - Use AWS WAF for API Gateway

3. **HTTPS**:
   - Amplify automatically provides SSL certificates
   - Ensure all assets load over HTTPS

## Support

For issues specific to:
- **AWS Amplify**: AWS Support or AWS Forums
- **ClickHouse**: ClickHouse documentation or support
- **This Application**: Contact your development team

## Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [ClickHouse Cloud Documentation](https://clickhouse.com/docs/)

---

## Quick Reference: API Endpoints

After deployment, your API endpoints will be:

| Endpoint | Method | Lambda Function | Description |
|----------|--------|----------------|-------------|
| `/api/query` | POST | queryApi | Execute custom ClickHouse queries |
| `/api/election-metrics` | POST | electionMetricsApi | Get election KPI metrics |
| `/api/top-jurisdictions` | POST | topJurisdictionsApi | Get top performing jurisdictions |
| `/api/jurisdiction-map` | POST | jurisdictionMapApi | Get map data by jurisdiction |
| `/api/turnout-series` | GET | turnoutSeriesApi | Get turnout time series data |
| `/api/test-clickhouse` | GET | testClickhouseApi | Test ClickHouse connection |
| `/api/hello` | GET/POST | helloApi | Health check endpoint |

---

**Last Updated**: October 2025


