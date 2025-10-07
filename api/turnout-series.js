const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');

module.exports = async function handler(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });

  try {
    const query = `
      SELECT *
      FROM (
        SELECT 'Aug 2024' AS label,
               round(100 * countIf(lower(Aug_2024_Status) = 'voted') / count(), 0) AS pct,
               202408 AS sort_key
        FROM silver_sos_2024_09_voters_llama2_3_4 
        WHERE (lower(llama_names) LIKE 'muslim' OR lower(llama_names) LIKE 'revert')

        UNION ALL

        SELECT 'Nov 2024' AS label,
               round(100 * countIf(lower(ballot_status) = 'accepted') / count(), 0) AS pct,
               202411 AS sort_key
        FROM silver_sos_2024_09_voters_llama2_3_4 
        WHERE (lower(llama_names) LIKE 'muslim' OR lower(llama_names) LIKE 'revert')
      )
      ORDER BY sort_key
      FORMAT JSON
    `;

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
    
    console.log('Turnout series result:', raw);
    
    const response = {
      labels: raw.data?.map(r => r.label) || [],
      data: raw.data?.map(r => Number(r.pct)) || [],
    };
    
    res.end(JSON.stringify(response));
    
  } catch (error) {
    console.error('Turnout series error:', error);
    res.end(JSON.stringify({ error: error.message }));
  }
};
