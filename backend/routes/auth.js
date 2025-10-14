const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// Student register
router.post('/register', async (req, res) => {
  const { rollNo, name, department, email, password } = req.body;
  try {
    let student = await Student.findOne({ rollNo });
    if (student) return res.status(400).json({ message: 'Roll number already registered' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    student = new Student({ rollNo, name, department, email, password: hashed });
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
  const { rollNo, password } = req.body;
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

// Admin login
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const payload = { id: admin._id, username: admin.username, role: 'admin' };
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
    if (req.user.role === 'admin') {
      const admin = await Admin.findById(req.user.id).select('-password');
      return res.json(admin);
    }
    res.status(400).json({ message: 'Unknown role' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
