const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Dummy payment processing endpoint
app.post("/api/process-payment", (req, res) => {
  const paymentInfo = req.body;

  console.log("Received payment info:", paymentInfo);

  // Simulate success response
  return res.status(200).json({
    success: true,
    message: "Payment processed successfully",
    transactionId: "TXN-" + Date.now(),
  });
});

// Dummy payment status checker
app.post("/api/check-payment", (req, res) => {
  const { checkoutId, entityId, token } = req.body;

  console.log("Checking status for:", { checkoutId, entityId, token });

  // Simulate status response
  return res.status(200).json({
    status: "completed",
    checkoutId,
    transactionId: "TXN-" + Date.now(),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
