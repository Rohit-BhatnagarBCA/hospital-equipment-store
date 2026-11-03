
/**
 * Category business logic.
 * Keeps validation and category rules outside HTTP controllers.
 */

const categoryRepository = require("../repositories/category.repository");
const { deleteAsset } = require("../config/cloudinary");
const ApiError = require("../utils/ApiError");

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 110);
}

function validateCategoryInput(body) {
  const name = String(body.name || "").trim();
  const description = String(body.description || "").trim();
  const status = body.status || "active";

  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  if (name.length > 100) {
    throw new ApiError(400, "Category name cannot exceed 100 characters");
  }

  if (description.length > 1000) {
    throw new ApiError(400, "Description cannot exceed 1000 characters");
  }

  if (!["active", "inactive"].includes(status)) {
    throw new ApiError(400, "Status must be active or inactive");
  }

  const slug = createSlug(name);

  if (!slug) {
    throw new ApiError(400, "Category name must contain English letters or numbers");
  }

  return { name, slug, description, status };
}

async function listCategories(query = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));

  const search = String(query.search || "").trim();
  const status = String(query.status || "").trim();

  const { items, total } = await categoryRepository.findAll({
    search,
    status,
    page,
    limit,
  });

  return {
    categories: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getCategoryById(id) {
  const category = await categoryRepository.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
}

async function createCategory(body, uploadedImage = null) {
  const fields = validateCategoryInput(body);

  const existing = await categoryRepository.findByName(fields.name);

  if (existing) {
    throw new ApiError(409, "A category with this name already exists");
  }

  const slugExists = await categoryRepository.findBySlug(fields.slug);

  if (slugExists) {
    throw new ApiError(409, "A category with this slug already exists");
  }

  return categoryRepository.create({
    ...fields,
    image: uploadedImage?.secure_url || "",
    imagePublicId: uploadedImage?.public_id || "",
  });
}

async function updateCategory(id, body, uploadedImage = null) {
  const category = await getCategoryById(id);
  const fields = validateCategoryInput(body);

  const duplicate = await categoryRepository.findByName(
    fields.name,
    id
  );

  if (duplicate) {
    throw new ApiError(409, "Another category already uses this name");
  }

  const slugDuplicate = await categoryRepository.findBySlug(fields.slug);

  if (slugDuplicate && String(slugDuplicate._id) !== String(id)) {
    throw new ApiError(409, "Another category already uses this slug");
  }

  // Existing products store category names as strings.
  // Do not rename a category while products still reference its old name.
  if (category.name.toLowerCase() !== fields.name.toLowerCase()) {
    const productCount =
      await categoryRepository.countProductsByCategoryName(category.name);

    if (productCount > 0) {
      throw new ApiError(
        409,
        `This category is used by ${productCount} product(s). Its name cannot be changed yet.`
      );
    }
  }

  const updateData = {
    ...fields,
  };

  if (uploadedImage) {
    updateData.image = uploadedImage.secure_url;
    updateData.imagePublicId = uploadedImage.public_id;
  }

  const updatedCategory = await categoryRepository.updateById(
    id,
    updateData
  );

  // Delete the previous Cloudinary image only after the database update succeeds.
  if (
    uploadedImage &&
    category.imagePublicId &&
    category.imagePublicId !== uploadedImage.public_id
  ) {
    await deleteAsset(category.imagePublicId, "image").catch(() => null);
  }

  return updatedCategory;
}

async function deleteCategory(id) {
  const category = await getCategoryById(id);

  const productCount =
    await categoryRepository.countProductsByCategoryName(category.name);

  if (productCount > 0) {
    throw new ApiError(
      409,
      `Cannot delete this category because ${productCount} product(s) are using it.`
    );
  }

  await categoryRepository.deleteById(id);

  if (category.imagePublicId) {
    await deleteAsset(category.imagePublicId, "image").catch(() => null);
  }

  return category;
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
