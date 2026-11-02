/**
 * Configures Cloudinary for secure server-side media storage.
 * Cloudinary credentials must remain in the backend environment.
 */

const cloudinary = require("cloudinary").v2;
const ApiError = require("../utils/ApiError");

function ensureCloudinaryConfigured() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (
    !CLOUDINARY_CLOUD_NAME ||
    !CLOUDINARY_API_KEY ||
    !CLOUDINARY_API_SECRET
  ) {
    throw new ApiError(503, "Cloudinary is not configured on the server");
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

function uploadBuffer(buffer, resourceType, folder) {
  ensureCloudinaryConfigured();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Stream the in-memory file buffer directly to Cloudinary.
    stream.end(buffer);
  });
}

async function deleteAsset(publicId, resourceType = "image") {
  if (!publicId) return;

  ensureCloudinaryConfigured();

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });
}

module.exports = {
  uploadBuffer,
  deleteAsset,
};