const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testModulesEndpoint() {
  console.log('🧪 Testing New Modules Endpoint...\n');

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

      // Step 2: Test the new modules endpoint
      console.log('\n2️⃣ Testing GET /modules/course/:courseId endpoint...');
      const courseId = 'cmemt3x0b00081xig1fprhuvw'; // Web Development Fundamentals
      
      const modulesResponse = await axios.get(`${BASE_URL}/api/v1/modules/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Modules endpoint working!');
      console.log('Response structure:');
      console.log('- Course:', modulesResponse.data.course.title);
      console.log('- Modules count:', modulesResponse.data.modules.length);
      
      if (modulesResponse.data.modules.length > 0) {
        const firstModule = modulesResponse.data.modules[0];
        console.log('- First module:', firstModule.title);
        console.log('- Lessons in first module:', firstModule.lessons.length);
      }

      // Step 3: Test with the other course
      console.log('\n3️⃣ Testing with Introduction to Computer Science...');
      const courseId2 = 'cmemt3x0900061xign3j7y031';
      
      const modulesResponse2 = await axios.get(`${BASE_URL}/api/v1/modules/course/${courseId2}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Second course working!');
      console.log('- Course:', modulesResponse2.data.course.title);
      console.log('- Modules count:', modulesResponse2.data.modules.length);

      // Step 4: Test with invalid course ID
      console.log('\n4️⃣ Testing with invalid course ID...');
      try {
        const invalidResponse = await axios.get(`${BASE_URL}/api/v1/modules/course/invalid-id`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('❌ Should have failed with invalid course ID');
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('✅ Correctly rejected - Course not found');
          console.log('Error message:', error.response.data.message);
        } else {
          console.log('❌ Unexpected error:', error.response?.status);
        }
      }

      // Step 5: Show the solution
      console.log('\n5️⃣ 🎯 SOLUTION:');
      console.log('Your frontend can now use:');
      console.log(`   GET /api/v1/modules/course/${courseId}`);
      console.log(`   GET /api/v1/modules/course/${courseId2}`);

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
  console.log('🚀 Modules Endpoint Test\n');
  
  await testModulesEndpoint();
  
  console.log('\n📋 Summary:');
  console.log('- New endpoint: GET /api/v1/modules/course/:courseId');
  console.log('- Returns course info with modules and lessons');
  console.log('- Should fix the 404 error you were experiencing');
  console.log('- Both endpoints now available: /lessons/course/:id and /modules/course/:id');
}

main().catch(console.error);
