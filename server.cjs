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
  .then(() => console.log("✔️ MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Opening schema
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
  category: { type: String, default: 'Uncategorized' }, // 👈 NEW FIELD
  createdAt: { type: Date, default: Date.now },
});

const Opening = mongoose.model('Opening', openingSchema);

// Routes

// GET all openings
app.get('/api/openings', async (req, res) => {
  try {
    const openings = await Opening.find();
    res.json(openings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single opening by ID ✅ (missing in your version)
app.get('/api/openings/:id', async (req, res) => {
  try {
    const opening = await Opening.findById(req.params.id);
    if (!opening) return res.status(404).json({ error: 'Opening not found' });
    res.json(opening);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new opening
app.post('/api/openings', async (req, res) => {
  try {
    const { name, description, pgn, moves, variations, category } = req.body;

    if (!name || !moves || moves.length === 0) {
      return res.status(400).json({ error: 'Name and moves are required.' });
    }

    const newOpening = new Opening({
      name,
      description: description || 'No description provided',
      pgn,
      moves,
      variations: variations || [],
      category: category || 'Uncategorized'
    });

    await newOpening.save();
    res.status(201).json({ success: true, opening: newOpening });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update opening
app.put('/api/openings/:id', async (req, res) => {
  try {
    const { name, description, pgn, moves, variations, category } = req.body;

    if (!name || !moves || moves.length === 0) {
      return res.status(400).json({ error: 'Name and moves are required.' });
    }

    const updatedOpening = await Opening.findByIdAndUpdate(
      req.params.id,
      { name, description, pgn, moves, variations: variations || [], category },
      { new: true, runValidators: true }
    );

    if (!updatedOpening) {
      return res.status(404).json({ error: 'Opening not found' });
    }

    res.json({ success: true, opening: updatedOpening });
  } catch (err) {
    res.status(500).json({ error: 'Server error while updating opening.' });
  }
});

// DELETE opening ✅ (optional but useful)
app.delete('/api/openings/:id', async (req, res) => {
  try {
    const deleted = await Opening.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Opening not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
