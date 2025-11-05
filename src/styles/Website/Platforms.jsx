import React from 'react';
import '../../styles/Website/Platforms.css';

function Platforms() {
  const platforms = [
    { 
      name: 'MT5 Desktop', 
      icon: '💻', 
      desc: 'Full-featured terminal for Windows and Mac'
    },
    { 
      name: 'MT5 Web', 
      icon: '🌐', 
      desc: 'Trade directly from your browser'
    },
    { 
      name: 'MT5 Mobile', 
      icon: '📱', 
      desc: 'iOS and Android apps for trading on the go'
    }
  ];

  return (
    <section className="platforms" id="platforms">
      <div className="container">
        <h2 className="section-title">Trading Platforms</h2>
        <p className="section-subtitle">Access global markets with MetaTrader 5</p>
        <div className="platforms-grid">
          {platforms.map((p, i) => (
            <div className="platform-card" key={i}>
              <div className="platform-icon">{p.icon}</div>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <button className="btn-download">Download</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Platforms;