
/**
 * Performs database operations for the product catalogue.
 *
 * Keeping database access in a repository makes it easier to test and later
 * replace the persistence layer without rewriting controllers.
 */ 

const Product = require("../models/product.model");
/**
 * Escapes regular-expression characters before using search text in a regex.
 * This prevents user input from changing the intended search pattern.
 */
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findActiveProducts({ search, page, limit }) {
  // Build the filter from known fields rather than accepting a raw client filter.
  const filter = { status: "active" };

  if (search) {
    filter.name = {
      $regex: escapeRegex(search),
      $options: "i",
    };
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .select("-__v")
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Product.countDocuments(filter),
  ]);

  return { items, total };
}

async function findActiveProductBySlug(slug) {
  return Product.findOne({
    slug,
    status: "active",
  })
    .select("-__v")
    .lean();
}

module.exports = {
  findActiveProducts,
  findActiveProductBySlug,
};
