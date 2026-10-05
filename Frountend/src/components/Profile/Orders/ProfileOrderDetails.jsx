/*
 * ProfileOrderDetails
 * -------------------------------------------------------
 * Displays complete information about a single customer
 * order.
 *
 * Responsibilities:
 * - Read order ID from URL
 * - Find the matching order
 * - Display order information
 * - Display product information
 * - Display payment summary
 * - Display delivery information
 * - Display order status
 * - Display order progress
 *
 * IMPORTANT:
 * This currently uses temporary local order data.
 *
 * Later:
 *
 * URL orderId
 *      ↓
 * Backend API
 *      ↓
 * Authenticated user's order
 *
 * The page structure can remain the same.
 */

import { Link, useParams } from "react-router-dom";

import Navbar from "../../shared/Navbar";
import AiAgent from "../../shared/AiAgent";
import Footer from "../../shared/Footer";

import OrderStatus from "./OrderStatus";



/*
 * =========================================================
 * TEMPORARY ORDER DATA
 * =========================================================
 *
 * This is temporary frontend/demo data.
 *
 * Later this data will come from the backend API.
 */

const localOrders = [

  {
    id: "ORD-1001",
    orderNumber: "MSI-1001",
    date: "2026-09-28",

    product: {
      name: "Advanced Patient Monitoring System",
      image: "/products/patient-monitor.png",
      category: "Patient Monitoring",
    },

    quantity: 1,

    amount: 85000,

    status: "delivered",

    paymentMethod: "UPI",

    paymentStatus: "Paid",

    deliveryAddress: {
      name: "Rohit Bhatnagar",
      address: "Indore, Madhya Pradesh",
      phone: "+91 XXXXX XXXXX",
    },
  },


  {
    id: "ORD-1002",
    orderNumber: "MSI-1002",
    date: "2026-09-30",

    product: {
      name: "ICU Ventilator Pro",
      image: "/products/icu-ventilator.png",
      category: "Critical Care",
    },

    quantity: 2,

    amount: 145000,

    status: "shipped",

    paymentMethod: "UPI",

    paymentStatus: "Paid",

    deliveryAddress: {
      name: "Rohit Bhatnagar",
      address: "Indore, Madhya Pradesh",
      phone: "+91 XXXXX XXXXX",
    },
  },


  {
    id: "ORD-1003",
    orderNumber: "MSI-1003",
    date: "2026-10-01",

    product: {
      name: "Digital ECG Machine",
      image: "/products/digital-ecg.png",
      category: "Cardiology",
    },

    quantity: 1,

    amount: 42000,

    status: "processing",

    paymentMethod: "UPI",

    paymentStatus: "Paid",

    deliveryAddress: {
      name: "Rohit Bhatnagar",
      address: "Indore, Madhya Pradesh",
      phone: "+91 XXXXX XXXXX",
    },
  },

];



function ProfileOrderDetails() {

  /*
   * =======================================================
   * READ ORDER ID FROM URL
   * =======================================================
   *
   * Route:
   *
   * /profile/orders/:orderId
   */

  const { orderId } = useParams();


  /*
   * =======================================================
   * FIND ORDER
   * =======================================================
   *
   * Normalize both values before comparing them.
   *
   * This prevents a small capitalization/spacing difference
   * from causing an unnecessary "Order not found" state.
   */

  const normalizedOrderId = String(orderId || "")
    .trim()
    .toLowerCase();


  const order = localOrders.find(
    (item) =>
      String(item.id || "")
        .trim()
        .toLowerCase() === normalizedOrderId
  );


  /*
   * =======================================================
   * ORDER NOT FOUND
   * =======================================================
   */

  if (!order) {

    return (

      <div className="min-h-screen bg-white">

        <Navbar />


        <main
          className="
            flex
            min-h-[60vh]
            items-center
            justify-center
            px-4
            py-20
          "
        >

          <div className="max-w-lg text-center">

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.15em]
                text-[#1769d1]
              "
            >
              Order not found
            </p>


            <h1
              className="
                mt-3
                text-3xl
                font-bold
                tracking-tight
                text-[#102a4c]
              "
            >
              We couldn't find this order
            </h1>


            <p
              className="
                mt-3
                text-sm
                leading-6
                text-slate-500
              "
            >
              The order may have been removed or the
              order ID may be incorrect.
            </p>


            <Link
              to="/profile/orders"
              className="
                mt-7
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-[#1769d1]
                px-5
                py-3
                text-sm
                font-bold
                text-white
                transition-colors
                duration-200
                hover:bg-[#0d4fa8]
              "
            >
              Back to Orders
            </Link>

          </div>

        </main>


        <Footer />

      </div>

    );
  }


  /*
   * =======================================================
   * SAFE ORDER VALUES
   * =======================================================
   *
   * These fallbacks prevent the page from crashing when
   * some backend fields are missing in the future.
   */

  const product = order.product || {};

  const deliveryAddress = order.deliveryAddress || {};

  const productName =
    product.name || "Medical Equipment";

  const productCategory =
    product.category || "Medical Equipment";

  const productImage =
    product.image || product.images?.[0] || null;


  /*
   * =======================================================
   * FORMAT DATE
   * =======================================================
   */

  const parsedDate = order.date
    ? new Date(order.date)
    : null;


  const formattedDate =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Date unavailable";


  /*
   * =======================================================
   * FORMAT ORDER AMOUNT
   * =======================================================
   *
   * IMPORTANT:
   *
   * amount represents the TOTAL ORDER AMOUNT.
   *
   * It is NOT treated as unit price.
   */

  const formattedAmount = Number(
    order.amount || 0
  ).toLocaleString("en-IN");


  /*
   * =======================================================
   * NORMALIZE STATUS
   * =======================================================
   */

  const normalizedStatus = String(
    order.status || ""
  )
    .toLowerCase()
    .trim();


  /*
   * =======================================================
   * ORDER TIMELINE
   * =======================================================
   *
   * The timeline is based on the current order status.
   *
   * Cancelled orders use a separate cancelled state.
   */

  const timelineSteps = [

    {
      title: "Order Placed",

      description:
        "Your order has been successfully placed.",

      active: true,
    },


    {
      title: "Order Confirmed",

      description:
        "Your order has been confirmed.",

      active:
        normalizedStatus === "confirmed" ||
        normalizedStatus === "shipped" ||
        normalizedStatus === "delivered",
    },


    {
      title: "Shipped",

      description:
        "Your order has been handed over for delivery.",

      active:
        normalizedStatus === "shipped" ||
        normalizedStatus === "delivered",
    },


    {
      title: "Delivered",

      description:
        "Your order has been delivered successfully.",

      active:
        normalizedStatus === "delivered",
    },

  ];


  /*
   * =======================================================
   * CANCELLED ORDER
   * =======================================================
   */

  const isCancelled =
    normalizedStatus === "cancelled";


  /*
   * =======================================================
   * PAYMENT STATUS
   * =======================================================
   */

  const paymentStatus =
    order.paymentStatus || "Pending";

  const paymentMethod =
    order.paymentMethod || "Not specified";


  return (

    <div className="min-h-screen bg-[#f8fbff]">

      {/* =================================================
          GLOBAL NAVBAR
          ================================================= */}

      <Navbar />


      <main>

        {/* =================================================
            BREADCRUMB
            ================================================= */}

        <div
          className="
            border-b
            border-slate-100
            bg-white
            px-4
            py-4
            sm:px-6
            lg:px-8
          "
        >

          <div
            className="
              mx-auto
              flex
              max-w-[1440px]
              flex-wrap
              items-center
              gap-2
              text-sm
            "
          >

            <Link
              to="/"
              className="
                text-slate-400
                transition-colors
                hover:text-[#1769d1]
              "
            >
              Home
            </Link>


            <span className="text-slate-300">
              /
            </span>


            <Link
              to="/profile"
              className="
                text-slate-400
                transition-colors
                hover:text-[#1769d1]
              "
            >
              Profile
            </Link>


            <span className="text-slate-300">
              /
            </span>


            <Link
              to="/profile/orders"
              className="
                text-slate-400
                transition-colors
                hover:text-[#1769d1]
              "
            >
              Orders
            </Link>


            <span className="text-slate-300">
              /
            </span>


            <span className="font-medium text-[#102a4c]">
              {order.orderNumber || order.id}
            </span>

          </div>

        </div>


        {/* =================================================
            PAGE CONTENT
            ================================================= */}

        <section
          className="
            px-4
            py-8
            sm:px-6
            sm:py-10
            lg:px-8
            lg:py-12
          "
        >

          <div className="mx-auto max-w-[1200px]">


            {/* =================================================
                PAGE HEADER
                ================================================= */}

            <div
              className="
                mb-8
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-[#1769d1]
                  "
                >
                  Order Details
                </p>


                <h1
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    tracking-tight
                    text-[#102a4c]
                    sm:text-3xl
                  "
                >
                  Order #{order.orderNumber || order.id}
                </h1>


                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                  "
                >
                  Placed on {formattedDate}
                </p>

              </div>


              <OrderStatus
                status={normalizedStatus}
              />

            </div>


            {/* =================================================
                MAIN GRID
                ================================================= */}

            <div
              className="
                grid
                gap-6
                lg:grid-cols-[1fr_340px]
              "
            >


              {/* =================================================
                  LEFT CONTENT
                  ================================================= */}

              <div className="space-y-6">


                {/* =================================================
                    PRODUCT CARD
                    ================================================= */}

                <section
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    sm:p-6
                  "
                >

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-[#102a4c]
                    "
                  >
                    Ordered Product
                  </h2>


                  <div
                    className="
                      mt-5
                      flex
                      flex-col
                      gap-5
                      sm:flex-row
                      sm:items-center
                    "
                  >

                    {/* Product image */}

                    <div
                      className="
                        flex
                        h-32
                        w-32
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-xl
                        bg-[#f7faff]
                      "
                    >

                      {productImage ? (

                        <img
                          src={productImage}
                          alt={productName}
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-contain
                            p-3
                          "
                        />

                      ) : (

                        <span
                          className="
                            text-xs
                            text-slate-400
                          "
                        >
                          No image
                        </span>

                      )}

                    </div>


                    {/* Product information */}

                    <div className="flex-1">

                      <p
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-[0.1em]
                          text-[#1769d1]
                        "
                      >
                        {productCategory}
                      </p>


                      <h3
                        className="
                          mt-2
                          text-xl
                          font-bold
                          leading-7
                          text-[#102a4c]
                        "
                      >
                        {productName}
                      </h3>


                      <div
                        className="
                          mt-3
                          flex
                          flex-wrap
                          gap-x-6
                          gap-y-2
                          text-sm
                          text-slate-500
                        "
                      >

                        <span>
                          Quantity:{" "}
                          <strong className="text-slate-700">
                            {order.quantity || 1}
                          </strong>
                        </span>


                        <span>
                          Order total:{" "}
                          <strong className="text-slate-700">
                            ₹{formattedAmount}
                          </strong>
                        </span>

                      </div>

                    </div>

                  </div>

                </section>


                {/* =================================================
                    DELIVERY INFORMATION
                    ================================================= */}

                <section
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    sm:p-6
                  "
                >

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-[#102a4c]
                    "
                  >
                    Delivery Information
                  </h2>


                  <div
                    className="
                      mt-5
                      rounded-xl
                      border
                      border-slate-100
                      bg-slate-50
                      p-4
                    "
                  >

                    <p
                      className="
                        text-sm
                        font-bold
                        text-[#102a4c]
                      "
                    >
                      {deliveryAddress.name || "Customer"}
                    </p>


                    <p
                      className="
                        mt-2
                        text-sm
                        leading-6
                        text-slate-500
                      "
                    >
                      {deliveryAddress.address ||
                        "Delivery address unavailable"}
                    </p>


                    <p
                      className="
                        mt-2
                        text-sm
                        text-slate-500
                      "
                    >
                      {deliveryAddress.phone ||
                        "Phone number unavailable"}
                    </p>

                  </div>

                </section>


                {/* =================================================
                    ORDER PROGRESS
                    ================================================= */}

                <section
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    sm:p-6
                  "
                >

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-[#102a4c]
                    "
                  >
                    Order Progress
                  </h2>


                  {isCancelled ? (

                    /*
                     * Cancelled orders do not continue through
                     * the normal shipping/delivery timeline.
                     */

                    <div
                      className="
                        mt-6
                        rounded-xl
                        border
                        border-red-100
                        bg-red-50
                        p-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <span
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-red-100
                            text-sm
                            font-bold
                            text-red-600
                          "
                        >
                          !
                        </span>


                        <div>

                          <p
                            className="
                              text-sm
                              font-bold
                              text-red-700
                            "
                          >
                            Order Cancelled
                          </p>


                          <p
                            className="
                              mt-1
                              text-xs
                              leading-5
                              text-red-600
                            "
                          >
                            This order has been cancelled and
                            will not continue through delivery.
                          </p>

                        </div>

                      </div>

                    </div>

                  ) : (

                    <div className="mt-6">

                      {timelineSteps.map(
                        (step, index) => (

                          <div
                            key={step.title}
                            className="flex gap-4"
                          >

                            {/* Timeline indicator */}

                            <div
                              className="
                                flex
                                flex-col
                                items-center
                              "
                            >

                              <div
                                className={`
                                  flex
                                  h-8
                                  w-8
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  text-xs
                                  font-bold
                                  ${
                                    step.active
                                      ? "bg-[#1769d1] text-white"
                                      : "bg-slate-100 text-slate-400"
                                  }
                                `}
                              >
                                {index + 1}
                              </div>


                              {index <
                                timelineSteps.length - 1 && (

                                <div
                                  className={`
                                    my-1
                                    h-10
                                    w-px
                                    ${
                                      timelineSteps[index + 1]
                                        .active
                                        ? "bg-[#1769d1]"
                                        : "bg-slate-200"
                                    }
                                  `}
                                />

                              )}

                            </div>


                            {/* Timeline content */}

                            <div className="pb-4">

                              <p
                                className={`
                                  text-sm
                                  font-bold
                                  ${
                                    step.active
                                      ? "text-[#102a4c]"
                                      : "text-slate-400"
                                  }
                                `}
                              >
                                {step.title}
                              </p>


                              <p
                                className="
                                  mt-1
                                  text-xs
                                  leading-5
                                  text-slate-500
                                "
                              >
                                {step.description}
                              </p>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </section>

              </div>


              {/* =================================================
                  RIGHT SIDEBAR
                  ================================================= */}

              <aside className="space-y-6">


                {/* =================================================
                    PAYMENT SUMMARY
                    ================================================= */}

                <section
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    sm:p-6
                  "
                >

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-[#102a4c]
                    "
                  >
                    Payment Summary
                  </h2>


                  <div className="mt-5 space-y-4">

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        text-sm
                      "
                    >

                      <span className="text-slate-500">
                        Product total
                      </span>


                      <span className="font-semibold text-slate-700">
                        ₹{formattedAmount}
                      </span>

                    </div>


                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        text-sm
                      "
                    >

                      <span className="text-slate-500">
                        Delivery
                      </span>


                      <span className="font-semibold text-green-600">
                        Free
                      </span>

                    </div>


                    <div className="border-t border-slate-100 pt-4">

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <span
                          className="
                            text-sm
                            font-bold
                            text-[#102a4c]
                          "
                        >
                          Total
                        </span>


                        <span
                          className="
                            text-xl
                            font-bold
                            text-[#102a4c]
                          "
                        >
                          ₹{formattedAmount}
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* Payment status */}

                  <div
                    className={`
                      mt-5
                      rounded-xl
                      px-4
                      py-3
                      ${
                        String(paymentStatus)
                          .toLowerCase() === "paid"
                          ? "bg-green-50"
                          : "bg-amber-50"
                      }
                    `}
                  >

                    <p
                      className={`
                        text-xs
                        font-bold
                        ${
                          String(paymentStatus)
                            .toLowerCase() === "paid"
                            ? "text-green-700"
                            : "text-amber-700"
                        }
                      `}
                    >
                      Payment {paymentStatus}
                    </p>


                    <p
                      className={`
                        mt-1
                        text-xs
                        ${
                          String(paymentStatus)
                            .toLowerCase() === "paid"
                            ? "text-green-600"
                            : "text-amber-600"
                        }
                      `}
                    >
                      Paid using {paymentMethod}
                    </p>

                  </div>

                </section>


                {/* =================================================
                    NEED HELP
                    ================================================= */}

                <section
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    sm:p-6
                  "
                >

                  <h2
                    className="
                      text-base
                      font-bold
                      text-[#102a4c]
                    "
                  >
                    Need help?
                  </h2>


                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    If you have any questions about this
                    order, our support team can help.
                  </p>


                  <button
                    type="button"
                    className="
                      mt-4
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-[#102a4c]
                      transition-all
                      duration-200
                      hover:border-blue-200
                      hover:bg-blue-50
                      hover:text-[#1769d1]
                    "
                  >
                    Contact Support
                  </button>

                </section>


                {/* =================================================
                    BACK TO ORDERS
                    ================================================= */}

                <Link
                  to="/profile/orders"
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#1769d1]
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-white
                    transition-all
                    duration-200
                    hover:bg-[#0d4fa8]
                  "
                >
                  Back to Orders
                </Link>

              </aside>

            </div>

          </div>

        </section>

      </main>


      {/* Floating AI assistant */}

      <AiAgent />


      {/* Global footer */}

      <Footer />

    </div>

  );
}


export default ProfileOrderDetails;