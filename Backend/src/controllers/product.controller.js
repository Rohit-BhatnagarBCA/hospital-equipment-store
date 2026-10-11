
/**
 * Handles HTTP requests for the public product catalogue.
 *
 * Controllers handle HTTP input and output while business logic stays
 * inside the service layer.
 */

const productService = require("../services/product.service");
const asyncHandler = require("../utils/asyncHandler");

const listProducts = asyncHandler(async (req, res) => {
  // Use only query parameters that passed Zod validation.
  const query = res.locals.validated.query;
  const result = await productService.listProducts(query);

  res.status(200).json({
    success: true,
    data: result.products,
    pagination: result.pagination,
  });
});

const getProductBySlug = asyncHandler(async (req, res) => {
  // Use the validated slug instead of trusting raw request input.
  const { slug } = res.locals.validated.params;
  const product = await productService.getProductBySlug(slug);

  res.status(200).json({
    success: true,
    data: product,
  });
});

module.exports = {
  listProducts,
  getProductBySlug,
};
