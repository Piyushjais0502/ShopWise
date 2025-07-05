require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const products = require('../product-data.json');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🧠 Simple Manual Filter Extractor
function extractFilters(message) {
  const msg = message.toLowerCase();

  const colors = ['red', 'blue', 'black', 'white', 'green', 'yellow'];
  const categories = ['sneakers', 'jackets', 'tshirts', 'jeans', 'bags', 'shoes'];

  return {
    color: colors.find(c => msg.includes(c)) || null,
    category: categories.find(c => msg.includes(c)) || null,
    maxPrice: parseInt(msg.match(/\d{3,5}/)?.[0]) || null
  };
}

// 💬 /chat route dummy
app.post('/chat', (req, res) => {
  const { message } = req.body;
  const { category, color, maxPrice } = extractFilters(message);

  let filtered = products;

  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase().includes(category));
  }
  if (color) {
    filtered = filtered.filter(p => p.color.toLowerCase().includes(color));
  }
  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= maxPrice);
  }

  const reply = filtered.length > 0
    ? `Here are some ${color || ''} ${category || ''} under Rs.${maxPrice || 'your budget'}`
    : `Sorry! Couldn't find matching products. Try changing the query.`;

  res.json({ reply, results: filtered });
});

app.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000 (No GPT)');
});
