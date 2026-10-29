/*
 * ProductInfo
 * -------------------------------------------------------
 * Displays the commercial and purchasing information of
 * a single medical product.
 *
 * Responsibilities:
 * - Display product identity and category
 * - Display rating and reviews
 * - Display pricing information
 * - Display stock status
 * - Allow configuration/size selection
 * - Allow quantity selection
 * - Provide purchasing/quotation actions
 *
 * Why this is a separate component:
 * ProductGallery handles the visual side of the product,
 * while ProductInfo handles the decision-making side.
 *
 * Keeping these responsibilities separate makes the product
 * details page easier to maintain and extend later.
 */

import { useState } from "react";
import { createQuoteRequest } from "../../services/quoteApi";

import {
  Minus,
  Plus,
  ShoppingCart,
  Star,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";


function ProductInfo({
  productSlug,
  category,
  name,
  rating,
  reviews,
  description,
  price,
  originalPrice,
  discount,
  stock,
  configurations = [],
}) {

  /*
   * Stores the configuration selected by the customer.
   *
   * Example:
   * Basic / Standard / Advanced
   *
   * This state will later be connected to the backend
   * when different configurations have different prices
   * or inventory.
   */
  const [selectedConfiguration, setSelectedConfiguration] =
    useState(configurations[0] || "");

  /*
   * Stores the requested quantity.
   *
   * Quantity is kept as local UI state for now.
   * Later this can be connected to cart/quote state.
   */
  const [quantity, setQuantity] = useState(1);


  /*
   * Increase product quantity.
   *
   * The minimum quantity is controlled separately so that
   * the customer cannot accidentally select zero items.
   */
  const increaseQuantity = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };


  /*
   * Decrease quantity but never allow it to go below 1.
   */
  const decreaseQuantity = () => {
    setQuantity((currentQuantity) =>
      Math.max(1, currentQuantity - 1)
    );
  };


    // Track the quotation form and its submission status.
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [quoteSuccess, setQuoteSuccess] = useState("");
  const [customerForm, setCustomerForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    message: "",
  });

  // Submit the selected product and customer details to the backend.
  const handleQuoteSubmit = async (event) => {
    event.preventDefault();
    setIsSubmittingQuote(true);
    setQuoteError("");
    setQuoteSuccess("");

    try {
      const result = await createQuoteRequest({
        ...customerForm,
        productSlug,
        quantity,
      });

      setQuoteSuccess(
        `Request submitted successfully. Reference: ${result.id}`
      );
      setIsQuoteOpen(false);
    } catch (error) {
      setQuoteError(error.message || "Unable to submit your request.");
    } finally {
      setIsSubmittingQuote(false);
    }
  };


  /*
   * Calculate the percentage discount automatically when
   * original and current prices are available.
   *
   * This prevents manually maintaining discount values
   * in multiple places.
   */
  const calculatedDiscount =
    originalPrice && price
      ? Math.round(
          ((originalPrice - price) / originalPrice) * 100
        )
      : discount;


  return (
    <div className="flex flex-col">

      {/* =================================================
          PRODUCT CATEGORY
          ================================================= */}

      <p
        className="
          text-xs
          font-bold
          uppercase
          tracking-[0.15em]
          text-[#1769d1]
        "
      >
        {category}
      </p>


      {/* =================================================
          PRODUCT NAME
          ================================================= */}

      <h1
        className="
          mt-2
          text-2xl
          font-bold
          leading-tight
          tracking-tight
          text-[#102a4c]
          sm:text-3xl
          lg:text-[34px]
        "
      >
        {name}
      </h1>


      {/* =================================================
          RATING
          =================================================
          
          Rating is displayed near the product name because
          customers commonly use reviews as an early trust
          signal before checking the price.
      ================================================= */}

      <div
        className="
          mt-4
          flex
          flex-wrap
          items-center
          gap-3
        "
      >

        <div
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-md
            bg-[#fff7e8]
            px-2.5
            py-1.5
          "
        >
          <Star
            size={15}
            fill="currentColor"
            className="text-[#e0a35c]"
          />

          <span
            className="
              text-sm
              font-bold
              text-[#8a5a12]
            "
          >
            {rating}
          </span>
        </div>


        <span
          className="
            text-sm
            text-slate-500
          "
        >
          {reviews} reviews
        </span>


        <span className="text-slate-300">
          |
        </span>


        <span
          className="
            text-sm
            font-semibold
            text-green-600
          "
        >
          Verified product
        </span>

      </div>


      {/* =================================================
          SHORT DESCRIPTION
          ================================================= */}

      <p
        className="
          mt-5
          max-w-2xl
          text-sm
          leading-6
          text-slate-600
          sm:text-base
        "
      >
        {description}
      </p>


      {/* =================================================
          PRICE BLOCK
          ================================================= */}

      <div
        className="
          mt-6
          rounded-xl
          border
          border-blue-50
          bg-[#f7faff]
          p-4
        "
      >

        <div className="flex flex-wrap items-end gap-3">

          <span
            className="
              text-3xl
              font-bold
              tracking-tight
              text-[#102a4c]
            "
          >
            ₹{price.toLocaleString("en-IN")}
          </span>


          {originalPrice && (
            <span
              className="
                pb-1
                text-sm
                text-slate-400
                line-through
              "
            >
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}


          {calculatedDiscount && (
            <span
              className="
                rounded-md
                bg-green-50
                px-2
                py-1
                text-xs
                font-bold
                text-green-700
              "
            >
              {calculatedDiscount}% OFF
            </span>
          )}

        </div>


        <p
          className="
            mt-1
            text-xs
            text-slate-500
          "
        >
          Price shown before applicable taxes and shipping.
        </p>

      </div>


      {/* =================================================
          STOCK STATUS
          ================================================= */}

      <div
        className="
          mt-5
          flex
          items-center
          gap-2
        "
      >

        <span
          className="
            h-2
            w-2
            rounded-full
            bg-green-500
          "
        />

        <span
          className="
            text-sm
            font-semibold
            text-green-600
          "
        >
          {stock}
        </span>

      </div>


      {/* =================================================
          CONFIGURATION / SIZE
          =================================================
          
          Medical equipment can have different variants,
          configurations or sizes.
          
          The same component can later receive these options
          directly from the product database.
      ================================================= */}

      {configurations.length > 0 && (
        <div className="mt-6">

          <div
            className="
              mb-3
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
              Configuration
            </span>

            <span
              className="
                text-xs
                text-slate-400
              "
            >
              Select one
            </span>

          </div>


          <div className="flex flex-wrap gap-2">

            {configurations.map((configuration) => {

              const isSelected =
                selectedConfiguration === configuration;

              return (
                <button
                  key={configuration}
                  type="button"
                  onClick={() =>
                    setSelectedConfiguration(configuration)
                  }
                  className={`
                    rounded-lg
                    border
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    transition-all
                    duration-200
                    ${
                      isSelected
                        ? "border-[#1769d1] bg-blue-50 text-[#1769d1]"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"
                    }
                  `}
                >
                  {configuration}
                </button>
              );
            })}

          </div>

        </div>
      )}


      {/* =================================================
          QUANTITY SELECTOR
          ================================================= */}

      <div className="mt-6">

        <p
          className="
            mb-3
            text-sm
            font-bold
            text-[#102a4c]
          "
        >
          Quantity
        </p>


        <div
          className="
            inline-flex
            items-center
            overflow-hidden
            rounded-lg
            border
            border-slate-200
            bg-white
          "
        >

          <button
            type="button"
            onClick={decreaseQuantity}
            aria-label="Decrease quantity"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              text-slate-500
              transition-colors
              hover:bg-slate-50
            "
          >
            <Minus size={16} />
          </button>


          <span
            className="
              flex
              h-10
              min-w-12
              items-center
              justify-center
              border-x
              border-slate-200
              px-3
              text-sm
              font-bold
              text-[#102a4c]
            "
          >
            {quantity}
          </span>


          <button
            type="button"
            onClick={increaseQuantity}
            aria-label="Increase quantity"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              text-slate-500
              transition-colors
              hover:bg-slate-50
            "
          >
            <Plus size={16} />
          </button>

        </div>

      </div>


      {/* =================================================
          PRIMARY ACTIONS
          =================================================
          
          For medical B2B products, quotation is often more
          useful than a standard consumer-style checkout.
          
          These buttons are UI actions for now.
          Backend functionality will be connected later.
      ================================================= */}

    
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setQuoteError("");
            setQuoteSuccess("");
            setIsQuoteOpen(true);
          }}
          className="
            flex flex-1
            items-center justify-center
            gap-2
            rounded-xl
            bg-[#1769d1]
            px-5 py-3.5
            text-sm font-bold text-white
            transition-all duration-200
            hover:bg-[#0d4fa8]
            active:scale-[0.99]
          "
        >
          <ShoppingCart size={18} />
          Add to Quote
        </button>

        <button
          type="button"
          onClick={() => {
            setQuoteError("");
            setQuoteSuccess("");
            setIsQuoteOpen(true);
          }}
          className="
            flex flex-1
            items-center justify-center
            gap-2
            rounded-xl
            border border-blue-100
            bg-white
            px-5 py-3.5
            text-sm font-bold text-[#1769d1]
            transition-all duration-200
            hover:bg-blue-50
            active:scale-[0.99]
          "
        >
          <MessageSquare size={18} />
          Contact Supplier
        </button>
      </div>


      {/* =================================================
          TRUST INFORMATION
          =================================================
          
          Small trust indicators reduce uncertainty before
          the customer submits a quotation request.
      ================================================= */}

      <div
        className="
          mt-6
          grid
          gap-3
          border-t
          border-slate-100
          pt-5
          sm:grid-cols-2
        "
      >

        <div className="flex items-center gap-2">

          <ShieldCheck
            size={18}
            className="text-[#1769d1]"
          />

          <span
            className="
              text-xs
              font-medium
              text-slate-500
            "
          >
            Verified medical equipment
          </span>

        </div>


        <div className="flex items-center gap-2">

          <MessageSquare
            size={18}
            className="text-[#1769d1]"
          />

          <span
            className="
              text-xs
              font-medium
              text-slate-500
            "
          >
            Business quotation support
          </span>

        </div>

      </div>

      
      {/* Show the server-confirmed result without interrupting the page. */}
      {quoteSuccess && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          {quoteSuccess}
        </p>
      )}

      {quoteError && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {quoteError}
        </p>
      )}

      {isQuoteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-form-title"
        >
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#1769d1]">
                  Business enquiry
                </p>
                <h2
                  id="quote-form-title"
                  className="mt-2 text-2xl font-bold text-[#102a4c]"
                >
                  Request a quotation
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {name} · Quantity: {quantity}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsQuoteOpen(false)}
                disabled={isSubmittingQuote}
                aria-label="Close quotation form"
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="quote-customer-name" className="mb-1 block text-sm font-semibold text-slate-700">
                  Full name
                </label>
                <input
                  id="quote-customer-name"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  value={customerForm.customerName}
                  onChange={(event) =>
                    setCustomerForm({
                      ...customerForm,
                      customerName: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#1769d1]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="quote-email" className="mb-1 block text-sm font-semibold text-slate-700">
                  Business email
                </label>
                <input
                  id="quote-email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  value={customerForm.email}
                  onChange={(event) =>
                    setCustomerForm({
                      ...customerForm,
                      email: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#1769d1]"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label htmlFor="quote-phone" className="mb-1 block text-sm font-semibold text-slate-700">
                  Phone number
                </label>
                <input
                  id="quote-phone"
                  type="tel"
                  required
                  minLength={7}
                  maxLength={20}
                  autoComplete="tel"
                  value={customerForm.phone}
                  onChange={(event) =>
                    setCustomerForm({
                      ...customerForm,
                      phone: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#1769d1]"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label htmlFor="quote-message" className="mb-1 block text-sm font-semibold text-slate-700">
                  Requirements (optional)
                </label>
                <textarea
                  id="quote-message"
                  rows={3}
                  maxLength={1000}
                  value={customerForm.message}
                  onChange={(event) =>
                    setCustomerForm({
                      ...customerForm,
                      message: event.target.value,
                    })
                  }
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#1769d1]"
                  placeholder="Tell us about delivery, bulk quantity or other requirements..."
                />
              </div>

              {quoteError && (
                <p role="alert" className="text-sm text-red-600">
                  {quoteError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmittingQuote}
                className="w-full rounded-xl bg-[#1769d1] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0d4fa8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmittingQuote ? "Submitting..." : "Submit quotation request"}
              </button>

              <p className="text-xs leading-5 text-slate-400">
                Your details will be used to respond to this quotation request.
              </p>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductInfo;