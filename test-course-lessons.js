const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testCourseLessons() {
  console.log('🧪 Testing Course Lessons Endpoint...\n');

  try {
    // Step 1: Login as admin to get a token
    console.log('1️⃣ Logging in as admin...');
    const adminLoginResponse = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
      email: 'admin@lms.com',
      password: 'admin123'
    });

    if (adminLoginResponse.data.access_token) {
      const adminToken = adminLoginResponse.data.access_token;
      console.log('✅ Admin login successful');

      // Step 2: Get all courses to find a valid course ID
      console.log('\n2️⃣ Getting all courses...');
      const coursesResponse = await axios.get(`${BASE_URL}/api/v1/courses`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (coursesResponse.data && coursesResponse.data.length > 0) {
        const courseId = coursesResponse.data[0].id;
        console.log(`✅ Found course: ${coursesResponse.data[0].title} (ID: ${courseId})`);

        // Step 3: Test the new course lessons endpoint
        console.log('\n3️⃣ Testing GET /lessons/course/:courseId...');
        const courseLessonsResponse = await axios.get(`${BASE_URL}/api/v1/lessons/course/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ Course lessons endpoint working!');
        console.log('Response structure:');
        console.log('- Course:', courseLessonsResponse.data.course.title);
        console.log('- Modules count:', courseLessonsResponse.data.modules.length);
        
        if (courseLessonsResponse.data.modules.length > 0) {
          const firstModule = courseLessonsResponse.data.modules[0];
          console.log('- First module:', firstModule.title);
          console.log('- Lessons in first module:', firstModule.lessons.length);
        }

        // Step 4: Test with invalid course ID
        console.log('\n4️⃣ Testing with invalid course ID...');
        try {
          const invalidResponse = await axios.get(`${BASE_URL}/api/v1/lessons/course/invalid-id`, {
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

        // Step 5: Test the exact URL that was failing
        console.log('\n5️⃣ Testing the exact URL that was failing...');
        const exactUrlResponse = await axios.get(`${BASE_URL}/api/v1/lessons/course/cmejwvh4v0006o2gv8oljt6q7`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ Exact URL now working!');
        console.log('Course:', exactUrlResponse.data.course.title);
        console.log('Modules:', exactUrlResponse.data.modules.length);

      } else {
        console.log('❌ No courses found in the system');
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
  console.log('🚀 Course Lessons Endpoint Test\n');
  
  await testCourseLessons();
  
  console.log('\n📋 Summary:');
  console.log('- New endpoint: GET /api/v1/lessons/course/:courseId');
  console.log('- Returns course info with modules and lessons');
  console.log('- Properly handles invalid course IDs');
  console.log('- Should fix the 404 error you were experiencing');
}

main().catch(console.error);
