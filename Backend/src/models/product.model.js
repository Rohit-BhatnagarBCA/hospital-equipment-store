/**
 * MongoDB schema for medical equipment products.
 * Existing catalogue fields are preserved and admin media fields are added.
 */

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
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

    // Numeric stock count for inventory calculations.
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
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

    // Keep URLs as strings for compatibility with existing product cards.
    images: {
      type: [String],
      default: [],
    },

    videos: {
      type: [String],
      default: [],
    },

    // Cloudinary public IDs are stored separately for reliable asset deletion.
    imagePublicIds: {
      type: [String],
      default: [],
    },

    videoPublicIds: {
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

productSchema.index({ category: 1, status: 1 });
productSchema.index({ name: 1, status: 1 });

module.exports = mongoose.model("Product", productSchema);