# 🚀 Deploy Backend Functions to AWS Amplify

## ✅ Your Frontend is Now Configured

Your `index.html` is configured to call APIs from Amplify's backend:

- **Local:** `http://localhost:5005/api/*`
- **Amplify:** `https://main.d2jwaen2uj4ggz.amplifyapp.com/api/*`

---

## 🎯 Deployment Options

### Option 1: Amplify Compute (Serverless Functions) - RECOMMENDED

Deploy your API handlers as Amplify serverless functions.

### Option 2: Amplify Rewrites (Proxy to External Backend)

Keep your Node.js server elsewhere and proxy API calls.

### Option 3: Server-Side Rendering (SSR) with Amplify

Deploy your entire Node.js app including server.js.

---

## 🚀 Option 1: Amplify Compute Functions (EASIEST)

### Step 1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify configure
```

### Step 2: Initialize Amplify

```bash
cd C:\Projects\Amac\rana\Amplify
amplify init
```

Answer prompts:
```
? Enter a name for the project: amacDashboard
? Initialize the project with the above configuration? Yes
? Select the authentication method: AWS profile
? Please choose the profile you want to use: default
```

### Step 3: Add API with Functions

```bash
amplify add api
```

Choose:
```
? Select from one of the below mentioned services: REST
? Provide a friendly name for your resource: amacApi
? Provide a path (e.g., /book/{isbn}): /api
? Choose a Lambda source: Create a new Lambda function
? Provide an AWS Lambda function name: amacApiHandler
? Choose the runtime: NodeJS
? Choose the function template: Serverless ExpressJS function
? Do you want to configure advanced settings? Yes
? Do you want to access other resources in this project? No
? Do you want to invoke this function on a recurring schedule? No
? Do you want to enable Lambda layers? No
? Do you want to configure environment variables? Yes

Add environment variables:
- CLICKHOUSE_URL: https://pod38uxp1w.us-west-2.aws.clickhouse.cloud:8443
- CLICKHOUSE_USER: default
- CLICKHOUSE_PASSWORD: [your password]
- CLICKHOUSE_DATABASE: default
- FIXIE_URL: http://fixie:xYDJFj7q8VoSvD1@criterium.usefixie.com:80

? Do you want to configure secret values? No
? Do you want to edit the local lambda function now? Yes
```

### Step 4: Update Lambda Function

Edit: `amplify/backend/function/amacApiHandler/src/app.js`

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const cors = require('cors');

// Import your API handlers
const helloHandler = require('./handlers/hello');
const testClickHouseHandler = require('./handlers/test-clickhouse');
const electionMetricsHandler = require('./handlers/election-metrics');
const topJurisdictionsHandler = require('./handlers/top-jurisdictions');
const jurisdictionMapHandler = require('./handlers/jurisdiction-map');
const turnoutSeriesHandler = require('./handlers/turnout-series');
const queryHandler = require('./handlers/query');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// API Routes
app.get('/api/hello', helloHandler);
app.get('/api/test-clickhouse', testClickHouseHandler);
app.post('/api/query', queryHandler);
app.post('/api/election-metrics', electionMetricsHandler);
app.post('/api/top-jurisdictions', topJurisdictionsHandler);
app.post('/api/jurisdiction-map', jurisdictionMapHandler);
app.get('/api/turnout-series', turnoutSeriesHandler);

module.exports = app;
```

### Step 5: Copy Your API Handlers

```bash
# Create handlers directory
New-Item -ItemType Directory -Force -Path "amplify/backend/function/amacApiHandler/src/handlers"

# Copy your API files
Copy-Item -Path "api/*" -Destination "amplify/backend/function/amacApiHandler/src/handlers/" -Recurse

# Copy lib files if needed
New-Item -ItemType Directory -Force -Path "amplify/backend/function/amacApiHandler/src/lib"
Copy-Item -Path "lib/*" -Destination "amplify/backend/function/amacApiHandler/src/lib/" -Recurse
```

### Step 6: Update package.json in Lambda

Edit: `amplify/backend/function/amacApiHandler/src/package.json`

Add dependencies:
```json
{
  "dependencies": {
    "aws-serverless-express": "^3.4.0",
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "node-fetch": "^2.7.0",
    "https-proxy-agent": "^7.0.6"
  }
}
```

### Step 7: Deploy to Amplify

```bash
amplify push
```

This will:
- Create Lambda function
- Create API Gateway
- Deploy everything
- Connect to your Amplify app

### Step 8: Verify Deployment

After deployment completes:
```bash
amplify status
```

You'll see your API endpoint:
```
REST API endpoint: https://xxxxx.execute-api.region.amazonaws.com/dev
```

But on Amplify, it will be served at:
```
https://main.d2jwaen2uj4ggz.amplifyapp.com/api/*
```

---

## 🔧 Option 2: Amplify Rewrites (Simpler, but requires external backend)

If you want to keep your Node.js server running separately (e.g., on EC2, Heroku, Render, etc.):

### Step 1: Deploy Your Backend Elsewhere

Deploy your entire `server.js` + `api/` folder to:
- AWS EC2
- AWS ECS/Fargate
- Heroku
- Render.com
- Railway.app
- Any VPS

Get the backend URL, e.g.: `https://your-backend.herokuapp.com`

### Step 2: Configure Amplify Rewrites

In Amplify Console:
1. Go to your app → **"Hosting"** → **"Rewrites and redirects"**
2. Click **"Add rule"**
3. Configure:

```
Source address: /api/<*>
Target address: https://your-backend.herokuapp.com/api/<*>
Type: Proxy (200 rewrite)
```

### Step 3: Update index.html

```javascript
API_GATEWAY_URL: '', // Leave empty - rewrites handle it
```

Or if backend is on different domain:
```javascript
API_GATEWAY_URL: 'https://your-backend.herokuapp.com',
```

---

## 🎯 Option 3: SSR with Amplify Hosting Compute

Deploy your entire Node.js app with Amplify Hosting Compute.

### Update amplify.yml:

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - npm ci --production
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: /
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Add compute configuration:

In Amplify Console → **App settings** → **Compute settings**:
- Enable SSR/Server-side compute
- Entry point: `server.js`
- Port: `5005`

---

## ✅ Recommended Approach for Your Project

**Use Option 1 (Amplify Functions)** if:
- ✅ You want serverless architecture
- ✅ You want automatic scaling
- ✅ You don't need long-running processes
- ✅ You want the easiest deployment

**Use Option 2 (Rewrites + External Backend)** if:
- ✅ You already have a backend deployed
- ✅ You want to keep server.js as-is
- ✅ You need full Node.js capabilities
- ✅ You want separate frontend/backend scaling

**Use Option 3 (SSR/Compute)** if:
- ✅ You need server-side rendering
- ✅ You want to deploy everything together
- ✅ You need WebSockets or long-polling
- ✅ You have complex server logic

---

## 📋 Quick Start Commands

### For Option 1 (Amplify Functions):
```bash
amplify init
amplify add api
amplify push
git add .
git commit -m "Add Amplify backend functions"
git push origin main
```

### For Option 2 (External Backend):
```bash
# Deploy backend to Heroku/Render/etc.
# Then configure rewrites in Amplify Console
git add index.html amplify.yml
git commit -m "Configure API for external backend"
git push origin main
```

### For Option 3 (SSR):
```bash
# Update amplify.yml for compute
# Enable compute in Amplify Console
git add amplify.yml
git commit -m "Enable server-side compute"
git push origin main
```

---

## 🧪 Testing After Deployment

### Test Frontend:
```
https://main.d2jwaen2uj4ggz.amplifyapp.com
```

### Test API Endpoints:
```bash
# Test hello endpoint
curl https://main.d2jwaen2uj4ggz.amplifyapp.com/api/hello

# Test with POST
curl -X POST https://main.d2jwaen2uj4ggz.amplifyapp.com/api/election-metrics \
  -H "Content-Type: application/json" \
  -d '{"election":"Nov 2024"}'
```

### Check Browser Console:
```
[API] Configuration loaded:
  Environment: main.d2jwaen2uj4ggz.amplifyapp.com
  BASE_URL: 
  API Gateway: https://main.d2jwaen2uj4ggz.amplifyapp.com
[API] Calling: /api/election-metrics
```

---

## 🎉 Summary

✅ **Frontend configured** - index.html ready  
✅ **amplify.yml updated** - Build config ready  
⏳ **Backend deployment** - Choose your option above  

**Next Step:** Pick Option 1, 2, or 3 and deploy!

Need help? Let me know which option you prefer! 🚀

