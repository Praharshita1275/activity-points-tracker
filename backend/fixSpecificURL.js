require("dotenv").config();
const mongoose = require("mongoose");
const Activity = require("./models/Activity");

async function fixURLs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Fix the specific URL
    const activity = await Activity.findOne({
      proofURL:
        "https://res.cloudinary.com/dlowa4lqp/raw/upload/v1762087612/aptrack/zdoir210nq4m47jd6jqs.pdf",
    });

    if (activity) {
      activity.proofURL =
        "https://res.cloudinary.com/dlowa4lqp/image/upload/v1762087612/aptrack/zdoir210nq4m47jd6jqs.pdf";
      await activity.save();
      console.log("✅ Fixed URL in database");
    } else {
      console.log("Activity not found");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

fixURLs();
