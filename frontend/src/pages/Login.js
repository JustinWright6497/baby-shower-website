import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter both your first and last name');
      setLoading(false);
      return;
    }

    const result = await login(firstName.trim(), lastName.trim());
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="App">


      <div className="page-container">
        <div style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
          <h1 style={{ 
            fontFamily: 'Dancing Script, cursive',
            fontSize: '4rem',
            fontWeight: '400',
            color: '#000000',
            marginBottom: '1rem',
            letterSpacing: '0.05em'
          }}>
            Welcome!
          </h1>
          <p style={{ 
            fontSize: '1.3rem', 
            marginBottom: '0',
            color: '#ffffff',
            fontWeight: '500'
          }}>
            Halloween Baby Shower for
          </p>
          <h2 style={{ 
            fontFamily: 'Playfair Display, serif',
            fontSize: '3rem',
            fontWeight: '300',
            color: '#CE9647',
            marginTop: '0',
            marginBottom: '2.5rem',
            letterSpacing: '0.1em'
          }}>
            ROXANNE WRIGHT
          </h2>
          <p style={{ 
            fontSize: '1.1rem', 
            marginBottom: '1.5rem',
            opacity: 0.9,
            lineHeight: '1.5'
          }}>
            Enter your name exactly as it appears on your invitation to continue.
          </p>

          <form onSubmit={handleSubmit} className="form-container">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="form-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="form-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ 
                width: '100%', 
                marginTop: '1.5rem',
                fontSize: '1.1rem',
                padding: '0.8rem 2rem',
                background: '#CE9647',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Loading...' : 'Join the Celebration!'}
            </button>
          </form>

          <p style={{ 
            fontSize: '0.95rem', 
            opacity: 0.8, 
            marginTop: '2.5rem',
            lineHeight: '1.4'
          }}>
            Having trouble? Contact the host if your name isn't recognized.
          </p>

          {/* Decorative elements */}
          <div style={{ 
            marginTop: '4rem', 
            opacity: 0.4,
            borderTop: '1px solid #333333',
            paddingTop: '2rem'
          }}>
            <p style={{ 
              fontSize: '1.1rem',
              fontStyle: 'italic',
              color: '#CE9647',
              fontWeight: '300'
            }}>
              A beautiful celebration awaits...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 
