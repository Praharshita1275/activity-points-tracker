const fs = require("fs");
const path = require("path");

let cloudinaryAvail = false;
let cloudinary = null;

if (
  process.env.CLOUD_NAME &&
  process.env.CLOUD_API_KEY &&
  process.env.CLOUD_API_SECRET
) {
  cloudinary = require("cloudinary").v2;
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
  cloudinaryAvail = true;
}

const uploadFile = async (filePath) => {
  // Toggle Cloudinary via env var
  const useCloudinary = String(process.env.USE_CLOUDINARY || "false").toLowerCase() === "true";

  if (cloudinaryAvail && useCloudinary) {
    // Check if it's a PDF file - check both the temp file path and read file signature
    const isPDF = filePath.toLowerCase().endsWith(".pdf");

    // Also check the file's magic number to verify it's actually a PDF
    let actuallyPDF = isPDF;
    try {
      const buffer = fs.readFileSync(filePath);
      // PDF files start with %PDF
      actuallyPDF = buffer.toString("utf-8", 0, 4) === "%PDF";
    } catch (e) {
      console.log("Could not read file signature:", e.message);
    }

    const uploadOptions = {
      folder: "aptrack",
      resource_type: actuallyPDF ? "raw" : "auto", // Use 'raw' for PDFs
      access_mode: "public", // Make sure files are publicly accessible
      type: "upload", // Specify upload type
    };

    console.log("📋 Upload options:", {
      filePath,
      isPDF: actuallyPDF,
      resource_type: uploadOptions.resource_type,
      access_mode: uploadOptions.access_mode,
    });

    const res = await cloudinary.uploader.upload(filePath, uploadOptions);
    // return secure_url and indicate local file may be removed
    return { secure_url: res.secure_url, removeLocal: true };
  }

  // Fallback: move file into uploads folder and serve it from backend
  console.log("📁 Using local storage (Cloudinary disabled or unavailable)");
  const uploadsDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const fileName = path.basename(filePath);
  const dest = path.join(uploadsDir, fileName);

  // If file already exists at destination (same name), skip rename
  if (filePath !== dest) {
    fs.renameSync(filePath, dest);
  }

  // Prefer an explicitly configured public URL for the backend (use your Render service URL)
  let base = process.env.BACKEND_PUBLIC_URL;
  // Render provides RENDER_EXTERNAL_HOSTNAME; construct https URL if present
  if (!base && process.env.RENDER_EXTERNAL_HOSTNAME) {
    base = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
  }
  if (!base) {
    base = `http://localhost:${process.env.PORT || 5001}`;
  }
  const url = `${base.replace(/\/$/, "")}/uploads/${encodeURIComponent(fileName)}`;
  console.log("✅ File stored locally:", url);
  return { secure_url: url, removeLocal: false };
};

module.exports = { uploader: { upload: uploadFile } };
