import React, { useState } from 'react';
import { FiArrowLeft, FiCreditCard, FiZap } from 'react-icons/fi';
import '../../styles/Admin/Deposit.css';

function Deposit() {
  const [step, setStep] = useState('choose'); // choose, method, form
  const [depositType, setDepositType] = useState(''); // wallet, trading
  const [paymentMethod, setPaymentMethod] = useState(''); // paybycash, usdt, qris

  const [depositForm, setDepositForm] = useState({
    tradingAccount: '',
    amount: '',
    transactionId: '',
    proof: null
  });

  const handleDepositTypeSelect = (type) => {
    setDepositType(type);
    setStep('method');
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setStep('form');
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('method');
    } else if (step === 'method') {
      setStep('choose');
      setDepositType('');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setDepositForm({
      ...depositForm,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Deposit request submitted!\nType: ${depositType}\nMethod: ${paymentMethod}\nAmount: $${depositForm.amount}`);
    // Reset form
    setStep('choose');
    setDepositType('');
    setPaymentMethod('');
    setDepositForm({
      tradingAccount: '',
      amount: '',
      transactionId: '',
      proof: null
    });
  };

  return (
    <div className="deposit-page">
      {/* Choose Deposit Type */}
      {step === 'choose' && (
        <div className="deposit-choose">
          <h1>Start Your Deposit</h1>
          <p>How would you like to fund your account?</p>

          <div className="deposit-options">
            <div
              className="deposit-option"
              onClick={() => handleDepositTypeSelect('wallet')}
            >
              <div className="option-icon wallet">
                <FiCreditCard size={32} />
              </div>
              <h3>Wallet Deposit</h3>
              <p>Manual deposit via bank, crypto, etc. Requires admin approval.</p>
            </div>

            <div
              className="deposit-option"
              onClick={() => handleDepositTypeSelect('trading')}
            >
              <div className="option-icon trading">
                <FiZap size={32} />
              </div>
              <h3>Trading Deposit</h3>
              <p>Instantly fund a specific trading account from your main wallet.</p>
            </div>
          </div>
        </div>
      )}

      {/* Choose Payment Method */}
      {step === 'method' && (
        <div className="deposit-method">
          <button className="back-button" onClick={handleBack}>
            <FiArrowLeft /> Back to choices
          </button>

          <h1>Choose Payment Method</h1>
          <p>Select how you want to make your deposit.</p>

          <div className="payment-methods">
            <div
              className={`payment-method ${paymentMethod === 'paybycash' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('paybycash')}
            >
              <div className="method-icon">💳</div>
              <h4>PayByCash</h4>
            </div>

            <div
              className={`payment-method ${paymentMethod === 'usdt' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('usdt')}
            >
              <div className="method-icon">₮</div>
              <h4>USDT(TRC20)</h4>
            </div>

            <div
              className={`payment-method ${paymentMethod === 'qris' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('qris')}
            >
              <div className="method-icon">📱</div>
              <h4>QRIS</h4>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Form */}
      {step === 'form' && (
        <div className="deposit-form-container">
          <button className="back-button" onClick={handleBack}>
            <FiArrowLeft /> Back to choices
          </button>

          <h1>
            {depositType === 'wallet' ? 'Wallet Deposit' : 'Direct Trading Deposit'}
          </h1>
          <p>
            {depositType === 'wallet'
              ? 'Manual deposit via bank, crypto, etc.'
              : 'Instantly fund a trading account.'}
          </p>

          <form className="deposit-form" onSubmit={handleSubmit}>
            {depositType === 'trading' && (
              <div className="form-group">
                <label>Select Trading Account</label>
                <select
                  name="tradingAccount"
                  value={depositForm.tradingAccount}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">-- Please select an account --</option>
                  <option value="900909477791">900909477791 - Live Account</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Amount (USD)</label>
              <input
                type="number"
                name="amount"
                placeholder="Enter amount"
                value={depositForm.amount}
                onChange={handleFormChange}
                required
                min="10"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Transaction ID / UTR Number</label>
              <input
                type="text"
                name="transactionId"
                placeholder="Enter transaction reference"
                value={depositForm.transactionId}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Upload Payment Proof</label>
              <input
                type="file"
                name="proof"
                accept="image/*,.pdf"
                onChange={handleFormChange}
                required
              />
              <small>Upload screenshot or receipt of payment</small>
            </div>

            <div className="payment-info">
              <h4>Payment Instructions:</h4>
              {paymentMethod === 'usdt' && (
                <div className="info-box">
                  <p><strong>USDT TRC20 Address:</strong></p>
                  <code>TXxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>
                  <p className="note">⚠️ Only send USDT on TRC20 network</p>
                </div>
              )}
              {paymentMethod === 'paybycash' && (
                <div className="info-box">
                  <p><strong>Bank Details:</strong></p>
                  <p>Account Name: Xmindia Trading Pvt Ltd</p>
                  <p>Account No: 1234567890</p>
                  <p>IFSC: SBIN0001234</p>
                </div>
              )}
              {paymentMethod === 'qris' && (
                <div className="info-box">
                  <p><strong>Scan QR Code:</strong></p>
                  <div className="qr-placeholder">[QR Code Here]</div>
                </div>
              )}
            </div>

            <button type="submit" className="btn-submit">
              {depositType === 'wallet' ? 'Submit Deposit Request' : 'Deposit Directly'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Deposit;