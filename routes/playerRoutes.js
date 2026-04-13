const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// POST /api/players
router.post('/players', async (req, res) => {
  try {
    const { email, name, level, score, coins } = req.body;
    
    if (!name || level === undefined || score === undefined) {
      return res.status(400).json({ error: 'Name, level, and score are required' });
    }

    // Use email as unique ID if available, otherwise name
    const query = email ? { email } : { name };
    const update = { 
      name, 
      email, 
      level: parseInt(level), 
      score: parseInt(score), 
      coins: parseInt(coins) || 0,
      createdAt: new Date() 
    };

    const player = await Player.findOneAndUpdate(query, update, { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true 
    });

    res.status(200).json(player);
  } catch (err) {
    console.error('Error saving player:', err);
    res.status(500).json({ error: 'Failed to save player data' });
  }
});

// GET /api/players
router.get('/players', async (req, res) => {
  try {
    const players = await Player.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { $ifNull: ["$email", "$name"] },
          email: { $first: "$email" },
          name: { $first: "$name" },
          level: { $first: "$level" },
          score: { $first: "$score" },
          coins: { $first: "$coins" },
          createdAt: { $first: "$createdAt" }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    res.status(200).json(players);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// GET /api/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    // Aggregation to find the BEST entry for each unique player (using email, fallback to name)
    const leaderboard = await Player.aggregate([
      {
        $sort: { score: -1, createdAt: -1 } // Sort by highest score first
      },
      {
        $group: {
          _id: { $ifNull: ["$email", "$name"] }, // Group by email if it exists, otherwise name
          name: { $first: "$name" },
          level: { $first: "$level" },
          score: { $first: "$score" },
          coins: { $first: "$coins" },
          createdAt: { $first: "$createdAt" }
        }
      },
      {
        $sort: { score: -1 } // Sort result by score again
      },
      {
        $limit: 10 // Top 10 unique players
      }
    ]);

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
