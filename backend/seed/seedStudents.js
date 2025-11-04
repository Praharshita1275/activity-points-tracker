const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Student = require('../models/Student');

// Load the exact list of students to seed
// Expected format: an array of objects like { rollNo: '160123737141', name: 'AMJA MAITHILI' }
const STUDENTS_LIST = require('./seedStudentsList');

const DEFAULT_PASSWORD = 'student123';
const FIXED_DEPARTMENT = 'IT';

async function main() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }

  if (!Array.isArray(STUDENTS_LIST) || STUDENTS_LIST.length === 0) {
    console.error('No students found in seed/seedStudentsList.js. Please add the provided roll numbers and names.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  let created = 0;
  let skipped = 0;
  let updated = 0;

  for (const entry of STUDENTS_LIST) {
    if (!entry || !entry.rollNo || !entry.name) {
      console.warn('Skipping invalid entry (needs rollNo and name):', entry);
      continue;
    }

    const rollNo = String(entry.rollNo).trim();
    const name = String(entry.name).trim();
    const department = FIXED_DEPARTMENT;
    const email = `${rollNo}@example.com`;

    const exists = await Student.findOne({ rollNo });
    if (exists) {
      // Update name/department/email if changed, but do not overwrite password
      const needsUpdate = (exists.name !== name) || (exists.department !== department) || (exists.email !== email);
      if (needsUpdate) {
        exists.name = name;
        exists.department = department;
        exists.email = email;
        await exists.save();
        updated++;
        console.log(`Updated existing: ${rollNo} - ${name} (${department})`);
      } else {
        skipped++;
        console.log(`Skip existing: ${rollNo}`);
      }
      continue;
    }

    await Student.create({ rollNo, name, department, email, password: hashed });
    created++;
    console.log(`Created student ${rollNo} - ${name} (${department})`);
  }

  // Optional: prune students not in the provided list (SAFE-OFF by default)
  if (String(process.env.PRUNE_STUDENTS_NOT_IN_LIST).toLowerCase() === 'true') {
    const listRolls = new Set(STUDENTS_LIST.map(s => String(s.rollNo).trim()));
    const toDelete = await Student.find({ rollNo: { $nin: Array.from(listRolls) } });
    if (toDelete.length > 0) {
      await Student.deleteMany({ rollNo: { $nin: Array.from(listRolls) } });
      console.log(`Pruned ${toDelete.length} students not in the provided list.`);
    } else {
      console.log('No students to prune.');
    }
  }

  console.log(`Seeding complete. Created: ${created}, Updated: ${updated}, Skipped: ${skipped}. Default password: ${DEFAULT_PASSWORD}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
