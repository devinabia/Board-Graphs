const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Load environment variables from .env file if it exists
try {
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=').trim();
        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = value;
        }
      }
    });
    console.log('✅ Loaded environment variables from .env file');
  } else {
    console.log('⚠️  No .env file found. Using default values.');
  }
} catch (error) {
  console.log('⚠️  Error loading .env file:', error.message);
}

// Import API handlers
const helloHandler = require('./api/hello');
const testClickHouseHandler = require('./api/test-clickhouse');
const electionMetricsHandler = require('./api/election-metrics');
const topJurisdictionsHandler = require('./api/top-jurisdictions');
const jurisdictionMapHandler = require('./api/jurisdiction-map');
const turnoutSeriesHandler = require('./api/turnout-series');
const queryHandler = require('./api/query');

// ClickHouse configuration logging
const clickhouseConfig = {
  host: (process.env.CLICKHOUSE_URL || process.env.CLICKHOUSE_HOST || 'https://pod38uxp1w.us-west-2.aws.clickhouse.cloud:8443').replace(/"/g, ''),
  username: (process.env.CLICKHOUSE_USER || 'default').replace(/"/g, ''),
  password: process.env.CLICKHOUSE_PASSWORD ? process.env.CLICKHOUSE_PASSWORD.replace(/"/g, '') : undefined,
  database: (process.env.CLICKHOUSE_DATABASE || 'default').replace(/"/g, ''),
};

// Add proxy if FIXIE_URL is set
if (process.env.FIXIE_URL) {
  const proxyUrl = process.env.FIXIE_URL.replace(/"/g, '');
  console.log('🔧 Using proxy:', proxyUrl);
}

console.log('🔧 ClickHouse Configuration:');
console.log(`   Host: ${clickhouseConfig.host}`);
console.log(`   Username: ${clickhouseConfig.username}`);
console.log(`   Password: ${clickhouseConfig.password ? '***SET***' : 'NOT SET'}`);
console.log(`   Database: ${clickhouseConfig.database}`);

// API handlers mapping
const apiHandlers = {
  '/api/hello': helloHandler,
  '/api/test-clickhouse': testClickHouseHandler,
  '/api/election-metrics': electionMetricsHandler,
  '/api/top-jurisdictions': topJurisdictionsHandler,
  '/api/jurisdiction-map': jurisdictionMapHandler,
  '/api/turnout-series': turnoutSeriesHandler,
  '/api/query': queryHandler
};

// Clean URL mapping for static files
const cleanUrlMap = {
  '/': 'index.html',
  '/test': 'test.html',
  '/login': 'login.html',
  '/dashboard_1': 'dashboard_1.html',
  '/dashboard_2': 'dashboard_2.html',
  '/dashboard_3': 'dashboard_3.html',
  '/dashboard_4': 'dashboard_4.html'
};

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.geojson': 'application/json'
};

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // Handle API routes
  if (apiHandlers[pathname]) {
    apiHandlers[pathname](req, res);
    return;
  }

  // Handle clean URLs (without file extensions)
  let filePath = pathname;
  if (cleanUrlMap[pathname]) {
    filePath = cleanUrlMap[pathname];
  }

  // Remove leading slash and resolve file path
  const safePath = path.normalize(filePath.replace(/^\/+/, ''));
  const fullPath = path.join(__dirname, safePath);

  // Security check - prevent directory traversal
  if (!fullPath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Check if file exists
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }

    // Get file extension and set appropriate MIME type
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Read and serve the file
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${__dirname}`);
  console.log(`🔗 Pages (clean URLs):`);
  console.log(`   - http://localhost:${PORT}/ (index.html)`);
  console.log(`   - http://localhost:${PORT}/test (test.html)`);
  console.log(`   - http://localhost:${PORT}/login (login.html)`);
  console.log(`   - http://localhost:${PORT}/dashboard_1 (dashboard_1.html)`);
  console.log(`   - http://localhost:${PORT}/dashboard_2 (dashboard_2.html)`);
  console.log(`   - http://localhost:${PORT}/dashboard_3 (dashboard_3.html)`);
  console.log(`   - http://localhost:${PORT}/dashboard_4 (dashboard_4.html)`);
  console.log(`🔗 API endpoints:`);
  console.log(`   - http://localhost:${PORT}/api/hello`);
  console.log(`   - http://localhost:${PORT}/api/test-clickhouse`);
  console.log(`   - http://localhost:${PORT}/api/query`);
  console.log(`   - http://localhost:${PORT}/api/election-metrics`);
  console.log(`   - http://localhost:${PORT}/api/top-jurisdictions`);
  console.log(`   - http://localhost:${PORT}/api/jurisdiction-map`);
  console.log(`   - http://localhost:${PORT}/api/turnout-series`);
});