import React, { useState, useEffect } from 'react';
import { 
  MdCloudUpload, 
  MdCheckCircle,
  MdAccessTime,
  MdCancel,
  MdContentCopy
} from 'react-icons/md';
import './Deposit.css';

export default function Deposit() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('UPI');
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [depositHistory, setDepositHistory] = useState([
    {
      id: 1,
      amount: 10000,
      method: 'UPI',
      status: 'APPROVED',
      createdAt: new Date('2024-11-20'),
      approvedAt: new Date('2024-11-20')
    },
    {
      id: 2,
      amount: 5000,
      method: 'BANK_TRANSFER',
      status: 'PENDING',
      createdAt: new Date('2024-11-19'),
      approvedAt: null
    },
    {
      id: 3,
      amount: 3000,
      method: 'UPI',
      status: 'REJECTED',
      createdAt: new Date('2024-11-18'),
      rejectionReason: 'Invalid payment proof'
    }
  ]);

  const paymentDetails = {
    UPI: {
      id: 'stockvala@paytm',
      qr: '/assets/upi-qr.png' // Placeholder
    },
    BANK_TRANSFER: {
      accountName: 'StockVala Trading Pvt Ltd',
      accountNumber: '1234567890',
      ifsc: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branch: 'Mumbai Main Branch'
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 1000) {
      alert('Minimum deposit amount is ₹1,000');
      return;
    }

    if (!proofFile) {
      alert('Please upload payment proof');
      return;
    }

    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newDeposit = {
        id: Date.now(),
        amount: parseFloat(amount),
        method: method,
        status: 'PENDING',
        createdAt: new Date(),
        approvedAt: null
      };

      setDepositHistory([newDeposit, ...depositHistory]);
      
      // Reset form
      setAmount('');
      setUtrNumber('');
      setProofFile(null);
      setProofPreview(null);
      setSubmitting(false);

      alert('Deposit request submitted successfully! We will review and approve within 24 hours.');
    }, 1500);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'APPROVED':
        return <MdCheckCircle size={20} style={{ color: '#10b981' }} />;
      case 'PENDING':
        return <MdAccessTime size={20} style={{ color: '#f59e0b' }} />;
      case 'REJECTED':
        return <MdCancel size={20} style={{ color: '#ef4444' }} />;
      default:
        return null;
    }
  };

  return (
    <div className="deposit-container">
      <div className="deposit-header">
        <div>
          <h1>Deposit Funds</h1>
          <p>Add money to your trading account</p>
        </div>
      </div>

      <div className="deposit-content">
        {/* Deposit Form */}
        <div className="deposit-form-section">
          <div className="form-card">
            <h2>Make a Deposit</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Amount */}
              <div className="form-group">
                <label>Deposit Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (Min: ₹1,000)"
                  min="1000"
                  required
                />
                <small>Minimum deposit: ₹1,000</small>
              </div>

              {/* Payment Method */}
              <div className="form-group">
                <label>Payment Method</label>
                <select 
                  value={method} 
                  onChange={(e) => setMethod(e.target.value)}
                  required
                >
                  <option value="UPI">UPI</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>

              {/* Payment Details Display */}
              <div className="payment-details-card">
                <h3>Payment Details</h3>
                
                {method === 'UPI' ? (
                  <div className="upi-details">
                    <div className="detail-row">
                      <span className="label">UPI ID:</span>
                      <div className="value-with-copy">
                        <span className="value">{paymentDetails.UPI.id}</span>
                        <button 
                          type="button"
                          className="copy-btn"
                          onClick={() => copyToClipboard(paymentDetails.UPI.id)}
                        >
                          <MdContentCopy size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="qr-code-placeholder">
                      <p>📱 Scan QR Code to Pay</p>
                      <div className="qr-box">
                        <p>QR Code Here</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bank-details">
                    <div className="detail-row">
                      <span className="label">Account Name:</span>
                      <span className="value">{paymentDetails.BANK_TRANSFER.accountName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Account Number:</span>
                      <div className="value-with-copy">
                        <span className="value">{paymentDetails.BANK_TRANSFER.accountNumber}</span>
                        <button 
                          type="button"
                          className="copy-btn"
                          onClick={() => copyToClipboard(paymentDetails.BANK_TRANSFER.accountNumber)}
                        >
                          <MdContentCopy size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="detail-row">
                      <span className="label">IFSC Code:</span>
                      <div className="value-with-copy">
                        <span className="value">{paymentDetails.BANK_TRANSFER.ifsc}</span>
                        <button 
                          type="button"
                          className="copy-btn"
                          onClick={() => copyToClipboard(paymentDetails.BANK_TRANSFER.ifsc)}
                        >
                          <MdContentCopy size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="detail-row">
                      <span className="label">Bank Name:</span>
                      <span className="value">{paymentDetails.BANK_TRANSFER.bankName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Branch:</span>
                      <span className="value">{paymentDetails.BANK_TRANSFER.branch}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* UTR/Transaction Reference (Optional) */}
              <div className="form-group">
                <label>UTR/Transaction Reference (Optional)</label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="Enter UTR or transaction number"
                />
              </div>

              {/* Upload Proof */}
              <div className="form-group">
                <label>Upload Payment Proof *</label>
                <div className="file-upload-area">
                  {proofPreview ? (
                    <div className="file-preview">
                      <img src={proofPreview} alt="Payment proof" />
                      <button 
                        type="button"
                        className="remove-file"
                        onClick={() => {
                          setProofFile(null);
                          setProofPreview(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />
                      <MdCloudUpload size={48} />
                      <p>Click to upload or drag and drop</p>
                      <small>PNG, JPG or PDF (Max 5MB)</small>
                    </label>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Deposit Request'}
              </button>
            </form>

            <div className="info-note">
              <p>⚠️ <strong>Important:</strong> Please complete the payment first, then upload the proof and submit this form. Your deposit will be credited within 24 hours after verification.</p>
            </div>
          </div>
        </div>

        {/* Deposit History */}
        <div className="deposit-history-section">
          <div className="history-card">
            <h2>Deposit History</h2>
            
            {depositHistory.length === 0 ? (
              <div className="no-history">
                <p>No deposit history yet</p>
              </div>
            ) : (
              <div className="history-list">
                {depositHistory.map((deposit) => (
                  <div key={deposit.id} className="history-item">
                    <div className="history-icon">
                      {getStatusIcon(deposit.status)}
                    </div>
                    <div className="history-details">
                      <div className="history-amount">₹{deposit.amount.toLocaleString()}</div>
                      <div className="history-method">{deposit.method.replace('_', ' ')}</div>
                      <div className="history-date">{deposit.createdAt.toLocaleDateString()}</div>
                    </div>
                    <div className="history-status">
                      <span className={`status-badge status-${deposit.status.toLowerCase()}`}>
                        {deposit.status}
                      </span>
                      {deposit.status === 'REJECTED' && deposit.rejectionReason && (
                        <small className="rejection-reason">{deposit.rejectionReason}</small>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="quick-info-card">
            <h3>💡 Quick Info</h3>
            <ul>
              <li>Minimum deposit: ₹1,000</li>
              <li>Processing time: Within 24 hours</li>
              <li>No deposit fees</li>
              <li>Instant credit after approval</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
