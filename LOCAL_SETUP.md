# AMAC Dashboard - Local Setup

This project has been converted from Vercel to a simple local Node.js server setup.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the project root with your ClickHouse credentials:
   ```env
   CLICKHOUSE_URL=https://pod38uxp1w.us-west-2.aws.clickhouse.cloud:8443
   CLICKHOUSE_USER=your_username
   CLICKHOUSE_PASSWORD=your_password
   CLICKHOUSE_DATABASE=default
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```
   or
   ```bash
   node server.js
   ```

4. **Open your browser:**
   - Main app: http://localhost:3000
   - Test page: http://localhost:3000/test
   - Login page: http://localhost:3000/login
   - Dashboards: http://localhost:3000/dashboard_1, /dashboard_2, etc.

## 📁 Project Structure

- `server.js` - Main Node.js server
- `test.html` - API testing page
- `public/` - Static files (HTML, CSS, JS, images)
- `api/` - API endpoint files (now handled by server.js)
- `lib/` - ClickHouse client configuration

## 🔧 API Endpoints

- `GET/POST /api/hello` - Basic API test
- `GET /api/test-clickhouse` - ClickHouse connection test
- `GET /api/query` - Sample ClickHouse query

## 🛠️ Development

The server automatically serves static files and handles API endpoints. No build process required.

### Features:
- ✅ Static file serving
- ✅ API endpoints
- ✅ CORS support
- ✅ ClickHouse integration
- ✅ Environment variable support
- ✅ Graceful shutdown

## 🐛 Troubleshooting

1. **Port already in use:** Change the PORT in server.js or kill existing processes
2. **ClickHouse connection failed:** Check your `.env` file credentials
3. **404 errors:** Make sure you're accessing the correct URLs

## 📝 Notes

- The server runs on port 3000 by default
- All API endpoints include CORS headers
- ClickHouse credentials are loaded from environment variables
- The test page shows server status and API test results
