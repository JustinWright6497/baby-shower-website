const express = require('express');
const csvData = require('../data/csvData');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Get family RSVP data showing all family members and their individual RSVP statuses
router.get('/family-rsvp', requireAuth, async (req, res) => {
  try {
    const familyGuests = await csvData.getGuestsByFamily(req.session.familyId);
    const rsvps = await csvData.getRsvps();
    
    const familyData = {
      familyName: req.session.familyName,
      familyId: req.session.familyId,
      currentGuestId: req.session.guestId,
      members: []
    };

    for (const guest of familyGuests) {
      const rsvp = rsvps.find(r => r.guest_id === guest.id);
      
      familyData.members.push({
        guestId: guest.id,
        firstName: guest.first_name,
        lastName: guest.last_name,
        rsvp: rsvp ? {
          id: rsvp.id,
          willAttend: rsvp.will_attend,
          dietaryRestrictions: rsvp.dietary_restrictions,
          individualNotes: rsvp.individual_notes,
          createdAt: rsvp.created_at,
          updatedAt: rsvp.updated_at
        } : null
      });
    }

    res.json({ familyData });
  } catch (error) {
    console.error('Error getting family RSVP:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get individual guest's RSVP (for backwards compatibility)
router.get('/my-rsvp', requireAuth, async (req, res) => {
  try {
    const guests = await csvData.getGuests();
         const rsvp = await csvData.findRsvpByGuestId(req.session.guestId);

    const guest = guests.find(g => g.id === req.session.guestId);

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    res.json({
      rsvp: rsvp ? {
        id: rsvp.id,
        guestId: rsvp.guest_id,
        willAttend: rsvp.will_attend,
        dietaryRestrictions: rsvp.dietary_restrictions,
        individualNotes: rsvp.individual_notes,
        createdAt: rsvp.created_at,
        updatedAt: rsvp.updated_at
      } : null
    });
  } catch (error) {
    console.error('Error getting my RSVP:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit or update individual RSVP (can be for any family member)
router.post('/submit', requireAuth, async (req, res) => {
  const {
    guestId, // Allow RSVPing for other family members
    willAttend,
    dietaryRestrictions,
    individualNotes
  } = req.body;

  if (willAttend === undefined) {
    return res.status(400).json({ error: 'Please specify if you will attend' });
  }

  try {
    // Use current guest ID if not specified, or validate family membership
    const targetGuestId = guestId || req.session.guestId;

    // Verify the target guest is in the same family (or is the current user)
    const guests = await csvData.getGuests();
    const targetGuest = guests.find(g => g.id === parseInt(targetGuestId));
    const currentGuest = guests.find(g => g.id === req.session.guestId);

    if (!targetGuest || 
        (targetGuest.family_id !== currentGuest.family_id && targetGuestId !== req.session.guestId)) {
      return res.status(403).json({ error: 'You can only RSVP for members of your family' });
    }

    // Save the RSVP
    await csvData.saveRsvp(
      targetGuestId,
      willAttend,
      dietaryRestrictions || '',
      individualNotes || ''
    );

    res.json({ 
      success: true, 
      message: 'RSVP saved successfully',
      guestName: `${targetGuest.first_name} ${targetGuest.last_name}`
    });

  } catch (error) {
    console.error('Error saving RSVP:', error);
    res.status(500).json({ error: 'Server error saving RSVP' });
  }
});

module.exports = router; 