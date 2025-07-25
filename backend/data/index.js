// Data layer that automatically switches between CSV (local) and PostgreSQL (production)
const csvData = require('./csvData');
const pgData = require('./pgData');

// Determine which data source to use
const usePostgreSQL = process.env.NODE_ENV === 'production' && process.env.DATABASE_URL;

// Export the appropriate data functions
if (usePostgreSQL) {
  console.log('🐘 Using PostgreSQL database (production mode)');
  module.exports = {
    ...pgData,
    // Add a flag to indicate we're using PostgreSQL
    _dataSource: 'postgresql'
  };
} else {
  console.log('📄 Using CSV files (development mode)');
  module.exports = {
    ...csvData,
    // Add a flag to indicate we're using CSV
    _dataSource: 'csv',
    // Add initializeDatabase function for CSV (no-op)
    initializeDatabase: async () => {
      console.log('📄 CSV files ready for use');
    }
  };
} 