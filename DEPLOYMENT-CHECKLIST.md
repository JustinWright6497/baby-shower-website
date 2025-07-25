# Deployment Checklist ✅

## Before Deployment:
- [ ] Run `npm run deploy-prep` to generate secure SESSION_SECRET
- [ ] Push all code to GitHub
- [ ] Test locally: `npm run dev`
- [ ] Update FRONTEND_URL in Railway environment variables

## Vercel Frontend:
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set build command: `cd frontend && npm run build`
- [ ] Set output directory: `frontend/build`
- [ ] Deploy and test

## Railway Backend:
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Add PostgreSQL addon: "New" → "Database" → "Add PostgreSQL"
- [ ] Set environment variables:
  - `NODE_ENV=production` (auto-set by railway.json)
  - `SESSION_SECRET` (auto-generated by deploy-prep script)
  - `FRONTEND_URL=[your-vercel-url]`
  - `DATABASE_URL` (auto-set by PostgreSQL addon)
- [ ] Deploy and test

## PostgreSQL Migration:
- [ ] After deployment, run migration: `railway run npm run migrate:postgres`
- [ ] Or set `RUN_MIGRATION=true` temporarily for automatic migration
- [ ] Verify data migration in admin panel
- [ ] Test RSVP functionality with PostgreSQL

## Post-Deployment:
- [ ] Test RSVP functionality
- [ ] Verify admin access
- [ ] Check all navigation
- [ ] Test on mobile
- [ ] Share URL with guests!

## URLs:
- Frontend: https://your-app.vercel.app
- Backend: https://your-app.railway.app

## Security Notes:
- ✅ SESSION_SECRET is automatically generated and secure
- ✅ PostgreSQL connection uses SSL in production
- ✅ CORS is properly configured for production domains
