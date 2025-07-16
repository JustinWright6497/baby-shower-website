# Baby Shower Website Deployment Guide

## Quick & Cheap Deployment Strategy

### 🎯 **Recommended Setup (Free - $5/month)**
- **Frontend**: Vercel (Free)
- **Backend**: Railway ($5/month after free credits)
- **Database**: Keep SQLite or migrate to PlanetScale (Free)

---

## 🚀 **Step 1: Deploy Frontend to Vercel**

### Prerequisites:
1. Push your code to GitHub if not already done
2. Create account at [vercel.com](https://vercel.com)

### Deploy Steps:
1. **Connect GitHub**: Import your repository
2. **Configure Build**:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `cd frontend && npm install`

3. **Environment Variables** (if needed):
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

4. **Deploy**: Vercel will auto-deploy on every push to main branch

---

## 🚀 **Step 2: Deploy Backend to Railway**

### Prerequisites:
1. Create account at [railway.app](https://railway.app)
2. Install Railway CLI: `npm install -g @railway/cli`

### Deploy Steps:
1. **Login**: `railway login`
2. **Initialize**: `railway init` (in your backend directory)
3. **Add Environment Variables**:
   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=3001
   railway variables set SESSION_SECRET=your-secret-key-here
   ```

4. **Deploy**: `railway up`
5. **Custom Domain** (optional): Add in Railway dashboard

### Backend Modifications Needed:
```javascript
// Update server.js for production
const PORT = process.env.PORT || 3001;

// Add CORS for your Vercel domain
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

---

## 🗄️ **Step 3: Database Options**

### Option A: Keep SQLite (Simplest)
- Works for small events (under 100 guests)
- Already configured
- Database file will be in Railway container

### Option B: Migrate to PlanetScale (Recommended)
1. Create account at [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Update backend to use MySQL instead of SQLite

### Option C: Use Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create project
3. Get PostgreSQL connection details
4. Update backend code

---

## 💰 **Cost Breakdown**

### Free Tier Option:
- **Vercel**: $0 (personal projects)
- **Render**: $0 (with limitations - sleeps when idle)
- **PlanetScale**: $0 (5GB free)
- **Total**: **FREE** (but backend may be slow to wake up)

### Recommended Paid Option:
- **Vercel**: $0 (personal projects)
- **Railway**: $5/month (always on, better performance)
- **PlanetScale**: $0 (5GB free)
- **Total**: **$5/month**

---

## 🔧 **Quick Setup Commands**

### 1. Prepare for deployment:
```bash
# In project root
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Update package.json scripts:
```json
{
  "scripts": {
    "build": "cd frontend && npm run build",
    "start": "cd backend && npm start",
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm start\""
  }
}
```

### 3. Create production environment file:
```bash
# backend/.env.production
NODE_ENV=production
DATABASE_PATH=./data/halloween_baby_shower.db
SESSION_SECRET=your-very-secure-random-string-here
```

---

## 🌐 **Alternative Free Options**

### GitHub Pages + Netlify Functions:
- **Frontend**: GitHub Pages (free)
- **Backend**: Netlify Functions (free tier)
- **Database**: Supabase (free tier)

### Firebase Hosting:
- **Full Stack**: Firebase (generous free tier)
- **Database**: Firestore (free tier)
- Requires rewriting backend to use Firebase functions

---

## 📝 **Post-Deployment Checklist**

- [ ] Test RSVP functionality
- [ ] Verify admin login works
- [ ] Check all page navigation
- [ ] Test mobile responsiveness
- [ ] Verify costume contest page loads
- [ ] Test registry links work
- [ ] Ensure database saves data correctly

---

## 🆘 **Troubleshooting**

### Common Issues:
1. **CORS Errors**: Update backend CORS settings
2. **Build Fails**: Check package.json scripts and paths
3. **Database Connection**: Verify connection strings
4. **Session Issues**: Ensure SESSION_SECRET is set

### Quick Fixes:
```bash
# Clear build cache
rm -rf frontend/build frontend/node_modules
cd frontend && npm install && npm run build

# Reset Railway deployment
railway service delete
railway init
```

---

## 🎉 **Go Live!**

Once deployed, you'll have:
- **Frontend URL**: `https://your-app.vercel.app`
- **Backend URL**: `https://your-backend.railway.app`
- **Custom Domain**: Optional upgrade for better branding

**Total Setup Time**: ~30 minutes
**Total Cost**: $0-5/month
**Perfect for**: Baby shower with up to 100+ guests 