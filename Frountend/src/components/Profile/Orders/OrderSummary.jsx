/*
 * OrderSummary
 * -------------------------------------------------------
 * Displays a quick summary of the user's order activity.
 *
 * Summary:
 * - Total Orders
 * - Active Orders
 * - Delivered Orders
 * - Total Spending
 *
 * IMPORTANT:
 * This component only displays summary information.
 * It does NOT fetch or modify order data.
 *
 * Future:
 * The values will come from the backend order API.
 *
 * Example:
 *
 * <OrderSummary
 *   totalOrders={24}
 *   activeOrders={3}
 *   deliveredOrders={21}
 *   totalSpending={125000}
 * />
 */


/*
 * =========================================================
 * SUMMARY ITEM
 * =========================================================
 *
 * Small reusable internal component used to keep the main
 * OrderSummary JSX clean.
 */

function SummaryItem({
  label,
  value,
  description,
  icon,
  iconBackground,
  iconColor,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >

      {/* =================================================
          TOP ROW
          ================================================= */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >

        {/* Label */}

        <div>

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.12em]
              text-slate-400
            "
          >
            {label}
          </p>


          {/* Main value */}

          <p
            className="
              mt-2
              text-2xl
              font-bold
              tracking-tight
              text-[#102a4c]
              sm:text-3xl
            "
          >
            {value}
          </p>

        </div>


        {/* Icon */}

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${iconBackground}
            ${iconColor}
          `}
        >
          {icon}
        </div>

      </div>


      {/* Description */}

      <p
        className="
          mt-4
          text-xs
          leading-5
          text-slate-500
        "
      >
        {description}
      </p>

    </div>
  );
}


/*
 * =========================================================
 * MAIN COMPONENT
 * =========================================================
 */

function OrderSummary({
  totalOrders = 0,
  activeOrders = 0,
  deliveredOrders = 0,
  totalSpending = 0,
}) {

  /*
   * =======================================================
   * FORMAT SPENDING
   * =======================================================
   *
   * Indian number formatting:
   *
   * 125000
   *
   * becomes:
   *
   * ₹1,25,000
   */

  const formattedSpending = Number(totalSpending || 0)
    .toLocaleString("en-IN");


  return (

    <section>

      {/* =================================================
          SECTION HEADER
          ================================================= */}

      <div className="mb-5">

        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.14em]
            text-[#1769d1]
          "
        >
          Order Overview
        </p>


        <h2
          className="
            mt-1
            text-xl
            font-bold
            tracking-tight
            text-[#102a4c]
          "
        >
          Your order activity
        </h2>


        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          A quick overview of your purchasing activity.
        </p>

      </div>


      {/* =================================================
          SUMMARY GRID
          ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* =================================================
            TOTAL ORDERS
            ================================================= */}

        <SummaryItem
          label="Total Orders"
          value={totalOrders}
          description="All orders placed through your account."
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
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

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 11h6"
              />
            </svg>
          }
          iconBackground="bg-blue-50"
          iconColor="text-[#1769d1]"
        />


        {/* =================================================
            ACTIVE ORDERS
            ================================================= */}

        <SummaryItem
          label="Active Orders"
          value={activeOrders}
          description="Orders currently being processed or shipped."
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle
                cx="12"
                cy="12"
                r="8"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l2.5 2"
              />
            </svg>
          }
          iconBackground="bg-amber-50"
          iconColor="text-amber-600"
        />


        {/* =================================================
            DELIVERED ORDERS
            ================================================= */}

        <SummaryItem
          label="Delivered"
          value={deliveredOrders}
          description="Orders successfully delivered to you."
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12.5 9.5 17 19 7"
              />
            </svg>
          }
          iconBackground="bg-green-50"
          iconColor="text-green-600"
        />


        {/* =================================================
            TOTAL SPENDING
            ================================================= */}

        <SummaryItem
          label="Total Spending"
          value={`₹${formattedSpending}`}
          description="Total amount spent across your orders."
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v18"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 7.5c0-1.7-1.8-3-4.5-3S8 5.6 8 7.4c0 2 1.8 2.7 4.5 3.2s4.5 1.3 4.5 3.3c0 1.8-1.8 3.3-4.5 3.3S8 15.8 8 14"
              />
            </svg>
          }
          iconBackground="bg-purple-50"
          iconColor="text-purple-600"
        />

      </div>

    </section>
  );
}


export default OrderSummary;