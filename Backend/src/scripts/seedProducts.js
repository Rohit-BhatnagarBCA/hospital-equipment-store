
/**
 * Seed Products Script
 *
 * PURPOSE:
 * Adds sample medical equipment to MongoDB for development and API testing.
 *
 * WHY THIS SCRIPT EXISTS:
 * The Products API currently returns an empty array because the database
 * does not contain active product records.
 *
 * HOW IT WORKS:
 * 1. Loads environment variables.
 * 2. Connects to MongoDB.
 * 3. Inserts or updates five sample products.
 * 4. Closes the database connection when finished.
 *
 * IMPORTANT:
 * This is development data, not verified supplier inventory.
 */

// Load environment variables from the Backend/.env file.
// This provides the MongoDB connection string without hardcoding credentials.
require("dotenv").config();

// Import the shared database connection function.
// Reusing this function keeps database configuration consistent across the app.
const connectDatabase = require("../config/database");

// Import Mongoose so the database connection can be closed after seeding.
const mongoose = require("mongoose");

// Import the Product model that defines the MongoDB product document structure.
const Product = require("../models/product.model");

// Store sample product records in an array.
// Each object follows the fields defined in the Product schema.
const products = [
  {
    // A unique, URL-friendly identifier used to fetch a product's details.
    slug: "digital-blood-pressure-monitor",

    // Product name displayed in catalogue cards and detail pages.
    name: "Digital Blood Pressure Monitor",

    // Category used to group and filter related medical equipment.
    category: "Patient Monitoring",

    // Short description shown to users.
    description:
      "Digital monitor designed to measure blood pressure and pulse rate.",

    // Example selling price for development purposes.
    price: 2499,

    // Example original price, before the displayed discount.
    originalPrice: 2999,

    // Example discount percentage.
    discount: 17,

    // Example catalogue rating; not a verified customer rating.
    rating: 4.5,

    // Example review count; not a verified review total.
    reviews: 28,

    // Stock label displayed in the catalogue.
    stock: "In Stock",

    // Optional label used to highlight a product card.
    badge: "Popular",

    // Empty until verified product image URLs are added.
    images: [],

    // Empty until supported product configurations are supplied.
    configurations: [],

    // Product specifications displayed in the product details section.
    specifications: {
      display: "Digital LCD",
      measurement: "Blood pressure and pulse",
      usage: "Clinical and home monitoring",
    },

    // Additional technical information about the product.
    technicalDetails: {
      powerSource: "Battery",
      warranty: "1 year",
    },

    // Only active products are returned by the public catalogue API.
    status: "active",
  },
  {
    // Unique identifier for the pulse oximeter.
    slug: "digital-pulse-oximeter",
    name: "Digital Pulse Oximeter",
    category: "Patient Monitoring",
    description:
      "Portable device for measuring blood oxygen saturation and pulse rate.",
    price: 1299,
    originalPrice: 1599,
    discount: 19,
    rating: 4.4,
    reviews: 19,
    stock: "In Stock",
    badge: "Best Seller",
    images: [],
    configurations: [],
    specifications: {
      display: "Digital LED",
      measurements: "SpO2 and pulse rate",
      design: "Portable fingertip device",
    },
    technicalDetails: {
      powerSource: "Battery",
      warranty: "1 year",
    },
    status: "active",
  },
  {
    // Unique identifier used in the product details URL.
    slug: "portable-ecg-machine",
    name: "Portable ECG Machine",
    category: "Diagnostic Equipment",
    description:
      "Portable electrocardiograph for recording the electrical activity of the heart.",
    price: 18500,
    originalPrice: 21000,
    discount: 12,
    rating: 4.6,
    reviews: 12,
    stock: "In Stock",
    badge: "Professional",
    images: [],
    configurations: [],
    specifications: {
      channels: "3-channel",
      display: "Digital display",
      usage: "Clinical cardiac assessment",
    },
    technicalDetails: {
      powerSource: "Mains and battery",
      warranty: "1 year",
    },
    status: "active",
  },
  {
    // Unique identifier for the infusion pump.
    slug: "infusion-pump",
    name: "Volumetric Infusion Pump",
    category: "Hospital Equipment",
    description:
      "Infusion equipment intended for controlled delivery of fluids in clinical settings.",
    price: 32000,
    originalPrice: 36000,
    discount: 11,
    rating: 4.3,
    reviews: 8,
    stock: "In Stock",
    badge: "Hospital Grade",
    images: [],
    configurations: [],
    specifications: {
      type: "Volumetric infusion",
      display: "Digital",
      usage: "Supervised clinical settings",
    },
    technicalDetails: {
      powerSource: "Mains and battery",
      warranty: "1 year",
    },
    status: "active",
  },
  {
    // Unique identifier for the infrared thermometer.
    slug: "digital-infrared-thermometer",
    name: "Digital Infrared Thermometer",
    category: "Diagnostic Equipment",
    description:
      "Non-contact infrared thermometer for measuring surface temperature.",
    price: 899,
    originalPrice: 1199,
    discount: 25,
    rating: 4.2,
    reviews: 31,
    stock: "In Stock",
    badge: "Value Pick",
    images: [],
    configurations: [],
    specifications: {
      type: "Infrared",
      measurement: "Non-contact temperature",
      display: "Digital",
    },
    technicalDetails: {
      powerSource: "Battery",
      warranty: "1 year",
    },
    status: "active",
  },
];

/**
 * Inserts new products or updates existing ones.
 *
 * Using the slug as the lookup key prevents duplicate records when
 * this script is run multiple times.
 */
async function seedProducts() {
  try {
    // Establish a database connection before executing any write operations.
    await connectDatabase();

    // Process each product one at a time so failures are easier to trace.
    for (const product of products) {
      await Product.updateOne(
        // Find the existing record by its unique slug.
        { slug: product.slug },

        // Update its fields if found; otherwise insert the supplied record.
        { $set: product },

        // upsert creates a document when no matching slug exists.
        // runValidators checks the data against the Product schema.
        { upsert: true, runValidators: true }
      );
    }

    // Report success only after every product operation has completed.
    console.log(`Successfully seeded ${products.length} products.`);
  } catch (error) {
    // Print a useful error message if connecting or writing fails.
    console.error("Product seeding failed:", error.message);

    // Mark the process as failed so scripts and deployment tools can detect it.
    process.exitCode = 1;
  } finally {
    // Close the MongoDB connection whether the script succeeds or fails.
    await mongoose.disconnect();
  }
}

// Start the asynchronous seeding process.
seedProducts();
