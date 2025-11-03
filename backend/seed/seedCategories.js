const mongoose = require('mongoose');
require('dotenv').config();
const PointsReference = require('../models/PointsReference');

// Map of categories to their sub-options. Use 'General' when no specific sub-options are needed.
const CATEGORY_MAP = [
  { category: 'MOOCs', subs: ['12 weeks', '8 weeks'] },
  { category: 'Tech Fest / R&D Day / Freshers Workshop / Conference / Hackathons etc.', subs: ['Organizer', 'Participant'] },
  { category: 'Rural Reporting', subs: ['General'] },
  { category: 'Harithaharam / Plantation', subs: ['General'] },
  { category: 'Participation in Relief Camps', subs: ['General'] },
  { category: 'Participation in Debate / Group Discussion / Technical Quiz', subs: ['General'] },
  { category: 'Publication in Newspaper, Magazines (Institution Level / Article / Internet)', subs: ['Editor', 'Writer'] },
  { category: 'Publication in Newspaper, Magazine & Blogs', subs: ['General'] },
  { category: 'Research Publication', subs: ['General'] },
  { category: 'Innovation Projects', subs: ['General'] },
  { category: 'Blood Donation / NSS or NCC Participation', subs: ['General'] },
  { category: 'Blood Donation / NSS Camp Organization', subs: ['General'] },
  { category: 'Participation in Sports / Games', subs: ['College', 'University', 'Region', 'State', 'National'] },
  { category: 'Cultural Programme', subs: ['General'] },
  { category: 'Member of Professional Society', subs: ['General'] },
  { category: 'Student Chapter / Club', subs: ['General'] },
  { category: 'Relevant Industry Visit & Report', subs: ['General'] },
  { category: 'Photography Activity in Different Clubs', subs: ['General'] },
  { category: 'Participation in Yoga Camp', subs: ['General'] },
  { category: 'Self-Entrepreneurship Program', subs: ['General'] },
  { category: 'Adventure Sports with Certification', subs: ['General'] },
  { category: 'Training to Under-Privileged Physically Challenged', subs: ['General'] },
  { category: 'Community Service & Allied Activities', subs: ['General'] },
  { category: 'Class Representative', subs: ['General'] },
];

// Choose sensible defaults; can be edited later in admin panel if present
const DEFAULT_POINTS_FOR = (category, sub) => {
  // Example custom defaults
  if (category === 'MOOCs') {
    if (sub === '12 weeks') return 20;
    if (sub === '8 weeks') return 10;
  }
  if (category.startsWith('Tech Fest')) {
    return sub === 'Organizer' ? 15 : 10;
  }
  if (category === 'Participation in Sports / Games') {
    return { 'College': 5, 'University': 10, 'Region': 15, 'State': 20, 'National': 25 }[sub] || 5;
  }
  // Fallback default
  return 0;
};

const MAX_POINTS_DEFAULT = 100; // coarse cap; adjust as needed

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set in environment');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  let created = 0;
  for (const entry of CATEGORY_MAP) {
    for (const sub of entry.subs) {
      const existing = await PointsReference.findOne({ category: entry.category, subCategory: sub });
      if (!existing) {
        await PointsReference.create({
          category: entry.category,
          subCategory: sub,
          defaultPoints: DEFAULT_POINTS_FOR(entry.category, sub),
          maxPoints: MAX_POINTS_DEFAULT,
        });
        created += 1;
        console.log(`Seeded: ${entry.category} -> ${sub}`);
      } else {
        // Optionally update defaults without changing existing max
        const nextDefault = DEFAULT_POINTS_FOR(entry.category, sub);
        if (existing.defaultPoints !== nextDefault) {
          existing.defaultPoints = nextDefault;
          await existing.save();
          console.log(`Updated default points: ${entry.category} -> ${sub} = ${nextDefault}`);
        }
      }
    }
  }

  console.log(`Seeding complete. New entries created: ${created}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
