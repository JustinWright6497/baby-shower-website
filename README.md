# Roxanne's Baby Shower Website

A spooky-themed baby shower website with RSVP functionality, featuring witches and bats!

## Features

- Beautiful themed design
- 🔐 Guest authentication (first/last name from invite)
- 📝 RSVP management
- 👑 Admin dashboard for viewing responses
- 📱 Responsive design
- 🎭 Costume party information

## Tech Stack

- **Frontend**: React 18, React Router, Axios
- **Backend**: Node.js, Express.js
- **Data Storage**: CSV Files
- **Authentication**: Express Sessions

## Quick Start

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Start development servers**:
   ```bash
   npm run dev
   ```

   This runs both frontend (http://localhost:3000) and backend (http://localhost:5000) concurrently.

3. **Test the application**:
   - Visit http://localhost:3000
   - Login with sample guest names (see "Test Accounts" below)
   - Admin login: First Name: "Admin", Last Name: "User"

## Test Accounts

Sample guest accounts (First Name / Last Name):
- Emma Smith
- Michael Johnson 
- Sarah Williams
- David Brown
- Jessica Davis

Admin account:
- Admin User (has access to admin dashboard)

## Project Structure

```
├── backend/          # Express API server
│   ├── server.js     # Main server file
│   ├── data/         # CSV data files and operations
│   └── routes/       # API routes
├── frontend/         # React application
│   ├── src/          # React components
│   └── public/       # Static assets
└── package.json      # Root package.json
```

## Pages

- **Login**: Authenticate with first/last name
- **Home**: Baby shower information
- **Party Info**: Event details
- **RSVP**: Guest response form
- **Registries**: Gift registry links
- **Costume Party**: Costume contest info
- **Admin**: RSVP responses (admin only)

## Admin Access

There's one admin user who can access the admin dashboard to view all RSVP responses.

## Development

- Frontend runs on port 3000
- Backend runs on port 5000  
- Data files: `backend/data/families.csv`, `guests.csv`, `rsvps.csv`

### Data Structure

The application uses CSV files for data storage:

**families.csv** - Stores family information
- id, family_name, created_at

**guests.csv** - Stores invited guest information
- id, family_id, first_name, last_name, is_admin, created_at

**rsvps.csv** - Stores RSVP responses
- id, guest_id, will_attend, dietary_restrictions, individual_notes, created_at, updated_at

### API Endpoints

**Authentication**
- POST `/api/auth/login` - Guest login with first/last name
- POST `/api/auth/logout` - Logout
- GET `/api/auth/me` - Check authentication status

**RSVP Management**
- GET `/api/rsvp/family-rsvp` - Get family RSVP data
- POST `/api/rsvp/submit` - Submit/update individual RSVP

**Admin (Admin only)**
- GET `/api/admin/families` - Get all family RSVPs
- GET `/api/admin/stats` - Get RSVP statistics
- POST `/api/admin/add-family` - Add new family with members

## Theme

The website features a classic Halloween aesthetic with:
- Witch and bat motifs
- Dark color scheme (purples, oranges, blacks)
- Spooky fonts (Creepster, Griffy)
- Halloween decorative elements
- Floating bat animations
- Gradient backgrounds with Halloween colors

## Features Implemented

✅ **Authentication System**
- Name-based login (first/last name validation)
- Session management
- Protected routes
- Admin access control

✅ **Pages & Navigation**
- Home page with event information
- Party Info with detailed schedule
- RSVP form with costume preferences
- Gift registries with Halloween wishlist
- Costume contest information
- Admin dashboard for managing responses

✅ **RSVP Management**
- Guest response tracking (attending/not attending)
- Plus one management
- Dietary restrictions
- Costume descriptions for contest
- Notes and special requests

✅ **Admin Dashboard**
- View all RSVP responses
- Real-time statistics
- Costume contest participant list
- Dietary restrictions summary
- Export-ready data tables

✅ **Halloween Theme**
- Spooky color scheme and fonts
- Animated floating bats
- Halloween-themed copy and emojis
- Responsive design
- Baby shower + Halloween fusion

## Adding Guests

To add new guests to the invitation list:

1. Login as admin (admin / SEW051225)
2. Go to Admin Dashboard
3. Use the "Add New Family" functionality to add families with multiple members
4. Or manually edit the CSV files:
   - Add family to `backend/data/families.csv`
   - Add family members to `backend/data/guests.csv` with the family_id

## Customization

- Edit event details in `frontend/src/pages/Home.js` and `PartyInfo.js`
- Update registry links in `frontend/src/pages/Registries.js`
- Modify costume contest rules in `frontend/src/pages/CostumeParty.js` 
- Adjust Halloween theme colors in `frontend/src/App.css`

## Deployment

For production deployment:
1. Set environment variables for session secrets
2. Configure CORS for your domain
3. Ensure CSV data files are properly backed up
4. Enable HTTPS for secure sessions
5. Build frontend: `cd frontend && npm run build` 