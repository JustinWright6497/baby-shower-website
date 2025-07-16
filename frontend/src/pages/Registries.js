import React from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import SectionHeader from '../components/SectionHeader';
import ContentContainer from '../components/ContentContainer';

const Registries = () => {
  const registryInfo = {
    name: 'babylist Registry',
    link: 'https://my.babylist.com/baby-registry-roxanne-wright'
  };

  return (
    <Layout>
      <div>
        <PageHeader title="Our Registries" />

        <div className="section-separator"></div>

        <h2 style={{ 
          fontFamily: 'Dancing Script, cursive',
          fontSize: '2.2rem',
          fontWeight: '400',
          color: '#000000',
          marginBottom: '0',
          letterSpacing: '0.05em',
          textAlign: 'center'
        }}>
          Book Registry
        </h2>
        <p style={{ 
          fontSize: '1.2rem', 
          textAlign: 'center', 
          marginBottom: '2rem',
          maxWidth: '800px',
          margin: '1rem auto 2rem'
        }}>
          Instead of a card, we have a small request. Please bring a book, that you love the best. We hope that you write a special line or two. So each time we read it, we will think of you!
        </p>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <a 
            href="https://www.bookshelfbuilder.com/registry/r-wright-2"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ 
              display: 'inline-block', 
              textDecoration: 'none',
              fontSize: '1.2rem',
              padding: '1.2rem 3rem',
              background: '#CE9647',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            View Book Registry
          </a>
        </div>

        <div className="section-separator"></div>

        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ 
            marginBottom: '4rem', 
            maxWidth: '1000px', 
            margin: '0 auto 4rem'
          }}>
            <SectionHeader title={registryInfo.name} fontSize="2.2rem" />

              <div style={{ 
                textAlign: 'center',
                marginBottom: '3rem'
              }}>
                <h4 style={{ 
                  fontSize: '1.6rem', 
                  marginBottom: '1rem', 
                  color: '#CE9647'
                }}>
                  Pre-Labor Items
                </h4>
                <p style={{ 
                  fontSize: '1.1rem', 
                  opacity: 0.8
                }}>
                  List of Pre-Labor Items to come!
                </p>
              </div>

              <div style={{ 
                textAlign: 'center',
                marginBottom: '3rem'
              }}>
                <h4 style={{ 
                  fontSize: '1.6rem', 
                  marginBottom: '1rem', 
                  color: '#CE9647'
                }}>
                  Featured Items:
                </h4>
                <p style={{ 
                  fontSize: '1.1rem', 
                  opacity: 0.8
                }}>
                  List of Featured Items to come!
                </p>
              </div>

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <a 
                  href={registryInfo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ 
                    display: 'inline-block', 
                    textDecoration: 'none',
                    fontSize: '1.3rem',
                    padding: '1.5rem 4rem',
                    background: '#CE9647',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  View Full Registry
                </a>
              </div>
            </div>
        </div>

        <div className="section-separator"></div>

        <h2 style={{ 
          color: '#CE9647',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>Gift Guidelines</h2>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem', 
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#000000' }}>Size Guidelines</h4>
            <p>
              Consider getting sizes 3-24 months since baby will grow quickly! 
              Newborn sizes are cute but used for such a short time.
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#000000' }}>Gift Receipt</h4>
            <p>
              Don't forget to include gift receipts! It helps us exchange sizes 
              or duplicate items if needed.
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#000000' }}>Group Gifts</h4>
            <p>
              Some items like strollers or cribs are perfect for group gifting! 
              babylist has functionality for contributing to group items!
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#000000' }}>Please...</h4>
            <p>
              Please no religious books or gifts. Please refer to the registry for gift ideas and contact hosts with questions.
            </p>
          </div>
        </div>

        <div className="section-separator"></div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '3rem',
          padding: '2rem 0'
        }}>
          <h2>Thank You!</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            We're so grateful for your love and support as we prepare for our little one.
          </p>
          <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '2rem' }}>
            Whether you choose to give a gift or just celebrate with us, 
            your presence at our baby shower means the world to us!
          </p>
          <div style={{ fontSize: '2rem', marginTop: '2rem' }}>
            • ◦ • ◦ • ◦ •
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Registries; 
