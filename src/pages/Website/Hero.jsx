import React from 'react';
import '../../styles/Website/Hero.css';

function Hero({ onOpenModal }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1 className="hero-title">
          Xmindia — Precision Brokerage for Modern Traders
        </h1>
        <p className="hero-subtitle">
          Institutional-grade pricing, lightning execution and local funding — 
          all in one secure platform.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={onOpenModal}>
            Open Account
          </button>
          <button className="btn btn-secondary" onClick={() => scrollTo('partners')}>
            Become a Partner
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;