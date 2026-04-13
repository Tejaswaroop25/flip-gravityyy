const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  email: { type: String, unique: false }, // Store email if available
  name: { type: String, required: true },
  level: { type: Number, required: true },
  score: { type: Number, required: true },
  coins: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Player', playerSchema);
