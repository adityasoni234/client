import React from 'react';
import '../../styles/Website/Features.css';

function Features() {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast Execution',
      desc: 'Order execution in milliseconds with zero requotes'
    },
    {
      icon: '📊',
      title: 'Tight Spreads',
      desc: 'Spreads starting from 0.0 pips on major pairs'
    },
    {
      icon: '💳',
      title: 'Local Payments',
      desc: 'Instant deposits via UPI, IMPS, and bank transfer'
    },
    {
      icon: '🛡️',
      title: 'Segregated Funds',
      desc: 'Capital protected in segregated tier-1 bank accounts'
    },
    {
      icon: '🔒',
      title: 'Secure KYC',
      desc: 'Bank-grade security with OCR verification'
    },
    {
      icon: '📞',
      title: '24×7 Support',
      desc: 'Round-the-clock multilingual support team'
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <h2 className="section-title">Why Choose Xmindia?</h2>
        <p className="section-subtitle">
          Experience institutional-grade trading with retail accessibility
        </p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;