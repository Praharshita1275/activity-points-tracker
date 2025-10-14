const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  studentRollNo: { type: String, required: true },
  semester: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  description: String,
  points: { type: Number, default: 0 },
  proofURL: String,
  status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
