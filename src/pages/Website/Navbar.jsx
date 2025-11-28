import React, { useState, useEffect } from 'react';
import '../../styles/Website/Navbar.css';

function Navbar({ onOpenModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo and Brand */}
        <div className="navbar-brand">
          <img src="/logo.jpeg" alt="Xmindia Logo" className="navbar-logo-img" />
          <span className="navbar-logo-text">Xmindia</span>
        </div>
        
        {/* Navigation Menu */}
        <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><a onClick={() => scrollToSection('home')}>Home</a></li>
          <li><a onClick={() => scrollToSection('platforms')}>Platforms</a></li>
          <li><a onClick={() => scrollToSection('markets')}>Markets</a></li>
          <li><a onClick={() => scrollToSection('accounts')}>Accounts</a></li>
          <li><a onClick={() => scrollToSection('funding')}>Funding</a></li>
          <li><a onClick={() => scrollToSection('partners')}>Partners</a></li>
          <li><a onClick={() => scrollToSection('contact')}>Contact</a></li>
        </ul>
        
        {/* CTA Button */}
        <button className="navbar-cta" onClick={onOpenModal}>
          Open Account
        </button>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="navbar-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;