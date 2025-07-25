const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const dataDir = __dirname;
const familiesPath = path.join(dataDir, 'families.csv');
const guestsPath = path.join(dataDir, 'guests.csv');
const rsvpsPath = path.join(dataDir, 'rsvps.csv');

// Helper function to read CSV file
function readCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    // Add debugging for production
    console.log(`[DEBUG] Attempting to read file: ${filePath}`);
    console.log(`[DEBUG] File exists: ${fs.existsSync(filePath)}`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`[ERROR] File not found: ${filePath}`);
      resolve([]); // Return empty array instead of rejecting
      return;
    }

    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(`[DEBUG] Successfully read ${results.length} records from ${filePath}`);
        resolve(results);
      })
      .on('error', (error) => {
        console.error(`[ERROR] Error reading ${filePath}:`, error);
        resolve([]); // Return empty array instead of rejecting
      });
  });
}

// Helper function to write CSV file
async function writeCsvFile(filePath, data, headers) {
  const csvWriter = createCsvWriter({
    path: filePath,
    header: headers.map(h => ({ id: h, title: h }))
  });
  await csvWriter.writeRecords(data);
}

// Families operations
async function getFamilies() {
  try {
    const families = await readCsvFile(familiesPath);
    return families.map(f => ({
      ...f,
      id: parseInt(f.id)
    }));
  } catch (error) {
    console.error('Error reading families:', error);
    return [];
  }
}

async function addFamily(familyName) {
  try {
    const families = await getFamilies();
    const newId = families.length > 0 ? Math.max(...families.map(f => f.id)) + 1 : 1;
    const newFamily = {
      id: newId,
      family_name: familyName,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    families.push(newFamily);
    await writeCsvFile(familiesPath, families, ['id', 'family_name', 'created_at']);
    return newFamily;
  } catch (error) {
    console.error('Error adding family:', error);
    throw error;
  }
}

// Guests operations
async function getGuests() {
  try {
    const guests = await readCsvFile(guestsPath);
    return guests.map(g => ({
      ...g,
      id: parseInt(g.id),
      family_id: parseInt(g.family_id),
      is_admin: g.is_admin === 'true'
    }));
  } catch (error) {
    console.error('Error reading guests:', error);
    return [];
  }
}

async function findGuestByName(firstName, lastName) {
  try {
    const guests = await getGuests();
    const families = await getFamilies();
    
    const guest = guests.find(g => 
      g.first_name.toLowerCase() === firstName.toLowerCase() && 
      g.last_name.toLowerCase() === lastName.toLowerCase()
    );
    
    if (guest) {
      const family = families.find(f => f.id === guest.family_id);
      return {
        ...guest,
        family_name: family ? family.family_name : 'Unknown'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error finding guest:', error);
    return null;
  }
}

async function getGuestsByFamily(familyId) {
  try {
    const guests = await getGuests();
    return guests.filter(g => g.family_id === parseInt(familyId));
  } catch (error) {
    console.error('Error getting guests by family:', error);
    return [];
  }
}

async function addGuest(familyId, firstName, lastName, isAdmin = false) {
  try {
    const guests = await getGuests();
    const newId = guests.length > 0 ? Math.max(...guests.map(g => g.id)) + 1 : 1;
    const newGuest = {
      id: newId,
      family_id: parseInt(familyId),
      first_name: firstName,
      last_name: lastName,
      is_admin: isAdmin,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    guests.push(newGuest);
    await writeCsvFile(guestsPath, guests, ['id', 'family_id', 'first_name', 'last_name', 'is_admin', 'created_at']);
    return newGuest;
  } catch (error) {
    console.error('Error adding guest:', error);
    throw error;
  }
}

// RSVPs operations
async function getRsvps() {
  try {
    const rsvps = await readCsvFile(rsvpsPath);
    return rsvps.map(r => ({
      ...r,
      id: parseInt(r.id || 0),
      guest_id: parseInt(r.guest_id),
      will_attend: r.will_attend === 'true'
    }));
  } catch (error) {
    console.error('Error reading RSVPs:', error);
    return [];
  }
}

async function findRsvpByGuestId(guestId) {
  try {
    const rsvps = await getRsvps();
    return rsvps.find(r => r.guest_id === parseInt(guestId)) || null;
  } catch (error) {
    console.error('Error finding RSVP:', error);
    return null;
  }
}

async function findRsvpByFamilyId(familyId) {
  try {
    const guests = await getGuests();
    const familyGuests = guests.filter(g => g.family_id === parseInt(familyId));
    const familyGuestIds = familyGuests.map(g => g.id);
    
    const rsvps = await getRsvps();
    const familyRsvp = rsvps.find(r => familyGuestIds.includes(r.guest_id));
    
    if (familyRsvp) {
      const guest = familyGuests.find(g => g.id === familyRsvp.guest_id);
      const families = await getFamilies();
      const family = families.find(f => f.id === parseInt(familyId));
      
      return {
        ...familyRsvp,
        first_name: guest.first_name,
        last_name: guest.last_name,
        family_name: family.family_name
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error finding RSVP by family:', error);
    return null;
  }
}

async function getRsvpsByFamily(familyId) {
  try {
    const guests = await getGuests();
    const familyGuests = guests.filter(g => g.family_id === parseInt(familyId));
    const familyGuestIds = familyGuests.map(g => g.id);
    
    const rsvps = await getRsvps();
    const familyRsvps = rsvps.filter(r => familyGuestIds.includes(r.guest_id));
    
    const families = await getFamilies();
    const family = families.find(f => f.id === parseInt(familyId));
    
    return familyRsvps.map(rsvp => {
      const guest = familyGuests.find(g => g.id === rsvp.guest_id);
      return {
        ...rsvp,
        first_name: guest.first_name,
        last_name: guest.last_name,
        family_name: family.family_name
      };
    });
  } catch (error) {
    console.error('Error getting RSVPs by family:', error);
    return [];
  }
}

async function saveRsvp(guestId, willAttend, dietaryRestrictions = '', individualNotes = '') {
  try {
    // First, get the guest to find their family
    const guests = await getGuests();
    const guest = guests.find(g => g.id === parseInt(guestId));
    
    if (!guest) {
      throw new Error('Guest not found');
    }
    
    const familyId = guest.family_id;
    
    // Get all guests in this family
    const familyGuests = guests.filter(g => g.family_id === familyId);
    const familyGuestIds = familyGuests.map(g => g.id);
    
    // Check if any family member has already RSVP'd
    const rsvps = await getRsvps();
    const existingFamilyRsvpIndex = rsvps.findIndex(r => familyGuestIds.includes(r.guest_id));
    
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const rsvpData = {
      guest_id: parseInt(guestId),
      will_attend: willAttend,
      dietary_restrictions: dietaryRestrictions || '',
      individual_notes: individualNotes || '',
      updated_at: timestamp
    };
    
    if (existingFamilyRsvpIndex >= 0) {
      // Family has already RSVP'd - update the existing RSVP
      rsvps[existingFamilyRsvpIndex] = {
        ...rsvps[existingFamilyRsvpIndex],
        ...rsvpData
      };
      console.log(`📝 Updated existing RSVP for family ${guest.first_name} ${guest.last_name}`);
    } else {
      // Family hasn't RSVP'd yet - create new RSVP
      const newId = rsvps.length > 0 ? Math.max(...rsvps.map(r => r.id || 0)) + 1 : 1;
      rsvps.push({
        id: newId,
        ...rsvpData,
        created_at: timestamp
      });
      console.log(`✅ Created new RSVP for family ${guest.first_name} ${guest.last_name}`);
    }
    
    await writeCsvFile(rsvpsPath, rsvps, ['id', 'guest_id', 'will_attend', 'dietary_restrictions', 'individual_notes', 'created_at', 'updated_at']);
    return rsvpData;
  } catch (error) {
    console.error('Error saving RSVP:', error);
    throw error;
  }
}

// Delete operations
async function removeGuest(guestId) {
  try {
    const guests = await getGuests();
    const guestToRemove = guests.find(g => g.id === parseInt(guestId));
    
    if (!guestToRemove) {
      throw new Error('Guest not found');
    }

    // Remove the guest
    const updatedGuests = guests.filter(g => g.id !== parseInt(guestId));
    await writeCsvFile(guestsPath, updatedGuests, ['id', 'family_id', 'first_name', 'last_name', 'is_admin', 'created_at']);

    // Remove associated RSVP if it exists
    const rsvps = await getRsvps();
    const updatedRsvps = rsvps.filter(r => r.guest_id !== parseInt(guestId));
    await writeCsvFile(rsvpsPath, updatedRsvps, ['id', 'guest_id', 'will_attend', 'dietary_restrictions', 'individual_notes', 'created_at', 'updated_at']);

    return guestToRemove;
  } catch (error) {
    console.error('Error removing guest:', error);
    throw error;
  }
}

// Update operations
async function updateGuest(guestId, firstName, lastName) {
  try {
    const guests = await getGuests();
    const guestIndex = guests.findIndex(g => g.id === parseInt(guestId));
    
    if (guestIndex === -1) {
      throw new Error('Guest not found');
    }

    // Update the guest's name
    guests[guestIndex] = {
      ...guests[guestIndex],
      first_name: firstName,
      last_name: lastName
    };

    await writeCsvFile(guestsPath, guests, ['id', 'family_id', 'first_name', 'last_name', 'is_admin', 'created_at']);
    return guests[guestIndex];
  } catch (error) {
    console.error('Error updating guest:', error);
    throw error;
  }
}

async function removeFamily(familyId) {
  try {
    const families = await getFamilies();
    const familyToRemove = families.find(f => f.id === parseInt(familyId));
    
    if (!familyToRemove) {
      throw new Error('Family not found');
    }

    // Get all guests in this family
    const guests = await getGuests();
    const familyGuests = guests.filter(g => g.family_id === parseInt(familyId));

    // Remove all family members
    const updatedGuests = guests.filter(g => g.family_id !== parseInt(familyId));
    await writeCsvFile(guestsPath, updatedGuests, ['id', 'family_id', 'first_name', 'last_name', 'is_admin', 'created_at']);

    // Remove all RSVPs for family members
    const rsvps = await getRsvps();
    const familyGuestIds = familyGuests.map(g => g.id);
    const updatedRsvps = rsvps.filter(r => !familyGuestIds.includes(r.guest_id));
    await writeCsvFile(rsvpsPath, updatedRsvps, ['id', 'guest_id', 'will_attend', 'dietary_restrictions', 'individual_notes', 'created_at', 'updated_at']);

    // Remove the family
    const updatedFamilies = families.filter(f => f.id !== parseInt(familyId));
    await writeCsvFile(familiesPath, updatedFamilies, ['id', 'family_name', 'created_at']);

    return { family: familyToRemove, removedMembers: familyGuests.length };
  } catch (error) {
    console.error('Error removing family:', error);
    throw error;
  }
}

module.exports = {
  getFamilies,
  addFamily,
  removeFamily,
  getGuests,
  findGuestByName,
  getGuestsByFamily,
  addGuest,
  removeGuest,
  updateGuest,
  getRsvps,
  findRsvpByGuestId,
  findRsvpByFamilyId,
  getRsvpsByFamily,
  saveRsvp
}; 