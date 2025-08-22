const axios = require('axios');

const BASE_URL = 'https://shanghairevolmsapi.up.railway.app/api/v1';

async function testRoleBasedDashboards() {
  console.log('🔍 Testing Role-Based Dashboards...\n');

  const testUsers = [
    { email: 'student1@lms.com', password: 'student123', role: 'STUDENT' },
    { email: 'teacher1@lms.com', password: 'teacher123', role: 'TEACHER' },
    { email: 'admin@lms.com', password: 'admin123', role: 'ADMIN' }
  ];

  for (const user of testUsers) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧑‍💼 Testing ${user.role} Dashboard`);
    console.log(`${'='.repeat(60)}`);

    try {
      // Login
      console.log(`\n1️⃣ Logging in as ${user.email}...`);
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: user.email,
        password: user.password
      });

      if (loginResponse.data.success) {
        const token = loginResponse.data.access_token;
        console.log(`✅ Login successful for ${user.role}`);
        console.log(`👤 User: ${loginResponse.data.user.fullName}`);
        console.log(`🔑 Token: ${token.substring(0, 30)}...`);

        // Test dashboard
        console.log(`\n2️⃣ Testing ${user.role} dashboard...`);
        const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log(`✅ Dashboard access successful!`);
        console.log(`📊 Dashboard Type: ${dashboardResponse.data.type}`);
        console.log(`📈 Summary:`, JSON.stringify(dashboardResponse.data.summary, null, 2));

        // Show role-specific data
        switch (user.role) {
          case 'STUDENT':
            console.log(`📚 Recent Enrollments: ${dashboardResponse.data.recentEnrollments?.length || 0}`);
            console.log(`📋 Recent Assignments: ${dashboardResponse.data.recentAssignments?.length || 0}`);
            console.log(`📤 Recent Submissions: ${dashboardResponse.data.recentSubmissions?.length || 0}`);
            console.log(`📊 Recent Grades: ${dashboardResponse.data.recentGrades?.length || 0}`);
            break;
          
          case 'TEACHER':
            console.log(`📚 Courses: ${dashboardResponse.data.courses?.length || 0}`);
            console.log(`⏳ Pending Submissions: ${dashboardResponse.data.pendingSubmissions?.length || 0}`);
            console.log(`📊 Recent Grades: ${dashboardResponse.data.recentGrades?.length || 0}`);
            console.log(`📅 Upcoming Due Dates: ${dashboardResponse.data.upcomingDueDates?.length || 0}`);
            break;
          
          case 'ADMIN':
            console.log(`👥 Recent Users: ${dashboardResponse.data.recentUsers?.length || 0}`);
            console.log(`📚 Recent Courses: ${dashboardResponse.data.recentCourses?.length || 0}`);
            console.log(`🖥️ System Health: ${dashboardResponse.data.systemHealth ? 'Available' : 'Not Available'}`);
            break;
        }

      } else {
        console.log(`❌ Login failed for ${user.role}`);
      }

    } catch (error) {
      console.log(`❌ Error testing ${user.role} dashboard:`);
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('🎯 Role-Based Dashboard Testing Complete!');
  console.log(`${'='.repeat(60)}`);
}

// Run the test
testRoleBasedDashboards();
