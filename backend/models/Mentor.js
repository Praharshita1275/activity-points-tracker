const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  facultyId: { type: String, required: true, unique: true },
  name: { type: String },
  department: { type: String },
  password: { type: String, required: true },
});

module.exports = mongoose.model('Mentor', MentorSchema);
