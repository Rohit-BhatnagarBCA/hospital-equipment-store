/**
 * Business logic for creating, editing, listing and deleting products.
 * Controllers handle HTTP; this service handles product rules and media cleanup.
 */

const adminProductRepository = require("../repositories/admin-product.repository");
const { deleteAsset } = require("../config/cloudinary");
const ApiError = require("../utils/ApiError");

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 140);
}

async function makeUniqueSlug(name, currentId = null) {
  const baseSlug = createSlug(name);

  if (!baseSlug) {
    throw new ApiError(400, "Product name must contain valid characters");
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await adminProductRepository.findBySlug(slug);

    if (!existing || String(existing._id) === String(currentId)) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

function parseNumber(value, fieldName, { optional = false } = {}) {
  if ((value === undefined || value === "") && optional) return null;

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw new ApiError(400, `${fieldName} must be a valid non-negative number`);
  }

  return number;
}

function parseJsonArray(value, fieldName) {
  if (value === undefined || value === "") return [];

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === "string")) {
      throw new Error("Expected an array of strings");
    }

    return parsed;
  } catch {
    throw new ApiError(400, `${fieldName} must be a valid JSON string array`);
  }
}

function validateProductInput(body) {
  const name = String(body.name || "").trim();
  const category = String(body.category || "").trim();
  const description = String(body.description || "").trim();

  if (!name) throw new ApiError(400, "Product name is required");
  if (!category) throw new ApiError(400, "Product category is required");
  if (name.length > 200) throw new ApiError(400, "Product name is too long");
  if (category.length > 100) throw new ApiError(400, "Category name is too long");

  const price = parseNumber(body.price, "Price");
  const originalPrice = parseNumber(body.originalPrice, "Original price", {
    optional: true,
  });
  const stockQuantity = parseNumber(body.stockQuantity ?? 0, "Stock quantity");

  const status = body.status || "active";

  if (!["active", "inactive"].includes(status)) {
    throw new ApiError(400, "Status must be active or inactive");
  }

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return {
    name,
    category,
    description,
    price,
    originalPrice,
    stockQuantity,
    stock: stockQuantity > 0 ? "In Stock" : "Out of Stock",
    badge: String(body.badge || "").trim(),
    status,
    discount,
  };
}

async function listProducts(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const search = String(query.search || "").trim();

  const { items, total } = await adminProductRepository.findAll({
    search,
    page,
    limit,
  });

  return {
    products: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function createProduct(body, uploadedImages, uploadedVideos) {
  const fields = validateProductInput(body);
  const slug = await makeUniqueSlug(fields.name);

  const images = uploadedImages.map((file) => file.secure_url);
  const imagePublicIds = uploadedImages.map((file) => file.public_id);
  const videos = uploadedVideos.map((file) => file.secure_url);
  const videoPublicIds = uploadedVideos.map((file) => file.public_id);

  return adminProductRepository.create({
    ...fields,
    slug,
    images,
    imagePublicIds,
    videos,
    videoPublicIds,
  });
}

async function updateProduct(id, body, uploadedImages, uploadedVideos) {
  const product = await adminProductRepository.findById(id);

  if (!product) throw new ApiError(404, "Product not found");

  const fields = validateProductInput(body);
  const slug = await makeUniqueSlug(fields.name, id);

  const existingImages = parseJsonArray(body.existingImages, "existingImages");
  const existingVideos = parseJsonArray(body.existingVideos, "existingVideos");

  // Match retained URLs to their existing Cloudinary IDs.
  const retainedImagePublicIds = existingImages.map((url) => {
    const index = product.images.indexOf(url);
    return index >= 0 ? product.imagePublicIds[index] || "" : "";
  });

  const retainedVideoPublicIds = existingVideos.map((url) => {
    const index = product.videos.indexOf(url);
    return index >= 0 ? product.videoPublicIds[index] || "" : "";
  });

  const removedImagePublicIds = product.imagePublicIds.filter(
    (publicId) => !retainedImagePublicIds.includes(publicId)
  );

  const removedVideoPublicIds = product.videoPublicIds.filter(
    (publicId) => !retainedVideoPublicIds.includes(publicId)
  );

  const newImages = uploadedImages.map((file) => file.secure_url);
  const newImagePublicIds = uploadedImages.map((file) => file.public_id);
  const newVideos = uploadedVideos.map((file) => file.secure_url);
  const newVideoPublicIds = uploadedVideos.map((file) => file.public_id);

  const updatedProduct = await adminProductRepository.updateById(id, {
    ...fields,
    slug,
    images: [...existingImages, ...newImages],
    imagePublicIds: [
      ...retainedImagePublicIds.filter(Boolean),
      ...newImagePublicIds,
    ],
    videos: [...existingVideos, ...newVideos],
    videoPublicIds: [
      ...retainedVideoPublicIds.filter(Boolean),
      ...newVideoPublicIds,
    ],
  });

  // Remove media that was deliberately removed from the edit form.
  await Promise.allSettled([
    ...removedImagePublicIds.map((publicId) => deleteAsset(publicId, "image")),
    ...removedVideoPublicIds.map((publicId) => deleteAsset(publicId, "video")),
  ]);

  return updatedProduct;
}

async function deleteProduct(id) {
  const product = await adminProductRepository.deleteById(id);

  if (!product) throw new ApiError(404, "Product not found");

  // Delete the product's Cloudinary assets after removing its database record.
  await Promise.allSettled([
    ...(product.imagePublicIds || []).map((publicId) =>
      deleteAsset(publicId, "image")
    ),
    ...(product.videoPublicIds || []).map((publicId) =>
      deleteAsset(publicId, "video")
    ),
  ]);

  return product;
}

module.exports = {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};