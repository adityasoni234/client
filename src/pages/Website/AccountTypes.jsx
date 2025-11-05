import React from 'react';
import '../../styles/Website/AccountTypes.css';

function AccountTypes({ onOpenModal }) {
  const accounts = [
    { 
      name: 'Standard', 
      minDeposit: '$100', 
      leverage: '1:500', 
      commission: 'No', 
      spread: '1.0', 
      stopOut: '50%', 
      currency: 'INR/USD' 
    },
    { 
      name: 'ECN', 
      minDeposit: '$500', 
      leverage: '1:400', 
      commission: '$3/lot', 
      spread: '0.0', 
      stopOut: '50%', 
      currency: 'USD', 
      popular: true 
    },
    { 
      name: 'Master', 
      minDeposit: '$5,000', 
      leverage: '1:200', 
      commission: '$2/lot', 
      spread: '0.0', 
      stopOut: '30%', 
      currency: 'USD' 
    }
  ];

  return (
    <section className="account-types" id="accounts">
      <div className="container">
        <h2 className="section-title">Choose Your Account</h2>
        <p className="section-subtitle">Tailored account types for every trading style</p>
        
        <div className="accounts-grid">
          {accounts.map((acc, i) => (
            <div className={`account-card ${acc.popular ? 'popular' : ''}`} key={i}>
              {acc.popular && <span className="badge">Most Popular</span>}
              <h3>{acc.name}</h3>
              <div className="account-details">
                <div className="detail">
                  <span className="label">Min Deposit</span>
                  <span className="value">{acc.minDeposit}</span>
                </div>
                <div className="detail">
                  <span className="label">Leverage</span>
                  <span className="value">{acc.leverage}</span>
                </div>
                <div className="detail">
                  <span className="label">Commission</span>
                  <span className="value">{acc.commission}</span>
                </div>
                <div className="detail">
                  <span className="label">Spread From</span>
                  <span className="value">{acc.spread} pips</span>
                </div>
                <div className="detail">
                  <span className="label">Stop-out</span>
                  <span className="value">{acc.stopOut}</span>
                </div>
                <div className="detail">
                  <span className="label">Currency</span>
                  <span className="value">{acc.currency}</span>
                </div>
              </div>
              <button className="btn-select" onClick={onOpenModal}>
                Select Account
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AccountTypes;