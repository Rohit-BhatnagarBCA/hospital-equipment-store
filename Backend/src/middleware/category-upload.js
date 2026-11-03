
/**
 * Validates and stores category image uploads in memory.
 * Cloudinary handles permanent image storage.
 */

const multer = require("multer");
const ApiError = require("../utils/ApiError");

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },

  fileFilter(req, file, callback) {
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new ApiError(400, "Only JPG, PNG or WEBP category images are allowed")
      );
    }

    callback(null, true);
  },
}).single("image");

function handleCategoryImageUpload(req, res, next) {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return next(
        new ApiError(400, "Category image must be 2 MB or smaller")
      );
    }

    if (error) {
      return next(error);
    }

    next();
  });
}

module.exports = handleCategoryImageUpload;
