import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <div className="App">

      
      <Navigation />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout; 