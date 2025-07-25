const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { initializeDatabase, addFamily, addGuest, saveRsvp } = require('./pgData');

// File paths
const familiesPath = path.join(__dirname, 'families.csv');
const guestsPath = path.join(__dirname, 'guests.csv');
const rsvpsPath = path.join(__dirname, 'rsvps.csv');

// Helper function to read CSV file
function readCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      resolve([]);
      return;
    }

    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(`Read ${results.length} records from ${path.basename(filePath)}`);
        resolve(results);
      })
      .on('error', (error) => {
        console.error(`Error reading ${filePath}:`, error);
        reject(error);
      });
  });
}

async function migrateFamilies() {
  console.log('\n🏠 Migrating families...');
  const families = await readCsvFile(familiesPath);
  const familyIdMap = new Map(); // Map old ID to new ID
  
  for (const family of families) {
    try {
      const newFamily = await addFamily(family.family_name);
      familyIdMap.set(parseInt(family.id), newFamily.id);
      console.log(`✅ Added family: ${family.family_name} (${family.id} → ${newFamily.id})`);
    } catch (error) {
      console.error(`❌ Failed to add family ${family.family_name}:`, error.message);
    }
  }
  
  return familyIdMap;
}

async function migrateGuests(familyIdMap) {
  console.log('\n👥 Migrating guests...');
  const guests = await readCsvFile(guestsPath);
  const guestIdMap = new Map(); // Map old ID to new ID
  
  for (const guest of guests) {
    try {
      const newFamilyId = familyIdMap.get(parseInt(guest.family_id));
      if (!newFamilyId) {
        console.error(`❌ Family ID ${guest.family_id} not found for guest ${guest.first_name} ${guest.last_name}`);
        continue;
      }
      
      const isAdmin = guest.is_admin === 'true';
      const newGuest = await addGuest(newFamilyId, guest.first_name, guest.last_name, isAdmin);
      guestIdMap.set(parseInt(guest.id), newGuest.id);
      
      const adminFlag = isAdmin ? ' (ADMIN)' : '';
      console.log(`✅ Added guest: ${guest.first_name} ${guest.last_name}${adminFlag} (${guest.id} → ${newGuest.id})`);
    } catch (error) {
      console.error(`❌ Failed to add guest ${guest.first_name} ${guest.last_name}:`, error.message);
    }
  }
  
  return guestIdMap;
}

async function migrateRsvps(guestIdMap) {
  console.log('\n📝 Migrating RSVPs...');
  const rsvps = await readCsvFile(rsvpsPath);
  
  for (const rsvp of rsvps) {
    try {
      const newGuestId = guestIdMap.get(parseInt(rsvp.guest_id));
      if (!newGuestId) {
        console.error(`❌ Guest ID ${rsvp.guest_id} not found for RSVP ${rsvp.id}`);
        continue;
      }
      
      const willAttend = rsvp.will_attend === 'true';
      const dietaryRestrictions = rsvp.dietary_restrictions || '';
      const individualNotes = rsvp.individual_notes || '';
      
      await saveRsvp(newGuestId, willAttend, dietaryRestrictions, individualNotes);
      
      const attendStatus = willAttend ? 'attending' : 'not attending';
      console.log(`✅ Added RSVP: Guest ${newGuestId} - ${attendStatus} (${rsvp.id})`);
    } catch (error) {
      console.error(`❌ Failed to add RSVP for guest ${rsvp.guest_id}:`, error.message);
    }
  }
}

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...');
    console.log('📋 This will import your existing CSV data into PostgreSQL');
    
    // Initialize database schema
    await initializeDatabase();
    
    // Migrate data in order (families → guests → rsvps)
    const familyIdMap = await migrateFamilies();
    const guestIdMap = await migrateGuests(familyIdMap);
    await migrateRsvps(guestIdMap);
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('📊 Summary:');
    console.log(`   • Families: ${familyIdMap.size}`);
    console.log(`   • Guests: ${guestIdMap.size}`);
    console.log('   • RSVPs: Check your database');
    
    console.log('\n💡 Next steps:');
    console.log('   1. Update your server.js to use pgData instead of csvData');
    console.log('   2. Test the application locally');
    console.log('   3. Deploy to Railway');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration }; 