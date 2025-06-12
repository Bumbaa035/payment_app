const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5173;

app.use(cors()); // Cross-Origin зөвшөөрөх
app.use(express.json()); // JSON parse хийх middleware

app.get('/', (req, res) => {
  res.send('Сервер амжилттай ажиллаж байна!');
});

app.post('/pay', (req, res) => {
  const { amount, method } = req.body;
  console.log('🧾 Гүйлгээ ирлээ:', { amount, method });

  res.json({ success: true, message: 'Төлбөр амжилттай!', data: { amount, method } });
});

app.listen(PORT, () => {
  console.log(`Сервер http://localhost:${PORT} дээр ажиллаж байна`);
});
