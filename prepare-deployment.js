#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing for Railway PostgreSQL Deployment...\n');

// Generate a secure session secret
const sessionSecret = crypto.randomBytes(64).toString('hex');
console.log('🔐 Generated secure SESSION_SECRET:');
console.log(sessionSecret);
console.log('');

// Update railway.json with the new secret
const railwayPath = path.join(__dirname, 'railway.json');
const railwayConfig = JSON.parse(fs.readFileSync(railwayPath, 'utf8'));

railwayConfig.environments.production.variables.SESSION_SECRET = sessionSecret;

fs.writeFileSync(railwayPath, JSON.stringify(railwayConfig, null, 2));

console.log('✅ Updated railway.json with secure SESSION_SECRET');
console.log('');

// Deployment checklist
console.log('📋 DEPLOYMENT CHECKLIST:');
console.log('');
console.log('1. 🐘 Add PostgreSQL Addon to Railway:');
console.log('   • Go to Railway dashboard');
console.log('   • Click "New" → "Database" → "Add PostgreSQL"');
console.log('   • Wait for provisioning');
console.log('');
console.log('2. 🚀 Deploy to Railway:');
console.log('   • Push this code to GitHub');
console.log('   • Railway will auto-deploy');
console.log('   • DATABASE_URL will be auto-set');
console.log('');
console.log('3. 📊 Run Migration:');
console.log('   • After deployment, run:');
console.log('   • railway run npm run migrate:postgres');
console.log('');
console.log('4. ✅ Verify Deployment:');
console.log('   • Check health endpoint: /api/health');
console.log('   • Test RSVP functionality');
console.log('   • Verify admin access');
console.log('');
console.log('🎉 Your app will automatically use PostgreSQL in production!');
console.log('📄 CSV files will still work in development.'); 