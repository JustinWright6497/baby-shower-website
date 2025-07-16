import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout>
      <div>
        <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '3rem' }}>
          <h1 style={{ 
            fontFamily: 'Playfair Display, serif',
            fontSize: '4rem',
            fontWeight: '300',
            color: '#000000',
            marginBottom: '0.5rem',
            letterSpacing: '0.1em'
          }}>
            A BABY
          </h1>
          <h1 style={{ 
            fontFamily: 'Dancing Script, cursive',
            fontSize: '4rem',
            fontWeight: '400',
            color: '#CE9647',
            marginBottom: '0',
            letterSpacing: '0.05em'
          }}>
            is brewing!
          </h1>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
            Join us for a baby shower honoring
          </p>
          <h1 style={{ 
            fontFamily: 'Playfair Display, serif',
            fontSize: '4rem',
            fontWeight: '300',
            color: '#CE9647',
            marginBottom: '0',
            letterSpacing: '0.1em'
          }}>
            ROXANNE WRIGHT
          </h1>
        </div>

        <div className="section-separator"></div>

        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ 
            fontSize: '3rem', 
            marginBottom: '1.5rem',
            color: '#000000'
          }}>When</h2>
          <p style={{ 
            fontSize: '1.8rem', 
            lineHeight: '1.8',
            color: '#f0f0f0',
            marginBottom: '3rem'
          }}>
            <strong>November 1st, 2025</strong><br />
            At 1:00 PM CST (anticipated start dependent on venue availability)
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ 
            fontSize: '3rem', 
            marginBottom: '1.5rem',
            color: '#000000'
          }}>Where</h2>
          <p style={{ 
            fontSize: '1.8rem', 
            lineHeight: '1.8',
            color: '#f0f0f0',
            marginBottom: '3rem'
          }}>
            <strong>Venue TBD</strong><br />
            Kansas City, MO
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ 
            fontSize: '3rem', 
            marginBottom: '1.5rem',
            color: '#000000'
          }}>Theme</h2>
          <p style={{ 
            fontSize: '1.8rem', 
            lineHeight: '1.8',
            color: '#f0f0f0',
            marginBottom: '1rem'
          }}>
            <strong>Halloween Costume Party!</strong><br />
            Costumes Required!
          </p>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#f0f0f0',
            marginBottom: '3rem'
          }}>
            See <Link to="/costume-contest" style={{ color: '#CE9647', textDecoration: 'underline' }}>Costume Contest</Link> page for more info!
          </p>
        </div>



        <div className="section-separator" style={{ 
          textAlign: 'center', 
          padding: '2rem 0',
          color: '#000000',
        }}>
          <h2>Can't Wait to See You!</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Thank you for helping us welcome Stevie!
          </p>
          <p style={{ fontSize: '1rem', opacity: 0.8 }}>
            Don't forget to RSVP by Sept. 1st! The sooner people RSVP the sooner we can confirm a venue!
          </p>
          <div style={{ fontSize: '2rem', marginTop: '2rem' }}>
            • ◦ • ◦ • ◦ • ◦ •
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home; 
