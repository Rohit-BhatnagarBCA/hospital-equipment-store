
/**
 * Protected admin category routes.
 * Every endpoint requires an authenticated admin user.
 */

const express = require("express");

const categoryController = require("../controllers/category.controller");
const { authenticate, authorize } = require("../middleware/auth");
const handleCategoryImageUpload = require("../middleware/category-upload");

const router = express.Router();

// Apply authentication and authorization to every category endpoint.
router.use(authenticate, authorize("admin"));

router.get("/", categoryController.listCategories);

router.get("/:id", categoryController.getCategory);

router.post(
  "/",
  handleCategoryImageUpload,
  categoryController.createCategory
);

router.put(
  "/:id",
  handleCategoryImageUpload,
  categoryController.updateCategory
);

router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
