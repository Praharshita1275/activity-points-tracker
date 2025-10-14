const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const Student = require('../models/Student');
const PointsReference = require('../models/PointsReference');
const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Get activities with optional filters
router.get('/activities', auth, adminMiddleware, async (req, res) => {
  try {
    const { rollNo, semester, category, status } = req.query;
    const filter = {};
    if (rollNo) filter.studentRollNo = rollNo;
    if (semester) filter.semester = Number(semester);
    if (category) filter.category = category;
    if (status) filter.status = status;
    const activities = await Activity.find(filter).sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Verify an activity (apply points with category max enforcement)
router.post('/verify/:id', auth, adminMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    if (activity.status === 'Verified') return res.status(400).json({ message: 'Already verified' });

    const ref = await PointsReference.findOne({ category: activity.category, subCategory: activity.subCategory });
    const defaultPoints = ref ? ref.defaultPoints : activity.points;
    const maxPoints = ref ? ref.maxPoints : defaultPoints;

    // sum of already verified points for this student under this category
    const verifiedActivities = await Activity.find({ studentRollNo: activity.studentRollNo, category: activity.category, status: 'Verified' });
    const currentSum = verifiedActivities.reduce((s, a) => s + (a.points || 0), 0);
    const allowed = Math.max(0, maxPoints - currentSum);
    const awarded = Math.min(defaultPoints, allowed);

    // update activity
    activity.points = awarded;
    activity.status = 'Verified';
    await activity.save();

    // update student totals
    if (awarded > 0) {
      const student = await Student.findOne({ rollNo: activity.studentRollNo });
      if (student) {
        const semKey = `semesterPoints.sem${activity.semester}`;
        // increment semester and total
        student.semesterPoints = student.semesterPoints || {};
        student.semesterPoints[`sem${activity.semester}`] = (student.semesterPoints[`sem${activity.semester}`] || 0) + awarded;
        student.totalPoints = (student.totalPoints || 0) + awarded;
        await student.save();
      }
    }

    res.json({ message: 'Activity verified', activity });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Reject activity
router.post('/reject/:id', auth, adminMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    activity.status = 'Rejected';
    await activity.save();
    res.json({ message: 'Activity rejected', activity });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Edit awarded points (admin) - adjusts student totals accordingly
router.put('/edit-points/:id', auth, adminMiddleware, async (req, res) => {
  try {
    const { points } = req.body;
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    const oldPoints = activity.points || 0;
    activity.points = Number(points);
    if (activity.status !== 'Verified') activity.status = 'Verified';
    await activity.save();

    const diff = activity.points - oldPoints;
    if (diff !== 0) {
      const student = await Student.findOne({ rollNo: activity.studentRollNo });
      if (student) {
        student.semesterPoints = student.semesterPoints || {};
        student.semesterPoints[`sem${activity.semester}`] = (student.semesterPoints[`sem${activity.semester}`] || 0) + diff;
        student.totalPoints = (student.totalPoints || 0) + diff;
        await student.save();
      }
    }

    res.json({ message: 'Points updated', activity });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
