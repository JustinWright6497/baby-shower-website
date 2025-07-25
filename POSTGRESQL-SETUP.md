# PostgreSQL Migration Setup Guide

## Current Status ✅
- ✅ PostgreSQL package installed (`pg` v8.11.3)
- ✅ Database schema defined in `pgData.js`
- ✅ All routes updated to use PostgreSQL
- ✅ Migration script ready
- ✅ Server configured to initialize PostgreSQL
- ✅ Updated guest list in `data.txt` ready for migration

## Data Status 📊
- **Current data source**: `backend/data/data.txt` (updated guest list)
- **Old CSV files**: Outdated - contains old family/guest information
- **Migration needed**: Import current data from `data.txt` to PostgreSQL

## Steps to Complete Migration

### 1. Add PostgreSQL Addon to Railway
1. Go to your Railway project dashboard
2. Click "New" → "Database" → "Add PostgreSQL"
3. Wait for the addon to be provisioned
4. Railway will automatically set the `DATABASE_URL` environment variable

### 2. Deploy to Railway
```bash
# Commit and push your changes
git add .
git commit -m "Add PostgreSQL migration with updated data.txt"
git push
```

### 3. Run Migration (After Deployment)
Once deployed, you can run the migration in one of two ways:

**Option A: Via Railway CLI (Recommended)**
```bash
# Install Railway CLI if you haven't already
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run migration with current data
railway run npm run update:data
```

**Option B: Via Railway Dashboard**
1. Go to your Railway project
2. Click on your backend service
3. Go to "Variables" tab
4. Add a temporary variable: `RUN_MIGRATION=true`
5. The server will automatically run migration on startup

### 4. Verify Migration
After migration, check your application:
1. Visit your deployed frontend
2. Try logging in with a guest account
3. Check the admin panel to see if data is loaded
4. Test RSVP functionality

### 5. Clean Up (Optional)
Once everything is working:
1. Remove the `RUN_MIGRATION` variable if you used Option B
2. You can delete the old CSV files from your repository (keep backups!)
3. Update your `.gitignore` to exclude CSV files

## Environment Variables Needed

Railway should automatically set these when you add the PostgreSQL addon:
- `DATABASE_URL` - PostgreSQL connection string (auto-set by Railway)

Optional but recommended:
- `SESSION_SECRET` - For session security (already configured)

## Data Migration Details

The migration will:
1. **Parse `data.txt`** - Read the current guest list with family structure
2. **Create PostgreSQL tables** - Set up families, guests, and RSVPs tables
3. **Import current data** - Add all families and guests from your updated list
4. **Skip removed entries** - Ignore families/guests marked with 'x' or '--'
5. **Preserve structure** - Maintain family relationships and member counts

## Key Changes from Old Data
- Updated family names (e.g., "Molly Hemphill" vs "Molly Lalumandier")
- Corrected guest names (e.g., "Sydnee Rust" vs "Sydney Rust")
- Removed families/guests marked for removal
- Added new families and guests

## Troubleshooting

### DATABASE_URL Not Set
- Make sure you've added the PostgreSQL addon to your Railway project
- Check that the addon is properly provisioned
- Redeploy your application after adding the addon

### Migration Fails
- Check Railway logs for detailed error messages
- Ensure your `data.txt` file is properly formatted
- Verify the PostgreSQL addon is running

### Connection Issues
- Check that `NODE_ENV=production` is set (for SSL)
- Verify the `DATABASE_URL` format is correct
- Ensure the PostgreSQL addon is in the same Railway project

## Data Backup

Before running migration:
1. Keep a backup of your current `data.txt` file
2. Keep a backup of your current working system
3. Test the migration locally first if possible

## Rollback Plan

If something goes wrong:
1. Your `data.txt` file is still in the repository
2. You can temporarily switch back to CSV by updating the routes
3. The PostgreSQL addon can be removed from Railway if needed 