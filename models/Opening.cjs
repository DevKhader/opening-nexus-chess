const mongoose = require('mongoose');

const VariationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startMove: { type: Number, required: true },
  moves: [{ type: String, required: true }]
});

const OpeningSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: 'No description provided' },
  moves: [{ type: String, required: true }],
  variations: [VariationSchema]
}, { timestamps: true });

const Opening = mongoose.model('Opening', OpeningSchema);

module.exports = Opening;
