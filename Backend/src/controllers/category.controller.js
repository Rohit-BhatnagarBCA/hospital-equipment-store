
/**
 * HTTP controllers for admin category management.
 * Handles Cloudinary uploads and sends responses to the client.
 */

const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const categoryService = require("../services/category.service");
const { uploadBuffer, deleteAsset } = require("../config/cloudinary");

function validateId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid category ID");
  }
}

async function uploadCategoryImage(file) {
  if (!file) return null;

  return uploadBuffer(
    file.buffer,
    "image",
    "medical-sales-intelligence/categories"
  );
}

const listCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.listCategories(req.query);

  res.status(200).json({
    success: true,
    data: result.categories,
    pagination: result.pagination,
  });
});

const getCategory = asyncHandler(async (req, res) => {
  validateId(req.params.id);

  const category = await categoryService.getCategoryById(req.params.id);

  res.status(200).json({
    success: true,
    data: category,
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const uploadedImage = await uploadCategoryImage(req.file);

  try {
    const category = await categoryService.createCategory(
      req.body,
      uploadedImage
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    // Avoid orphaned Cloudinary images if category creation fails.
    if (uploadedImage?.public_id) {
      await deleteAsset(uploadedImage.public_id, "image").catch(() => null);
    }

    throw error;
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  validateId(req.params.id);

  const uploadedImage = await uploadCategoryImage(req.file);

  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body,
      uploadedImage
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    if (uploadedImage?.public_id) {
      await deleteAsset(uploadedImage.public_id, "image").catch(() => null);
    }

    throw error;
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  validateId(req.params.id);

  await categoryService.deleteCategory(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
