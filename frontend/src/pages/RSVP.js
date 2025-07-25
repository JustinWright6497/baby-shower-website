import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { API_ENDPOINTS, EVENT_INFO } from '../utils/constants';

const RSVP = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [familyData, setFamilyData] = useState(null);
  const [familyRSVP, setFamilyRSVP] = useState({});

  useEffect(() => {
    loadFamilyRSVP();
  }, []);

  const loadFamilyRSVP = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.RSVP.FAMILY);
      setFamilyData(response.data.familyData);
      
      // Initialize family RSVP state with existing responses
      const initialRSVP = {};
      response.data.familyData.members.forEach(member => {
        initialRSVP[member.guestId] = {
          firstName: member.firstName,
          lastName: member.lastName,
          willAttend: member.rsvp?.willAttend || false,
          dietaryRestrictions: member.rsvp?.dietaryRestrictions || '',
          individualNotes: member.rsvp?.individualNotes || ''
        };
      });
      setFamilyRSVP(initialRSVP);
    } catch (error) {
      console.error('Error loading family RSVP:', error);
      setError('Failed to load your family RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (guestId, willAttend) => {
    setFamilyRSVP(prev => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        willAttend
      }
    }));
  };

  const handleInputChange = (guestId, field, value) => {
    setFamilyRSVP(prev => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      // Submit RSVP for each family member
      const promises = Object.entries(familyRSVP).map(([guestId, rsvpData]) => {
        return axios.post(API_ENDPOINTS.RSVP.SUBMIT, {
          guestId,
          willAttend: rsvpData.willAttend,
          dietaryRestrictions: rsvpData.dietaryRestrictions,
          individualNotes: rsvpData.individualNotes
        });
      });

      await Promise.all(promises);
      setMessage('Family RSVP has been saved successfully!');
      await loadFamilyRSVP(); // Refresh data
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting family RSVP:', error);
      setError('Failed to save family RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading your family RSVP..." />
      </Layout>
    );
  }

  if (!familyData) {
    return (
      <Layout>
        <div className="alert alert-error">
          Failed to load family data. Please try refreshing the page.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '3rem' }}>
          <h1 style={{ 
            fontFamily: 'Dancing Script, cursive',
            fontSize: '4rem',
            fontWeight: '400',
            color: '#CE9647',
            marginBottom: '1rem',
            letterSpacing: '0.05em'
          }}>
            RSVP
          </h1>
          <div style={{ 
            fontSize: '1.2rem', 
            lineHeight: '1.6',
            marginBottom: '1rem',
            color: '#ffffff'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>{EVENT_INFO.DATE} at {EVENT_INFO.TIME}</strong>
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              {EVENT_INFO.LOCATION}, {EVENT_INFO.CITY}
            </p>
            <p style={{ 
              fontSize: '1rem', 
              fontStyle: 'italic',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Your RSVP will help us determine party info (food, venue, drinks, activities, etc.)
            </p>
          </div>
        </div>

        {/* Family RSVP Form */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {message && <SuccessMessage message={message} />}
          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit}>
            {familyData.members.map((member) => {
              const memberRSVP = familyRSVP[member.guestId] || {};
              
              return (
                <div key={member.guestId} style={{ 
                  marginBottom: '3rem',
                  padding: '2rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  borderLeft: '3px solid #CE9647'
                }}>
                  <h3 style={{ 
                    color: '#ffffff', 
                    marginBottom: '1.5rem',
                    fontSize: '1.5rem'
                  }}>
                    {member.firstName} {member.lastName}
                  </h3>

                  {/* Attendance Selection */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                      Will {member.firstName} be attending?
                    </label>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                      <label className="form-checkbox">
                        <input
                          type="radio"
                          name={`attendance-${member.guestId}`}
                          checked={memberRSVP.willAttend === true}
                          onChange={() => handleAttendanceChange(member.guestId, true)}
                        />
                        <span>Yes, will attend!</span>
                      </label>
                      <label className="form-checkbox">
                        <input
                          type="radio"
                          name={`attendance-${member.guestId}`}
                          checked={memberRSVP.willAttend === false}
                          onChange={() => handleAttendanceChange(member.guestId, false)}
                        />
                        <span>Cannot attend</span>
                      </label>
                    </div>
                  </div>

                  {/* Dietary Restrictions - only show if attending */}
                  {memberRSVP.willAttend && (
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label className="form-label" htmlFor={`dietary-${member.guestId}`}>
                        Dietary Restrictions or Allergies
                      </label>
                      <textarea
                        id={`dietary-${member.guestId}`}
                        className="form-textarea"
                        value={memberRSVP.dietaryRestrictions}
                        onChange={(e) => handleInputChange(member.guestId, 'dietaryRestrictions', e.target.value)}
                        placeholder="Any dietary restrictions or allergies..."
                        style={{ width: '100%', minHeight: '80px' }}
                      />
                    </div>
                  )}

                  {/* Individual Notes */}
                  <div className="form-group">
                    <label className="form-label" htmlFor={`notes-${member.guestId}`}>
                      Additional Notes
                    </label>
                    <textarea
                      id={`notes-${member.guestId}`}
                      className="form-textarea"
                      value={memberRSVP.individualNotes}
                      onChange={(e) => handleInputChange(member.guestId, 'individualNotes', e.target.value)}
                      placeholder="Any special requests or messages..."
                      style={{ width: '100%', minHeight: '80px' }}
                    />
                  </div>
                </div>
              );
            })}

            <button 
              type="submit" 
              disabled={submitting}
              style={{ 
                width: '100%', 
                marginTop: '2rem',
                fontSize: '1.2rem',
                padding: '1rem 2rem',
                background: '#CE9647',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: 'bold',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Saving Family RSVP...' : 'Submit Family RSVP'}
            </button>
          </form>
        </div>

        {/* Questions Section */}
        <div className="section-separator" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#000000', fontSize: '1.5rem', marginBottom: '1rem' }}>Questions?</h3>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Contact the host if you have any questions about the celebration!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RSVP; 
