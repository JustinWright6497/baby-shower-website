#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing Baby Shower Website for Deployment...\n');

// 1. Update backend server.js for production
console.log('✅ Configuring backend for production...');

const serverPath = path.join(__dirname, 'backend', 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Check if production config already exists
if (!serverContent.includes('process.env.PORT')) {
  console.log('   → Updating PORT configuration');
  serverContent = serverContent.replace(
    'const PORT = 3001;',
    'const PORT = process.env.PORT || 3001;'
  );
}

// Update CORS for production
if (!serverContent.includes('process.env.FRONTEND_URL')) {
  console.log('   → Updating CORS configuration');
  serverContent = serverContent.replace(
    /app\.use\(cors\(\{[\s\S]*?\}\)\);/,
    `app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));`
  );
}

fs.writeFileSync(serverPath, serverContent);

// 2. Create .env.example file
console.log('✅ Creating environment example file...');
const envExample = `# Backend Environment Variables
NODE_ENV=production
PORT=3001
SESSION_SECRET=your-super-secret-session-key-change-this
DATABASE_PATH=./data/halloween_baby_shower.db
FRONTEND_URL=https://your-vercel-app.vercel.app

# Optional: If using hosted database
# DATABASE_URL=your-database-connection-string
`;

fs.writeFileSync(path.join(__dirname, 'backend', '.env.example'), envExample);

// 3. Update root package.json
console.log('✅ Updating root package.json...');
const rootPackagePath = path.join(__dirname, 'package.json');
let rootPackage = {};

if (fs.existsSync(rootPackagePath)) {
  rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
}

rootPackage.name = rootPackage.name || 'baby-shower-website';
rootPackage.version = rootPackage.version || '1.0.0';
rootPackage.scripts = {
  ...rootPackage.scripts,
  "build": "cd frontend && npm install && npm run build",
  "start": "cd backend && npm start",
  "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm start\"",
  "install-all": "npm install && cd frontend && npm install && cd ../backend && npm install",
  "deploy-prep": "node prepare-deployment.js"
};

fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2));

// 4. Create Railway deployment config
console.log('✅ Creating Railway configuration...');
const railwayConfig = {
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "restartPolicyType": "ON_FAILURE"
  }
};

fs.writeFileSync(path.join(__dirname, 'railway.json'), JSON.stringify(railwayConfig, null, 2));

// 5. Create deployment checklist
console.log('✅ Creating deployment checklist...');
const checklist = `# Deployment Checklist ✅

## Before Deployment:
- [ ] Push all code to GitHub
- [ ] Test locally: \`npm run dev\`
- [ ] Update FRONTEND_URL in backend .env
- [ ] Generate secure SESSION_SECRET

## Vercel Frontend:
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set build command: \`cd frontend && npm run build\`
- [ ] Set output directory: \`frontend/build\`
- [ ] Deploy and test

## Railway Backend:
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Set environment variables:
  - \`NODE_ENV=production\`
  - \`SESSION_SECRET=[secure-random-string]\`
  - \`FRONTEND_URL=[your-vercel-url]\`
- [ ] Deploy and test

## Post-Deployment:
- [ ] Test RSVP functionality
- [ ] Verify admin access
- [ ] Check all navigation
- [ ] Test on mobile
- [ ] Share URL with guests!

## URLs:
- Frontend: https://your-app.vercel.app
- Backend: https://your-app.railway.app
`;

fs.writeFileSync(path.join(__dirname, 'DEPLOYMENT-CHECKLIST.md'), checklist);

console.log('\n🎉 Deployment preparation complete!');
console.log('\n📋 Next steps:');
console.log('1. Review DEPLOYMENT-CHECKLIST.md');
console.log('2. Push to GitHub: git add . && git commit -m "Prepare for deployment" && git push');
console.log('3. Deploy frontend to Vercel');
console.log('4. Deploy backend to Railway');
console.log('5. Update environment variables');
console.log('\n💰 Expected cost: $0-5/month');
console.log('🕐 Setup time: ~30 minutes');
console.log('\nGood luck with the baby shower! 🍼✨'); 