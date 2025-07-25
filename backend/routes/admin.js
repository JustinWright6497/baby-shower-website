const express = require('express');
const data = require('../data');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all family RSVPs for admin view
router.get('/families', requireAdmin, async (req, res) => {
  try {
    const families = await data.getFamilies();
    const guests = await data.getGuests();
    const rsvps = await data.getRsvps();
    
    // Group data by family
    const familiesMap = new Map();
    
    families.forEach(family => {
      if (family.family_name !== 'Admin Family') { // Exclude admin family from display
        familiesMap.set(family.id, {
          familyId: family.id,
          familyName: family.family_name,
          members: []
        });
      }
    });

    guests.forEach(guest => {
      if (!guest.is_admin && familiesMap.has(guest.family_id)) {
        const rsvp = rsvps.find(r => r.guest_id === guest.id);
        
        const family = familiesMap.get(guest.family_id);
        family.members.push({
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
    });

    const familiesArray = Array.from(familiesMap.values());
    res.json({ families: familiesArray });
  } catch (error) {
    console.error('Error getting families for admin:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get legacy RSVP format for backwards compatibility
router.get('/rsvps', requireAdmin, async (req, res) => {
  try {
    const families = await data.getFamilies();
    const guests = await data.getGuests();
    const rsvps = await data.getRsvps();
    
    const rsvpData = guests
      .filter(guest => !guest.is_admin)
      .map(guest => {
        const family = families.find(f => f.id === guest.family_id);
        const rsvp = rsvps.find(r => r.guest_id === guest.id);
        
        return {
          guest: {
            id: guest.id,
            firstName: guest.first_name,
            lastName: guest.last_name,
            familyName: family ? family.family_name : 'Unknown'
          },
          rsvp: rsvp ? {
            willAttend: rsvp.will_attend,
            dietaryRestrictions: rsvp.dietary_restrictions,
            notes: rsvp.individual_notes,
            createdAt: rsvp.created_at,
            updatedAt: rsvp.updated_at
          } : null
        };
      });

    res.json({ rsvps: rsvpData });
  } catch (error) {
    console.error('Error getting RSVPs for admin:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get RSVP statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const guests = await data.getGuests();
    const rsvps = await data.getRsvps();
    const families = await data.getFamilies();
    
    const nonAdminGuests = guests.filter(g => !g.is_admin);
    const attendingRsvps = rsvps.filter(r => r.will_attend);
    const notAttendingRsvps = rsvps.filter(r => !r.will_attend);
    const pendingGuests = nonAdminGuests.filter(g => !rsvps.find(r => r.guest_id === g.id));
    
    // Calculate total responses (guests who have submitted an RSVP)
    const totalResponses = nonAdminGuests.filter(g => rsvps.find(r => r.guest_id === g.id)).length;
    
    // Family stats
    const familyStats = families
      .filter(f => f.family_name !== 'Admin Family')
      .map(family => {
        const familyGuests = nonAdminGuests.filter(g => g.family_id === family.id);
        const familyRsvps = familyGuests.map(g => rsvps.find(r => r.guest_id === g.id)).filter(Boolean);
        const attending = familyRsvps.filter(r => r.will_attend).length;
        const notAttending = familyRsvps.filter(r => !r.will_attend).length;
        const pending = familyGuests.length - familyRsvps.length;
        
        return {
          familyName: family.family_name,
          totalMembers: familyGuests.length,
          attending,
          notAttending,
          pending
        };
      });

    const stats = {
      totalGuests: nonAdminGuests.length,
      totalFamilies: families.filter(f => f.family_name !== 'Admin Family').length,
      totalResponses: totalResponses,
      attending: attendingRsvps.length,
      notAttending: notAttendingRsvps.length,
      pending: pendingGuests.length,
      familyStats
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error getting stats for admin:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new family with members
router.post('/add-family', requireAdmin, async (req, res) => {
  const { familyName, members } = req.body;

  if (!familyName || !members || members.length === 0) {
    return res.status(400).json({ error: 'Family name and at least one member are required' });
  }

  try {
    // Check if family already exists
    const existingFamilies = await data.getFamilies();
    if (existingFamilies.find(f => f.family_name.toLowerCase() === familyName.toLowerCase())) {
      return res.status(400).json({ error: 'Family name already exists' });
    }

    // Add family
          const newFamily = await data.addFamily(familyName);
    
    // Add family members
    const addedMembers = [];
    for (const member of members) {
      try {
        const newGuest = await data.addGuest(
          newFamily.id,
          member.firstName,
          member.lastName,
          false
        );
        addedMembers.push(newGuest);
      } catch (memberError) {
        console.error(`Error adding member ${member.firstName} ${member.lastName}:`, memberError);
        // Continue adding other members even if one fails
      }
    }

    res.json({
      success: true,
      family: newFamily,
      members: addedMembers,
      message: `Added family "${familyName}" with ${addedMembers.length} members`
    });
  } catch (error) {
    console.error('Error adding family:', error);
    res.status(500).json({ error: 'Server error adding family' });
  }
});

// Remove individual guest
router.delete('/guest/:guestId', requireAdmin, async (req, res) => {
  const { guestId } = req.params;

  try {
    const removedGuest = await data.removeGuest(guestId);
    res.json({
      success: true,
      message: `Removed ${removedGuest.first_name} ${removedGuest.last_name} from the guest list`,
      removedGuest
    });
  } catch (error) {
    console.error('Error removing guest:', error);
    res.status(500).json({ error: error.message || 'Server error removing guest' });
  }
});

// Remove entire family
router.delete('/family/:familyId', requireAdmin, async (req, res) => {
  const { familyId } = req.params;

  try {
    const result = await data.removeFamily(familyId);
    res.json({
      success: true,
      message: `Removed family "${result.family.family_name}" and ${result.removedMembers} members`,
      removedFamily: result.family,
      removedMembersCount: result.removedMembers
    });
  } catch (error) {
    console.error('Error removing family:', error);
    res.status(500).json({ error: error.message || 'Server error removing family' });
  }
});

// Update guest name
router.put('/guest/:guestId', requireAdmin, async (req, res) => {
  const { guestId } = req.params;
  const { firstName, lastName } = req.body;

  // Validate input
  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  if (firstName.trim().length === 0 || lastName.trim().length === 0) {
    return res.status(400).json({ error: 'First name and last name cannot be empty' });
  }

  try {
    const updatedGuest = await data.updateGuest(guestId, firstName.trim(), lastName.trim());
    res.json({
      success: true,
      message: `Updated guest name to ${firstName} ${lastName}`,
      updatedGuest
    });
  } catch (error) {
    console.error('Error updating guest:', error);
    res.status(500).json({ error: error.message || 'Server error updating guest' });
  }
});

module.exports = router; 