
/**
 * Registers read-only routes for the public product catalogue.
 *
 * Request validation runs before controllers so invalid input
 * never reaches the business or database layers.
 */

const express = require("express");
const validate = require("../middleware/validate");
const productController = require("../controllers/product.controller");

const {
  listProductsSchema,
  productParamsSchema,
} = require("../validations/product.validation");

const router = express.Router();

// GET /api/v1/products
router.get(
  "/",
  validate({ query: listProductsSchema }),
  productController.listProducts
);

// GET /api/v1/products/:slug
router.get(
  "/:slug",
  validate({ params: productParamsSchema }),
  productController.getProductBySlug
);

module.exports = router;
