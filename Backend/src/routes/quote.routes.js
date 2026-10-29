
/**
 * Routes for public quotation submissions.
 */

const express = require("express");
const validate = require("../middleware/validate");
const quoteController = require("../controllers/quote.controller");
const { createQuoteSchema } = require("../validations/quote.validation");

const router = express.Router();

router.post(
  "/",
  validate({ body: createQuoteSchema }),
  quoteController.createQuote
);

module.exports = router;