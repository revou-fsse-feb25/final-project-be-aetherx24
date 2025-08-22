const axios = require('axios');

const BASE_URL = 'https://shanghairevolmsapi.up.railway.app/api/v1';

async function debugJWT() {
  console.log('🔍 Debugging JWT Payload...\n');

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
      console.log('🔑 Token:', token.substring(0, 50) + '...');
      
      // Decode JWT (without verification for debugging)
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('\n📋 JWT Payload:');
        console.log('   sub:', payload.sub);
        console.log('   email:', payload.email);
        console.log('   role:', payload.role);
        console.log('   iat:', payload.iat);
        console.log('   exp:', payload.exp);
      }

      // Test dashboard and see what req.user contains
      console.log('\n2️⃣ Testing dashboard to see req.user...');
      const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✅ Dashboard response received');
      console.log('📊 Dashboard data keys:', Object.keys(dashboardResponse.data));
      
      // Test auth-status to see user info
      console.log('\n3️⃣ Testing auth-status to see user info...');
      const authStatusResponse = await axios.get(`${BASE_URL}/auth-status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✅ Auth status response:');
      console.log('   authenticated:', authStatusResponse.data.authenticated);
      console.log('   user:', authStatusResponse.data.user);
      console.log('   message:', authStatusResponse.data.message);

    } else {
      console.log('❌ Login failed');
    }

  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

debugJWT();
