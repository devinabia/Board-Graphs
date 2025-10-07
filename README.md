# AMAC Voter Analytics Dashboard

## Project Structure Changes Made

### 1. Fixed API 405 Errors
- **Issue**: APIs were returning 405 Method Not Allowed errors
- **Solution**: 
  - Updated `api/turnout-series.js` to accept both GET and POST requests
  - Fixed all API endpoints to use consistent ES6 import/export syntax
  - Ensured proper method handling for all endpoints

### 2. Fixed Project Structure
- **Issue**: Incorrect asset paths and routing configuration
- **Solution**:
  - Updated `vercel.json` with proper routing rules
  - Fixed asset paths in `index.html` to point to `/public/assets/`
  - Added support for serving HTML files directly from root
  - Created test page for API verification

### 3. API Endpoints
- `/api/hello` - Test endpoint (POST)
- `/api/election-metrics` - Election statistics (POST)
- `/api/jurisdiction-map` - Jurisdiction mapping data (POST)
- `/api/top-jurisdictions` - Top jurisdictions by metrics (POST)
- `/api/turnout-series` - Turnout data series (GET/POST)

### 4. How to Run
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Open `http://localhost:3000` for main dashboard
4. Open `http://localhost:3000/test` for API testing

### 5. Deployment
The project is configured for Vercel deployment with:
- API functions in `/api` directory
- Static assets in `/public` directory
- Main dashboard at `/index.html`
- Test page at `/test.html`

## Key Files Modified
- `index.html` - Fixed asset paths and API calls
- `api/turnout-series.js` - Fixed module syntax and method handling
- `vercel.json` - Updated routing configuration
- `test.html` - Created for API testing (new file)
- `README.md` - This documentation (new file)

## Environment Variables Required
- `CLICKHOUSE_URL` - ClickHouse database URL
- `CLICKHOUSE_USER` - ClickHouse username
- `CLICKHOUSE_PASSWORD` - ClickHouse password
- `FIXIE_URL` - Proxy URL for database connections
