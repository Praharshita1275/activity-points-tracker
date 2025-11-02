require("dotenv").config();
const mongoose = require("mongoose");
const Activity = require("./models/Activity");

async function fixPDFUrls() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find activities with PDF URLs that have /image/upload/
    const activities = await Activity.find({
      proofURL: { $regex: "/image/upload/.*.pdf$" },
    });

    console.log(
      `Found ${activities.length} activities with incorrect PDF URLs`
    );

    for (const activity of activities) {
      const oldUrl = activity.proofURL;
      const newUrl = oldUrl.replace("/image/upload/", "/raw/upload/");

      await Activity.findByIdAndUpdate(activity._id, { proofURL: newUrl });
      console.log(`Updated: ${oldUrl} -> ${newUrl}`);
    }

    console.log("✅ Fixed all PDF URLs");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

fixPDFUrls();
