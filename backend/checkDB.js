require("dotenv").config();
const mongoose = require("mongoose");
const Activity = require("./models/Activity");

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const activity = await Activity.findOne({ proofURL: { $ne: "" } });
    if (activity) {
      console.log("Sample proofURL:", activity.proofURL);
      console.log("Activity ID:", activity._id);
    } else {
      console.log("No activities with proofURL found");
    }

    const allActivities = await Activity.find({});
    console.log(`Total activities: ${allActivities.length}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

checkDB();
