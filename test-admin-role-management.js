const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAdminRoleManagement() {
  console.log('🧪 Testing Admin Role Management...\n');

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

      // Step 2: Test admin-only endpoints
      console.log('\n2️⃣ Testing admin-only endpoints...');
      
      // Test GET /users (should work for admin)
      try {
        const usersResponse = await axios.get(`${BASE_URL}/api/v1/users`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ GET /users successful - Admin can view all users');
        console.log(`Total users: ${usersResponse.data.length}`);
      } catch (error) {
        console.log('❌ GET /users failed:', error.response?.status, error.response?.data);
      }

      // Step 3: Test role change functionality
      console.log('\n3️⃣ Testing role change functionality...');
      
      // Find a student to promote
      const usersResponse = await axios.get(`${BASE_URL}/api/v1/users`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const studentUser = usersResponse.data.find(user => user.role === 'STUDENT');
      if (studentUser) {
        console.log(`Found student: ${studentUser.email} (ID: ${studentUser.id})`);
        
        // Test role change from STUDENT to TEACHER
        try {
          const roleChangeResponse = await axios.patch(`${BASE_URL}/api/v1/users/${studentUser.id}/role`, {
            role: 'TEACHER',
            reason: 'Promoted due to qualifications'
          }, {
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('✅ Role change successful!');
          console.log('Response:', roleChangeResponse.data.message);
          console.log('New role:', roleChangeResponse.data.user.role);
          
        } catch (error) {
          console.log('❌ Role change failed:', error.response?.status, error.response?.data);
        }
      }

      // Step 4: Test admin-only user creation
      console.log('\n4️⃣ Testing admin-only user creation...');
      try {
        const createUserResponse = await axios.post(`${BASE_URL}/api/v1/users`, {
          email: 'newadmin@lms.com',
          password: 'admin123',
          firstName: 'New',
          lastName: 'Admin',
          role: 'ADMIN'
        }, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ Admin user creation successful!');
        console.log('New user:', createUserResponse.data);
        
      } catch (error) {
        console.log('❌ Admin user creation failed:', error.response?.status, error.response?.data);
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

async function testNonAdminAccess() {
  console.log('\n🔍 Testing Non-Admin Access Restrictions...\n');

  try {
    // Step 1: Login as student
    console.log('1️⃣ Logging in as student...');
    const studentLoginResponse = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
      email: 'student1@lms.com',
      password: 'student123'
    });

    if (studentLoginResponse.data.access_token) {
      const studentToken = studentLoginResponse.data.access_token;
      console.log('✅ Student login successful');

      // Step 2: Test that student cannot access admin endpoints
      console.log('\n2️⃣ Testing student access restrictions...');
      
      // Test GET /users (should fail for student)
      try {
        const usersResponse = await axios.get(`${BASE_URL}/api/v1/users`, {
          headers: {
            'Authorization': `Bearer ${studentToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('❌ GET /users should have failed for student!');
      } catch (error) {
        if (error.response?.status === 403) {
          console.log('✅ GET /users correctly blocked for student - Admin access required');
        } else {
          console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
        }
      }

      // Test role change (should fail for student)
      try {
        const roleChangeResponse = await axios.patch(`${BASE_URL}/api/v1/users/any-id/role`, {
          role: 'TEACHER'
        }, {
          headers: {
            'Authorization': `Bearer ${studentToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('❌ Role change should have failed for student!');
      } catch (error) {
        if (error.response?.status === 403) {
          console.log('✅ Role change correctly blocked for student - Admin access required');
        } else {
          console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
        }
      }

    } else {
      console.log('❌ Student login failed');
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
  console.log('🚀 Admin Role Management Test\n');
  
  await testAdminRoleManagement();
  await testNonAdminAccess();
  
  console.log('\n📋 Summary:');
  console.log('- Admin endpoints should be accessible only to admins');
  console.log('- Non-admin users should get 403 Forbidden errors');
  console.log('- Role changes should work for admins');
  console.log('- User creation should work for admins');
}

main().catch(console.error);
