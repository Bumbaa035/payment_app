// server.js
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // 👉 Token үүсгэхэд ашиглана

const app = express();
const PORT = 5173;

app.use(cors());
app.use(express.json());

// ✅ Энгийн GET route
app.get('/', (req, res) => {
  res.send('Сервер амжилттай ажиллаж байна!');
});

// ✅ Token үүсгэх route
app.get('/get-token', (req, res) => {
  const accessToken = uuidv4(); // UUID төрлийн санамсаргүй токен
  res.json({ accessToken });
});

// ✅ Checkout ID үүсгэх route
app.get('/get-checkoutid', (req, res) => {
  const checkoutId = uuidv4(); // UUID checkout ID
  res.json({ checkoutId });
});

// ✅ Сервер асаах
app.listen(PORT, () => {
  console.log(`Сервер http://localhost:${PORT} дээр ажиллаж байна`);
});
