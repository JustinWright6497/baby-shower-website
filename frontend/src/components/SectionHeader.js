import React from 'react';

const SectionHeader = ({ 
  title, 
  subtitle,
  color = '#000000',
  fontSize = '1.8rem',
  fontWeight = '600',
  marginBottom = '1rem',
  textAlign = 'center',
  fontFamily = 'inherit'
}) => {
  return (
    <div style={{ marginBottom: subtitle ? '1rem' : '2rem' }}>
      <h3 style={{ 
        color,
        fontSize,
        fontWeight,
        marginBottom,
        textAlign,
        fontFamily
      }}>
        {title}
      </h3>
      
      {subtitle && (
        <p style={{ 
          fontSize: '1.1rem', 
          opacity: 0.8,
          lineHeight: '1.6',
          textAlign,
          marginBottom: '2rem'
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader; 