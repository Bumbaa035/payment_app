import { useState } from 'react';

function PaymentForm() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('card');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5173/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount, method })
    });

    const data = await res.json();
    setResponse(data.message);
  };

  return (
      <form onSubmit={handleSubmit} className="payment-form">
        <h2>Төлбөрийн Форм</h2>
        <input
            type="number"
            placeholder="Дүн"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
        />
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="card">Карт</option>
          <option value="qr">QR</option>
        </select>
        <button type="submit">Төлбөр хийх</button>
        {response && <p>{response}</p>}
      </form>
  );
}

export default PaymentForm;
