
/**
 * Stores customer quotation requests in MongoDB.
 * A quote keeps a product snapshot so the request remains understandable
 * even if the product catalogue changes later.
 */

const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    product: {
      slug: { type: String, required: true, maxlength: 160 },
      name: { type: String, required: true, maxlength: 200 },
      quantity: { type: Number, required: true, min: 1, max: 10000 },
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

quoteSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Quote", quoteSchema);