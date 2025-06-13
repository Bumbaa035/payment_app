import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const jsonData = {
  receiverId: "Gunjee1234",
  wallet: "MNT1234567890",
  info: "Төлбөр илгээх QR код",
};

function QRGenerator() {
  // JSON-ийг string болгож хөрвүүлнэ
  const qrValue = JSON.stringify(jsonData);

  return (
    <div>
      <h2>QR код үүсгэгч</h2>
      <QRCodeCanvas value={qrValue} size={256} bgColor="#fff" fgColor="#000" />

      <a
        href="/QRScannerPage"
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
      >
        QR код унших
      </a>
    </div>
  );
}

export default QRGenerator;
