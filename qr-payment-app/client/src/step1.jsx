import React, { useState } from "react";
import "./step1.css"; // CSS файлыг импортлох

const Step1 = ({ onNext }) => {
  // form-ийн бүх талбаруудыг нэг объект-д хадгална
  const [form, setForm] = useState({
    initId: "",
    entityId: "songo.mn",
    token: "NEgxQ0x4bTJ0WXJPOW1JeA",
    amount: "101.54",
    currency: "MNT",
    redirectUri: "https://test.hipay.mn:4445",
  });

  // input өөрчлөгдөх бүрд form state шинэчилнэ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Step1-ээс гарах өгөгдлийг parent-д дамжуулна
    onNext(form);
  };

  return (
    <div className="step1-container">
      {/* HiPay лого дээд хэсэгт төвд */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src="/hipayy.png" alt="HiPay Logo" style={{ width: "200px" }} />
      </div>

      <h2>Step 1: Checkout</h2>

      <form className="step1-form" onSubmit={handleSubmit}>
        <label>
          initId:
          <input
            type="text"
            name="initId"
            value={form.initId}
            onChange={handleChange}
            placeholder="initId-г оруулна уу"
          />
        </label>

        <label>
          entityId:
          <input
            type="text"
            name="entityId"
            value={form.entityId}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Token:
          <input
            type="text"
            name="token"
            value={form.token}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
          />
        </label>

        <label>
          Currency:
          <input
            type="text"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Redirect Uri:
          <input
            type="text"
            name="redirectUri"
            value={form.redirectUri}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default Step1;
