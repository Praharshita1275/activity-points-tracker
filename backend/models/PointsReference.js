const mongoose = require('mongoose');

const PointsReferenceSchema = new mongoose.Schema({
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  defaultPoints: { type: Number, required: true },
  maxPoints: { type: Number, required: true }
});

module.exports = mongoose.model('PointsReference', PointsReferenceSchema);
