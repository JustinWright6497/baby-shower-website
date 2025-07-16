import React from 'react';

const ContentContainer = ({ 
  children,
  maxWidth = '600px',
  margin = '0 auto',
  padding = '2rem 1rem',
  textAlign = 'center',
  marginBottom = '3rem'
}) => {
  return (
    <div style={{ 
      maxWidth, 
      margin, 
      padding, 
      textAlign,
      marginBottom
    }}>
      {children}
    </div>
  );
};

export default ContentContainer; 