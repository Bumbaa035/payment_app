import React, { useState } from 'react';

const PaymentCheckout = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment submitted', { email, phone });
    // Энд төлбөр илгээх логикыг бичнэ
  };

  return (
    <div className="payment-container">
      <h2>Step2: Payment</h2>

      <div className="payment-info">
        <div className="info-row">
          <span className="label">entityId:</span>
          <span className="value">songo.nn</span>
        </div>
        <div className="info-row">
          <span className="label">Token:</span>
          <span className="value">NEgxQ0x4bTJOWXJPOW1JeA</span>
        </div>
        <div className="info-row">
          <span className="label">Amount:</span>
          <span className="value">109.14</span>
        </div>
        <div className="info-row">
          <span className="label">Currency:</span>
          <span className="value">MNT</span>
        </div>
        <div className="info-row">
          <span className="label">checkoutId*</span>
          <span className="value">HPSM250609171521000000038</span>
        </div>
        <div className="info-row">
          <span className="label">QrData*</span>
          <span className="value">00020101021215344226049642260496C</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>shopperResultUrl*:</label>
          <input
            type="text"
            value="https://test.hipay.mn.4445/shopperResultUrl.php"
            readOnly
          />
        </div>

        <div className="form-group">
          <label>shopperCancelUrl*:</label>
          <input
            type="text"
            value="https://test.hipay.mn.4445/"
            readOnly
          />
        </div>

        <div className="form-group">
          <label>lang:</label>
          <select defaultValue="en">
            <option value="en">English</option>
          </select>
        </div>

        <div className="form-group">
          <label>customer email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>customer phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="payment-methods">
          <h3>method:</h3>
          <div className="method-options">
            <label>
              <input type="radio" name="method" value="posl" defaultChecked />
              Pay
            </label>
            <label>
              <input type="radio" name="method" value="miniapp" />
              Mini app Pay
            </label>
            <label>
              <input type="radio" name="method" value="camera" />
              open camera
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="pay-button">Pay</button>
          <button type="button" className="back-button">BACK</button>
        </div>
      </form>
    </div>
  );
};

export default PaymentCheckout;
