const { Pool } = require('pg');

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Helper function to execute queries
async function query(text, params) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('[PostgreSQL Error]:', error);
    throw error;
  }
}

// Initialize database schema
async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await query(`
      CREATE TABLE IF NOT EXISTS families (
        id SERIAL PRIMARY KEY,
        family_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS guests (
        id SERIAL PRIMARY KEY,
        family_id INTEGER NOT NULL REFERENCES families(id) ON DELETE CASCADE,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        guest_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
        will_attend BOOLEAN NOT NULL,
        dietary_restrictions TEXT DEFAULT '',
        individual_notes TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await query('CREATE INDEX IF NOT EXISTS idx_guests_family_id ON guests(family_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(first_name, last_name)');
    await query('CREATE INDEX IF NOT EXISTS idx_rsvps_guest_id ON rsvps(guest_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_guests_admin ON guests(is_admin)');

    console.log('[PostgreSQL] Database schema initialized successfully');
  } catch (error) {
    console.error('[PostgreSQL] Failed to initialize database:', error);
    throw error;
  }
}

// Families operations
async function getFamilies() {
  try {
    const result = await query('SELECT * FROM families ORDER BY id');
    return result.rows;
  } catch (error) {
    console.error('Error reading families:', error);
    return [];
  }
}

async function addFamily(familyName) {
  try {
    const result = await query(
      'INSERT INTO families (family_name) VALUES ($1) RETURNING *',
      [familyName]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding family:', error);
    throw error;
  }
}

async function removeFamily(familyId) {
  try {
    // Get family info before deletion
    const familyResult = await query('SELECT * FROM families WHERE id = $1', [familyId]);
    if (familyResult.rows.length === 0) {
      throw new Error('Family not found');
    }

    // Get count of family members
    const membersResult = await query('SELECT COUNT(*) as count FROM guests WHERE family_id = $1', [familyId]);
    const memberCount = parseInt(membersResult.rows[0].count);

    // Delete family (CASCADE will delete guests and rsvps)
    await query('DELETE FROM families WHERE id = $1', [familyId]);

    return { 
      family: familyResult.rows[0], 
      removedMembers: memberCount 
    };
  } catch (error) {
    console.error('Error removing family:', error);
    throw error;
  }
}

// Guests operations
async function getGuests() {
  try {
    const result = await query('SELECT * FROM guests ORDER BY id');
    return result.rows;
  } catch (error) {
    console.error('Error reading guests:', error);
    return [];
  }
}

async function findGuestByName(firstName, lastName) {
  try {
    const result = await query(`
      SELECT g.*, f.family_name 
      FROM guests g 
      JOIN families f ON g.family_id = f.id 
      WHERE LOWER(g.first_name) = LOWER($1) AND LOWER(g.last_name) = LOWER($2)
    `, [firstName, lastName]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error finding guest:', error);
    return null;
  }
}

async function getGuestsByFamily(familyId) {
  try {
    const result = await query('SELECT * FROM guests WHERE family_id = $1 ORDER BY id', [familyId]);
    return result.rows;
  } catch (error) {
    console.error('Error getting guests by family:', error);
    return [];
  }
}

async function addGuest(familyId, firstName, lastName, isAdmin = false) {
  try {
    const result = await query(
      'INSERT INTO guests (family_id, first_name, last_name, is_admin) VALUES ($1, $2, $3, $4) RETURNING *',
      [familyId, firstName, lastName, isAdmin]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding guest:', error);
    throw error;
  }
}

async function removeGuest(guestId) {
  try {
    // Get guest info before deletion
    const guestResult = await query('SELECT * FROM guests WHERE id = $1', [guestId]);
    if (guestResult.rows.length === 0) {
      throw new Error('Guest not found');
    }

    // Delete guest (CASCADE will delete rsvps)
    await query('DELETE FROM guests WHERE id = $1', [guestId]);

    return guestResult.rows[0];
  } catch (error) {
    console.error('Error removing guest:', error);
    throw error;
  }
}

async function updateGuest(guestId, firstName, lastName) {
  try {
    const result = await query(
      'UPDATE guests SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *',
      [firstName, lastName, guestId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Guest not found');
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating guest:', error);
    throw error;
  }
}

// RSVPs operations
async function getRsvps() {
  try {
    const result = await query('SELECT * FROM rsvps ORDER BY id');
    return result.rows;
  } catch (error) {
    console.error('Error reading RSVPs:', error);
    return [];
  }
}

async function findRsvpByGuestId(guestId) {
  try {
    const result = await query('SELECT * FROM rsvps WHERE guest_id = $1', [guestId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error finding RSVP:', error);
    return null;
  }
}

async function saveRsvp(guestId, willAttend, dietaryRestrictions = '', individualNotes = '') {
  try {
    // Check if RSVP exists
    const existingRsvp = await findRsvpByGuestId(guestId);
    
    if (existingRsvp) {
      // Update existing RSVP
      const result = await query(`
        UPDATE rsvps 
        SET will_attend = $1, dietary_restrictions = $2, individual_notes = $3, updated_at = CURRENT_TIMESTAMP
        WHERE guest_id = $4 
        RETURNING *
      `, [willAttend, dietaryRestrictions, individualNotes, guestId]);
      
      return result.rows[0];
    } else {
      // Create new RSVP
      const result = await query(`
        INSERT INTO rsvps (guest_id, will_attend, dietary_restrictions, individual_notes)
        VALUES ($1, $2, $3, $4) 
        RETURNING *
      `, [guestId, willAttend, dietaryRestrictions, individualNotes]);
      
      return result.rows[0];
    }
  } catch (error) {
    console.error('Error saving RSVP:', error);
    throw error;
  }
}

module.exports = {
  initializeDatabase,
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
  saveRsvp
}; 