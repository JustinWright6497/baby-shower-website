const express = require('express');
const csvData = require('../data/csvData');

const router = express.Router();

// Login route - check first and last name against guest list
router.post('/login', async (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  try {
    const guest = await csvData.findGuestByName(firstName.trim(), lastName.trim());

    if (!guest) {
      return res.status(401).json({ error: 'Guest not found. Please check your name spelling or contact the host.' });
    }

    // Set session data including family context
    req.session.guestId = guest.id;
    req.session.firstName = guest.first_name;
    req.session.lastName = guest.last_name;
    req.session.isAdmin = guest.is_admin;
    req.session.familyId = guest.family_id;
    req.session.familyName = guest.family_name;

    res.json({
      success: true,
      guest: {
        id: guest.id,
        firstName: guest.first_name,
        lastName: guest.last_name,
        isAdmin: guest.is_admin,
        familyId: guest.family_id,
        familyName: guest.family_name
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ success: true });
  });
});

// Check authentication status
router.get('/me', (req, res) => {
  if (req.session && req.session.guestId) {
    res.json({
      authenticated: true,
      guest: {
        id: req.session.guestId,
        firstName: req.session.firstName,
        lastName: req.session.lastName,
        isAdmin: req.session.isAdmin,
        familyId: req.session.familyId,
        familyName: req.session.familyName
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router; 