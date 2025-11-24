const axios = require('axios');
const https = require('https');

// Create axios instance that ignores SSL errors (for testing)
const api = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  }),
  timeout: 10000
});

async function testConnection() {
  console.log('\n🔌 Testing Real MT5 Connection...\n');
  
  const MT5_SERVER = '91.243.176.38';
  const MT5_LOGIN = 7000;
  const MT5_PASSWORD = 'Rekha@123';
  
  // Try different common MT5 API endpoints
  const endpoints = [
    `https://${MT5_SERVER}:443/api/v1/auth/login`,
    `https://${MT5_SERVER}:8443/api/v1/auth/login`,
    `https://${MT5_SERVER}/api/auth/login`,
    `https://${MT5_SERVER}/webapi/v1/auth/login`,
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      
      const response = await api.post(endpoint, {
        login: MT5_LOGIN,
        password: MT5_PASSWORD
      });
      
      console.log('✅ SUCCESS! Connected to:', endpoint);
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Connection refused');
      } else if (error.code === 'ETIMEDOUT') {
        console.log('❌ Connection timeout');
      } else if (error.response) {
        console.log(`❌ HTTP ${error.response.status}:`, error.response.data);
      } else {
        console.log('❌ Error:', error.message);
      }
    }
    console.log('');
  }
  
  console.log('⚠️  Could not connect to any endpoint.');
  console.log('\n📋 Next steps:');
  console.log('1. Verify MT5 Web API is enabled on the server');
  console.log('2. Check if firewall allows connections to port 443/8443');
  console.log('3. Contact your MT5 provider for the correct API endpoint\n');
}

testConnection();
