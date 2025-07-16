// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me'
  },
  RSVP: {
    FAMILY: '/api/rsvp/family-rsvp',
    SUBMIT: '/api/rsvp/submit',
    GUEST: '/api/rsvp/guest'
  },
  ADMIN: {
    FAMILIES: '/api/admin/families',
    STATS: '/api/admin/stats',
    ADD_FAMILY: '/api/admin/add-family',
    REMOVE_GUEST: (guestId) => `/api/admin/guest/${guestId}`,
    REMOVE_FAMILY: (familyId) => `/api/admin/family/${familyId}`,
    UPDATE_GUEST: (guestId) => `/api/admin/guest/${guestId}`
  }
};

// Common styling constants
export const COLORS = {
  PRIMARY: '#B08047',
  SECONDARY: '#CE9647',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#f0f0f0',
  BACKGROUND: '#575757',
  ERROR: '#ff4444',
  SUCCESS: '#28a745',
  BLACK: '#000000'
};

// Common font families
export const FONTS = {
  DANCING_SCRIPT: 'Dancing Script, cursive',
  PLAYFAIR_DISPLAY: 'Playfair Display, serif',
  CORMORANT_GARAMOND: 'Cormorant Garamond, serif'
};

// Common styles
export const COMMON_STYLES = {
  PAGE_HEADER: {
    fontFamily: FONTS.DANCING_SCRIPT,
    fontSize: '4rem',
    fontWeight: '400',
    color: COLORS.SECONDARY,
    letterSpacing: '0.05em',
    textAlign: 'center'
  },
  SECTION_HEADER: {
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  CONTENT_CONTAINER: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem 1rem',
    textAlign: 'center'
  },
  BUTTON_PRIMARY: {
    background: COLORS.SECONDARY,
    border: 'none',
    color: COLORS.TEXT_PRIMARY,
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

// Event details
export const EVENT_INFO = {
  DATE: 'November 1st, 2025',
  TIME: '1:00 PM CST (anticipated start dependent on venue availability)',
  LOCATION: 'Venue TBD',
  CITY: 'Kansas City, MO'
}; 