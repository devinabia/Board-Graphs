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

  try {
    // Use direct fetch approach like in the original election-metrics
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
        body: 'SELECT version() as version, now() as current_time',
        agent,
      }
    );

    const responseText = await clickhouseRes.text();
    console.log('ClickHouse response:', responseText);
    
    // Try to parse as JSON, if it fails, return the raw response
    let data = {};
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      // If it's not JSON, it might be tab-separated values
      const lines = responseText.trim().split('\n');
      if (lines.length >= 2) {
        const headers = lines[0].split('\t');
        const values = lines[1].split('\t');
        data = {};
        headers.forEach((header, index) => {
          data[header] = values[index];
        });
      }
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'ClickHouse connection successful',
        data: data,
        rawResponse: responseText,
        environment: {
          hasUrl: !!process.env.CLICKHOUSE_URL,
          hasUser: !!process.env.CLICKHOUSE_USER,
          hasPassword: !!process.env.CLICKHOUSE_PASSWORD,
          hasHost: !!process.env.CLICKHOUSE_HOST,
          hasProxy: !!process.env.FIXIE_URL
        }
      })
    };
    
  } catch (error) {
    console.error('ClickHouse test error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        details: 'ClickHouse connection or query failed',
        environment: {
          hasUrl: !!process.env.CLICKHOUSE_URL,
          hasUser: !!process.env.CLICKHOUSE_USER,
          hasPassword: !!process.env.CLICKHOUSE_PASSWORD,
          hasHost: !!process.env.CLICKHOUSE_HOST,
          hasProxy: !!process.env.FIXIE_URL
        }
      })
    };
  }
};


