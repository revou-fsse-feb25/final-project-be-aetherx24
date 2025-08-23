const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testNewUserLogin() {
  console.log('🔍 Testing New User Login Issue...\n');

  try {
    // Step 1: Test backend connectivity
    console.log('1️⃣ Testing backend connectivity...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Backend is responding:', healthResponse.data);

    // Step 2: Try to login with the new user credentials
    console.log('\n2️⃣ Testing login with new user...');
    console.log('Email: johnfreeman@lms.com');
    console.log('Password: user123');
    
    const loginResponse = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
      email: 'johnfreeman@lms.com',
      password: 'user123'
    });

    console.log('✅ Login successful!');
    console.log('Response status:', loginResponse.status);
    console.log('Response data:', JSON.stringify(loginResponse.data, null, 2));

    if (loginResponse.data.access_token) {
      const token = loginResponse.data.access_token;
      console.log('\n🔑 JWT Token received:', token.substring(0, 50) + '...');

      // Step 3: Test the token with dashboard
      console.log('\n3️⃣ Testing token with dashboard...');
      const dashboardResponse = await axios.get(`${BASE_URL}/api/v1/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Dashboard access successful!');
      console.log('Dashboard type:', dashboardResponse.data.type);
      console.log('User role:', dashboardResponse.data.summary?.userRole || 'Not specified');

      // Step 4: Test auth-status endpoint
      console.log('\n4️⃣ Testing auth-status endpoint...');
      const authStatusResponse = await axios.get(`${BASE_URL}/api/v1/auth-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Auth status successful:', authStatusResponse.data.message);
      console.log('User info:', authStatusResponse.data.user);

    } else {
      console.log('❌ No access token in response');
    }

  } catch (error) {
    if (error.response) {
      console.log('❌ Error response:', error.response.status);
      console.log('Error data:', error.response.data);
      
      if (error.response.status === 401) {
        console.log('\n🔍 401 Unauthorized - Possible issues:');
        console.log('- Invalid email/password combination');
        console.log('- User not found in database');
        console.log('- Password hashing issue');
        console.log('- JWT configuration problem');
      }
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

async function testExistingUserLogin() {
  console.log('\n🔍 Testing Existing User Login for Comparison...\n');

  try {
    // Test with a known working user
    console.log('Testing with existing user: student1@lms.com');
    
    const loginResponse = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
      email: 'student1@lms.com',
      password: 'student123'
    });

    console.log('✅ Existing user login successful!');
    console.log('Response status:', loginResponse.status);
    
    if (loginResponse.data.access_token) {
      console.log('✅ Access token received');
      
      // Test dashboard access
      const token = loginResponse.data.access_token;
      const dashboardResponse = await axios.get(`${BASE_URL}/api/v1/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Dashboard access successful for existing user');
      console.log('Dashboard type:', dashboardResponse.data.type);
    }

  } catch (error) {
    if (error.response) {
      console.log('❌ Existing user login failed:', error.response.status, error.response.data);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

async function main() {
  console.log('🚀 New User Login Debug Test\n');
  
  await testNewUserLogin();
  await testExistingUserLogin();
  
  console.log('\n📋 Summary:');
  console.log('- If new user login fails but existing user works, there\'s a user creation issue');
  console.log('- If both fail, there\'s a backend authentication problem');
  console.log('- Check the specific error messages above for clues');
}

main().catch(console.error);
