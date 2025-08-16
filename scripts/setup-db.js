#!/usr/bin/env node

/**
 * Database Setup Script for LMS Backend
 * This script helps you set up your PostgreSQL database for the LMS project
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 LMS Backend Database Setup');
console.log('==============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('Please create a .env file with your database configuration.');
  console.log('You can copy from config.env and update the values.\n');
  process.exit(1);
}

// Check if DATABASE_URL is set
const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('DATABASE_URL=')) {
  console.log('❌ DATABASE_URL not found in .env file!');
  console.log('Please add your PostgreSQL connection string to .env file.\n');
  process.exit(1);
}

console.log('✅ Environment configuration found');
console.log('📦 Installing dependencies...\n');

try {
  // Install dependencies
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully\n');
} catch (error) {
  console.log('❌ Failed to install dependencies');
  process.exit(1);
}

console.log('🗄️ Setting up database...\n');

try {
  // Generate Prisma client
  console.log('1. Generating Prisma client...');
  execSync('npm run db:generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated\n');

  // Push schema to database
  console.log('2. Pushing database schema...');
  execSync('npm run db:push', { stdio: 'inherit' });
  console.log('✅ Database schema pushed successfully\n');

} catch (error) {
  console.log('❌ Database setup failed!');
  console.log('Please check your database connection and try again.');
  console.log('Make sure PostgreSQL is running and accessible.');
  process.exit(1);
}

console.log('🎉 Database setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start the application: npm run start:dev');
console.log('2. Access API documentation: http://localhost:3000/api');
console.log('3. Test the API endpoints');
console.log('\n🚀 Happy coding!');
