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
    console.log('Request body:', event.body);
    const { election } = JSON.parse(event.body);
    
    let query;
    if (election === "Nov 2024") {
      query = `
       SELECT
           count() AS total_voters,
           round(100 * countIf(lower(ballot_status) = 'accepted') / count(), 0) AS turnout_pct,
           countIf(toYear(registrationdate) = 2024) AS new_regs,
           uniqExact(toInt32OrNull(legislativedistrict)) AS active_legis,
           (
               SELECT uniqExact(toInt32OrNull(legislativedistrict))
               FROM silver_sos_2024_09_voters_llama2_3_4
               WHERE legislativedistrict != ''
           ) AS total_legis
       FROM silver_sos_2024_09_voters_llama2_3_4
       WHERE (lower(llama_names) LIKE 'muslim' OR lower(llama_names) LIKE 'revert')
         AND legislativedistrict != ''
       FORMAT JSON
      `;
    } else if (election === "Aug 2024") {
      query = `
      SELECT
        count() AS total_voters,
        round(100 * countIf(upper(Aug_2024_Status) = 'VOTED') / count(), 0) AS turnout_pct,
        countIf(toYear(registrationdate) = 2024) AS new_regs,
       uniqExact(toInt32OrNull(legislativedistrict)) AS active_legis,
                  (
                      SELECT uniqExact(toInt32OrNull(legislativedistrict))
                      FROM silver_sos_2024_09_voters_llama2_3_4
                      WHERE legislativedistrict != ''
                  ) AS total_legis
              FROM silver_sos_2024_09_voters_llama2_3_4
              WHERE (lower(llama_names) LIKE 'muslim' OR lower(llama_names) LIKE 'revert')
                AND legislativedistrict != ''
      FORMAT JSON
      `;
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Unsupported election period" })
      };
    }

    // Use ClickHouse client instead of direct fetch
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
    
    console.log('Election metrics result:', raw);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data: raw.data || [],
        meta: raw.meta || [],
        stats: raw.statistics || {},
        row: raw.data?.[0] || {}, // shortcut for KPI cards
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


