import React from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import SectionHeader from '../components/SectionHeader';
import ContentContainer from '../components/ContentContainer';
import useScrollToTop from '../hooks/useScrollToTop';

const CostumeParty = () => {
  useScrollToTop();


  return (
    <Layout>
      <div>
        <PageHeader 
          title="Costume Contest!"
          subtitle="Get ready for our beautiful halloween style competition!"
          description="Come dressed to impress and win some wonderful prizes!"
        />

        <div style={{ 
          background: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <strong>Contest Schedule:</strong> Style judging starts at 2:30 PM sharp (1.5 hours after start)!<br /> 
          Make sure to arrive by then for photos and the contest.
          Winners announced immediately after!
        </div>

        <SectionHeader title="Contest Categories & Prizes" color="#000000" />
        <ContentContainer>
          <SectionHeader 
            title="Categories & Prizes to be announced" 
            color="#CE9647"
            subtitle="Contact Hosts/watch out on this page for updates!"
          />
        </ContentContainer>

        <h2 className="section-separator" style={{ 
          color: '#CE9647'
        }}>Contest Rules & Guidelines</h2>
        <ContentContainer>
          <SectionHeader 
            title="Rules & Guidelines to be announced" 
            color="#000000"
            subtitle="Contact Hosts/watch out on this page for updates!"
          />
        </ContentContainer>



        <div className="section-separator" style={{ 
          textAlign: 'center', 
          padding: '2rem 0'
        }}>
          <h2>Ready to Show Your Style?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            We can't wait to see everyone's unique halloween costumes!
          </p>
          <div style={{ fontSize: '2rem', marginTop: '2rem' }}>
            • ◦ • ◦ • ◦ • ◦ •
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CostumeParty; 
