const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const ExcelJS = require('exceljs');

// Export activities to Excel
router.get('/activities', auth, adminMiddleware, async (req, res) => {
  try {
    const activities = await Activity.find({}).sort({ createdAt: -1 });
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Activities');
    sheet.columns = [
      { header: 'Roll No', key: 'studentRollNo', width: 15 },
      { header: 'Semester', key: 'semester', width: 10 },
      { header: 'Category', key: 'category', width: 25 },
      { header: 'SubCategory', key: 'subCategory', width: 25 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Points', key: 'points', width: 10 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Proof URL', key: 'proofURL', width: 60 },
      { header: 'Created At', key: 'createdAt', width: 20 }
    ];

    activities.forEach(a => {
      sheet.addRow({
        studentRollNo: a.studentRollNo,
        semester: a.semester,
        category: a.category,
        subCategory: a.subCategory,
        description: a.description,
        points: a.points,
        status: a.status,
        proofURL: a.proofURL,
        createdAt: a.createdAt
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=activities.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
