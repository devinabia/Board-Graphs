# 🚀 Deploy Backend Using Amplify Functions

## ✅ Your Backend Works Locally - Let's Deploy It!

I can see your local backend is working perfectly with data. Now let's deploy it to Amplify.

---

## 🎯 Method 1: Amplify CLI (Complete Integration)

### Step 1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
```

### Step 2: Configure Amplify

```bash
amplify configure
```

This will:
1. Open AWS Console in browser
2. Create IAM user
3. Save credentials locally

### Step 3: Initialize Amplify in Your Project

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

### Step 4: Add REST API with Lambda Function

```bash
amplify add api
```

Answer prompts:
```
? Select from one of the below mentioned services: REST
? Provide a friendly name for your resource: amacApi
? Provide a path (e.g., /book/{isbn}): /api
? Choose a Lambda source: Create a new Lambda function
? Provide an AWS Lambda function name: amacApiFunction
? Choose the runtime: NodeJS
? Choose the function template: Serverless ExpressJS function (Lambda proxy integration)
? Do you want to configure advanced settings? Yes
? Do you want to access other resources in this project from this function? No
? Do you want to invoke this function on a recurring schedule? No
? Do you want to enable Lambda layers for this function? No
? Do you want to configure environment variables for this function? Yes

? Enter the environment variable name: CLICKHOUSE_URL
? Enter the environment variable value: https://pod38uxp1w.us-west-2.aws.clickhouse.cloud:8443

? Select what you want to do with environment variables: Add new environment variable

? Enter the environment variable name: CLICKHOUSE_USER
? Enter the environment variable value: default

? Select what you want to do with environment variables: Add new environment variable

? Enter the environment variable name: CLICKHOUSE_PASSWORD
? Enter the environment variable value: [your password from .env]

? Select what you want to do with environment variables: Add new environment variable

? Enter the environment variable name: CLICKHOUSE_DATABASE
? Enter the environment variable value: default

? Select what you want to do with environment variables: Add new environment variable

? Enter the environment variable name: FIXIE_URL
? Enter the environment variable value: http://fixie:xYDJFj7q8VoSvD1@criterium.usefixie.com:80

? Select what you want to do with environment variables: I'm done

? Do you want to configure secret values this function can access? No
? Do you want to edit the local lambda function now? Yes
```

### Step 5: Replace Lambda Function Code

Amplify created: `amplify/backend/function/amacApiFunction/src/`

Now replace the code with your API handlers:

```bash
# Copy your API handlers
Copy-Item -Path "api\*" -Destination "amplify\backend\function\amacApiFunction\src\api\" -Recurse

# Copy lib if needed
Copy-Item -Path "lib\*" -Destination "amplify\backend\function\amacApiFunction\src\lib\" -Recurse
```

### Step 6: Update Lambda app.js

Edit: `amplify/backend/function/amacApiFunction/src/app.js`

Replace with:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const cors = require('cors');

// Import your API handlers
const helloHandler = require('./api/hello');
const testClickHouseHandler = require('./api/test-clickhouse');
const electionMetricsHandler = require('./api/election-metrics');
const topJurisdictionsHandler = require('./api/top-jurisdictions');
const jurisdictionMapHandler = require('./api/jurisdiction-map');
const turnoutSeriesHandler = require('./api/turnout-series');
const queryHandler = require('./api/query');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// API Routes - matching your server.js
app.get('/api/hello', helloHandler);
app.get('/api/test-clickhouse', testClickHouseHandler);
app.post('/api/query', queryHandler);
app.post('/api/election-metrics', electionMetricsHandler);
app.post('/api/top-jurisdictions', topJurisdictionsHandler);
app.post('/api/jurisdiction-map', jurisdictionMapHandler);
app.get('/api/turnout-series', turnoutSeriesHandler);

module.exports = app;
```

### Step 7: Update package.json

Edit: `amplify/backend/function/amacApiFunction/src/package.json`

Add your dependencies:

```json
{
  "name": "amacApiFunction",
  "version": "2.0.0",
  "description": "AMAC Dashboard API Functions",
  "main": "index.js",
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

### Step 8: Deploy to AWS

```bash
amplify push
```

This will:
- Create Lambda function
- Create API Gateway
- Deploy everything
- Connect to your Amplify app

Wait 5-10 minutes for deployment.

### Step 9: Get Your API URL

After deployment, Amplify shows:

```
✔ All resources are updated in the cloud

REST API endpoint: https://xxxxxxx.execute-api.us-west-2.amazonaws.com/dev
```

### Step 10: Test Your API

```bash
curl https://xxxxxxx.execute-api.us-west-2.amazonaws.com/dev/api/hello
```

Should return:
```json
{"message":"Hello from AMAC API!","timestamp":"..."}
```

### Step 11: Update index.html (OPTIONAL)

Your `index.html` already auto-detects! It will use relative paths on Amplify.

But Amplify will serve the API at the same domain, so it just works!

---

## 🎯 Method 2: Deploy to Render.com (FASTEST - 5 min)

If Amplify CLI is taking too long, deploy to Render.com and proxy:

### Step 1: Go to render.com

1. Sign up (free): https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your Git repo

### Step 2: Configure

```
Name: amac-dashboard-api
Branch: main
Build Command: npm install
Start Command: node server.js
```

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add all from your `.env` file:
```
CLICKHOUSE_URL=https://pod38uxp1w.us-west-2.aws.clickhouse.cloud:8443
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=[your password]
CLICKHOUSE_DATABASE=default
FIXIE_URL=http://fixie:xYDJFj7q8VoSvD1@criterium.usefixie.com:80
PORT=5005
```

### Step 4: Deploy

Click **"Create Web Service"** - wait 3-5 minutes

You'll get URL: `https://amac-dashboard-api.onrender.com`

### Step 5: Test

```bash
curl https://amac-dashboard-api.onrender.com/api/hello
```

### Step 6: Configure Amplify Rewrite

1. Go to **Amplify Console**
2. Your App → **Hosting** → **Rewrites and redirects**
3. Click **"Add rule"**
4. Configure:
   ```
   Source address: /api/<*>
   Target address: https://amac-dashboard-api.onrender.com/api/<*>
   Type: Rewrite (200)
   ```
5. Save

### Step 7: Done!

Visit: `https://main.d2jwaen2uj4ggz.amplifyapp.com`

APIs now work! ✅

---

## 🎯 Method 3: AWS Lambda Manual (Advanced)

Create 7 Lambda functions manually in AWS Console, but Method 1 (Amplify CLI) does this automatically.

---

## 📊 Comparison

| Method | Time | Difficulty | Cost | Recommended |
|--------|------|----------|------|-------------|
| Amplify CLI | 20 min | Medium | Free tier | ⭐ Best integration |
| Render.com | 5 min | Easy | Free tier | ⚡ Fastest |
| Manual Lambda | 60 min | Hard | Free tier | Advanced only |

---

## ✅ Recommendation

**For Your Situation:**

Use **Method 2 (Render.com)** for immediate results, then migrate to **Method 1 (Amplify Functions)** later if needed.

**Why Render.com first:**
- ✅ Works in 5 minutes
- ✅ No CLI installation needed
- ✅ Easy debugging (see logs in dashboard)
- ✅ Can migrate to Amplify later
- ✅ Your code works as-is (no modifications)

---

## 🚀 Quick Start (Render.com)

1. **Visit:** https://render.com
2. **Sign up** with GitHub
3. **New Web Service** → Select your repo
4. **Configure:**
   - Build: `npm install`
   - Start: `node server.js`
5. **Add environment variables** from `.env`
6. **Deploy** (3 minutes)
7. **Get URL:** `https://your-app.onrender.com`
8. **Configure Amplify rewrite** (see above)
9. **Done!** ✅

---

## 🆘 Need Help?

Choose your path:

**Want fastest solution (5 min)?**
→ Use Render.com (Method 2)

**Want best AWS integration (20 min)?**
→ Use Amplify CLI (Method 1)

**Already have AWS experience?**
→ Use Manual Lambda (Method 3)

Let me know which method you want and I'll help you through it! 🚀

