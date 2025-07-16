import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import SectionHeader from '../components/SectionHeader';
import ContentContainer from '../components/ContentContainer';
import useScrollToTop from '../hooks/useScrollToTop';

const PartyInfo = () => {
  useScrollToTop();
  return (
    <Layout>
      <div>
        <PageHeader title="Party Information" />
        
        <ContentContainer>
          
          <div style={{ marginBottom: '3rem' }}>
            <SectionHeader title="Event Details" color="black" />
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              <strong>Date:</strong> November 1st, 2025<br />
              <strong>Time:</strong> 1:00 PM CST (anticipated start dependent on venue availability)<br />
              <strong>Location:</strong> Venue TBD<br />
              Kansas City, MO
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <SectionHeader title="Dress Code" color="black" />
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              <strong>Costume Party!</strong><br />
              COSTUMES REQUIRED!<br />
              See <Link to="/costume-contest" style={{ color: '#CE9647', textDecoration: 'underline' }}>Costume Contest</Link> page.
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ 
              color: 'black', 
              marginBottom: '1rem',
              fontSize: '1.8rem',
              fontWeight: '600'
            }}>
              Kid-Friendly
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              Kids are welcome, however, child specific activities will not be present, please plan accordingly
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ 
              color: 'black', 
              marginBottom: '1rem',
              fontSize: '1.8rem',
              fontWeight: '600'
            }}>
              Food & Drink
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              Food and Beverages will be provided (Alcoholic and NA!). Expect a chili bar and appetizer style foods and desserts! More info to come based on dietary restrictions from RSVPs, please make sure to list dietary restrictions when RSVPing!
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ 
              color: 'black', 
              marginBottom: '1rem',
              fontSize: '1.8rem',
              fontWeight: '600'
            }}>
              Activities
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              Activities: TBD!
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ 
              color: 'black', 
              marginBottom: '1rem',
              fontSize: '1.8rem',
              fontWeight: '600'
            }}>
              Facebook Event
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              If you are digital, you can find our facebook event here! (if this is not a link yet, we have yet to make it please check back later!)
            </p>
          </div>
        </ContentContainer>

        <div className="section-separator" style={{ 
          textAlign: 'center', 
          padding: '2rem 0'
        }}>
          <h2>Can't Wait to Celebrate!</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Thank you for being part of our special day!
          </p>
          <p style={{ fontSize: '1rem', opacity: 0.8 }}>
            Don't forget to RSVP so we can plan the perfect celebration for everyone!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PartyInfo; 
