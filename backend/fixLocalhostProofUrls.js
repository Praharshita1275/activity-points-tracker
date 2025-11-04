require('dotenv').config();
const mongoose = require('mongoose');
const Activity = require('./models/Activity');

async function run() {
  const mongo = process.env.MONGO_URI;
  if (!mongo) throw new Error('MONGO_URI not set');
  await mongoose.connect(mongo);
  console.log('Connected to MongoDB');

  // Determine target base URL
  let base = process.env.BACKEND_PUBLIC_URL;
  if (!base && process.env.RENDER_EXTERNAL_HOSTNAME) {
    base = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
  }
  if (!base) throw new Error('Please set BACKEND_PUBLIC_URL or ensure RENDER_EXTERNAL_HOSTNAME is available in the environment');
  base = base.replace(/\/$/, '');

  const badPattern = /^(https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?)/i;

  const list = await Activity.find({ proofURL: { $regex: badPattern } });
  console.log(`Found ${list.length} activities with localhost proofURL`);

  for (const a of list) {
    const idx = a.proofURL.indexOf('/uploads/');
    if (idx !== -1) {
      const file = a.proofURL.substring(idx + '/uploads/'.length);
      const fixed = `${base}/uploads/${encodeURIComponent(decodeURIComponent(file))}`;
      console.log(`Fixing ${a._id}: ${a.proofURL} -> ${fixed}`);
      a.proofURL = fixed;
      await a.save();
    }
  }

  console.log('Done');
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
