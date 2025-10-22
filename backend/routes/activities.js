const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Activity = require('../models/Activity');
const Student = require('../models/Student');
const PointsReference = require('../models/PointsReference');
const auth = require('../middleware/auth');
const cloudinary = require('../utils/cloudinary');

const upload = multer({ dest: 'uploads/' });

// Upload activity (student)
router.post('/upload', auth, upload.single('proof'), async (req, res) => {
  try {
    const { category, subCategory, semester, description } = req.body;
    const rollNo = req.user.rollNo;

    // Prevent accidental duplicate submissions: if the same student submitted
    // an activity with the same category/subCategory/semester/description within
    // the last 30 seconds, treat it as a duplicate.
    const recentWindow = new Date(Date.now() - 30 * 1000);
    const duplicate = await Activity.findOne({
      studentRollNo: rollNo,
      category,
      subCategory,
      semester: Number(semester),
      description,
      createdAt: { $gte: recentWindow }
    });
    if (duplicate) {
      return res.status(409).json({ message: 'Duplicate submission detected. Please wait a moment before trying again.' });
    }

    // find default points from reference
    const ref = await PointsReference.findOne({ category, subCategory });
    const defaultPoints = ref ? ref.defaultPoints : 0;

    // upload file to cloudinary or move to uploads
    let proofURL = '';
    if (req.file) {
      const filePath = path.resolve(req.file.path);
      const result = await cloudinary.uploader.upload(filePath);
      proofURL = result.secure_url;
      if (result.removeLocal) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
    }

    const activity = new Activity({
      studentRollNo: rollNo,
      semester: Number(semester),
      category,
      subCategory,
      description,
      points: defaultPoints, // will be finalized on verification
      proofURL,
      status: 'Pending'
    });
    await activity.save();
    res.json({ message: 'Uploaded successfully', activity });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get student's activities
router.get('/my', auth, async (req, res) => {
  try {
    const rollNo = req.user.rollNo;
    const activities = await Activity.find({ studentRollNo: rollNo }).sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete activity (only if pending)
router.delete('/:id', auth, async (req, res) => {
  try {
    const rollNo = req.user.rollNo;
    const activity = await Activity.findOne({ _id: req.params.id, studentRollNo: rollNo });
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    if (activity.status !== 'Pending') {
      return res.status(403).json({ message: 'Cannot delete activity that is not pending' });
    }
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
