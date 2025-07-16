import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false); // Close menu after logout
  };

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
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#F8F9F5',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <ul 
          className={`nav-links ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}
          style={{
            ...(isMobileMenuOpen && {
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              zIndex: 1000,
              padding: '1rem 0',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            })
          }}
        >
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
              style={{ 
                color: isActive('/') ? '#CE9647' : '#F8F9F5',
                background: isActive('/') ? 'rgba(206, 150, 71, 0.2)' : 'transparent'
              }}
              onClick={closeMobileMenu}
            >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/party-info"
                className={isActive('/party-info') ? 'active' : ''}
                style={{ 
                  color: isActive('/party-info') ? '#CE9647' : '#F8F9F5',
                  background: isActive('/party-info') ? 'rgba(206, 150, 71, 0.2)' : 'transparent'
                }}
                onClick={closeMobileMenu}
              >
                Party Info
              </Link>
            </li>
            <li>
              <Link 
                to="/rsvp"
                className={isActive('/rsvp') ? 'active' : ''}
                style={{ 
                  color: isActive('/rsvp') ? '#CE9647' : '#F8F9F5',
                  background: isActive('/rsvp') ? 'rgba(206, 150, 71, 0.2)' : 'transparent'
                }}
                onClick={closeMobileMenu}
              >
                RSVP
              </Link>
            </li>
            <li>
              <Link 
                to="/registries"
                className={isActive('/registries') ? 'active' : ''}
                style={{ 
                  color: isActive('/registries') ? '#CE9647' : '#F8F9F5',
                  background: isActive('/registries') ? 'rgba(206, 150, 71, 0.2)' : 'transparent'
                }}
                onClick={closeMobileMenu}
              >
                Registries
              </Link>
            </li>
            <li>
              <Link 
                to="/costume-contest"
                className={isActive('/costume-contest') ? 'active' : ''}
                style={{ 
                  color: isActive('/costume-contest') ? '#CE9647' : '#F8F9F5',
                  background: isActive('/costume-contest') ? 'rgba(206, 150, 71, 0.2)' : 'transparent'
                }}
                onClick={closeMobileMenu}
              >
                Costume Contest
              </Link>
          </li>
          {isAdmin && (
            <li>
              <Link 
                to="/admin"
                className={isActive('/admin') ? 'active' : ''}
                style={{ 
                  color: isActive('/admin') ? '#CE9647' : '#F8F9F5',
                  background: isActive('/admin') ? 'rgba(206, 150, 71, 0.2)' : 'transparent'
                }}
                onClick={closeMobileMenu}
              >
                Admin
              </Link>
            </li>
          )}
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