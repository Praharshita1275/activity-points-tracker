const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: String,
  email: String,
  password: { type: String, required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
  semesterPoints: {
    sem1: { type: Number, default: 0 },
    sem2: { type: Number, default: 0 },
    sem3: { type: Number, default: 0 },
    sem4: { type: Number, default: 0 },
    sem5: { type: Number, default: 0 },
    sem6: { type: Number, default: 0 },
    sem7: { type: Number, default: 0 },
    sem8: { type: Number, default: 0 }
  },
  totalPoints: { type: Number, default: 0 }
});

module.exports = mongoose.model('Student', StudentSchema);
