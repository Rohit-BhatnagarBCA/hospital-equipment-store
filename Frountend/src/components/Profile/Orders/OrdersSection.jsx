/*
 * OrdersSection
 * -------------------------------------------------------
 * Displays the customer's recent orders.
 *
 * Responsibilities:
 * - Display order list
 * - Show order status
 * - Reuse OrderCard for every order
 * - Provide empty state when there are no orders
 *
 * IMPORTANT:
 * This component currently uses temporary local order data.
 *
 * Later:
 * The orders will come from the backend API.
 */

import OrderCard from "./OrderCard";


function OrdersSection({ orders = [] }) {

  /*
   * =======================================================
   * EMPTY ORDERS
   * =======================================================
   *
   * If the customer has no orders, show a friendly
   * empty state instead of rendering an empty list.
   */

  if (!orders.length) {

    return (

      <section
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
        "
      >

        {/* Section heading */}

        <div>

          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#1769d1]
            "
          >
            Orders
          </p>


          <h2
            className="
              mt-2
              text-xl
              font-bold
              text-[#102a4c]
            "
          >
            Your Orders
          </h2>


          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            Your recent purchases and order history will
            appear here.
          </p>

        </div>


        {/* Empty state */}

        <div
          className="
            mt-8
            flex
            min-h-[220px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-slate-200
            bg-slate-50
            px-6
            text-center
          "
        >

          {/* Icon */}

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-white
              text-slate-400
              shadow-sm
            "
          >

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-6 w-6"
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 3h12a1 1 0 0 1 1 1v16l-3-2-4 2-4-2-3 2V4a1 1 0 0 1 1-1Z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 8h6M9 12h6"
              />

            </svg>

          </div>


          <h3
            className="
              mt-4
              text-base
              font-bold
              text-[#102a4c]
            "
          >
            No orders yet
          </h3>


          <p
            className="
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-slate-500
            "
          >
            Once you place an order, you will be able to
            track and manage it from your profile.
          </p>

        </div>

      </section>

    );
  }


  /*
   * =======================================================
   * ORDERS LIST
   * =======================================================
   *
   * When orders are available, each order is rendered
   * using the reusable OrderCard component.
   */

  return (

    <section>

      {/* =================================================
          SECTION HEADER
          ================================================= */}

      <div
        className="
          mb-5
          flex
          flex-col
          gap-2
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >

        <div>

          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#1769d1]
            "
          >
            Orders
          </p>


          <h2
            className="
              mt-2
              text-xl
              font-bold
              text-[#102a4c]
            "
          >
            Your Orders
          </h2>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Track your recent medical equipment purchases.
          </p>

        </div>


        {/* Order count */}

        <div
          className="
            inline-flex
            w-fit
            items-center
            rounded-full
            bg-blue-50
            px-3
            py-1.5
            text-xs
            font-bold
            text-[#1769d1]
          "
        >

          {orders.length}{" "}
          {orders.length === 1 ? "Order" : "Orders"}

        </div>

      </div>


      {/* =================================================
          ORDER CARDS
          ================================================= */}

      <div className="space-y-4">

        {orders.map((order) => (

          <OrderCard
            key={order.id}
            id={order.id}
            orderNumber={order.orderNumber}
            date={order.date}
            product={order.product}
            quantity={order.quantity}
            amount={order.amount}
            status={order.status}
          />

        ))}

      </div>

    </section>

  );
}


export default OrdersSection; 