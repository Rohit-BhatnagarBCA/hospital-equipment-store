/*
 * OrderCard
 * -------------------------------------------------------
 * Reusable card for displaying a single customer order.
 *
 * Responsibilities:
 * - Display order ID
 * - Display order date
 * - Display product information
 * - Display quantity
 * - Display order amount
 * - Display order status
 * - Provide order details action
 *
 * IMPORTANT:
 * This component only displays order information.
 *
 * It does NOT:
 * - Fetch orders
 * - Modify orders
 * - Cancel orders
 * - Process payments
 *
 * Those operations will later be handled by the backend.
 */

import { Link } from "react-router-dom";

import OrderStatus from "./OrderStatus";


function OrderCard({
  id,
  orderNumber,
  date,
  product,
  quantity = 1,
  amount = 0,
  status,
}) {

  /*
   * =======================================================
   * FORMAT ORDER DATE
   * =======================================================
   *
   * Converts a valid date into a readable Indian date.
   *
   * Example:
   *
   * 2026-10-03
   *
   * becomes:
   *
   * 3 October 2026
   */

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date unavailable";


  /*
   * =======================================================
   * FORMAT ORDER AMOUNT
   * =======================================================
   */

  const formattedAmount = Number(amount || 0)
    .toLocaleString("en-IN");


  /*
   * =======================================================
   * PRODUCT IMAGE
   * =======================================================
   *
   * Product can be either:
   *
   * {
   *   name,
   *   image
   * }
   *
   * or simply a product name.
   *
   * This fallback prevents the card from crashing if an
   * image is not available.
   */

  const productName =
    product?.name || "Medical Equipment";

  const productImage =
    product?.image || product?.images?.[0];


  return (

    <article
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        transition-all
        duration-200
        hover:shadow-md
      "
    >

      {/* =================================================
          ORDER HEADER
          ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-slate-100
          pb-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-slate-400
            "
          >
            Order ID
          </p>


          <p
            className="
              mt-1
              text-sm
              font-bold
              text-[#102a4c]
            "
          >
            #{orderNumber || id}
          </p>

        </div>


        <div className="flex items-center gap-3">

          <div className="text-right">

            <p
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.1em]
                text-slate-400
              "
            >
              Ordered
            </p>


            <p
              className="
                mt-1
                text-xs
                font-medium
                text-slate-600
              "
            >
              {formattedDate}
            </p>

          </div>


          <OrderStatus status={status} />

        </div>

      </div>


      {/* =================================================
          PRODUCT INFORMATION
          ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-5
          py-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        {/* Product */}

        <div className="flex min-w-0 items-center gap-4">

          {/* Product image */}

          <div
            className="
              flex
              h-20
              w-20
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-slate-100
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
                  p-2
                "
              />

            ) : (

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-7 w-7 text-slate-300"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m7 15 3-3 2 2 2-2 3 3"
                />

              </svg>

            )}

          </div>


          {/* Product details */}

          <div className="min-w-0">

            <h3
              className="
                line-clamp-2
                text-sm
                font-bold
                leading-5
                text-[#102a4c]
                sm:text-base
              "
            >
              {productName}
            </h3>


            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Quantity:{" "}
              <span className="font-semibold text-slate-700">
                {quantity}
              </span>
            </p>

          </div>

        </div>


        {/* Amount */}

        <div className="shrink-0 sm:text-right">

          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.1em]
              text-slate-400
            "
          >
            Total
          </p>


          <p
            className="
              mt-1
              text-lg
              font-bold
              text-[#102a4c]
            "
          >
            ₹{formattedAmount}
          </p>

        </div>

      </div>


      {/* =================================================
          CARD FOOTER
          ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-3
          border-t
          border-slate-100
          pt-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <p
          className="
            text-xs
            text-slate-500
          "
        >
          Need help with this order?
        </p>


        {/* =================================================
            ORDER DETAILS
            =================================================
            
            The actual order details page will be created
            later.
            
            Keeping the route dynamic means every order can
            use the same page.
            
            Example:
            
            /profile/orders/ORD-1001
        ================================================= */}

        <Link
          to={`/profile/orders/${id}`}
          className="
            inline-flex
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2.5
            text-xs
            font-bold
            text-[#102a4c]
            transition-all
            duration-200
            hover:border-blue-200
            hover:bg-blue-50
            hover:text-[#1769d1]
          "
        >
          View Order
        </Link>

      </div>

    </article>
  );
}


export default OrderCard;