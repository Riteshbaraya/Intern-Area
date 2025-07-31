const axios = require('axios');

const BASE_URL = 'https://intern-area-p721.onrender.com';

async function testRoutes() {
  console.log('🧪 Testing Backend Routes...\n');

  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      url: `${BASE_URL}/health`,
      expectedStatus: 200
    },
    {
      name: 'Get Internships',
      method: 'GET',
      url: `${BASE_URL}/api/internship`,
      expectedStatus: 200
    },
    {
      name: 'Get Jobs',
      method: 'GET',
      url: `${BASE_URL}/api/job`,
      expectedStatus: 200
    },
    {
      name: 'Get Applications (Admin)',
      method: 'GET',
      url: `${BASE_URL}/api/application`,
      expectedStatus: 401 // Should require auth
    },
    {
      name: 'Get Users (Admin)',
      method: 'GET',
      url: `${BASE_URL}/api/admin/user`,
      expectedStatus: 401 // Should require auth
    },
    {
      name: 'Admin Dashboard',
      method: 'GET',
      url: `${BASE_URL}/api/admin/dashboard`,
      expectedStatus: 401 // Should require auth
    },
    {
      name: 'User Login (Invalid)',
      method: 'POST',
      url: `${BASE_URL}/api/auth/login`,
      data: { email: 'test@test.com', password: 'wrong' },
      expectedStatus: 401
    },
    {
      name: 'Admin Login (Invalid)',
      method: 'POST',
      url: `${BASE_URL}/api/auth/admin-login`,
      data: { email: 'admin@test.com', password: 'wrong' },
      expectedStatus: 401
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      
      const config = {
        method: test.method,
        url: test.url,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (test.data) {
        config.data = test.data;
      }

      const response = await axios(config);
      
      if (response.status === test.expectedStatus) {
        console.log(`✅ ${test.name}: ${response.status} (Expected: ${test.expectedStatus})`);
      } else {
        console.log(`⚠️ ${test.name}: ${response.status} (Expected: ${test.expectedStatus})`);
      }
      
      if (response.data && typeof response.data === 'object') {
        console.log(`   Data: ${JSON.stringify(response.data).substring(0, 100)}...`);
      }
      
    } catch (error) {
      if (error.response && error.response.status === test.expectedStatus) {
        console.log(`✅ ${test.name}: ${error.response.status} (Expected: ${test.expectedStatus})`);
      } else {
        console.log(`❌ ${test.name}: ${error.response?.status || 'Network Error'} (Expected: ${test.expectedStatus})`);
        if (error.response?.data) {
          console.log(`   Error: ${JSON.stringify(error.response.data)}`);
        }
      }
    }
    
    console.log('');
  }

  console.log('🧪 Route testing complete!');
}

testRoutes().catch(console.error); 