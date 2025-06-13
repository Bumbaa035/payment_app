import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./step3.css";
import QRScanner from "./QRScanner";

const Step3 = ({ data, onBack }) => {
  // --- Сонгосон төлбөрийн арга --------------------------------------------
  const [selectedMethod, setSelectedMethod] = useState("card");
  // --- QR Scanner харуулах эсэх ------------------------------------------
  const [showQRScanner, setShowQRScanner] = useState(false);
  // --- Хэл сонголт ---------------------------------------------------
  const [currentLang, setCurrentLang] = useState(data?.lang || "en");

  // Payment data-аас мэдээлэл авах
  const paymentAmount = data?.amount || "0";
  const currency = data?.currency || "MNT";
  const entityId = data?.entityId || "Demo shop";
  const checkoutId = data?.checkoutId || "";

  // QR Code-д ашиглах мэдээлэл (HiPay QR format)
  const qrValue =
    data?.qrData ||
    JSON.stringify({
      checkoutId: checkoutId,
      amount: paymentAmount,
      currency: currency,
      entityId: entityId,
    });

  // --- КАРТЫН мэдээлэл ------------------------------------------------------
  const initialCard = {
    cardNumber: "",
    cardHolder: "",
    expireDate: "",
    cvv: "",
    email: data?.customerEmail || "",
    phone: data?.customerPhone || "",
  };
  const [cardData, setCardData] = useState(initialCard);

  // --- HIPAY түрийвчний мэдээлэл -------------------------------------------
  const initialHipay = {
    walletNumber: "",
    email: data?.customerEmail || "",
    phone: data?.customerPhone || "",
  };
  const [hipayData, setHipayData] = useState(initialHipay);

  // --- Талбар өөрчлөгдөхөд ---------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (selectedMethod === "card") {
      setCardData((prev) => ({ ...prev, [name]: value }));
    } else {
      setHipayData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- Төлбөр илгээх --------------------------------------------------------
  // inside Step3.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentInfo = {
      ...data,
      paymentMethod: selectedMethod,
      paymentDetails: selectedMethod === "card" ? cardData : hipayData,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentInfo),
      });

      const result = await res.json();
      alert(
        currentLang === "mn"
          ? `Төлбөр амжилттай!\nГүйлгээ: ${result.transactionId}`
          : `Payment successful!\nTransaction: ${result.transactionId}`
      );
    } catch (error) {
      alert("Error processing payment: " + error.message);
    }
  };

  const handleCheckPayment = async () => {
    const checkData = {
      checkoutId: checkoutId,
      entityId: entityId,
      token: data?.token,
    };

    try {
      const res = await fetch("http://localhost:5000/api/check-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkData),
      });

      const result = await res.json();
      alert(
        currentLang === "mn"
          ? `Төлбөрийн статус: ${result.status}\nГүйлгээ: ${result.transactionId}`
          : `Payment status: ${result.status}\nTransaction: ${result.transactionId}`
      );
    } catch (error) {
      alert("Error checking payment: " + error.message);
    }
  };

  // --- Төлбөрийн арга солих -------------------------------------------------
  const switchMethod = (method) => {
    setSelectedMethod(method);
    // сонголтоо солиход талбаруудаа цэвэрлэх
    setCardData({
      ...initialCard,
      email: data?.customerEmail || "",
      phone: data?.customerPhone || "",
    });
    setHipayData({
      ...initialHipay,
      email: data?.customerEmail || "",
      phone: data?.customerPhone || "",
    });
    // QR Scanner-ийг хаах
    setShowQRScanner(false);
  };

  // --- QR Scanner харуулах/нуух ------------------------------------------
  const handleScanQR = () => {
    setShowQRScanner(true);
  };

  const handleCloseScanQR = () => {
    setShowQRScanner(false);
  };

  // --- QR Scanner-аас мэдээлэл авах ------------------------------------------
  const handleQRScanSuccess = (qrData) => {
    console.log("QR scan successful:", qrData);

    // If payment was completed via QR
    if (qrData.paymentStatus === "completed") {
      alert(
        `${
          currentLang === "mn"
            ? "QR төлбөр амжилттай!"
            : "QR Payment successful!"
        }\n${currentLang === "mn" ? "Гүйлгээний ID:" : "Transaction ID:"} ${
          qrData.transactionId
        }`
      );
      setShowQRScanner(false);
      return;
    }

    // Update HiPay data with scanned information
    setHipayData((prev) => ({
      ...prev,
      walletNumber: qrData.receiverId || prev.walletNumber,
      qrData: qrData.qrData || qrData,
    }));

    // Show success message and close scanner
    const message =
      currentLang === "mn"
        ? `QR код амжилттай уншигдлаа!\nХүлээн авагч: ${qrData.receiverId}`
        : `QR code scanned successfully!\nReceiver: ${qrData.receiverId}`;

    alert(message);
    setShowQRScanner(false);
  };

  // --- Хэл солих --------------------------------------------------------
  const switchLanguage = (lang) => {
    setCurrentLang(lang);
  };

  // Хэрэв QR Scanner харуулж байвал зөвхөн тэрийг л харуулна
  if (showQRScanner) {
    return (
      <div className="step3-container">
        <div className="top-bar">
          <button className="back-btn" onClick={handleCloseScanQR}>
            ← {currentLang === "mn" ? "Төлбөр рүү буцах" : "Back to Payment"}
          </button>
          <div className="lang-switch">
            <button
              className={`lang-btn ${currentLang === "mn" ? "active" : ""}`}
              onClick={() => switchLanguage("mn")}
            >
              MN
            </button>
            <button
              className={`lang-btn ${currentLang === "en" ? "active" : ""}`}
              onClick={() => switchLanguage("en")}
            >
              EN
            </button>
          </div>
        </div>
        <QRScanner
          paymentData={data}
          onScanSuccess={handleQRScanSuccess}
          onCancel={handleCloseScanQR}
          currentLang={currentLang}
        />
      </div>
    );
  }

  return (
    <div className="step3-container">
      {/* --- Толгой хэсэг --- */}
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}>
          ← {currentLang === "mn" ? "Буцах" : "Back"}
        </button>
        <div className="lang-switch">
          <button
            className={`lang-btn ${currentLang === "mn" ? "active" : ""}`}
            onClick={() => switchLanguage("mn")}
          >
            MN
          </button>
          <button
            className={`lang-btn ${currentLang === "en" ? "active" : ""}`}
            onClick={() => switchLanguage("en")}
          >
            EN
          </button>
        </div>
      </div>

      <h2 className="shop-name">{entityId}</h2>
      <div className="price">
        {paymentAmount}
        {currency === "MNT" ? "₮" : ` ${currency}`}
      </div>

      {/* --- Төлбөрийн арга сонголт --- */}
      <div className="method-tabs">
        <button
          className={`method-tab ${selectedMethod === "card" ? "active" : ""}`}
          onClick={() => switchMethod("card")}
        >
          {currentLang === "mn" ? "Карт" : "Card"}
        </button>
        <button
          className={`method-tab ${selectedMethod === "hipay" ? "active" : ""}`}
          onClick={() => switchMethod("hipay")}
        >
          HiPay
        </button>
      </div>

      {/* --- Форм --- */}
      <form className="payment-form" onSubmit={handleSubmit}>
        {selectedMethod === "card" && (
          <>
            {/* Картын талбарууд */}
            <label>
              {currentLang === "mn" ? "Картын дугаар *" : "Card Number *"}
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
              {currentLang === "mn" ? "Картын эзэн *" : "Card Holder Name *"}
              <input
                type="text"
                name="cardHolder"
                value={cardData.cardHolder}
                onChange={handleChange}
                required
                placeholder={currentLang === "mn" ? "Бат-Оргил" : "Bat-Orgil"}
              />
            </label>

            <div className="form-row">
              <label>
                {currentLang === "mn" ? "Дуусах огноо *" : "Expire Date *"}
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
                {currentLang === "mn" ? "CVV код *" : "CVV Code *"}
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
              {currentLang === "mn" ? "И-мэйл" : "Email"}
              <input
                type="email"
                name="email"
                value={cardData.email}
                onChange={handleChange}
                placeholder={currentLang === "mn" ? "И-мэйл" : "Email"}
              />
            </label>

            <label>
              {currentLang === "mn" ? "Утас" : "Phone"}
              <input
                type="tel"
                name="phone"
                value={cardData.phone}
                onChange={handleChange}
                placeholder={currentLang === "mn" ? "Утас" : "Phone"}
              />
            </label>
          </>
        )}

        {selectedMethod === "hipay" && (
          <>
            {/* HiPay талбарууд */}
            <label
              className="hipay-label"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {currentLang === "mn" ? "HiPay Түрийвч QR" : "HiPay Wallet QR"}
              <QRCodeCanvas
                style={{ margin: "10px 0" }}
                value={qrValue}
                size={256}
                bgColor="#fff"
                fgColor="#000"
              />
              <small
                style={{
                  color: "#666",
                  textAlign: "center",
                  maxWidth: "300px",
                }}
              >
                {currentLang === "mn"
                  ? "HiPay апп-аараа дээрх QR кодыг уншуулж төлбөрөө төлнө үү"
                  : "Scan this QR code with your HiPay app to complete payment"}
              </small>
            </label>
            <button type="button" className="pay-btn" onClick={handleScanQR}>
              {currentLang === "mn" ? "QR код уншуулах" : "Scan QR Code"}
            </button>

            {/* Show scanned QR info if available */}
            {hipayData.qrData && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  backgroundColor: "#e8f5e8",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              >
                <strong>
                  {currentLang === "mn" ? "Уншигдсан QR:" : "Scanned QR:"}
                </strong>
                <br />
                {currentLang === "mn" ? "Хүлээн авагч:" : "Receiver:"}{" "}
                {hipayData.walletNumber}
              </div>
            )}
          </>
        )}

        <button type="submit" className="pay-btn">
          {currentLang === "mn" ? "Төлөх" : "Pay"}
        </button>
        <button
          type="button"
          className="check-btn"
          onClick={handleCheckPayment}
        >
          {currentLang === "mn" ? "Төлбөр шалгах" : "Check Payment"}
        </button>
      </form>

      <div className="powered-by">
        Powered by <span className="hipay-logo">hipay</span>
      </div>

      {/* Payment details summary (for debugging) */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "5px",
            fontSize: "12px",
          }}
        >
          <strong>Debug Info:</strong>
          <br />
          Checkout ID: {checkoutId}
          <br />
          Entity ID: {entityId}
          <br />
          Amount: {paymentAmount} {currency}
          <br />
          Token: {data?.token?.substring(0, 10)}...
        </div>
      )}
    </div>
  );
};

export default Step3;
