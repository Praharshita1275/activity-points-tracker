const fs = require('fs');
const path = require('path');

let cloudinaryAvail = false;
let cloudinary = null;

if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET) {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
  cloudinaryAvail = true;
}

const uploadFile = async (filePath) => {
  if (cloudinaryAvail) {
    const res = await cloudinary.uploader.upload(filePath, { folder: 'aptrack' });
    // return secure_url and indicate local file may be removed
    return { secure_url: res.secure_url, removeLocal: true };
  }

  // Fallback: move file into uploads folder and serve it from backend
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const fileName = path.basename(filePath);
  const dest = path.join(uploadsDir, fileName);
  fs.renameSync(filePath, dest);
  const port = process.env.PORT || 5001;
  const url = `http://localhost:${port}/uploads/${encodeURIComponent(fileName)}`;
  return { secure_url: url, removeLocal: false };
};

module.exports = { uploader: { upload: uploadFile } };
