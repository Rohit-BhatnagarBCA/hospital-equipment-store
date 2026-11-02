/**
 * Database operations for the admin product manager.
 * Unlike the public repository, this repository can access inactive products.
 */

const Product = require("../models/product.model");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findAll({ search = "", page = 1, limit = 10 }) {
  const filter = {};

  if (search) {
    const safeSearch = escapeRegex(search);

    filter.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { category: { $regex: safeSearch, $options: "i" } },
      { slug: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Product.countDocuments(filter),
  ]);

  return { items, total };
}

async function findById(id) {
  return Product.findById(id);
}

async function findBySlug(slug) {
  return Product.findOne({ slug }).lean();
}

async function create(data) {
  return Product.create(data);
}

async function updateById(id, data) {
  return Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

async function deleteById(id) {
  return Product.findByIdAndDelete(id);
}

module.exports = {
  findAll,
  findById,
  findBySlug,
  create,
  updateById,
  deleteById,
};