const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAdminDashboard() {
  console.log('🔍 Testing Admin Dashboard (BigInt Fix)...\n');

  try {
    // Step 1: Login as admin
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
      email: 'admin@lms.com',
      password: 'admin123'
    });

    if (loginResponse.data.success && loginResponse.data.access_token) {
      console.log('✅ Admin login successful');
      const token = loginResponse.data.access_token;
      
      // Step 2: Test admin dashboard
      console.log('\n2️⃣ Testing admin dashboard...');
      const dashboardResponse = await axios.get(`${BASE_URL}/api/v1/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Admin dashboard successful!');
      console.log('📊 Dashboard type:', dashboardResponse.data.type);
      console.log('📊 Summary keys:', Object.keys(dashboardResponse.data.summary));
      
      if (dashboardResponse.data.summary.userDistribution) {
        console.log('📊 User distribution:', dashboardResponse.data.summary.userDistribution);
        console.log('✅ BigInt serialization issue fixed!');
      }

      // Step 3: Test auth-status
      console.log('\n3️⃣ Testing auth-status...');
      const authStatusResponse = await axios.get(`${BASE_URL}/api/v1/auth-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Auth status successful:', authStatusResponse.data.message);

    } else {
      console.log('❌ Admin login failed:', loginResponse.data);
    }

  } catch (error) {
    if (error.response) {
      console.log('❌ Error response:', error.response.status, error.response.data);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

async function main() {
  console.log('🚀 Admin Dashboard BigInt Fix Test\n');
  await testAdminDashboard();
}

main().catch(console.error);
