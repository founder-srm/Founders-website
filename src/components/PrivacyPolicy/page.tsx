import React from 'react';

const PrivacyPolicy = () => {
  const containerStyle = {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  };

  const headerStyle = {
    fontSize: '2.5rem',
    marginBottom: '20px',
  };

  const sectionStyle = {
    marginTop: '20px',
  };

  const subHeaderStyle = {
    fontSize: '1.5rem',
    marginTop: '20px',
  };

  const paragraphStyle = {
    lineHeight: '1.6',
    fontSize: '1rem',
  };

  const listStyle = {
    listStyleType: 'disc',
    marginLeft: '20px',
  };

  const footerStyle = {
    marginTop: '30px',
    fontStyle: 'italic',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Privacy Policy</h1>
      <p style={paragraphStyle}>
        This Privacy Policy outlines how we collect, use, and protect your personal information when you use our website.
      </p>
      <section style={sectionStyle}>
        <h2 style={subHeaderStyle}>1. Information We Collect</h2>
        <p style={paragraphStyle}>
          We collect information that you provide to us, such as your name, email, company, phone number, etc., when you fill out forms or register on our website.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={subHeaderStyle}>2. How We Use Your Information</h2>
        <p style={paragraphStyle}>
          The information we collect is used to:
          <ul style={listStyle}>
            <li>Provide you with requested services</li>
            <li>Communicate with you regarding your inquiries</li>
            <li>Improve our services and website functionality</li>
            <li>Send you marketing materials (if you’ve opted in)</li>
          </ul>
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={subHeaderStyle}>3. Sharing Your Information</h2>
        <p style={paragraphStyle}>
          We do not sell, trade, or rent your personal information to third parties. We may share it with trusted service providers who assist us in operating our website and conducting our business, as long as they agree to keep this information confidential.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={subHeaderStyle}>4. Data Security</h2>
        <p style={paragraphStyle}>
          We take reasonable precautions to protect your information from unauthorized access, alteration, or destruction.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={subHeaderStyle}>5. Cookies</h2>
        <p style={paragraphStyle}>
          Our website uses cookies to improve your experience. You can choose to disable cookies through your browser settings.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={subHeaderStyle}>6. Your Rights</h2>
        <p style={paragraphStyle}>
          You have the right to:
          <ul style={listStyle}>
            <li>Access the personal data we have about you</li>
            <li>Request the correction or deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={subHeaderStyle}>7. Changes to this Privacy Policy</h2>
        <p style={paragraphStyle}>
          We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the updated policy on this page.
        </p>
      </section>

      <footer style={footerStyle}>
        <p>Last updated: January 2025</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
