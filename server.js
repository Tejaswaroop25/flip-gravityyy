require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const playerRoutes = require('./routes/playerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend files (HTML, CSS, JS) so it works on other devices
const path = require('path');
app.use(express.static(__dirname));

app.use('/api', playerRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB database'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
