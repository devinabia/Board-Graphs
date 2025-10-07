const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');

module.exports = async function handler(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });

  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  if (req.method === 'GET') {
    res.end(JSON.stringify({
      message: 'Hello from AMAC API!',
      timestamp: new Date().toISOString(),
      method: 'GET'
    }));
  } else if (req.method === 'POST') {
    res.end(JSON.stringify({
      message: 'Hello from AMAC API!',
      timestamp: new Date().toISOString(),
      method: 'POST',
      received: 'POST request processed successfully'
    }));
  } else {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
};
