/*
 * Orders Data
 * -------------------------------------------------------
 * This file is the single source of truth for order data.
 *
 * Why are we keeping orders in one file?
 *
 * Earlier:
 * - Profile.jsx had its own orders
 * - ProfileOrders.jsx had another orders array
 * - ProfileOrderDetails.jsx had another orders array
 *
 * That creates a major problem:
 * If we update an order in one place, the other pages
 * can still show old information.
 *
 * Now all order-related pages will import this same data.
 *
 * Later:
 * This local data can be replaced with backend/API data
 * without changing the overall UI structure.
 */

// =========================================================
// PRODUCT IMAGES
// =========================================================

// These are the actual images already present inside:
//
// src/images/products/
//
// IMPORTANT:
// We are importing the files directly instead of using
// incorrect paths like /products/patient-monitor.png.
import patientMonitorImage from "../images/products/patient-monitor.webp";
import ventilatorImage from "../images/products/ventilator.webp";
import ecgImage from "../images/products/ecg-machine.webp";

// =========================================================
// ORDERS
// =========================================================

export const orders = [
  {
    // Internal order ID used by React Router.
    id: "ORD-1001",

    // Customer-facing order number.
    orderNumber: "MSI-1001",

    // Order creation date.
    date: "2026-09-28",

    // Product information.
    product: {
      name: "Advanced Patient Monitoring System",

      image: patientMonitorImage,

      category: "Patient Monitoring",
    },

    // Quantity purchased.
    quantity: 1,

    // Complete order amount.
    amount: 85000,

    // Current order status.
    status: "delivered",

    // Payment information.
    paymentMethod: "UPI",
    paymentStatus: "Paid",

    // Shipping information.
    shippingAddress: {
      name: "Rohit Bhatnagar",
      addressLine1: "Vijay Nagar",
      addressLine2: "Indore, Madhya Pradesh",
      pincode: "452010",
      country: "India",
    },
  },

  {
    id: "ORD-1002",

    orderNumber: "MSI-1002",

    date: "2026-09-30",

    product: {
      name: "ICU Ventilator Pro",

      image: ventilatorImage,

      category: "Critical Care",
    },

    quantity: 2,

    amount: 145000,

    status: "shipped",

    paymentMethod: "UPI",
    paymentStatus: "Paid",

    shippingAddress: {
      name: "Rohit Bhatnagar",
      addressLine1: "Vijay Nagar",
      addressLine2: "Indore, Madhya Pradesh",
      pincode: "452010",
      country: "India",
    },
  },

  {
    id: "ORD-1003",

    orderNumber: "MSI-1003",

    date: "2026-10-01",

    product: {
      name: "Digital ECG Machine",

      image: ecgImage,

      category: "Cardiology",
    },

    quantity: 1,

    amount: 42000,

    status: "processing",

    paymentMethod: "UPI",
    paymentStatus: "Paid",

    shippingAddress: {
      name: "Rohit Bhatnagar",
      addressLine1: "Vijay Nagar",
      addressLine2: "Indore, Madhya Pradesh",
      pincode: "452010",
      country: "India",
    },
  },
];