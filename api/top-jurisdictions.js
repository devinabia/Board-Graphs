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
        console.log('Top jurisdictions request body:', body);
        const { election } = JSON.parse(body);
        
        const table = "silver_sos_2024_09_voters_llama2_3_4";
        const cohort = "(lower(llama_names) LIKE 'muslim' OR lower(llama_names) LIKE 'revert')";

        // Which condition applies?
        const electionCond =
          election === "Nov 2024"
            ? "lower(ballot_status) = 'accepted'"
            : "upper(Aug_2024_Status) = 'VOTED'";

        const queries = {
          county: `
            SELECT countycode AS name,
                   count() AS count,
                   round(100 * countIf(${electionCond}) / count(), 1) AS turnout
            FROM ${table}
            WHERE ${cohort}
            GROUP BY countycode
            ORDER BY count DESC
            LIMIT 1
            FORMAT JSON
          `,
          congressional: `
            SELECT congressionaldistrict AS name,
                   count() AS count,
                   round(100 * countIf(${electionCond}) / count(), 1) AS turnout
            FROM ${table}
            WHERE ${cohort}
            GROUP BY congressionaldistrict
            ORDER BY count DESC
            LIMIT 1
            FORMAT JSON
          `,
          legislative: `
            SELECT legislativedistrict AS name,
                   count() AS count,
                   round(100 * countIf(${electionCond}) / count(), 1) AS turnout
            FROM ${table}
            WHERE ${cohort}
            GROUP BY legislativedistrict
            ORDER BY count DESC
            LIMIT 1
            FORMAT JSON
          `,
          cities: `
            SELECT regcity AS name,
                   count() AS count,
                   round(100 * countIf(${electionCond}) / count(), 1) AS turnout
            FROM ${table}
            WHERE ${cohort}
            GROUP BY regcity
            ORDER BY count DESC
            LIMIT 2
            FORMAT JSON
          `,
        };

        // Use direct fetch approach with proxy
        const proxyUrl = process.env.FIXIE_URL ? process.env.FIXIE_URL.replace(/"/g, '') : null;
        const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : null;
        const results = {};

        for (let key of Object.keys(queries)) {
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
              body: queries[key],
              agent,
            }
          );

          const json = await clickhouseRes.json();
          if (key === "cities") {
            results.cities = json.data.map((r) => ({
              name: r.name,
              count: r.count,
              turnout: r.turnout,
            }));
          } else {
            const row = json.data?.[0] || {};
            results[key] = {
              name: row.name || "",
              count: row.count || 0,
              turnout: row.turnout || 0,
            };
          }
        }
        
        console.log('Top jurisdictions result:', results);
        
        res.end(JSON.stringify(results));
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
