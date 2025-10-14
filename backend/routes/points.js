const express = require('express');
const router = express.Router();
const PointsReference = require('../models/PointsReference');

// Get all points reference entries (categories & subcategories)
router.get('/', async (req, res) => {
  try {
    const list = await PointsReference.find({}).sort({ category: 1, subCategory: 1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
