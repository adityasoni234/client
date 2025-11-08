import React from 'react';
import { FiShare2, FiCopy } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookMessenger, FaFacebookF } from 'react-icons/fa';
import '../../styles/Admin/ReferralLinks.css';

function ReferralLinks() {
  const referralLink = 'https://portal.prestigeglobalfx.com/user/register?ib_code=900909477879';
  const ibCode = '900909477879';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  const handleShareWhatsApp = () => {
    const message = `Join me on this amazing trading platform! Use my referral link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShareMessenger = () => {
    alert('Opening Messenger share...');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
  };

  return (
    <div className="referral-links-page">
      <div className="referral-content">
        <div className="referral-icon-container">
          <div className="referral-icon">
            <FiShare2 size={48} />
          </div>
        </div>

        <h1>Your Referral Link</h1>
        <p className="referral-subtitle">
          Share this link to attract new clients and start earning commissions.
        </p>

        <div className="referral-section">
          <label>Your unique link</label>
          <div className="link-input-group">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="referral-input"
            />
            <button className="btn-copy" onClick={handleCopy}>
              <FiCopy /> Copy
            </button>
          </div>
        </div>

        <div className="share-section">
          <p className="share-text">Or share directly on:</p>
          <div className="social-buttons">
            <button className="social-btn whatsapp" onClick={handleShareWhatsApp}>
              <FaWhatsapp size={24} />
            </button>
            <button className="social-btn messenger" onClick={handleShareMessenger}>
              <FaFacebookMessenger size={24} />
            </button>
            <button className="social-btn facebook" onClick={handleShareFacebook}>
              <FaFacebookF size={24} />
            </button>
          </div>
        </div>

        <div className="info-box">
          <h3>How it works:</h3>
          <ul>
            <li>Share your unique referral link with potential clients</li>
            <li>When they sign up using your link, they become your referred client</li>
            <li>Earn commissions on every trade they make</li>
            <li>Track all your referrals in the "Attracted Clients" section</li>
          </ul>
        </div>

        <div className="ib-code-section">
          <p>Your IB Code: <strong>{ibCode}</strong></p>
        </div>
      </div>
    </div>
  );
}

export default ReferralLinks;