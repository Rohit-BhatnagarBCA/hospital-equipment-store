/*
 * OrderStatus
 * -------------------------------------------------------
 * Reusable component for displaying the current status of
 * a customer order.
 *
 * Responsibilities:
 * - Display order status
 * - Display status indicator
 * - Display readable status label
 * - Support different order states
 *
 * Supported statuses:
 *
 * processing
 * confirmed
 * shipped
 * delivered
 * cancelled
 *
 * IMPORTANT:
 * This component does not contain order data.
 *
 * The parent component will provide the status through:
 *
 * <OrderStatus status="delivered" />
 *
 * Future:
 * The status will come directly from the backend order API.
 */


function OrderStatus({ status }) {

  /*
   * =======================================================
   * NORMALIZE STATUS
   * =======================================================
   *
   * Converting the value to lowercase prevents problems
   * when backend data uses different capitalization.
   *
   * Example:
   *
   * "Delivered"
   * "DELIVERED"
   *
   * Both become:
   *
   * "delivered"
   */

  const normalizedStatus = String(status || "")
    .toLowerCase()
    .trim();


  /*
   * =======================================================
   * STATUS CONFIGURATION
   * =======================================================
   *
   * Keeping status UI in one configuration object makes
   * this component easier to maintain.
   *
   * Later, if the backend introduces another status,
   * we can add it here without rewriting the JSX.
   */

  const statusConfig = {

    processing: {
      label: "Processing",
      dot: "bg-amber-500",
      text: "text-amber-700",
      background: "bg-amber-50",
    },

    confirmed: {
      label: "Confirmed",
      dot: "bg-blue-500",
      text: "text-blue-700",
      background: "bg-blue-50",
    },

    shipped: {
      label: "Shipped",
      dot: "bg-indigo-500",
      text: "text-indigo-700",
      background: "bg-indigo-50",
    },

    delivered: {
      label: "Delivered",
      dot: "bg-green-500",
      text: "text-green-700",
      background: "bg-green-50",
    },

    cancelled: {
      label: "Cancelled",
      dot: "bg-red-500",
      text: "text-red-700",
      background: "bg-red-50",
    },

  };


  /*
   * =======================================================
   * FALLBACK STATUS
   * =======================================================
   *
   * If the backend sends an unknown or empty status,
   * we don't want the component to crash.
   *
   * Instead we show a neutral "Unknown" state.
   */

  const currentStatus = statusConfig[normalizedStatus] || {

    label: "Unknown",

    dot: "bg-slate-400",

    text: "text-slate-600",

    background: "bg-slate-100",

  };


  /*
   * =======================================================
   * UI
   * =======================================================
   */

  return (

    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        px-3
        py-1.5
        text-xs
        font-bold
        ${currentStatus.background}
        ${currentStatus.text}
      `}
    >

      {/* Status indicator */}

      <span
        className={`
          h-2
          w-2
          rounded-full
          ${currentStatus.dot}
        `}
      />


      {/* Status label */}

      {currentStatus.label}

    </span>

  );
}


export default OrderStatus;