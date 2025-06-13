import React, { useState, useEffect } from "react";
import "./step2.css"; // CSS файлыг импортлох

const Step2 = ({ data, onBack, onNext }) => {
  const [form, setForm] = useState({
    entityId: "",
    token: "",
    amount: "",
    currency: "MNT",
    checkoutId: "",
    qrData: "",
    shopperResultUrl: "https://test.hipay.mn:4445/shopperResultUrl.php",
    shopperCancelUrl: "https://test.hipay.mn:4445/",
    lang: "mn",
    customerEmail: "",
    customerPhone: "",
    method: "post",
  });

  // Update form when data prop changes
  useEffect(() => {
    if (data) {
      setForm((prevForm) => ({
        ...prevForm,
        ...data,
        // Ensure default values for fields that might be empty
        checkoutId: data.checkoutId || "HPSM250612121340000000013",
        // qrData: data.qrData || "000201010212...",
      }));
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass updated form data to step 3
    onNext(form);
    console.log("Төлбөрийн мэдээлэл:", form);
  };

  const handleCheck = () => {
    console.log("Маягтын мэдээлэл:", form);
    alert("Шалгав. Консол дээр дэлгэрэнгүй мэдээлэл байна.");
  };

  return (
    <div className="step2-container">
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src="/hipayy.png" alt="HiPay Logo" style={{ width: "200px" }} />
      </div>

      <h2>Алхам 2: Төлбөр</h2>

      <form className="step2-form" onSubmit={handleSubmit}>
        <label>
          Байгууллагын ID:
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
          Дүн:
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
          Валют:
          <input
            type="text"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Checkout ID*:
          <input
            type="text"
            name="checkoutId"
            value={form.checkoutId}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          QR мэдээлэл*:
          <textarea
            name="qrData"
            value={form.qrData}
            onChange={handleChange}
            required
            rows={4}
            className="qr-data-textarea"
            placeholder="QR код мэдээлэл..."
          />
        </label>

        <label>
          Амжилттай төлөлтийн URL*:
          <input
            type="text"
            name="shopperResultUrl"
            value={form.shopperResultUrl}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Буцах URL*:
          <input
            type="text"
            name="shopperCancelUrl"
            value={form.shopperCancelUrl}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Хэл:
          <select
            name="lang"
            value={form.lang}
            onChange={handleChange}
            required
          >
            <option value="mn">Монгол</option>
            <option value="en">English</option>
          </select>
        </label>

        <label>
          И-мэйл:
          <input
            type="email"
            name="customerEmail"
            value={form.customerEmail}
            onChange={handleChange}
            placeholder="example@email.com"
          />
        </label>

        <label>
          Утас:
          <input
            type="tel"
            name="customerPhone"
            value={form.customerPhone}
            onChange={handleChange}
            placeholder="+976 99999999"
          />
        </label>

        <label>
          Арга:
          <select name="method" value={form.method} onChange={handleChange}>
            <option value="post">POST</option>
            <option value="get">GET</option>
          </select>
        </label>

        <div
          className="step2-buttons"
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onBack}
            style={{ ...buttonStyle, backgroundColor: "#ccc", color: "#000" }}
          >
            Буцах
          </button>
          <button
            type="button"
            onClick={handleCheck}
            style={{
              ...buttonStyle,
              backgroundColor: "#28a745",
              color: "#fff",
            }}
          >
            Шалгах
          </button>
          <button
            type="submit"
            style={{
              ...buttonStyle,
              backgroundColor: "#0070f3",
              color: "#fff",
            }}
          >
            Төлөх
          </button>
        </div>

        {/* QR scanner link */}
        <div
          className="qr-scanner-link"
          style={{ marginTop: "20px", textAlign: "center" }}
        >
          <a
            href="/QRScannerPage"
            style={{ color: "#0070f3", textDecoration: "none" }}
          >
            QR Хэтэвч уншигч ашиглах
          </a>
        </div>
      </form>
    </div>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  cursor: "pointer",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  minWidth: "100px",
};

export default Step2;
