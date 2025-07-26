import React from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import SectionHeader from '../components/SectionHeader';
import ContentContainer from '../components/ContentContainer';

const CostumeParty = () => {
  return (
    <Layout>
      <div>
        <PageHeader 
          title="Costume Contest!"
          description="Come dressed to impress and win some fun prizes!"
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

        <h2 style={{ 
          color: '#CE9647',
          textAlign: 'center',
          fontSize: '3rem',
          marginBottom: '2rem',
          marginTop: '3rem'
        }}>Contest Categories & Prizes</h2>
        <ContentContainer>
          <SectionHeader 
            title="Best Overall Single" 
            color="#000000"
            subtitle=""
          />
          <SectionHeader 
            title="Best Overall Couple" 
            color="#000000"
            subtitle=""
          />
          <SectionHeader 
            title="Best Baby-Themed" 
            color="#000000"
            subtitle=""
          />
          <SectionHeader 
            title="Most Clever/Funniest" 
            color="#000000"
            subtitle=""
          />
          <SectionHeader 
            title="Most Iconic" 
            color="#000000"
            subtitle=""
          />
          <SectionHeader 
            title="The Parents' Favorite" 
            color="#000000"
            subtitle="There will be prizes for the winners of each category!"
          />
        </ContentContainer>

        <h2 className="section-separator" style={{ 
          color: '#CE9647'
        }}>Contest Rules & Guidelines</h2>
        <ContentContainer>
          <SectionHeader 
            title="Rules & Guidelines" 
            color="#000000"
            subtitle="Anyone coming dressed as a member of our current government or in any offensive costume will be asked to remove their costume before entering"
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
