import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

function QRScanner({
  paymentData,
  onScanSuccess,
  onCancel,
  currentLang = "en",
}) {
  const [scannedData, setScannedData] = useState(null);
  const [amount, setAmount] = useState(paymentData?.amount || "");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef(null);

  // Текстүүд хэлээр
  const texts = {
    en: {
      title: "QR Code Scanner",
      receiver: "Receiver ID:",
      amount: "Amount:",
      send: "Send Payment",
      set: "Set Demo",
      reset: "Reset",
      cancel: "Cancel",
      processing: "Processing...",
      success: "Payment successful!",
      error: "Payment failed.",
      serverError: "Could not connect to server.",
      invalidQR: "Invalid QR code format.",
      scanning: "Scanning QR code...",
      enterAmount: "Enter amount",
      confirmPayment: "Confirm Payment",
    },
    mn: {
      title: "QR код уншигч",
      receiver: "Хүлээн авагч ID:",
      amount: "Дүн:",
      send: "Илгээх",
      set: "Жишээ",
      reset: "Дахин",
      cancel: "Болих",
      processing: "Боловсруулж байна...",
      success: "Төлбөр амжилттай илгээгдлээ!",
      error: "Төлбөр амжилтгүй.",
      serverError: "Сервертэй холбогдож чадсангүй.",
      invalidQR: "QR код буруу байна.",
      scanning: "QR код уншиж байна...",
      enterAmount: "Дүн оруулна уу",
      confirmPayment: "Төлбөр баталгаажуулах",
    },
  };

  const t = texts[currentLang] || texts.en;

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
        },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          try {
            // Try to parse as JSON first (for structured QR codes)
            let data;
            try {
              data = JSON.parse(decodedText);
            } catch {
              // If not JSON, treat as plain text (could be payment string)
              data = {
                qrData: decodedText,
                receiverId: extractReceiverFromQR(decodedText),
                amount: extractAmountFromQR(decodedText) || paymentData?.amount,
                checkoutId: paymentData?.checkoutId,
              };
            }

            setScannedData(data);
            setAmount(data.amount || paymentData?.amount || "");
            setMessage("");
            scannerRef.current.clear();

            // Notify parent component about successful scan
            if (onScanSuccess) {
              onScanSuccess(data);
            }
          } catch (error) {
            console.error("QR parsing error:", error);
            setMessage(t.invalidQR);
          }
        },
        (error) => {
          // Only log errors that aren't just "not found" errors
          if (!error.includes("NotFoundException")) {
            console.warn("QR scan error:", error);
          }
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [paymentData, onScanSuccess, t.invalidQR]);

  // Extract receiver ID from QR string (HiPay format)
  const extractReceiverFromQR = (qrString) => {
    // Try to extract merchant info from QR code
    const merchantMatch = qrString.match(/5916([^6]*)/);
    if (merchantMatch) {
      return merchantMatch[1];
    }
    return "Unknown";
  };

  // Extract amount from QR string
  const extractAmountFromQR = (qrString) => {
    const amountMatch = qrString.match(/5406([0-9.]+)/);
    if (amountMatch) {
      return amountMatch[1];
    }
    return null;
  };

  const handlePayment = async () => {
    if (!amount || !scannedData) {
      setMessage(
        currentLang === "mn"
          ? "Дүн болон QR мэдээлэл шаардлагатай."
          : "Amount and QR data required."
      );
      return;
    }

    setIsProcessing(true);
    setMessage(t.processing);

    try {
      // Prepare payment data
      const paymentPayload = {
        ...paymentData,
        scannedData,
        amount: parseFloat(amount),
        receiverId: scannedData.receiverId,
        qrData: scannedData.qrData || scannedData,
        timestamp: new Date().toISOString(),
        paymentMethod: "qr_scan",
      };

      console.log("QR Payment data:", paymentPayload);

      // Make payment API call
      const response = await axios.post("http://localhost:5000/api/payment", {
        senderId: paymentData?.customerEmail || "guest_user",
        receiverId: scannedData.receiverId,
        amount: parseFloat(amount),
        currency: paymentData?.currency || "MNT",
        checkoutId: paymentData?.checkoutId,
        entityId: paymentData?.entityId,
        token: paymentData?.token,
        qrData: scannedData.qrData,
      });

      if (response.data.success) {
        setMessage(t.success);
        // Auto close after success
        setTimeout(() => {
          if (onScanSuccess) {
            onScanSuccess({
              ...scannedData,
              paymentStatus: "completed",
              transactionId: response.data.transactionId,
            });
          }
        }, 2000);
      } else {
        setMessage(t.error + " " + (response.data.message || ""));
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage(t.serverError);
    } finally {
      setIsProcessing(false);
    }
  };

  // Set demo data for testing
  const handleSet = () => {
    const demoData = {
      receiverId: paymentData?.entityId || "demo_merchant",
      wallet: "MNT1234567890",
      amount: paymentData?.amount || "100",
      checkoutId: paymentData?.checkoutId || "demo_checkout",
      qrData: paymentData?.qrData || "demo_qr_data",
    };

    setScannedData(demoData);
    setAmount(demoData.amount);
    setMessage(
      "⚙️ " +
        (currentLang === "mn"
          ? "Жишээ өгөгдөл тохируулагдлаа."
          : "Demo data set.")
    );
  };

  // Reset scanner
  const handleReset = () => {
    setScannedData(null);
    setAmount(paymentData?.amount || "");
    setMessage("");

    if (scannerRef.current) {
      scannerRef.current
        .clear()
        .then(() => {
          scannerRef.current.render(
            (decodedText) => {
              try {
                let data;
                try {
                  data = JSON.parse(decodedText);
                } catch {
                  data = {
                    qrData: decodedText,
                    receiverId: extractReceiverFromQR(decodedText),
                    amount:
                      extractAmountFromQR(decodedText) || paymentData?.amount,
                  };
                }

                setScannedData(data);
                setAmount(data.amount || paymentData?.amount || "");
                scannerRef.current.clear();

                if (onScanSuccess) {
                  onScanSuccess(data);
                }
              } catch {
                setMessage(t.invalidQR);
              }
            },
            (error) => {
              if (!error.includes("NotFoundException")) {
                console.warn("QR scan error:", error);
              }
            }
          );
        })
        .catch(console.error);
    }
  };

  return (
    <div
      className="qr-scanner-container"
      style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        {t.title}
      </h2>

      {/* Scanner area */}
      <div
        id="qr-reader"
        style={{ width: "100%", maxWidth: "400px", margin: "0 auto 20px" }}
      />

      {!scannedData && !message && (
        <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
          {t.scanning}
        </p>
      )}

      {/* Payment form when QR is scanned */}
      {scannedData && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p style={{ marginBottom: "10px" }}>
            <strong>{t.receiver}</strong> {scannedData.receiverId}
          </p>

          <label style={{ display: "block", marginBottom: "15px" }}>
            <strong>{t.amount}</strong>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t.enterAmount}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginTop: "5px",
                fontSize: "16px",
              }}
              step="0.01"
              min="0"
            />
          </label>

          <button
            onClick={handlePayment}
            disabled={isProcessing || !amount}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: isProcessing ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: isProcessing ? "not-allowed" : "pointer",
              marginBottom: "10px",
            }}
          >
            {isProcessing ? t.processing : t.send}
          </button>
        </div>
      )}

      {/* Control buttons */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleSet}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {t.set}
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {t.reset}
        </button>

        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {t.cancel}
          </button>
        )}
      </div>

      {/* Status message */}
      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            textAlign: "center",
            backgroundColor: message.includes("✅")
              ? "#d4edda"
              : message.includes("❌")
              ? "#f8d7da"
              : "#fff3cd",
            color: message.includes("✅")
              ? "#155724"
              : message.includes("❌")
              ? "#721c24"
              : "#856404",
            border: `1px solid ${
              message.includes("✅")
                ? "#c3e6cb"
                : message.includes("❌")
                ? "#f5c6cb"
                : "#ffeaa7"
            }`,
            borderRadius: "4px",
          }}
        >
          {message}
        </div>
      )}

      {/* Debug info in development */}
      {process.env.NODE_ENV === "development" && scannedData && (
        <details style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
          <summary>Debug Info</summary>
          <pre
            style={{
              backgroundColor: "#f5f5f5",
              padding: "10px",
              borderRadius: "4px",
              overflow: "auto",
            }}
          >
            {JSON.stringify({ scannedData, paymentData }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

export default QRScanner;
