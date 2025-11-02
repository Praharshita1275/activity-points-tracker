require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function testCloudinary() {
  try {
    console.log("Testing Cloudinary connection...");

    // List resources in the aptrack folder
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "aptrack/",
      max_results: 10,
    });

    console.log("Files in aptrack folder:");
    result.resources.forEach((file) => {
      console.log(`- ${file.public_id} (${file.resource_type})`);
      console.log(`  URL: ${file.secure_url}`);
    });
  } catch (error) {
    console.error("Cloudinary error:", error);
  }
}

testCloudinary();
