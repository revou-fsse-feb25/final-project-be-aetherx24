const axios = require('axios');

const BASE_URL = 'https://shanghairevolmsapi.up.railway.app/api/v1';

async function testSingleDashboard() {
  console.log('🔍 Testing Single Dashboard with Logging...\n');

  try {
    // Login as student
    console.log('1️⃣ Logging in as student...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'student1@lms.com',
      password: 'student123'
    });

    if (loginResponse.data.success) {
      const token = loginResponse.data.access_token;
      console.log('✅ Login successful');
      console.log('👤 User:', loginResponse.data.user.fullName);
      console.log('🔑 Token:', token.substring(0, 30) + '...');
      
      // Test dashboard
      console.log('\n2️⃣ Testing dashboard (check backend console for logs)...');
      const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✅ Dashboard response received');
      console.log('📊 Response keys:', Object.keys(dashboardResponse.data));
      console.log('📊 Full response:', JSON.stringify(dashboardResponse.data, null, 2));

    } else {
      console.log('❌ Login failed');
    }

  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

testSingleDashboard();
