const mongoose = require('mongoose');
require('dotenv').config();
const Student = require('../models/Student');

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // Test roll numbers to remove (numeric dummy accounts)
  const toRemove = new Set(['000']);
  for (let n = 141; n <= 190; n++) toRemove.add(String(n));

  // Optionally include any stray 'mentor' student
  toRemove.add('mentor');

  const list = Array.from(toRemove);
  const res = await Student.deleteMany({ rollNo: { $in: list } });
  console.log(`Deleted ${res.deletedCount} test student(s).`);

  // Show quick summary by roll format
  const remaining = await Student.find({}, 'rollNo name').sort({ rollNo: 1 });
  const hyphenated = remaining.filter(s => s.rollNo.includes('-')).length;
  const numeric = remaining.filter(s => /^\d+$/.test(s.rollNo)).length;
  console.log(`Remaining students: total=${remaining.length}, hyphenated=${hyphenated}, numeric=${numeric}`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
