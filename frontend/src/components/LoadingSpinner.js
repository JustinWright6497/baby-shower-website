import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">Loading...</div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner; 