# Local Development Setup (CSV Mode)

## Quick Start

Your application is now configured to automatically use CSV files for local development and PostgreSQL for production!

### 1. Start the Backend (CSV Mode)
```bash
cd backend
npm install
npm run dev
```

The server will automatically detect that you're in development mode and use CSV files.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm start
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## How It Works

The application automatically switches between data sources:

- **Local Development** (`NODE_ENV=development` or no `DATABASE_URL`): Uses CSV files
- **Production** (`NODE_ENV=production` + `DATABASE_URL`): Uses PostgreSQL

## Current Data

Your application will use the existing CSV files:
- `backend/data/families.csv` - Family information
- `backend/data/guests.csv` - Guest information  
- `backend/data/rsvps.csv` - RSVP responses

## Testing

1. **Login**: Try logging in with guest names from your CSV files
2. **RSVP**: Submit RSVPs and see them saved to CSV
3. **Admin**: Access admin panel to manage families and guests
4. **Data Persistence**: All changes are saved to CSV files

## Switching to PostgreSQL (Production)

When you're ready to deploy to production:

1. **Railway**: Add PostgreSQL addon to your Railway project
2. **Environment**: Railway will automatically set `DATABASE_URL` and `NODE_ENV=production`
3. **Migration**: Run `railway run npm run update:data` to migrate CSV data to PostgreSQL

## File Structure

```
backend/
├── data/
│   ├── index.js          # Auto-switches between CSV/PostgreSQL
│   ├── csvData.js        # CSV file operations
│   ├── pgData.js         # PostgreSQL operations
│   ├── families.csv      # Family data
│   ├── guests.csv        # Guest data
│   ├── rsvps.csv         # RSVP data
│   └── data.txt          # Updated guest list (for migration)
├── routes/
│   ├── auth.js           # Uses data layer
│   ├── rsvp.js           # Uses data layer
│   └── admin.js          # Uses data layer
└── server.js             # Uses data layer
```

## Benefits

✅ **Simple Local Development**: No database setup required
✅ **Easy Testing**: Use existing CSV data
✅ **Production Ready**: Automatically switches to PostgreSQL
✅ **Data Migration**: Easy migration from CSV to PostgreSQL
✅ **No Code Changes**: Same API endpoints work with both data sources

## Troubleshooting

### CSV Files Not Found
- Make sure you're in the `backend` directory
- Check that CSV files exist in `backend/data/`

### Server Won't Start
- Run `npm install` in the backend directory
- Check that port 5000 is available

### Frontend Can't Connect
- Make sure backend is running on port 5000
- Check that CORS is properly configured

### Data Not Saving
- Check file permissions on CSV files
- Ensure CSV files are writable 