
/**
 * Defines the MongoDB schema for medical equipment products.
 *
 * The schema enforces consistent data types and basic constraints at the
 * database-model level. Request validation should still happen before saving.
 */
 
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // A stable, human-readable identifier used in product URLs.
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      maxlength: 5000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    originalPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    stock: {
      type: String,
      default: "In Stock",
      maxlength: 100,
    },

    badge: {
      type: String,
      default: "",
      maxlength: 100,
    },

    configurations: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    technicalDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Only active products are visible through the public catalogue API.
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  }
);

// Improve common catalogue queries without indexing every field unnecessarily.
productSchema.index({ category: 1, status: 1 });
productSchema.index({ name: 1, status: 1 });

module.exports = mongoose.model("Product", productSchema);
