const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Mentor = require('../models/Mentor');
const Student = require('../models/Student');

async function upsertMentor(facultyId, name, department, password) {
  let mentor = await Mentor.findOne({ facultyId });
  if (!mentor) {
    const hashed = await bcrypt.hash(password, 10);
    mentor = await Mentor.create({ facultyId, name, department, password: hashed });
    console.log(`Created mentor ${facultyId} (${name}) password=${password}`);
  } else {
    console.log(`Existing mentor ${facultyId} (${mentor.name || name})`);
  }
  return mentor;
}

async function main() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // Create or reuse three mentors
  const m1 = await upsertMentor('mentor1', 'Mentor One', 'IT', 'mentor123');
  const m2 = await upsertMentor('mentor2', 'Mentor Two', 'IT', 'mentor234');
  const m3 = await upsertMentor('mentor3', 'Mentor Three', 'IT', 'mentor345');

  // Fetch all students (assumed official list already seeded)
  const students = await Student.find({}).sort({ rollNo: 1 });
  const total = students.length;
  const part = Math.ceil(total / 3);
  const groups = [
    students.slice(0, part),
    students.slice(part, part * 2),
    students.slice(part * 2),
  ];

  // Assign
  let a1 = 0, a2 = 0, a3 = 0;
  for (const s of groups[0]) { s.mentor = m1._id; await s.save(); a1++; }
  for (const s of groups[1]) { s.mentor = m2._id; await s.save(); a2++; }
  for (const s of groups[2]) { s.mentor = m3._id; await s.save(); a3++; }

  console.log(`Assigned students -> mentor1: ${a1}, mentor2: ${a2}, mentor3: ${a3}`);
  console.log('Credentials:');
  console.log(' - mentor1 / mentor123');
  console.log(' - mentor2 / mentor234');
  console.log(' - mentor3 / mentor345');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
