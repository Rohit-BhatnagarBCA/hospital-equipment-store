/**
 * HTTP controllers for admin product operations.
 * Uploaded files are sent to Cloudinary before saving their URLs in MongoDB.
 */

const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const adminProductService = require("../services/admin-product.service");
const { uploadBuffer, deleteAsset } = require("../config/cloudinary");

async function uploadFiles(files, resourceType) {
  return Promise.all(
    files.map((file) =>
      uploadBuffer(
        file.buffer,
        resourceType,
        "medical-sales-intelligence/products"
      )
    )
  );
}

function validateId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid product ID");
  }
}

const listProducts = asyncHandler(async (req, res) => {
  const result = await adminProductService.listProducts(req.query);

  res.status(200).json({
    success: true,
    data: result.products,
    pagination: result.pagination,
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const images = req.files?.images || [];
  const videos = req.files?.video || [];

  const uploadedImages = await uploadFiles(images, "image");
  let uploadedVideos = [];

  try {
    uploadedVideos = await uploadFiles(videos, "video");

    const product = await adminProductService.createProduct(
      req.body,
      uploadedImages,
      uploadedVideos
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    // Remove newly uploaded assets if the database operation fails.
    await Promise.allSettled([
      ...uploadedImages.map((file) => deleteAsset(file.public_id, "image")),
      ...uploadedVideos.map((file) => deleteAsset(file.public_id, "video")),
    ]);

    throw error;
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  validateId(req.params.id);

  const images = req.files?.images || [];
  const videos = req.files?.video || [];

  const uploadedImages = await uploadFiles(images, "image");
  let uploadedVideos = [];

  try {
    uploadedVideos = await uploadFiles(videos, "video");

    const product = await adminProductService.updateProduct(
      req.params.id,
      req.body,
      uploadedImages,
      uploadedVideos
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    await Promise.allSettled([
      ...uploadedImages.map((file) => deleteAsset(file.public_id, "image")),
      ...uploadedVideos.map((file) => deleteAsset(file.public_id, "video")),
    ]);

    throw error;
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  validateId(req.params.id);

  await adminProductService.deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

module.exports = {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};