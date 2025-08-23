const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEdgeCases() {
  console.log('🧪 Testing Edge Cases...\n');

  try {
    // Step 1: Login as admin
    console.log('1️⃣ Logging in as admin...');
    const adminLoginResponse = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
      email: 'admin@lms.com',
      password: 'admin123'
    });

    if (adminLoginResponse.data.access_token) {
      const adminToken = adminLoginResponse.data.access_token;
      console.log('✅ Admin login successful');

      // Step 2: Test invalid role change (same role)
      console.log('\n2️⃣ Testing invalid role change (same role)...');
      try {
        const roleChangeResponse = await axios.patch(`${BASE_URL}/api/v1/users/cmemt3wyy00031xigxewnauk4/role`, {
          role: 'TEACHER' // Already a teacher
        }, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('❌ Should have failed - user already has this role');
      } catch (error) {
        if (error.response?.status === 400) {
          console.log('✅ Correctly rejected - User already has this role');
          console.log('Error:', error.response.data);
        } else {
          console.log('❌ Unexpected error:', error.response?.status);
        }
      }

      // Step 3: Test role change with reason
      console.log('\n3️⃣ Testing role change with reason...');
      try {
        const roleChangeResponse = await axios.patch(`${BASE_URL}/api/v1/users/cmemt3wyy00031xigxewnauk4/role`, {
          role: 'STUDENT',
          reason: 'Demoted due to performance issues'
        }, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ Role change successful!');
        console.log('Response:', roleChangeResponse.data.message);
        console.log('Reason:', roleChangeResponse.data.reason);
        console.log('New role:', roleChangeResponse.data.user.role);
        
      } catch (error) {
        console.log('❌ Role change failed:', error.response?.status, error.response?.data);
      }

      // Step 4: Test admin limit (try to create another admin)
      console.log('\n4️⃣ Testing admin limit...');
      try {
        const createAdminResponse = await axios.post(`${BASE_URL}/api/v1/users`, {
          email: 'anotheradmin@lms.com',
          password: 'admin123',
          firstName: 'Another',
          lastName: 'Admin',
          role: 'ADMIN'
        }, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ Another admin created successfully');
        console.log('New admin:', createAdminResponse.data);
        
      } catch (error) {
        if (error.response?.status === 400) {
          console.log('✅ Correctly rejected - Admin limit reached');
          console.log('Error:', error.response.data);
        } else {
          console.log('❌ Unexpected error:', error.response?.status);
        }
      }

    } else {
      console.log('❌ Admin login failed');
    }

  } catch (error) {
    if (error.response) {
      console.log('❌ Error response:', error.response.status);
      console.log('Error data:', error.response.data);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

async function main() {
  console.log('🚀 Edge Cases Test\n');
  
  await testEdgeCases();
  
  console.log('\n📋 Summary:');
  console.log('- Invalid role changes should be rejected');
  console.log('- Role changes with reasons should work');
  console.log('- Admin limits should be enforced');
}

main().catch(console.error);
