/**
 * Accepts product images and videos using multipart/form-data.
 *
 * Images: maximum 5 files, 2 MB each.
 * Videos: maximum 1 file, 20 MB.
 */

const multer = require("multer");
const ApiError = require("../utils/ApiError");

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const allowedVideoTypes = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const upload = multer({
  storage: multer.memoryStorage(),

  // The maximum is set to the video limit; image limits are checked below.
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 6,
  },

  fileFilter(req, file, callback) {
    const isImage = file.fieldname === "images";
    const isVideo = file.fieldname === "video";

    if (isImage && allowedImageTypes.includes(file.mimetype)) {
      return callback(null, true);
    }

    if (isVideo && allowedVideoTypes.includes(file.mimetype)) {
      return callback(null, true);
    }

    callback(new ApiError(400, `Unsupported file type: ${file.originalname}`));
  },
}).fields([
  { name: "images", maxCount: 5 },
  { name: "video", maxCount: 1 },
]);

function handleProductMediaUpload(req, res, next) {
  upload(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        return next(
          new ApiError(400, "Upload limit exceeded. Check the file count and size.")
        );
      }

      return next(error);
    }

    const images = req.files?.images || [];
    const videos = req.files?.video || [];

    // Enforce the smaller image limit separately from the video limit.
    const oversizedImage = images.some(
      (file) => file.size > 2 * 1024 * 1024
    );

    if (oversizedImage) {
      return next(new ApiError(400, "Each image must be 2 MB or smaller"));
    }

    if (videos.some((file) => file.size > 20 * 1024 * 1024)) {
      return next(new ApiError(400, "Video must be 20 MB or smaller"));
    }

    next();
  });
}

module.exports = handleProductMediaUpload;