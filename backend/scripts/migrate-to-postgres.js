#!/usr/bin/env node

const { runMigration } = require('../data/migrate');

console.log('🚀 Starting PostgreSQL Migration...');
console.log('📋 This script will migrate your CSV data to PostgreSQL');
console.log('');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.error('💡 Make sure you have:');
  console.error('   1. Added PostgreSQL addon to your Railway project');
  console.error('   2. Set the DATABASE_URL environment variable');
  console.error('   3. Redeployed your application');
  process.exit(1);
}

console.log('✅ DATABASE_URL is configured');
console.log('');

// Run the migration
runMigration().catch(error => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
}); 