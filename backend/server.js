const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://vercel.app',
    'https://*.vercel.app',
    'https://baby-shower-website.vercel.app',
    'https://wrightbabyshower.baby',
    'https://www.wrightbabyshower.baby'
  ],
  credentials: true
}));

app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'halloween-baby-shower-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
const authRoutes = require('./routes/auth');
const rsvpRoutes = require('./routes/rsvp');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/admin', adminRoutes);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  const dataDir = path.join(__dirname, 'data');
  const familiesPath = path.join(dataDir, 'families.csv');
  const guestsPath = path.join(dataDir, 'guests.csv');
  const rsvpsPath = path.join(dataDir, 'rsvps.csv');
  
  const fileStatus = {
    dataDir: {
      exists: fs.existsSync(dataDir),
      path: dataDir
    },
    families: {
      exists: fs.existsSync(familiesPath),
      path: familiesPath,
      size: fs.existsSync(familiesPath) ? fs.statSync(familiesPath).size : 0
    },
    guests: {
      exists: fs.existsSync(guestsPath),
      path: guestsPath,
      size: fs.existsSync(guestsPath) ? fs.statSync(guestsPath).size : 0
    },
    rsvps: {
      exists: fs.existsSync(rsvpsPath),
      path: rsvpsPath,
      size: fs.existsSync(rsvpsPath) ? fs.statSync(rsvpsPath).size : 0
    }
  };

  res.json({ 
    status: 'ok', 
    message: 'Roxanne\'s Baby Shower server is running',
    storage: 'CSV files',
    environment: process.env.NODE_ENV || 'development',
    fileStatus 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log('Roxanne\'s Baby Shower server running on port', PORT);
  console.log('📁 Using CSV file storage');
  console.log('🎯 Frontend should be running on http://localhost:3000');
});

module.exports = app; 