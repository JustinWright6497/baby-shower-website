// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.guestId) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Admin authentication middleware
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

module.exports = {
  requireAuth,
  requireAdmin
}; 