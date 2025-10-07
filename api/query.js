const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');

module.exports = async function handler(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });

  if (req.method !== 'POST') {
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    // Parse request body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { query } = JSON.parse(body);
        
        if (!query) {
          res.end(JSON.stringify({ error: 'Query is required' }));
          return;
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
        
        res.end(JSON.stringify({
          data: raw.data || [],
          meta: raw.meta || [],
          stats: raw.statistics || {},
        }));
      } catch (parseError) {
        console.error('Error parsing request body:', parseError);
        console.error('Body content:', body);
        res.end(JSON.stringify({ error: 'Invalid JSON in request body', details: parseError.message }));
      }
    });
  } catch (err) {
    console.error("ClickHouse error:", err);
    res.end(JSON.stringify({ error: err.message }));
  }
};
