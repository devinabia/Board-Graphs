const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { query } = JSON.parse(event.body);
    
    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Query is required' })
      };
    }

    // Use direct fetch approach with proxy
    const proxyUrl = process.env.FIXIE_URL ? process.env.FIXIE_URL.replace(/"/g, '') : null;
    const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : null;

    const clickhouseRes = await fetch(
      "https://pod38uxp1w.us-west-2.aws.clickhouse.cloud:8443/?database=default",
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              (process.env.CLICKHOUSE_USER || 'default').replace(/"/g, '') + ":" + 
              (process.env.CLICKHOUSE_PASSWORD || '').replace(/"/g, '')
            ).toString("base64"),
          "Content-Type": "text/plain",
        },
        body: query,
        agent,
      }
    );

    const raw = await clickhouseRes.json();
    
    console.log('Query result:', raw);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data: raw.data || [],
        meta: raw.meta || [],
        stats: raw.statistics || {},
      })
    };
  } catch (err) {
    console.error("ClickHouse error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};


