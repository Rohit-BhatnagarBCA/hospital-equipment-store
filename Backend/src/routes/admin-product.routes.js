
/**
 * Protected admin product routes.
 * Reuses the project's existing JWT authentication and role authorization.
 */

const express = require("express");

const adminProductController = require("../controllers/admin-product.controller");
const { authenticate, authorize } = require("../middleware/auth");
const handleProductMediaUpload = require("../middleware/upload");

const router = express.Router();

// All routes require a valid admin account.
router.use(authenticate, authorize("admin"));

router.get("/", adminProductController.listProducts);

router.post(
  "/",
  handleProductMediaUpload,
  adminProductController.createProduct
);

router.put(
  "/:id",
  handleProductMediaUpload,
  adminProductController.updateProduct
);

router.delete("/:id", adminProductController.deleteProduct);

module.exports = router;
