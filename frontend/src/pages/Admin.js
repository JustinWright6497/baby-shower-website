import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import PageHeader from '../components/PageHeader';
import { API_ENDPOINTS, COLORS } from '../utils/constants';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [families, setFamilies] = useState([]);
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [addFamilyForm, setAddFamilyForm] = useState({
    familyName: '',
    members: [{ firstName: '', lastName: '' }]
  });
  const [addFamilyLoading, setAddFamilyLoading] = useState(false);
  const [addFamilyMessage, setAddFamilyMessage] = useState('');
  const [addFamilyError, setAddFamilyError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState('');
  const [editError, setEditError] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [familyResponse, statsResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.ADMIN.FAMILIES),
        axios.get(API_ENDPOINTS.ADMIN.STATS)
      ]);

      setFamilies(familyResponse.data.families);
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setError(error.response?.data?.error || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAdminData();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not submitted';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFamilySummary = (family) => {
    return family.members.reduce((summary, member) => {
      if (!member.rsvp) {
        summary.pending++;
      } else if (member.rsvp.willAttend) {
        summary.attending++;
      } else {
        summary.notAttending++;
      }
      return summary;
    }, { attending: 0, notAttending: 0, pending: 0 });
  };

  const handleAddMember = () => {
    setAddFamilyForm(prev => ({
      ...prev,
      members: [...prev.members, { firstName: '', lastName: '' }]
    }));
  };

  const handleRemoveMember = (index) => {
    if (addFamilyForm.members.length > 1) {
      setAddFamilyForm(prev => ({
        ...prev,
        members: prev.members.filter((_, i) => i !== index)
      }));
    }
  };

  const handleMemberChange = (index, field, value) => {
    setAddFamilyForm(prev => ({
      ...prev,
      members: prev.members.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const handleAddFamily = async (e) => {
    e.preventDefault();
    setAddFamilyLoading(true);
    setAddFamilyError('');
    setAddFamilyMessage('');

    if (!addFamilyForm.familyName.trim()) {
      setAddFamilyError('Family name is required');
      setAddFamilyLoading(false);
      return;
    }

    if (addFamilyForm.members.some(member => !member.firstName.trim() || !member.lastName.trim())) {
      setAddFamilyError('All family members must have first and last names');
      setAddFamilyLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.ADMIN.ADD_FAMILY, {
        familyName: addFamilyForm.familyName.trim(),
        members: addFamilyForm.members.map(member => ({
          firstName: member.firstName.trim(),
          lastName: member.lastName.trim()
        }))
      });

      if (response.data.success) {
        setAddFamilyMessage(`Successfully added family "${addFamilyForm.familyName}" with ${addFamilyForm.members.length} members!`);
        setAddFamilyForm({
          familyName: '',
          members: [{ firstName: '', lastName: '' }]
        });
        setShowAddFamily(false);
        await loadAdminData(); // Refresh the data
      }
    } catch (error) {
      console.error('Error adding family:', error);
      setAddFamilyError(error.response?.data?.error || 'Failed to add family. Please try again.');
    } finally {
      setAddFamilyLoading(false);
    }
  };

  const handleDeleteMember = async (guestId, firstName, lastName) => {
    setDeleteLoading(true);
    setError('');
    setAddFamilyMessage('');

    try {
      const response = await axios.delete(API_ENDPOINTS.ADMIN.REMOVE_GUEST(guestId));
      
      if (response.data.success) {
        setAddFamilyMessage(`Successfully removed ${firstName} ${lastName} from the guest list`);
        await loadAdminData(); // Refresh the data
      }
    } catch (error) {
      console.error('Error removing member:', error);
      setError(error.response?.data?.error || 'Failed to remove member. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirm(null);
    }
  };

  const handleDeleteFamily = async (familyId, familyName) => {
    setDeleteLoading(true);
    setError('');
    setAddFamilyMessage('');

    try {
      const response = await axios.delete(API_ENDPOINTS.ADMIN.REMOVE_FAMILY(familyId));
      
      if (response.data.success) {
        setAddFamilyMessage(`Successfully removed the ${familyName} family and all members`);
        await loadAdminData(); // Refresh the data
      }
    } catch (error) {
      console.error('Error removing family:', error);
      setError(error.response?.data?.error || 'Failed to remove family. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirm(null);
    }
  };

  const confirmDelete = (type, id, name, extraData = null) => {
    setDeleteConfirm({
      type,
      id,
      name,
      extraData
    });
  };

  // Editing functions
  const startEditing = (member) => {
    setEditingMember(member.guestId);
    setEditForm({
      firstName: member.firstName,
      lastName: member.lastName
    });
    setEditError('');
    setEditMessage('');
    setAddFamilyMessage(''); // Clear any previous success messages
    setAddFamilyError(''); // Clear any previous error messages
  };

  const cancelEditing = () => {
    setEditingMember(null);
    setEditForm({ firstName: '', lastName: '' });
    setEditError('');
    setEditMessage('');
  };

  const handleEditSubmit = async (guestId) => {
    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      setEditError('Both first name and last name are required');
      return;
    }

    setEditLoading(true);
    setEditError('');
    setEditMessage('');

    try {
      const response = await axios.put(API_ENDPOINTS.ADMIN.UPDATE_GUEST(guestId), {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim()
      });

      if (response.data.success) {
        setEditMessage(response.data.message);
        setEditingMember(null);
        setEditForm({ firstName: '', lastName: '' });
        await loadAdminData(); // Refresh the data
      }
    } catch (error) {
      console.error('Error updating member:', error);
      setEditError(error.response?.data?.error || 'Failed to update member name. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading admin dashboard..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="alert alert-error">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={refreshData} 
            retryText="Try Again" 
          />
        )}

        <PageHeader 
          title="Admin Dashboard"
          subtitle="Roxanne's Baby Shower Family RSVP Management"
        />
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <button 
            onClick={refreshData} 
            className="btn btn-secondary"
            disabled={refreshing}
            style={{
              fontSize: '1.1rem',
              padding: '0.8rem 2rem',
              background: COLORS.SECONDARY,
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontWeight: 'bold'
            }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

                {/* Statistics Overview */}
        <h2 style={{ color: '#000000', fontSize: '2rem', marginBottom: '2rem' }}>Overview Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.totalResponses || 0}</span>
            <span className="stat-label">Responses</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.attending || 0}</span>
            <span className="stat-label">Attending</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.notAttending || 0}</span>
            <span className="stat-label">Not Attending</span>
          </div>
        </div>

        {/* Add Family Section */}
        <div style={{ marginTop: '4rem', marginBottom: '3rem' }}>
          <div style={{ 
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: '#000000', fontSize: '2rem', margin: '0 0 1.5rem 0' }}>Manage Invitees</h2>
            <button
              onClick={() => {
                setShowAddFamily(!showAddFamily);
                setAddFamilyError('');
                setAddFamilyMessage('');
              }}
              style={{
                background: showAddFamily ? '#666666' : '#CE9647',
                border: 'none',
                color: '#ffffff',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {showAddFamily ? 'Cancel' : 'Add New Family'}
            </button>
          </div>

          {addFamilyMessage && <SuccessMessage message={addFamilyMessage} />}
          {addFamilyError && <ErrorMessage message={addFamilyError} />}
          {editMessage && <SuccessMessage message={editMessage} />}
          {editError && <ErrorMessage message={editError} />}

          {showAddFamily && (
            <div style={{ 
              background: '#1a1a1a',
              padding: '2rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: '#CE9647', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                Add New Family
              </h3>
              
              <form onSubmit={handleAddFamily}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: 'bold',
                    color: '#ffffff'
                  }}>
                    Family Name *
                  </label>
                  <input
                    type="text"
                    value={addFamilyForm.familyName}
                    onChange={(e) => setAddFamilyForm(prev => ({ ...prev, familyName: e.target.value }))}
                    placeholder="Enter family name (e.g., Smith, Johnson)"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '4px',
                      border: '1px solid #333333',
                      background: '#2a2a2a',
                      color: '#ffffff',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <label style={{ 
                      fontWeight: 'bold',
                      color: '#ffffff'
                    }}>
                      Family Members *
                    </label>
                    <button
                      type="button"
                      onClick={handleAddMember}
                      style={{
                        background: '#28a745',
                        border: 'none',
                        color: '#ffffff',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      + Add Member
                    </button>
                  </div>

                  {addFamilyForm.members.map((member, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      marginBottom: '1rem',
                      alignItems: 'center'
                    }}>
                      <input
                        type="text"
                        value={member.firstName}
                        onChange={(e) => handleMemberChange(index, 'firstName', e.target.value)}
                        placeholder="First Name"
                        style={{
                          flex: 1,
                          padding: '0.8rem',
                          borderRadius: '4px',
                          border: '1px solid #333333',
                          background: '#2a2a2a',
                          color: '#ffffff',
                          fontSize: '1rem'
                        }}
                      />
                      <input
                        type="text"
                        value={member.lastName}
                        onChange={(e) => handleMemberChange(index, 'lastName', e.target.value)}
                        placeholder="Last Name"
                        style={{
                          flex: 1,
                          padding: '0.8rem',
                          borderRadius: '4px',
                          border: '1px solid #333333',
                          background: '#2a2a2a',
                          color: '#ffffff',
                          fontSize: '1rem'
                        }}
                      />
                      {addFamilyForm.members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(index)}
                          style={{
                            background: '#dc3545',
                            border: 'none',
                            color: '#ffffff',
                            padding: '0.8rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    disabled={addFamilyLoading}
                    style={{
                      background: '#CE9647',
                      border: 'none',
                      color: '#ffffff',
                      padding: '1rem 2rem',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: addFamilyLoading ? 'not-allowed' : 'pointer',
                      opacity: addFamilyLoading ? 0.6 : 1
                    }}
                  >
                    {addFamilyLoading ? 'Adding Family...' : 'Add Family'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddFamily(false);
                      setAddFamilyForm({
                        familyName: '',
                        members: [{ firstName: '', lastName: '' }]
                      });
                      setAddFamilyError('');
                      setAddFamilyMessage('');
                    }}
                    style={{
                      background: '#666666',
                      border: 'none',
                      color: '#ffffff',
                      padding: '1rem 2rem',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        
        {families.map((family) => {
          const familySummary = getFamilySummary(family);
          return (
            <div key={family.familyId} style={{ 
              marginBottom: '3rem',
              borderLeft: '3px solid #CE9647',
              paddingLeft: '2rem',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              width: '60%',
              margin: '0 auto 3rem auto'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ 
                  color: '#CE9647',
                  fontSize: '1.8rem',
                  margin: 0,
                  textAlign: 'center'
                }}>
                  {family.familyName}
                </h3>
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{ color: '#ffffff' }}>
                      ✅ {familySummary.attending} attending
                    </span>
                    <span style={{ color: '#cccccc' }}>
                      ❌ {familySummary.notAttending} not attending
                    </span>
                    <span style={{ color: '#CE9647' }}>
                      ⏳ {familySummary.pending} pending
                    </span>
                  </div>
                  <button
                    onClick={() => confirmDelete('family', family.familyId, family.familyName)}
                    style={{
                      background: '#dc3545',
                      border: 'none',
                      color: '#ffffff',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Delete Family
                  </button>
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr', 
                gap: '1rem' 
              }}>
                {family.members.map((member) => (
                  <div key={member.guestId} style={{ 
                    padding: '1rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    border: member.rsvp?.willAttend ? '1px solid #ffffff' : 
                           member.rsvp?.willAttend === false ? '1px solid #666666' : 
                           '1px solid #CE9647'
                  }}>
                    {editingMember === member.guestId ? (
                      // Editing mode
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ 
                          display: 'flex', 
                          gap: '0.5rem',
                          marginBottom: '0.5rem'
                        }}>
                          <input
                            type="text"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                            placeholder="First Name"
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              borderRadius: '4px',
                              border: '1px solid #333333',
                              background: '#2a2a2a',
                              color: '#ffffff',
                              fontSize: '0.9rem'
                            }}
                          />
                          <input
                            type="text"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                            placeholder="Last Name"
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              borderRadius: '4px',
                              border: '1px solid #333333',
                              background: '#2a2a2a',
                              color: '#ffffff',
                              fontSize: '0.9rem'
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEditSubmit(member.guestId)}
                            disabled={editLoading}
                            style={{
                              background: '#28a745',
                              border: 'none',
                              color: '#ffffff',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              cursor: editLoading ? 'not-allowed' : 'pointer',
                              fontWeight: 'bold',
                              opacity: editLoading ? 0.6 : 1
                            }}
                          >
                            {editLoading ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={cancelEditing}
                            disabled={editLoading}
                            style={{
                              background: '#6c757d',
                              border: 'none',
                              color: '#ffffff',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              cursor: editLoading ? 'not-allowed' : 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Normal view mode
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <h4 style={{ 
                          margin: 0,
                          color: '#ffffff',
                          fontSize: '1.1rem'
                        }}>
                          {member.firstName} {member.lastName}
                        </h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => startEditing(member)}
                            style={{
                              background: '#007bff',
                              border: 'none',
                              color: '#ffffff',
                              padding: '0.3rem 0.6rem',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete('member', member.guestId, `${member.firstName} ${member.lastName}`)}
                            style={{
                              background: '#dc3545',
                              border: 'none',
                              color: '#ffffff',
                              padding: '0.3rem 0.6rem',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {!member.rsvp ? (
                      <p style={{ color: '#CE9647', fontWeight: 'bold' }}>No Response Yet</p>
                    ) : (
                      <div>
                        <p style={{ 
                          color: member.rsvp.willAttend ? '#ffffff' : '#cccccc',
                          fontWeight: 'bold',
                          marginBottom: '0.5rem'
                        }}>
                          {member.rsvp.willAttend ? 'Attending' : 'Not Attending'}
                        </p>
                        
                                                 {member.rsvp.willAttend && (
                           <>
                             {member.rsvp.dietaryRestrictions && (
                               <p style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                                 <strong>Dietary:</strong> {member.rsvp.dietaryRestrictions}
                               </p>
                             )}
                             {member.rsvp.individualNotes && (
                               <p style={{ fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.8 }}>
                                 <strong>Notes:</strong> {member.rsvp.individualNotes}
                               </p>
                             )}
                           </>
                         )}
                        
                        <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>
                          Submitted: {formatDate(member.rsvp.updatedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Dietary Restrictions Summary */}
        <h2 className="section-separator" style={{ 
          color: '#CE9647',
          fontSize: '2rem',
          marginBottom: '2rem'
        }}>Dietary Restrictions Summary</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '3rem' 
        }}>
          {families.flatMap(family => 
            family.members.filter(member => 
              member.rsvp?.willAttend && member.rsvp?.dietaryRestrictions
            )
          ).map((member, index) => (
            <div key={index} style={{ 
              padding: '1.5rem',
              borderLeft: '3px solid #CE9647',
              paddingLeft: '2rem'
            }}>
              <h4 style={{ 
                marginBottom: '0.8rem',
                color: '#ffffff',
                fontSize: '1.1rem'
              }}>
                {member.firstName} {member.lastName}
              </h4>
              <p style={{ 
                marginTop: '0.5rem',
                fontSize: '1rem',
                opacity: 0.9
              }}>
                {member.rsvp.dietaryRestrictions}
              </p>
            </div>
          ))}
        </div>

        {families.flatMap(family => 
          family.members.filter(member => 
            member.rsvp?.willAttend && member.rsvp?.dietaryRestrictions
          )
        ).length === 0 && (
          <p style={{ opacity: 0.7, fontStyle: 'italic' }}>
            No dietary restrictions reported yet.
          </p>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#1a1a1a',
              padding: '2rem',
              borderRadius: '8px',
              border: '2px solid #CE9647',
              maxWidth: '500px',
              width: '90%'
            }}>
              <h3 style={{ 
                color: '#CE9647', 
                marginBottom: '1rem',
                fontSize: '1.5rem'
              }}>
                Confirm Deletion
              </h3>
              
              <p style={{ 
                color: '#ffffff', 
                marginBottom: '1.5rem',
                fontSize: '1.1rem',
                lineHeight: '1.5'
              }}>
                {deleteConfirm.type === 'family' ? (
                  <>
                    Are you sure you want to delete the <strong>{deleteConfirm.name}</strong> family?
                    <br /><br />
                    <span style={{ color: '#CE9647', fontWeight: 'bold' }}>
                      This will permanently remove all family members and their RSVPs. This action cannot be undone.
                    </span>
                  </>
                ) : (
                  <>
                    Are you sure you want to remove <strong>{deleteConfirm.name}</strong> from the guest list?
                    <br /><br />
                    <span style={{ color: '#CE9647' }}>
                      This will also remove their RSVP if they have submitted one.
                    </span>
                  </>
                )}
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleteLoading}
                  style={{
                    background: '#666666',
                    border: 'none',
                    color: '#ffffff',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    cursor: deleteLoading ? 'not-allowed' : 'pointer',
                    opacity: deleteLoading ? 0.6 : 1
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirm.type === 'family') {
                      handleDeleteFamily(deleteConfirm.id, deleteConfirm.name);
                    } else {
                      handleDeleteMember(deleteConfirm.id, deleteConfirm.name.split(' ')[0], deleteConfirm.name.split(' ')[1]);
                    }
                  }}
                  disabled={deleteLoading}
                  style={{
                    background: '#dc3545',
                    border: 'none',
                    color: '#ffffff',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: deleteLoading ? 'not-allowed' : 'pointer',
                    opacity: deleteLoading ? 0.6 : 1
                  }}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin; 
