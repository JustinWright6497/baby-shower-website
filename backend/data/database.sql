-- Baby Shower Database Schema
-- This script creates the tables needed for the baby shower website

-- Create families table
CREATE TABLE IF NOT EXISTS families (
    id SERIAL PRIMARY KEY,
    family_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    family_id INTEGER NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rsvps table
CREATE TABLE IF NOT EXISTS rsvps (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    will_attend BOOLEAN NOT NULL,
    dietary_restrictions TEXT DEFAULT '',
    individual_notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_family_id ON guests(family_id);
CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_rsvps_guest_id ON rsvps(guest_id);
CREATE INDEX IF NOT EXISTS idx_guests_admin ON guests(is_admin);

-- Create updated_at trigger for rsvps table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rsvps_updated_at 
    BEFORE UPDATE ON rsvps 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 