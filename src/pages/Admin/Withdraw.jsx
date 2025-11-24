import React, { useState, useEffect } from 'react';
import { 
  MdAccountBalance,
  MdCheckCircle,
  MdAccessTime,
  MdCancel,
  MdWarning
} from 'react-icons/md';
import './Withdraw.css';

export default function Withdraw() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('BANK_TRANSFER');
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  });
  const [upiDetails, setUpiDetails] = useState({
    upiId: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    walletBalance: 75000,
    mt5Balance: 50000,
    freeMargin: 46250,
    openPositions: 2,
    canWithdraw: true
  });
  const [withdrawHistory, setWithdrawHistory] = useState([
    {
      id: 1,
      amount: 5000,
      method: 'BANK_TRANSFER',
      status: 'APPROVED',
      utrNumber: 'UTR123456789',
      createdAt: new Date('2024-11-20'),
      approvedAt: new Date('2024-11-20')
    },
    {
      id: 2,
      amount: 3000,
      method: 'UPI',
      status: 'PENDING',
      createdAt: new Date('2024-11-19'),
      approvedAt: null
    },
    {
      id: 3,
      amount: 2000,
      method: 'BANK_TRANSFER',
      status: 'REJECTED',
      createdAt: new Date('2024-11-18'),
      rejectionReason: 'Insufficient margin'
    }
  ]);

  const minWithdrawal = 1000;
  const maxWithdrawal = Math.min(accountInfo.walletBalance, accountInfo.freeMargin);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const withdrawAmount = parseFloat(amount);

    // Validations
    if (withdrawAmount < minWithdrawal) {
      alert(`Minimum withdrawal amount is ₹${minWithdrawal.toLocaleString()}`);
      return;
    }

    if (withdrawAmount > maxWithdrawal) {
      alert(`Maximum withdrawal amount is ₹${maxWithdrawal.toLocaleString()} (based on your free margin)`);
      return;
    }

    if (!accountInfo.canWithdraw) {
      alert('Withdrawal not allowed. Please close open positions first.');
      return;
    }

    // Validate details based on method
    if (method === 'BANK_TRANSFER') {
      if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.ifscCode) {
        alert('Please fill all bank details');
        return;
      }
    } else if (method === 'UPI') {
      if (!upiDetails.upiId) {
        alert('Please enter UPI ID');
        return;
      }
    }

    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newWithdrawal = {
        id: Date.now(),
        amount: withdrawAmount,
        method: method,
        status: 'PENDING',
        createdAt: new Date(),
        approvedAt: null
      };

      setWithdrawHistory([newWithdrawal, ...withdrawHistory]);
      
      // Reset form
      setAmount('');
      setBankDetails({
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: ''
      });
      setUpiDetails({ upiId: '' });
      setSubmitting(false);

      alert('Withdrawal request submitted successfully! We will process it within 24-48 hours.');
    }, 1500);
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
    <div className="withdraw-container">
      <div className="withdraw-header">
        <div>
          <h1>Withdraw Funds</h1>
          <p>Request withdrawal from your account</p>
        </div>
      </div>

      <div className="withdraw-content">
        {/* Withdraw Form */}
        <div className="withdraw-form-section">
          {/* Account Balance Card */}
          <div className="balance-card">
            <h3>Available Balance</h3>
            <div className="balance-grid">
              <div className="balance-item">
                <span className="balance-label">Wallet Balance</span>
                <span className="balance-value">₹{accountInfo.walletBalance.toLocaleString()}</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">MT5 Balance</span>
                <span className="balance-value">₹{accountInfo.mt5Balance.toLocaleString()}</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">Free Margin</span>
                <span className="balance-value">₹{accountInfo.freeMargin.toLocaleString()}</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">Open Positions</span>
                <span className="balance-value">{accountInfo.openPositions}</span>
              </div>
            </div>
            <div className="max-withdraw">
              <MdWarning size={18} />
              <span>Maximum withdrawable: ₹{maxWithdrawal.toLocaleString()}</span>
            </div>
          </div>

          {/* Withdrawal Form */}
          <div className="form-card">
            <h2>Request Withdrawal</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Amount */}
              <div className="form-group">
                <label>Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Enter amount (Min: ₹${minWithdrawal.toLocaleString()})`}
                  min={minWithdrawal}
                  max={maxWithdrawal}
                  required
                />
                <small>Minimum: ₹{minWithdrawal.toLocaleString()} | Maximum: ₹{maxWithdrawal.toLocaleString()}</small>
              </div>

              {/* Withdrawal Method */}
              <div className="form-group">
                <label>Withdrawal Method</label>
                <select 
                  value={method} 
                  onChange={(e) => setMethod(e.target.value)}
                  required
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

              {/* Bank Transfer Details */}
              {method === 'BANK_TRANSFER' && (
                <div className="payment-details-section">
                  <h3>Bank Account Details</h3>
                  
                  <div className="form-group">
                    <label>Account Holder Name</label>
                    <input
                      type="text"
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                      placeholder="Enter account holder name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                      placeholder="Enter account number"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      value={bankDetails.ifscCode}
                      onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                      placeholder="Enter IFSC code"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                      placeholder="Enter bank name"
                    />
                  </div>
                </div>
              )}

              {/* UPI Details */}
              {method === 'UPI' && (
                <div className="payment-details-section">
                  <h3>UPI Details</h3>
                  
                  <div className="form-group">
                    <label>UPI ID</label>
                    <input
                      type="text"
                      value={upiDetails.upiId}
                      onChange={(e) => setUpiDetails({upiId: e.target.value})}
                      placeholder="username@bank"
                      required
                    />
                    <small>Enter your UPI ID (e.g., yourname@paytm)</small>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={submitting || !accountInfo.canWithdraw}
              >
                {submitting ? 'Processing...' : 'Submit Withdrawal Request'}
              </button>
            </form>

            <div className="info-note">
              <p>⚠️ <strong>Important:</strong> Withdrawals are processed within 24-48 hours on business days. Ensure your bank details are correct to avoid delays.</p>
            </div>
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="withdraw-history-section">
          <div className="history-card">
            <h2>Withdrawal History</h2>
            
            {withdrawHistory.length === 0 ? (
              <div className="no-history">
                <p>No withdrawal history yet</p>
              </div>
            ) : (
              <div className="history-list">
                {withdrawHistory.map((withdrawal) => (
                  <div key={withdrawal.id} className="history-item">
                    <div className="history-icon">
                      {getStatusIcon(withdrawal.status)}
                    </div>
                    <div className="history-details">
                      <div className="history-amount">₹{withdrawal.amount.toLocaleString()}</div>
                      <div className="history-method">{withdrawal.method.replace('_', ' ')}</div>
                      <div className="history-date">{withdrawal.createdAt.toLocaleDateString()}</div>
                      {withdrawal.utrNumber && (
                        <div className="history-utr">UTR: {withdrawal.utrNumber}</div>
                      )}
                    </div>
                    <div className="history-status">
                      <span className={`status-badge status-${withdrawal.status.toLowerCase()}`}>
                        {withdrawal.status}
                      </span>
                      {withdrawal.status === 'REJECTED' && withdrawal.rejectionReason && (
                        <small className="rejection-reason">{withdrawal.rejectionReason}</small>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="quick-info-card">
            <h3>💡 Withdrawal Info</h3>
            <ul>
              <li>Min withdrawal: ₹{minWithdrawal.toLocaleString()}</li>
              <li>Processing: 24-48 hours</li>
              <li>No withdrawal fees</li>
              <li>Close positions for max withdrawal</li>
            </ul>
          </div>

          {/* Warning Card */}
          {accountInfo.openPositions > 0 && (
            <div className="warning-card">
              <MdWarning size={24} />
              <div>
                <h4>Open Positions Detected</h4>
                <p>You have {accountInfo.openPositions} open position(s). Close them to withdraw your full balance.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
