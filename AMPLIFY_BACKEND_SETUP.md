# Using Amplify Backend Resources (Instead of Manual Lambda)

## ✨ Why This Is Better

Instead of manually creating Lambda functions and API Gateway, use Amplify's built-in backend:

| Manual Approach | Amplify Backend | Winner |
|----------------|-----------------|--------|
| Create 7 Lambda functions manually | `amplify add function` | ✅ Amplify |
| Configure API Gateway manually | `amplify add api` | ✅ Amplify |
| Set up CORS manually | Auto-configured | ✅ Amplify |
| Deploy separately | Deploys with frontend | ✅ Amplify |
| Manage environment variables | Managed by Amplify | ✅ Amplify |

---

## 🛠️ Setup Steps

### Step 1: Install Amplify CLI (if not installed)

```bash
npm install -g @aws-amplify/cli
amplify configure
```

### Step 2: Initialize Amplify in Your Project

```bash
cd C:\Projects\Amac\rana\Amplify
amplify init
```

Answer the prompts:
- Project name: `amac-dashboard`
- Environment: `prod`
- Default editor: (your choice)
- App type: `javascript`
- Framework: `none`
- Source directory: `public`
- Distribution directory: `public`
- Build command: `npm run build`
- Start command: `npm start`

### Step 3: Add REST API

```bash
amplify add api
```

Choose:
- Service: **REST**
- API name: `amacApi`
- Path: `/api`
- Lambda source: **Create a new Lambda function**
- Function name: `amacApiFunction`
- Runtime: **NodeJS**
- Template: **Serverless ExpressJS function**
- Advanced settings: Configure environment variables
  - `CLICKHOUSE_URL`: your ClickHouse URL
  - `CLICKHOUSE_USER`: your username
  - `CLICKHOUSE_PASSWORD`: your password
  - `CLICKHOUSE_DATABASE`: `default`
  - `FIXIE_URL`: your proxy URL (if using)

### Step 4: Copy Your API Code

After creating the function, Amplify creates: `amplify/backend/function/amacApiFunction/`

Copy your existing API handlers:

```bash
# Copy all API handlers to the Amplify function
Copy-Item -Path "api/*" -Destination "amplify/backend/function/amacApiFunction/src/" -Recurse
```

### Step 5: Update the Lambda Handler

Edit `amplify/backend/function/amacApiFunction/src/app.js`:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

// Import your API handlers
const helloHandler = require('./hello');
const testClickHouseHandler = require('./test-clickhouse');
const electionMetricsHandler = require('./election-metrics');
const topJurisdictionsHandler = require('./top-jurisdictions');
const jurisdictionMapHandler = require('./jurisdiction-map');
const turnoutSeriesHandler = require('./turnout-series');
const queryHandler = require('./query');

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// API Routes - wrap your existing handlers
app.get('/api/hello', async (req, res) => {
  await helloHandler(req, res);
});

app.get('/api/test-clickhouse', async (req, res) => {
  await testClickHouseHandler(req, res);
});

app.post('/api/query', async (req, res) => {
  await queryHandler(req, res);
});

app.post('/api/election-metrics', async (req, res) => {
  await electionMetricsHandler(req, res);
});

app.post('/api/top-jurisdictions', async (req, res) => {
  await topJurisdictionsHandler(req, res);
});

app.post('/api/jurisdiction-map', async (req, res) => {
  await jurisdictionMapHandler(req, res);
});

app.get('/api/turnout-series', async (req, res) => {
  await turnoutSeriesHandler(req, res);
});

module.exports = app;
```

### Step 6: Deploy to Amplify

```bash
amplify push
```

This will:
- Create the Lambda function
- Create API Gateway
- Configure CORS
- Deploy everything

### Step 7: Get Your API URL

After deployment, Amplify will show your API endpoint:

```
✅ REST API endpoint: https://abc123xyz.amplifyapp.com/prod
```

---

## 🔧 Option 2: Use Amplify's Serverless Functions (Simpler)

Amplify hosting can also serve serverless functions directly!

### Create Amplify Functions

1. Create a `amplify/backend/function/` directory structure
2. Add your Lambda functions there
3. Amplify will auto-deploy them

### File Structure:

```
amplify/
└── backend/
    └── function/
        ├── queryApi/
        │   └── index.js
        ├── electionMetricsApi/
        │   └── index.js
        ├── topJurisdictionsApi/
        │   └── index.js
        ├── jurisdictionMapApi/
        │   └── index.js
        ├── turnoutSeriesApi/
        │   └── index.js
        ├── testClickhouseApi/
        │   └── index.js
        └── helloApi/
            └── index.js
```

---

## 🎯 Option 3: Simplest - Use Amplify's Same Domain

If your APIs are simple, you can serve them from the same Amplify app!

### Update `amplify.yml`:

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
        - echo "Building static site..."
        - mkdir -p public
        - cp -r assets public/
        - cp *.html public/
        - cp *.css public/
        # Copy API files
        - mkdir -p public/api
        - cp -r api/* public/api/
  artifacts:
    baseDirectory: public
    files:
      - '**/*'
```

**But wait...** Static hosting can't run Node.js APIs directly!

---

## ✅ Recommended Solution

**Use Amplify Functions + REST API** (Option 1)

This gives you:
- ✅ Automatic deployment
- ✅ Proper API Gateway
- ✅ Environment variables managed by Amplify
- ✅ Easy CORS configuration
- ✅ Integrated with your frontend deployment

### After Setup, Update index.html:

```javascript
const API_CONFIG = {
    // Amplify automatically provides the API URL
    API_GATEWAY_URL: '', // Leave empty, we'll use relative paths
    
    get BASE_URL() {
        // Amplify serves APIs on the same domain
        return ''; // Always use relative paths
    },
    
    ENDPOINTS: {
        HELLO: '/api/hello',
        // ... rest stays the same
    }
};
```

---

## 🚀 Quick Start Commands

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add API with Lambda
amplify add api

# Deploy everything
amplify push

# Check status
amplify status
```

---

## 📊 Comparison

| Approach | Complexity | Cost | Flexibility |
|----------|-----------|------|-------------|
| Manual Lambda + API Gateway | High | $$ | High |
| Amplify Functions + API | Medium | $ | Medium |
| Amplify Hosting (static only) | Low | $ | Low |

**Recommendation:** Use **Amplify Functions + API** (best balance)

---

## 🆘 Need Help?

If you want me to help you set this up, I can:
1. Create the Amplify configuration files
2. Convert your API handlers to Amplify format
3. Update the frontend configuration
4. Guide you through deployment

Just let me know!

