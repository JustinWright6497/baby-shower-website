import React from 'react';

const SuccessMessage = ({ message }) => {
  return (
    <div style={{
      background: '#28a745',
      color: '#ffffff',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      textAlign: 'center'
    }}>
      <p style={{ margin: 0, fontWeight: '500' }}>{message}</p>
    </div>
  );
};

export default SuccessMessage; 