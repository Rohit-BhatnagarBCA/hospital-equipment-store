
/**
 * Sends customer quotation requests to the backend.
 * Keeps quotation HTTP logic outside React components.
 */

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

export async function createQuoteRequest({
  customerName,
  email,
  phone,
  message,
  productSlug,
  quantity,
}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/quotes`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName,
        email,
        phone,
        message,
        productSlug,
        quantity,
      }),
    });
  } catch {
    throw new Error("Cannot connect to the server. Check that the backend is running.");
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.success !== true) {
    throw new Error(
      payload?.message || "Your quotation request could not be submitted."
    );
  }

  return payload.data;
}