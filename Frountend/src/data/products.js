/*
 * Product Data
 * -------------------------------------------------------
 * Central product catalogue for the Medical Sales
 * Intelligence frontend.
 *
 * Responsibilities:
 * - Store product information in one place.
 * - Provide product data to ProductSection.
 * - Provide product data to ProductDetails.
 * - Provide product lookup by dynamic product ID.
 *
 * Why we use a separate data file:
 * Keeping product data outside UI components prevents
 * components from becoming unnecessarily large.
 *
 * Current stage:
 * Product data is stored locally for frontend development.
 *
 * Future stage:
 * This structure can be replaced with data received from
 * the backend API and database.
 */


/*
 * =========================================================
 * PRODUCT IMAGE IMPORTS
 * =========================================================
 *
 * Images are imported instead of using direct /src paths.
 *
 * Vite processes these imports and generates the correct
 * production URL automatically.
 *
 * IMPORTANT:
 * These filenames must exactly match the files inside:
 *
 * src/images/products/
 */

import patientMonitor from "../images/products/patient-monitor.webp";
import ecgMachine from "../images/products/ecg-machine.webp";
import infusionPump from "../images/products/infusion-pump.webp";
import ventilator from "../images/products/ventilator.webp";
import ultrasoundMachine from "../images/products/ultrasound-machine.webp";


/*
 * =========================================================
 * PRODUCT CATALOGUE
 * =========================================================
 *
 * Every product has a unique ID.
 *
 * That ID is later used in the URL:
 *
 * /products/patient-monitor-pro
 *
 * /products/digital-ecg-12
 *
 * /products/icu-ventilator
 */

export const products = [

  /*
   * =======================================================
   * PRODUCT 01
   * PATIENT MONITOR
   * =======================================================
   */

  {
    id: "patient-monitor-pro",

    category: "Patient Monitoring",

    name: "Advanced Multi-Parameter Patient Monitor",

    description:
      "A professional multi-parameter patient monitoring system designed for hospitals, ICUs, emergency departments and clinical environments.",

    rating: 4.8,

    reviews: 126,

    price: 48500,

    originalPrice: 56000,

    discount: 13,

    stock: "In Stock",

    badge: "Featured",

    configurations: [
      "Basic",
      "Standard",
      "Advanced",
    ],

    /*
     * Product images used by ProductGallery.
     *
     * The same image can later be replaced with multiple
     * product-angle images.
     */

    images: [
      patientMonitor,
    ],

    specifications: [
      {
        label: "Display",
        value: '12.1" HD',
      },

      {
        label: "ECG",
        value: "3 / 5 Lead",
      },

      {
        label: "SpO2",
        value: "Yes",
      },

      {
        label: "NIBP",
        value: "Yes",
      },

      {
        label: "Temperature",
        value: "Yes",
      },

      {
        label: "Respiration",
        value: "Yes",
      },
    ],

    technicalDetails: [
      {
        label: "Product Type",
        value: "Patient Monitor",
      },

      {
        label: "Application",
        value: "ICU / Hospital",
      },

      {
        label: "Power Supply",
        value: "AC / Battery",
      },

      {
        label: "Battery Backup",
        value: "Up to 4 Hours",
      },

      {
        label: "Warranty",
        value: "2 Years",
      },

      {
        label: "Usage",
        value: "Clinical",
      },
    ],
  },


  /*
   * =======================================================
   * PRODUCT 02
   * DIGITAL ECG MACHINE
   * =======================================================
   */

  {
    id: "digital-ecg-12",

    category: "Cardiology",

    name: "12 Channel Digital ECG Machine",

    description:
      "Professional 12-channel ECG system designed for accurate cardiac monitoring and clinical reporting.",

    rating: 4.7,

    reviews: 94,

    price: 32500,

    originalPrice: 38000,

    discount: 14,

    stock: "In Stock",

    badge: "Popular",

    configurations: [
      "Standard",
      "Advanced",
    ],

    images: [
      ecgMachine,
    ],

    specifications: [
      {
        label: "Channels",
        value: "12 Channel",
      },

      {
        label: "Display",
        value: '7" LCD',
      },

      {
        label: "Printer",
        value: "Built-in",
      },

      {
        label: "Lead System",
        value: "12 Lead",
      },

      {
        label: "Memory",
        value: "1000 Records",
      },

      {
        label: "Connectivity",
        value: "USB",
      },
    ],

    technicalDetails: [
      {
        label: "Product Type",
        value: "ECG Machine",
      },

      {
        label: "Application",
        value: "Cardiology",
      },

      {
        label: "Power Supply",
        value: "AC / Battery",
      },

      {
        label: "Battery Backup",
        value: "Up to 3 Hours",
      },

      {
        label: "Warranty",
        value: "2 Years",
      },

      {
        label: "Usage",
        value: "Hospital / Clinic",
      },
    ],
  },


  /*
   * =======================================================
   * PRODUCT 03
   * INFUSION PUMP
   * =======================================================
   */

  {
    id: "smart-infusion-pump",

    category: "Infusion & IV",

    name: "Smart Volumetric Infusion Pump",

    description:
      "Precision infusion system designed for controlled medication and fluid delivery in clinical environments.",

    rating: 4.6,

    reviews: 71,

    price: 27500,

    originalPrice: 32000,

    discount: 14,

    stock: "In Stock",

    badge: "Popular",

    configurations: [
      "Standard",
      "Advanced",
    ],

    images: [
      infusionPump,
    ],

    specifications: [
      {
        label: "Flow Rate",
        value: "0.1–1200 ml/h",
      },

      {
        label: "Display",
        value: "LCD",
      },

      {
        label: "Alarm System",
        value: "Multi-level",
      },

      {
        label: "Occlusion Detection",
        value: "Yes",
      },

      {
        label: "Battery",
        value: "Built-in",
      },

      {
        label: "Connectivity",
        value: "USB",
      },
    ],

    technicalDetails: [
      {
        label: "Product Type",
        value: "Infusion Pump",
      },

      {
        label: "Application",
        value: "ICU / Hospital",
      },

      {
        label: "Power Supply",
        value: "AC / Battery",
      },

      {
        label: "Battery Backup",
        value: "Up to 6 Hours",
      },

      {
        label: "Warranty",
        value: "2 Years",
      },

      {
        label: "Usage",
        value: "Clinical",
      },
    ],
  },


  /*
   * =======================================================
   * PRODUCT 04
   * ICU VENTILATOR
   * =======================================================
   */

  {
    id: "icu-ventilator",

    category: "Critical Care",

    name: "Advanced ICU Ventilator System",

    description:
      "Modern respiratory support system designed for intensive care environments and critical patient management.",

    rating: 4.8,

    reviews: 43,

    price: 185000,

    originalPrice: 215000,

    discount: 14,

    stock: "In Stock",

    badge: "Professional",

    configurations: [
      "Adult",
      "Pediatric",
      "Advanced",
    ],

    images: [
      ventilator,
    ],

    specifications: [
      {
        label: "Ventilation Modes",
        value: "Multiple",
      },

      {
        label: "Display",
        value: '15" Touchscreen',
      },

      {
        label: "Patient Type",
        value: "Adult / Pediatric",
      },

      {
        label: "Monitoring",
        value: "Real-time",
      },

      {
        label: "Battery",
        value: "Built-in",
      },

      {
        label: "Alarm System",
        value: "Advanced",
      },
    ],

    technicalDetails: [
      {
        label: "Product Type",
        value: "ICU Ventilator",
      },

      {
        label: "Application",
        value: "Critical Care",
      },

      {
        label: "Power Supply",
        value: "AC / Battery",
      },

      {
        label: "Battery Backup",
        value: "Up to 4 Hours",
      },

      {
        label: "Warranty",
        value: "2 Years",
      },

      {
        label: "Usage",
        value: "ICU / Emergency",
      },
    ],
  },


  /*
   * =======================================================
   * PRODUCT 05
   * PORTABLE ULTRASOUND
   * =======================================================
   */

  {
    id: "portable-ultrasound",

    category: "Diagnostic Equipment",

    name: "Portable Diagnostic Ultrasound System",

    description:
      "Compact ultrasound solution with high-resolution imaging designed for hospitals, clinics and point-of-care diagnostics.",

    rating: 4.7,

    reviews: 82,

    price: 165000,

    originalPrice: 190000,

    discount: 13,

    stock: "In Stock",

    badge: "New",

    configurations: [
      "Basic",
      "Standard",
      "Advanced",
    ],

    images: [
      ultrasoundMachine,
    ],

    specifications: [
      {
        label: "Display",
        value: '15" HD',
      },

      {
        label: "Imaging",
        value: "Color Doppler",
      },

      {
        label: "Probes",
        value: "Multiple",
      },

      {
        label: "Storage",
        value: "128 GB",
      },

      {
        label: "Connectivity",
        value: "USB / Wi-Fi",
      },

      {
        label: "Battery",
        value: "Built-in",
      },
    ],

    technicalDetails: [
      {
        label: "Product Type",
        value: "Ultrasound System",
      },

      {
        label: "Application",
        value: "Diagnostic Imaging",
      },

      {
        label: "Power Supply",
        value: "AC / Battery",
      },

      {
        label: "Battery Backup",
        value: "Up to 3 Hours",
      },

      {
        label: "Warranty",
        value: "2 Years",
      },

      {
        label: "Usage",
        value: "Hospital / Clinic",
      },
    ],
  },

];


/*
 * =========================================================
 * FIND PRODUCT BY ID
 * =========================================================
 *
 * Used by ProductDetails.jsx.
 *
 * Example:
 *
 * getProductById("icu-ventilator")
 *
 * returns the complete ICU ventilator object.
 *
 * Keeping this lookup function here means ProductDetails
 * does not need to know how the product catalogue is stored.
 */

export function getProductById(productId) {
  return products.find(
    (product) => product.id === productId
  );
}