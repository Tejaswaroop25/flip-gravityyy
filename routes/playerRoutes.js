const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// POST /api/players
router.post('/players', async (req, res) => {
  try {
    const { name, level, score } = req.body;
    
    if (!name || level === undefined || score === undefined) {
      return res.status(400).json({ error: 'Name, level, and score are required' });
    }

    const player = new Player({ name, level, score });
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    console.error('Error saving player:', err);
    res.status(500).json({ error: 'Failed to save player data' });
  }
});

// GET /api/players
router.get('/players', async (req, res) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    res.status(200).json(players);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// GET /api/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Player.find().sort({ score: -1 }).limit(10);
    res.status(200).json(leaderboard);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
