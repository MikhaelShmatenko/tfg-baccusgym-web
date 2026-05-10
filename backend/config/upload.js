const multer = require("multer");
const path = require("path");
const fs = require("fs");

const dest = path.join(__dirname, "../public/videos/exercise-tutorials");
fs.mkdirSync(dest, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dest),
  filename: (req, file, cb) => {
    const existing = fs.readdirSync(dest);
    const duplicate = existing.some((f) => f.endsWith(`-${file.originalname}`));
    if (duplicate) {
      return cb(new Error("DUPLICATE_FILE"));
    }
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("video/")) {
    return cb(new Error("INVALID_FILE_TYPE"));
  }
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
