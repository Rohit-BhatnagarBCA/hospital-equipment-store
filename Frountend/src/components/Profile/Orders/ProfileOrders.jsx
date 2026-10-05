/*
 * ProfileOrders
 * -------------------------------------------------------
 * Orders section used inside the user's Profile dashboard.
 *
 * Responsibilities:
 * - Display order summary
 * - Display recent orders
 * - Reuse OrderSummary
 * - Reuse OrderCard
 * - Provide empty state when there are no orders
 *
 * IMPORTANT:
 * For now this component uses temporary local order data.
 *
 * Later:
 * localOrders
 *     ↓
 * Backend API
 *     ↓
 * authenticated user's orders
 *
 * The UI structure will remain the same.
 */

import OrderSummary from "./OrderSummary";
import OrderCard from "./OrderCard";


/*
 * =========================================================
 * TEMPORARY ORDER DATA
 * =========================================================
 *
 * This is only mock data for building and testing the UI.
 *
 * IMPORTANT:
 * Do NOT treat this as the final database structure.
 *
 * Later this will come from:
 *
 * GET /api/orders/my-orders
 */

const localOrders = [

  {
    id: "ORD-1001",
    orderNumber: "MSI-1001",
    date: "2026-09-28",

    product: {
      name: "Advanced Patient Monitoring System",
      image: "/products/patient-monitor.png",
    },

    quantity: 1,
    amount: 85000,
    status: "delivered",
  },


  {
    id: "ORD-1002",
    orderNumber: "MSI-1002",
    date: "2026-09-30",

    product: {
      name: "ICU Ventilator Pro",
      image: "/products/icu-ventilator.png",
    },

    quantity: 2,
    amount: 145000,
    status: "shipped",
  },


  {
    id: "ORD-1003",
    orderNumber: "MSI-1003",
    date: "2026-10-01",

    product: {
      name: "Digital ECG Machine",
      image: "/products/digital-ecg.png",
    },

    quantity: 1,
    amount: 42000,
    status: "processing",
  },

];


function ProfileOrders() {

  /*
   * =======================================================
   * ORDER SUMMARY CALCULATIONS
   * =======================================================
   */

  const totalOrders = localOrders.length;


  /*
   * Active orders:
   *
   * Anything that has not reached delivered/cancelled.
   */

  const activeOrders = localOrders.filter(
    (order) =>
      order.status !== "delivered" &&
      order.status !== "cancelled"
  ).length;


  /*
   * Delivered orders
   */

  const deliveredOrders = localOrders.filter(
    (order) =>
      order.status === "delivered"
  ).length;


  /*
   * Total spending
   */

  const totalSpending = localOrders.reduce(
    (total, order) =>
      total + Number(order.amount || 0),
    0
  );


  /*
   * =======================================================
   * UI
   * =======================================================
   */

  return (

    <section>

      {/* =================================================
          PAGE / SECTION HEADER
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
            Orders
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
            Your Orders
          </h1>


          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-slate-500
            "
          >
            Track your medical equipment purchases and
            review your previous orders.
          </p>

        </div>

      </div>


      {/* =================================================
          ORDER SUMMARY
          ================================================= */}

      <OrderSummary
        totalOrders={totalOrders}
        activeOrders={activeOrders}
        deliveredOrders={deliveredOrders}
        totalSpending={totalSpending}
      />


      {/* =================================================
          RECENT ORDERS
          ================================================= */}

      <div className="mt-10">

        {/* Section heading */}

        <div
          className="
            mb-5
            flex
            flex-col
            gap-2
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-bold
                tracking-tight
                text-[#102a4c]
              "
            >
              Recent Orders
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Your latest medical equipment purchases.
            </p>

          </div>

        </div>


        {/* =================================================
            ORDER LIST
            ================================================= */}

        {localOrders.length > 0 ? (

          <div className="space-y-4">

            {localOrders.map((order) => (

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

        ) : (

          /*
           * =================================================
           * EMPTY STATE
           * =================================================
           */

          <div
            className="
              flex
              min-h-[320px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-slate-50
              px-6
              text-center
            "
          >

            {/* Empty state icon */}

            <div
              className="
                mb-4
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
                strokeWidth="1.6"
                className="h-6 w-6"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 3h12l2 4H4l2-4Z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
                />

              </svg>

            </div>


            <h3
              className="
                text-lg
                font-bold
                text-[#102a4c]
              "
            >
              No orders yet
            </h3>


            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
              "
            >
              You haven't placed any medical equipment
              orders yet. Your purchases will appear here.
            </p>

          </div>

        )}

      </div>

    </section>

  );
}


export default ProfileOrders;