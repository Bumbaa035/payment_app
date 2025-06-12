import React, { useState } from 'react';
import './Step3.css';

const Step3 = ({ onBack }) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expireDate: '',
    cvv: '',
    email: '',
    phone: '',
  });

  const [selectedMethod, setSelectedMethod] = useState('card');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Төлбөрийн мэдээлэл илгээгдлээ:\n' + JSON.stringify(cardData, null, 2));
  };

  return (
    <div className="step3-container">
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="lang-switch">
          <button className="lang-btn">MN</button>
          <button className="lang-btn active">EN</button>
        </div>
      </div>

      <h2 className="shop-name">Demo shop DisplayName</h2>
      <div className="price">103₮</div>

      <div className="method-tabs">
        <button
          className={`method-tab ${selectedMethod === 'card' ? 'active' : ''}`}
          onClick={() => setSelectedMethod('card')}
        >
          Card
        </button>
        <button
          className={`method-tab ${selectedMethod === 'hipay' ? 'active' : ''}`}
          onClick={() => setSelectedMethod('hipay')}
        >
          Hipay
        </button>
      </div>

      <form className="payment-form" onSubmit={handleSubmit}>
        <label>
          Card Number *
          <input
            type="text"
            name="cardNumber"
            value={cardData.cardNumber}
            onChange={handleChange}
            required
            placeholder="XXXX XXXX XXXX XXXX"
            maxLength={19}
          />
        </label>

        <label>
          Card Holder Name *
          <input
            type="text"
            name="cardHolder"
            value={cardData.cardHolder}
            onChange={handleChange}
            required
            placeholder="Bat-orgil"
          />
        </label>

        <div className="form-row">
          <label>
            Expire Date *
            <input
              type="text"
              name="expireDate"
              value={cardData.expireDate}
              onChange={handleChange}
              required
              placeholder="MM/YY"
              maxLength={5}
            />
          </label>

          <label>
            CVV Code *
            <input
              type="password"
              name="cvv"
              value={cardData.cvv}
              onChange={handleChange}
              required
              placeholder="***"
              maxLength={4}
            />
          </label>
        </div>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={cardData.email}
            onChange={handleChange}
            placeholder="Имэйл"
          />
        </label>

        <label>
          Phone
          <input
            type="tel"
            name="phone"
            value={cardData.phone}
            onChange={handleChange}
            placeholder="Утас"
          />
        </label>

        <button type="submit" className="pay-btn">Pay</button>
        <button type="button" className="check-btn">Check Payment</button>
      </form>

      <div className="powered-by">Powered by <span className="hipay-logo">hipay</span></div>
    </div>
  );
};

export default Step3;
