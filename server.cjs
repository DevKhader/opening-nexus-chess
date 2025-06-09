// server.cjs
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✔️ MongoDB connected");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });


// Define Opening schema with variations and description
const openingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: 'No description provided' },
  pgn: String,
  moves: [String],
  variations: [
    {
      name: { type: String, required: true },
      startMove: { type: Number, required: true },
      moves: [{ type: String, required: true }]
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const Opening = mongoose.model('Opening', openingSchema);

// POST route to save opening
app.post('/api/openings', async (req, res) => {
  try {
    const { name, description, pgn, moves, variations } = req.body;

    if (!name || !moves || moves.length === 0) {
      return res.status(400).json({ error: 'Name and moves are required.' });
    }

    const newOpening = new Opening({
      name,
      description: description || 'No description provided',
      pgn,
      moves,
      variations: variations || []
    });

    await newOpening.save();
    res.status(201).json({ success: true, opening: newOpening });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT route to update opening by ID
app.put('/api/openings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, pgn, moves, variations } = req.body;

    if (!name || !moves || moves.length === 0) {
      return res.status(400).json({ error: 'Name and moves are required.' });
    }

    const updatedOpening = await Opening.findByIdAndUpdate(
      id,
      { name, description, pgn, moves, variations: variations || [] },
      { new: true, runValidators: true }
    );

    if (!updatedOpening) {
      return res.status(404).json({ error: 'Opening not found' });
    }

    res.json({ success: true, opening: updatedOpening });
  } catch (err) {
    console.error('Error updating opening:', err);
    res.status(500).json({ error: 'Server error while updating opening.' });
  }
});

// GET route to retrieve all openings
app.get('/api/openings', async (req, res) => {
  try {
    const all = await Opening.find();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
