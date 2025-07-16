import React from 'react';

const PageHeader = ({ 
  title, 
  subtitle, 
  description, 
  marginTop = '3rem', 
  marginBottom = '3rem',
  titleColor = '#CE9647',
  showSubtitle = true
}) => {
  return (
    <div style={{ 
      textAlign: 'center', 
      marginTop, 
      marginBottom 
    }}>
      <h1 style={{ 
        fontFamily: 'Dancing Script, cursive',
        fontSize: '4rem',
        fontWeight: '400',
        color: titleColor,
        marginBottom: subtitle || description ? '1rem' : '0',
        letterSpacing: '0.05em'
      }}>
        {title}
      </h1>
      
      {subtitle && showSubtitle && (
        <p style={{ 
          fontSize: '1.3rem', 
          opacity: 0.9, 
          marginBottom: description ? '1rem' : '2rem',
          color: '#ffffff'
        }}>
          {subtitle}
        </p>
      )}
      
      {description && (
        <p style={{ 
          fontSize: '1.1rem', 
          opacity: 0.9, 
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: '1.6',
          color: '#ffffff'
        }}>
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader; 