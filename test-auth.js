const axios = require('axios');

const BASE_URL = 'https://shanghairevolmsapi.up.railway.app/api/v1';

async function testAuthFlow() {
  console.log('🔍 Testing JWT Authentication Flow...\n');

  try {
    // Step 1: Test if backend is responding
    console.log('1️⃣ Testing backend connectivity...');
    try {
      const healthCheck = await axios.get(`${BASE_URL.replace('/api/v1', '')}/health`);
      console.log('✅ Backend is responding:', healthCheck.status);
    } catch (error) {
      console.log('❌ Backend health check failed:', error.message);
    }

    // Step 2: Test login endpoint with VALID credentials
    console.log('\n2️⃣ Testing login endpoint...');
    const loginData = {
      email: 'student1@lms.com',
      password: 'student123'
    };

    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
      console.log('✅ Login successful!');
      console.log('Response status:', loginResponse.status);
      console.log('Response data:', JSON.stringify(loginResponse.data, null, 2));
      
      const token = loginResponse.data.access_token;
      console.log('\n🔑 JWT Token received:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      
      if (token) {
        // Step 3: Test token validation with dashboard
        console.log('\n3️⃣ Testing token validation with dashboard...');
        try {
          const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('✅ Dashboard access successful!');
          console.log('Response status:', dashboardResponse.status);
          console.log('Response data:', JSON.stringify(dashboardResponse.data, null, 2));
        } catch (error) {
          console.log('❌ Dashboard access failed:');
          console.log('Status:', error.response?.status);
          console.log('Error:', error.response?.data || error.message);
        }

        // Step 4: Test auth-status endpoint
        console.log('\n4️⃣ Testing auth-status endpoint...');
        try {
          const authStatusResponse = await axios.get(`${BASE_URL}/auth-status`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('✅ Auth status check successful!');
          console.log('Response:', JSON.stringify(authStatusResponse.data, null, 2));
        } catch (error) {
          console.log('❌ Auth status check failed:');
          console.log('Status:', error.response?.status);
          console.log('Error:', error.response?.data || error.message);
        }

        // Step 5: Test user profile endpoint
        console.log('\n5️⃣ Testing user profile endpoint...');
        try {
          const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('✅ User profile access successful!');
          console.log('Response:', JSON.stringify(profileResponse.data, null, 2));
        } catch (error) {
          console.log('❌ User profile access failed:');
          console.log('Status:', error.response?.status);
          console.log('Error:', error.response?.data || error.message);
        }
      }
      
    } catch (error) {
      console.log('❌ Login failed:');
      console.log('Status:', error.response?.status);
      console.log('Error:', error.response?.data || error.message);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

// Run the test
testAuthFlow();
