const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const Student = require("../models/Student");
const PointsReference = require("../models/PointsReference");
const auth = require("../middleware/auth");
const mentorMiddleware = require("../middleware/mentor");

// Get activities with optional filters, restricted to this mentor's students
router.get("/activities", auth, mentorMiddleware, async (req, res) => {
  try {
    const { rollNo, semester, category, status } = req.query;
    const filter = {};
    if (semester) filter.semester = Number(semester);
    if (category) filter.category = category;
    if (status) filter.status = status;
    // restrict to students assigned to this mentor
    const assigned = await Student.find({ mentor: req.user.id }, 'rollNo');
    const rollNos = assigned.map(s => s.rollNo);
    if (rollNo) {
      // If a specific rollNo is requested, ensure it belongs to this mentor
      if (!rollNos.includes(rollNo)) {
        return res.json([]);
      }
      filter.studentRollNo = rollNo;
    } else {
      filter.studentRollNo = { $in: rollNos };
    }
    const activities = await Activity.find(filter).sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Verify an activity (apply points with category max enforcement)
router.post("/verify/:id", auth, mentorMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    if (activity.status === "Verified") return res.status(400).json({ message: "Already verified" });

    // Ensure this activity belongs to a student assigned to this mentor
    const student = await Student.findOne({ rollNo: activity.studentRollNo });
    if (!student || String(student.mentor) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to verify this activity' });
    }

    const ref = await PointsReference.findOne({
      category: activity.category,
      subCategory: activity.subCategory,
    });
    const defaultPoints = ref ? ref.defaultPoints : activity.points;
    const maxPoints = ref ? ref.maxPoints : defaultPoints;

    // sum of already verified points for this student under this category
    const verifiedActivities = await Activity.find({
      studentRollNo: activity.studentRollNo,
      category: activity.category,
      status: "Verified",
    });
    const currentSum = verifiedActivities.reduce((s, a) => s + (a.points || 0), 0);
    const allowed = Math.max(0, maxPoints - currentSum);
    const awarded = Math.min(defaultPoints, allowed);

    // update activity
    activity.points = awarded;
    activity.status = "Verified";
    await activity.save();

    // update student totals
    if (awarded > 0) {
      if (student) {
        student.semesterPoints = student.semesterPoints || {};
        student.semesterPoints[`sem${activity.semester}`] =
          (student.semesterPoints[`sem${activity.semester}`] || 0) + awarded;
        student.totalPoints = (student.totalPoints || 0) + awarded;
        await student.save();
      }
    }

    res.json({ message: "Activity verified", activity });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Reject activity
router.post("/reject/:id", auth, mentorMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    const student = await Student.findOne({ rollNo: activity.studentRollNo });
    if (!student || String(student.mentor) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to reject this activity' });
    }
    activity.status = "Rejected";
    await activity.save();
    res.json({ message: "Activity rejected", activity });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Edit awarded points (mentor) - adjusts student totals accordingly
router.put("/edit-points/:id", auth, mentorMiddleware, async (req, res) => {
  try {
    const { points } = req.body;
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    const student = await Student.findOne({ rollNo: activity.studentRollNo });
    if (!student || String(student.mentor) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to edit this activity' });
    }

    const oldPoints = activity.points || 0;
    activity.points = Number(points);
    if (activity.status !== "Verified") activity.status = "Verified";
    await activity.save();

    const diff = activity.points - oldPoints;
    if (diff !== 0) {
      if (student) {
        student.semesterPoints = student.semesterPoints || {};
        student.semesterPoints[`sem${activity.semester}`] =
          (student.semesterPoints[`sem${activity.semester}`] || 0) + diff;
        student.totalPoints = (student.totalPoints || 0) + diff;
        await student.save();
      }
    }

    res.json({ message: "Points updated", activity });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get this mentor's students with their details
router.get("/students", auth, mentorMiddleware, async (req, res) => {
  try {
    const students = await Student.find(
      { mentor: req.user.id },
      "rollNo name department totalPoints semesterPoints"
    ).sort({ rollNo: 1 });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
