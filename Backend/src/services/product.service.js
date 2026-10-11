
/**
 * Implements business operations for the public product catalogue.
 *
 * The service coordinates repository calls and handles expected
 * business conditions independently of HTTP routing.
 */

const productRepository = require("../repositories/product.repository");
const ApiError = require("../utils/ApiError");

async function listProducts(query) {
  const { items, total } =
    await productRepository.findActiveProducts(query);

  return {
    products: items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

async function getProductBySlug(slug) {
  const product =
    await productRepository.findActiveProductBySlug(slug);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
}

module.exports = {
  listProducts,
  getProductBySlug,
};
