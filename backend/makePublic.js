require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function makeFilesPublic() {
  try {
    console.log("Making aptrack files public...");

    // Update the specific file to be public
    const result = await cloudinary.api.update("aptrack/zdoir210nq4m47jd6jqs", {
      resource_type: "image",
      type: "authenticated",
      access_mode: "public",
    });

    console.log("✅ File updated:", result.public_id);
    console.log("Access mode:", result.access_mode);
  } catch (error) {
    console.error("Error:", error.error || error);
    console.log("\nℹ️  The file might already be public or you may need to:");
    console.log(
      "1. Go to Cloudinary Dashboard: https://cloudinary.com/console"
    );
    console.log("2. Navigate to Media Library");
    console.log("3. Find the aptrack folder");
    console.log('4. Select the file and click "Make Public"');
  }
}

makeFilesPublic();
