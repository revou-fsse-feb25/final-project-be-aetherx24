const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function checkCurrentCourses() {
  console.log('🔍 Checking Current Courses in Database...\n');

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

      // Step 2: Get all courses with full details
      console.log('\n2️⃣ Getting all courses...');
      const coursesResponse = await axios.get(`${BASE_URL}/api/v1/courses`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (coursesResponse.data && coursesResponse.data.length > 0) {
        console.log(`✅ Found ${coursesResponse.data.length} courses:\n`);
        
        coursesResponse.data.forEach((course, index) => {
          console.log(`${index + 1}. Course: ${course.title}`);
          console.log(`   ID: ${course.id}`);
          console.log(`   Code: ${course.code}`);
          console.log(`   Description: ${course.description}`);
          console.log(`   Teacher: ${course.teacher?.firstName} ${course.teacher?.lastName}`);
          console.log(`   Enrollments: ${course._count?.enrollments || 0}`);
          console.log('');
        });

        // Step 3: Test each course with the lessons endpoint
        console.log('3️⃣ Testing lessons endpoint for each course...\n');
        
        for (const course of coursesResponse.data) {
          try {
            const lessonsResponse = await axios.get(`${BASE_URL}/api/v1/lessons/course/${course.id}`, {
              headers: {
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/json'
              }
            });

            console.log(`✅ ${course.title}: ${lessonsResponse.data.modules.length} modules, ${lessonsResponse.data.modules.reduce((total, mod) => total + mod.lessons.length, 0)} lessons`);
            
          } catch (error) {
            console.log(`❌ ${course.title}: Error - ${error.response?.status} ${error.response?.data?.message}`);
          }
        }

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
  console.log('🚀 Current Courses Check\n');
  
  await checkCurrentCourses();
  
  console.log('\n📋 Summary:');
  console.log('- This shows all current course IDs in your database');
  console.log('- Use these IDs in your frontend instead of old ones');
  console.log('- Each course is tested with the lessons endpoint');
}

main().catch(console.error);
