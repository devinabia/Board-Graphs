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
    console.log('Jurisdiction map request body:', event.body);
    const { election, jurisdiction } = JSON.parse(event.body);
    
    let query;
    if (election === "Nov 2024") {
      if (jurisdiction === "Legislative Districts") {
        query = `
          SELECT
            legislativedistrict AS jurisdiction_name,
            count() AS voter_count,
            round(100 * countIf(lower(ballot_status) = 'accepted') / count(), 0) AS turnout_pct
          FROM silver_sos_2024_09_voters_llama2_3_4
          WHERE (lower(llama_names) LIKE 'muslim' OR lower(llama_names) LIKE 'revert')
            AND legislativedistrict != ''
          GROUP BY legislativedistrict
          ORDER BY voter_count DESC
          FORMAT JSON
        `;
      } else {
        // Default to legislative districts for now
        query = `
          SELECT
            legislativedistrict AS jurisdiction_name,
            count() AS voter_count,
            round(100 * countIf(lower(ballot_status) = 'accepted') / count(), 0) AS turnout_pct
          FROM silver_sos_2024_09_voters_llama2_3_4
          WHERE (lower(llama_names) LIKE 'muslim' OR lower(llama_names) LIKE 'revert')
            AND legislativedistrict != ''
          GROUP BY legislativedistrict
          ORDER BY voter_count DESC
          FORMAT JSON
        `;
      }
    } else if (election === "Aug 2024") {
      if (jurisdiction === "Legislative Districts") {
        query = `
          SELECT
            legislativedistrict AS jurisdiction_name,
            count() AS voter_count,
            round(100 * countIf(upper(Aug_2024_Status) = 'VOTED') / count(), 0) AS turnout_pct
          FROM silver_sos_2024_09_voters_llama2_3_4
          WHERE (lower(llama_names) LIKE 'muslim' OR lower(llama_names) LIKE 'revert')
            AND legislativedistrict != ''
          GROUP BY legislativedistrict
          ORDER BY voter_count DESC
          FORMAT JSON
        `;
      } else {
        // Default to legislative districts for now
        query = `
          SELECT
            legislativedistrict AS jurisdiction_name,
            count() AS voter_count,
            round(100 * countIf(upper(Aug_2024_Status) = 'VOTED') / count(), 0) AS turnout_pct
          FROM silver_sos_2024_09_voters_llama2_3_4
          WHERE (lower(llama_names) LIKE 'muslim' OR lower(llama_names) LIKE 'revert')
            AND legislativedistrict != ''
          GROUP BY legislativedistrict
          ORDER BY voter_count DESC
          FORMAT JSON
        `;
      }
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Unsupported election period" })
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
    
    console.log('Jurisdiction map result:', raw);
    
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


