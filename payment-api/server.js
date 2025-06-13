const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/verify', (req, res) => {
  const { token, checkoutId, amount } = req.body;

  console.log('🔍 Хүлээн авсан:', { token, checkoutId, amount });

  if (token && checkoutId && amount) {
    res.json({ success: true, message: 'Бүх мэдээлэл зөв байна.' });
  } else {
    res.status(400).json({ success: false, message: 'Талбар дутуу байна.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер http://localhost:${PORT} дээр ажиллаж байна`);
});
