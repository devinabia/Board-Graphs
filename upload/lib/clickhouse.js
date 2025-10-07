import { createClient } from '@clickhouse/client';

// Validate required environment variables
const requiredEnvVars = ['CLICKHOUSE_URL', 'CLICKHOUSE_USER', 'CLICKHOUSE_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  console.error('Please set the following in your .env file:');
  missingVars.forEach(varName => {
    console.error(`  ${varName}=your_value_here`);
  });
}

export const clickhouse = createClient({
  host: process.env.CLICKHOUSE_URL || process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USER || 'default',
  password: process.env.CLICKHOUSE_PASSWORD,
  database: process.env.CLICKHOUSE_DATABASE || 'default',
  // Vercel serverless requires HTTPS
  tls: {}, // leave empty for default secure connection
});

// Test connection function
export async function testClickHouseConnection() {
  try {
    const result = await clickhouse.query({
      query: 'SELECT 1 as test'
    });
    const data = await result.json();
    console.log('ClickHouse connection test successful:', data);
    return true;
  } catch (error) {
    console.error('ClickHouse connection test failed:', error);
    return false;
  }
}
