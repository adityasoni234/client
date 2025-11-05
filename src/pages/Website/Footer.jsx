import React from 'react';
import '../../styles/Website/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Xmindia</h3>
            <p>Trade Smarter. Grow Faster.</p>
            <p className="company-info">Your trusted partner in global financial markets</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#platforms">Platforms</a></li>
              <li><a href="#markets">Markets</a></li>
              <li><a href="#accounts">Accounts</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#withdrawal">Withdrawal Policy</a></li>
              <li><a href="#risk">Risk Disclosure</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-icons">
              <a href="#facebook" aria-label="Facebook">📘</a>
              <a href="#twitter" aria-label="Twitter">🐦</a>
              <a href="#linkedin" aria-label="LinkedIn">💼</a>
              <a href="#telegram" aria-label="Telegram">✈️</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="risk-warning">
            Risk Warning: Trading leveraged products involves substantial risk and may not be suitable for all investors.
          </p>
          <p className="copyright">© {new Date().getFullYear()} Xmindia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;