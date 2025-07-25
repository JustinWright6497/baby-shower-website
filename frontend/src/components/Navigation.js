import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { logout, isAdmin } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false); // Close menu after logout
  };

  // Navigation items with icons and descriptions
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠', description: 'Welcome page' },
    { path: '/party-info', label: 'Party Info', icon: '📅', description: 'Event details & schedule' },
    { path: '/rsvp', label: 'RSVP', icon: '✉️', description: 'Respond to invitation' },
    { path: '/registries', label: 'Registries', icon: '🎁', description: 'Gift registries' },
    { path: '/costume-contest', label: 'Costume Contest', icon: '🎭', description: 'Costume contest info' },
  ];

  // Add admin item if user is admin
  if (isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️', description: 'Admin panel' });
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Mobile hamburger button */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? '✕' : (
            <span className="menu-button-content">
              <span className="menu-label">Menu</span>
            </span>
          )}
        </button>

        <ul 
          className={`nav-links ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}
        >
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={isActive(item.path) ? 'active' : ''}
                style={{
                  color: isActive(item.path) ? '#CE9647' : '#F8F9F5',
                  background: isActive(item.path) ? 'rgba(206, 150, 71, 0.2)' : 'transparent'
                }}
                onClick={closeMobileMenu}
                title={item.description}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-user">
          <button onClick={handleLogout} className="nav-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 