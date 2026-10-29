
/**
 * Handles quotation requests from public product pages.
 */

const Quote = require("../models/quote.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const createQuote = asyncHandler(async (req, res) => {
  const input = res.locals.validated.body;

  // Only allow quotations for active products from our own database.
  const product = await Product.findOne({
    slug: input.productSlug.toLowerCase(),
    status: "active",
  })
    .select("slug name")
    .lean();

  if (!product) {
    throw new ApiError(404, "This product is no longer available.");
  }

  const quote = await Quote.create({
    customerName: input.customerName,
    email: input.email,
    phone: input.phone,
    message: input.message,
    product: {
      slug: product.slug,
      name: product.name,
      quantity: input.quantity,
    },
  });

  res.status(201).json({
    success: true,
    message: "Your quotation request has been submitted.",
    data: {
      id: quote.id,
      status: quote.status,
      createdAt: quote.createdAt,
    },
  });
});

module.exports = { createQuote };