import React from 'react';

const ErrorMessage = ({ message, onRetry, retryText = 'Try Again' }) => {
  return (
    <div style={{
      background: '#ff4444',
      color: '#ffffff',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      textAlign: 'center'
    }}>
      <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 