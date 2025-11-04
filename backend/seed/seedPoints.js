const mongoose = require('mongoose');
require('dotenv').config();
const PointsReference = require('../models/PointsReference');
const Admin = require('../models/Admin');
const Mentor = require('../models/Mentor');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected for seeding');

  const refs = [
    { category: 'Sports', subCategory: 'Inter-college (Represent college)', defaultPoints: 10, maxPoints: 50 },
    { category: 'Sports', subCategory: 'Intra-college', defaultPoints: 5, maxPoints: 20 },
    { category: 'Cultural', subCategory: 'Inter-college', defaultPoints: 10, maxPoints: 50 },
    { category: 'Cultural', subCategory: 'Intra-college', defaultPoints: 5, maxPoints: 20 },
    { category: 'Academic', subCategory: 'Paper Published', defaultPoints: 15, maxPoints: 30 },
    { category: 'Academic', subCategory: 'Workshop Attended', defaultPoints: 5, maxPoints: 20 },
    { category: 'Online Learning', subCategory: 'MOOCs', defaultPoints: 10, maxPoints: 40 },
    { category: 'Events', subCategory: 'Tech Fest/R&D Day/Conference/Hackathon', defaultPoints: 15, maxPoints: 45 },
    { category: 'Events', subCategory: 'Freshers Workshop', defaultPoints: 10, maxPoints: 30 },
    { category: 'Social Service', subCategory: 'Rural Reporting', defaultPoints: 10, maxPoints: 30 },
    { category: 'Environmental', subCategory: 'Harithaharam', defaultPoints: 10, maxPoints: 30 }
  ];

  for (const r of refs) {
    const existing = await PointsReference.findOne({ category: r.category, subCategory: r.subCategory });
    if (!existing) await PointsReference.create(r);
  }

  // create default mentor
  const existingMentor = await Mentor.findOne({ facultyId: 'mentor1' });
  if (!existingMentor) {
    const hashed = await bcrypt.hash('mentor123', 10);
    await Mentor.create({ facultyId: 'mentor1', name: 'Default Mentor', department: 'General', password: hashed });
    console.log('Default mentor created: facultyId=mentor1 password=mentor123');
  }

  console.log('PointsReference seeded');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
