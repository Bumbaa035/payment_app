import React, { useState } from 'react';
import './Step2.css';

const Step2 = ({ data, onBack }) => {
  const [form, setForm] = useState({
    entityId: data?.entityId || '',
    token: data?.token || '',
    amount: data?.amount || '',
    currency: data?.currency || 'MNT',
    checkoutId: '',
    qrData: '',
    shopperResultUrl: 'https://test.hipay.mn:4445/shopperResultUrl.php',
    shopperCancelUrl: 'https://test.hipay.mn:4445/',
    lang: 'mn',
    customerEmail: '',
    customerPhone: '',
    method: 'post',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Төлбөрийн мэдээлэл илгээгдлээ:\n' + JSON.stringify(form, null, 2));
  };

  const handleCheck = async () => {
    try {
      const res = await fetch('http://localhost:5173/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: form.token,
          checkoutId: form.checkoutId,
          amount: form.amount,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert('✅ Шалгалт амжилттай: ' + result.message);
      } else {
        alert('❌ Алдаа: ' + result.message);
      }
    } catch (err) {
      alert('⚠ Шалгах үед алдаа гарлаа: ' + err.message);
    }
  };


  return (
    <div className="step2-container">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src="/hipayy.png" alt="HiPay Logo" style={{ width: '200px' }} />
      </div>

      <h2>Алхам 2: Төлбөр</h2>

      <form className="step2-form" onSubmit={handleSubmit}>
        <label>
          Байгууллагын ID:
          <input type="text" name="entityId" value={form.entityId} onChange={handleChange} required />
        </label>

        <label>
          Token:
          <input type="text" name="token" value={form.token} onChange={handleChange} required />
        </label>

        <label>
          Дүн:
          <input type="number" name="amount" value={form.amount} onChange={handleChange} required step="0.01" min="0" />
        </label>

        <label>
          Валют:
          <input type="text" name="currency" value={form.currency} onChange={handleChange} required />
        </label>

        <label>
          Checkout ID*:
          <input
            type="text"
            name="checkoutId"
            value={form.checkoutId || "HPSM250612121340000000013"}
            onChange={handleChange}
            required
            readOnly={!!form.checkoutId}
          />
        </label>

        <label>
          QR мэдээлэл*:
          <textarea
            name="qrData"
            value={form.qrData || "000201010212..."}
            onChange={handleChange}
            required
            rows={4}
            className="qr-data-textarea"
          />
        </label>

        <label>
          Амжилттай төлөлтийн URL*:
          <input type="text" name="shopperResultUrl" value={form.shopperResultUrl} onChange={handleChange} required />
        </label>

        <label>
          Буцах URL*:
          <input type="text" name="shopperCancelUrl" value={form.shopperCancelUrl} onChange={handleChange} required />
        </label>

        <label>
          Хэл:
          <input type="text" name="lang" value={form.lang} onChange={handleChange} required />
        </label>

        <label>
          И-мэйл:
          <input type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} />
        </label>

        <label>
          Утас:
          <input type="tel" name="customerPhone" value={form.customerPhone} onChange={handleChange} />
        </label>

        <label>
          Арга:
          <input type="text" name="method" value={form.method} onChange={handleChange} />
        </label>

        <div className="step2-buttons" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" onClick={onBack} style={{ ...buttonStyle, backgroundColor: '#ccc', color: '#000' }}>Буцах</button>
          <button type="button" onClick={handleCheck} style={{ ...buttonStyle, backgroundColor: '#28a745', color: '#fff' }}>
            Шалгах
          </button>
          <button type="submit" style={{ ...buttonStyle, backgroundColor: '#0070f3', color: '#fff' }}>Төлөх</button>
        </div>
      </form>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
};

export default Step2;

