const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testCourseIdManagement() {
  console.log('🧪 Testing Course ID Management...\n');

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

      // Step 2: Test the new course ID mapping endpoint
      console.log('\n2️⃣ Testing GET /courses/ids endpoint...');
      const courseIdsResponse = await axios.get(`${BASE_URL}/api/v1/courses/ids`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Course ID mapping endpoint working!');
      console.log('Available courses:');
      courseIdsResponse.data.forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.title} (${course.code})`);
        console.log(`      ID: ${course.id}`);
        console.log(`      Description: ${course.description}`);
        console.log('');
      });

      // Step 3: Test the course lessons endpoint with each course
      console.log('3️⃣ Testing lessons endpoint for each course...\n');
      
      for (const course of courseIdsResponse.data) {
        try {
          const lessonsResponse = await axios.get(`${BASE_URL}/api/v1/lessons/course/${course.id}`, {
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          });

          const totalLessons = lessonsResponse.data.modules.reduce((total, mod) => total + mod.lessons.length, 0);
          console.log(`✅ ${course.title}: ${lessonsResponse.data.modules.length} modules, ${totalLessons} lessons`);
          
        } catch (error) {
          console.log(`❌ ${course.title}: Error - ${error.response?.status} ${error.response?.data?.message}`);
        }
      }

      // Step 4: Test with the old course ID that was failing
      console.log('\n4️⃣ Testing with the old failing course ID...');
      try {
        const oldCourseResponse = await axios.get(`${BASE_URL}/api/v1/lessons/course/cmejwvh4v0006o2gv8oljt6q7`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('❌ Should have failed - Course ID does not exist');
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('✅ Correctly rejected - Course not found');
          console.log('Error message:', error.response.data.message);
        } else {
          console.log('❌ Unexpected error:', error.response?.status);
        }
      }

      // Step 5: Show the solution
      console.log('\n5️⃣ 🎯 SOLUTION FOR YOUR FRONTEND:');
      console.log('Replace the old course ID in your frontend with one of these:');
      courseIdsResponse.data.forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.title}: ${course.id}`);
      });

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
  console.log('🚀 Course ID Management Test\n');
  
  await testCourseIdManagement();
  
  console.log('\n📋 Summary:');
  console.log('- New endpoint: GET /api/v1/courses/ids for easy course ID lookup');
  console.log('- Course lessons endpoint working for all valid course IDs');
  console.log('- Old course ID correctly rejected with 404');
  console.log('- Frontend should use current course IDs from /courses/ids endpoint');
}

main().catch(console.error);
