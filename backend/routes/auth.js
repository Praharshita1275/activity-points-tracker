const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Mentor = require('../models/Mentor');
const auth = require('../middleware/auth');

// Public: list mentors for student registration
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await Mentor.find({}, 'facultyId name department');
    res.json(mentors);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Student register (optional mentor assignment via mentorFacultyId or mentorId)
router.post('/register', async (req, res) => {
  const { rollNo, name, department, email, password, mentorFacultyId, mentorId } = req.body;
  try {
    let student = await Student.findOne({ rollNo });
    if (student) return res.status(400).json({ message: 'Roll number already registered' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const studentData = { rollNo, name, department, email, password: hashed };

    // Optional: attach mentor
    let mentor = null;
    if (mentorId) {
      mentor = await Mentor.findById(mentorId);
    } else if (mentorFacultyId) {
      mentor = await Mentor.findOne({ facultyId: mentorFacultyId });
    }
    if (mentor) studentData.mentor = mentor._id;

    student = new Student(studentData);
    await student.save();
    const payload = { id: student._id, rollNo: student.rollNo, role: 'student', username: student.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Student login
router.post('/login', async (req, res) => {
  const rollNo = (req.body.rollNo || '').trim();
  const password = req.body.password || '';
  try {
    const student = await Student.findOne({ rollNo });
    if (!student) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const payload = { id: student._id, rollNo: student.rollNo, role: 'student', username: student.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Mentor register
router.post('/mentor/register', async (req, res) => {
  const { facultyId, name, department, password } = req.body;
  try {
    let mentor = await Mentor.findOne({ facultyId });
    if (mentor) return res.status(400).json({ message: 'Faculty ID already registered' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    mentor = new Mentor({ facultyId, name, department, password: hashed });
    await mentor.save();
    const payload = { id: mentor._id, role: 'mentor', username: mentor.name || mentor.facultyId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Mentor login
router.post('/mentor/login', async (req, res) => {
  const { facultyId, password } = req.body;
  try {
    const mentor = await Mentor.findOne({ facultyId });
    if (!mentor) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const payload = { id: mentor._id, role: 'mentor', username: mentor.name || mentor.facultyId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get current user info
router.get('/me', auth, async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const student = await Student.findById(req.user.id).select('-password');
      return res.json(student);
    }
    if (req.user.role === 'mentor') {
      const mentor = await Mentor.findById(req.user.id).select('-password');
      return res.json(mentor);
    }
    res.status(400).json({ message: 'Unknown role' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
