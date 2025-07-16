# Deployment Checklist ✅

## Before Deployment:
- [ ] Push all code to GitHub
- [ ] Test locally: `npm run dev`
- [ ] Update FRONTEND_URL in backend .env
- [ ] Generate secure SESSION_SECRET

## Vercel Frontend:
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set build command: `cd frontend && npm run build`
- [ ] Set output directory: `frontend/build`
- [ ] Deploy and test

## Railway Backend:
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Set environment variables:
  - `NODE_ENV=production`
  - `SESSION_SECRET=[secure-random-string]`
  - `FRONTEND_URL=[your-vercel-url]`
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
