/*
 * Profile Order Details
 * -------------------------------------------------------
 * Displays complete information about one order.
 *
 * Route:
 *
 * /profile/orders/:orderId
 *
 * Example:
 *
 * /profile/orders/ORD-1001
 *
 * IMPORTANT:
 * Order data comes from the shared orders.js file.
 */

import { Link, useParams } from "react-router-dom";

import Navbar from "../../shared/Navbar";
import AiAgent from "../../shared/AiAgent";
import Footer from "../../shared/Footer";

import OrderStatus from "./OrderStatus";

import { orders } from "../../../data/orders";


function ProfileOrderDetails() {

  // =======================================================
  // GET ORDER ID FROM URL
  // =======================================================

  const { orderId } = useParams();


  // =======================================================
  // FIND ORDER
  // =======================================================

  /*
   * Find the order whose ID matches the URL.
   */
  const order = orders.find(
    (item) => item.id === orderId
  );


  // =======================================================
  // ORDER NOT FOUND
  // =======================================================

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
            bg-[#f8fbff]
            px-4
          "
        >

          <div className="text-center">

            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-slate-100
                text-2xl
              "
            >
              ?
            </div>


            <h1
              className="
                text-2xl
                font-bold
                text-[#102a4c]
              "
            >
              Order not found
            </h1>


            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
              "
            >
              We could not find an order with this order ID.
              Please check the order number and try again.
            </p>


            <Link
              to="/profile/orders"
              className="
                mt-6
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-[#1769d1]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#1258b0]
              "
            >
              Back to My Orders
            </Link>

          </div>

        </main>


        <AiAgent />

        <Footer />

      </div>
    );
  }


  // =======================================================
  // SHIPPING ADDRESS
  // =======================================================

  const shippingAddress = order.shippingAddress;


  // =======================================================
  // PAGE
  // =======================================================

  return (
    <div className="min-h-screen bg-white">

      <Navbar />


      <main className="bg-[#f8fbff]">

        <div
          className="
            mx-auto
            max-w-[1200px]
            px-4
            py-8
            sm:px-6
            lg:px-8
          "
        >

          {/* =================================================
              BREADCRUMB
              ================================================= */}

          <div
            className="
              mb-6
              flex
              flex-wrap
              items-center
              gap-2
              text-sm
              text-slate-500
            "
          >

            <Link
              to="/profile"
              className="hover:text-[#1769d1]"
            >
              Profile
            </Link>

            <span>/</span>

            <Link
              to="/profile/orders"
              className="hover:text-[#1769d1]"
            >
              Orders
            </Link>

            <span>/</span>

            <span className="font-medium text-slate-700">
              {order.orderNumber}
            </span>

          </div>


          {/* =================================================
              HEADER
              ================================================= */}

          <div className="mb-6">

            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-start
                sm:justify-between
              "
            >

              <div>

                <p
                  className="
                    mb-2
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-[#1769d1]
                  "
                >
                  Order Details
                </p>


                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-[#102a4c]
                    sm:text-3xl
                  "
                >
                  {order.orderNumber}
                </h1>


                <p className="mt-2 text-sm text-slate-500">
                  Placed on{" "}
                  {new Date(order.date).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>

              </div>


              <OrderStatus status={order.status} />

            </div>

          </div>


          {/* =================================================
              ORDER PRODUCT
              ================================================= */}

          <section
            className="
              mb-6
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              sm:p-6
            "
          >

            <h2
              className="
                mb-5
                text-lg
                font-bold
                text-[#102a4c]
              "
            >
              Product
            </h2>


            <div
              className="
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
                  w-full
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  bg-slate-50
                  sm:w-32
                "
              >

                <img
                  src={order.product.image}
                  alt={order.product.name}
                  className="
                    h-full
                    w-full
                    object-contain
                    p-3
                  "
                />

              </div>


              {/* Product information */}

              <div className="min-w-0 flex-1">

                <p
                  className="
                    mb-1
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[#1769d1]
                  "
                >
                  {order.product.category}
                </p>


                <h3
                  className="
                    text-lg
                    font-bold
                    text-[#102a4c]
                  "
                >
                  {order.product.name}
                </h3>


                <p className="mt-2 text-sm text-slate-500">
                  Quantity:{" "}
                  <span className="font-semibold text-slate-700">
                    {order.quantity}
                  </span>
                </p>

              </div>


              {/* Order amount */}

              <div className="sm:text-right">

                <p className="text-xs text-slate-500">
                  Order total
                </p>

                <p
                  className="
                    mt-1
                    text-xl
                    font-bold
                    text-[#102a4c]
                  "
                >
                  ₹{Number(order.amount).toLocaleString("en-IN")}
                </p>

              </div>

            </div>

          </section>


          {/* =================================================
              ORDER INFORMATION GRID
              ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              gap-6
              lg:grid-cols-2
            "
          >

            {/* =================================================
                DELIVERY ADDRESS
                ================================================= */}

            <section
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                sm:p-6
              "
            >

              <h2
                className="
                  mb-4
                  text-lg
                  font-bold
                  text-[#102a4c]
                "
              >
                Delivery Address
              </h2>


              {shippingAddress ? (
                <div
                  className="
                    text-sm
                    leading-7
                    text-slate-600
                  "
                >

                  <p className="font-semibold text-slate-800">
                    {shippingAddress.name}
                  </p>

                  <p>
                    {shippingAddress.addressLine1}
                  </p>

                  <p>
                    {shippingAddress.addressLine2}
                  </p>

                  <p>
                    PIN: {shippingAddress.pincode}
                  </p>

                  <p>
                    {shippingAddress.country}
                  </p>

                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Shipping address unavailable.
                </p>
              )}

            </section>


            {/* =================================================
                PAYMENT
                ================================================= */}

            <section
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                sm:p-6
              "
            >

              <h2
                className="
                  mb-4
                  text-lg
                  font-bold
                  text-[#102a4c]
                "
              >
                Payment
              </h2>


              <div className="space-y-3 text-sm">

                <div className="flex justify-between gap-4">

                  <span className="text-slate-500">
                    Payment method
                  </span>

                  <span className="font-semibold text-slate-700">
                    {order.paymentMethod}
                  </span>

                </div>


                <div className="flex justify-between gap-4">

                  <span className="text-slate-500">
                    Payment status
                  </span>

                  <span
                    className="
                      font-semibold
                      text-emerald-600
                    "
                  >
                    {order.paymentStatus}
                  </span>

                </div>


                <div
                  className="
                    flex
                    justify-between
                    gap-4
                    border-t
                    border-slate-100
                    pt-3
                  "
                >

                  <span className="font-medium text-slate-600">
                    Total
                  </span>

                  <span
                    className="
                      font-bold
                      text-[#102a4c]
                    "
                  >
                    ₹{Number(order.amount).toLocaleString("en-IN")}
                  </span>

                </div>

              </div>

            </section>

          </div>


          {/* =================================================
              ACTIONS
              ================================================= */}

          <div className="mt-6 flex flex-wrap gap-3">

            <Link
              to="/profile/orders"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:border-blue-200
                hover:text-[#1769d1]
              "
            >
              Back to Orders
            </Link>


            <Link
              to="/profile"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-[#1769d1]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#1258b0]
              "
            >
              Go to Profile
            </Link>

          </div>

        </div>

      </main>


      {/* Floating AI assistant */}
      <AiAgent />


      {/* Global footer */}
      <Footer />

    </div>
  );
}


export default ProfileOrderDetails;