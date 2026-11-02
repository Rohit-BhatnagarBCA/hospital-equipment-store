
/**
 * ProductTable
 *
 * Displays the admin product catalogue with search, edit and delete actions.
 */

import {
  Search,
  Pencil,
  Trash2,
  Package,
  Image as ImageIcon,
} from "lucide-react";

export default function ProductTable({
  products = [],
  search,
  onSearchChange,
  onEdit,
  onDelete,
  loading = false,
}) {
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);

  return (
    <section className="admin-panel admin-products-panel">
      <div className="admin-products-toolbar">
        <div>
          <h2>Recent Products</h2>
          <p>Manage your medical equipment catalogue.</p>
        </div>

        <label className="admin-products-search">
          <Search size={17} />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products..."
          />
        </label>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th className="admin-actions-heading">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="admin-table-message">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="admin-table-message">
                  <Package size={25} />
                  <strong>No products found</strong>
                  <span>Add a product or change your search.</span>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const productId = product._id || product.id;
                const stock = Number(
                  product.stockQuantity ?? product.stock ?? 0
                );

                return (
                  <tr key={productId}>
                    <td>
                      <div className="admin-product-cell">
                        <div className="admin-product-thumbnail">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                            />
                          ) : (
                            <ImageIcon size={22} />
                          )}
                        </div>

                        <div>
                          <strong>{product.name}</strong>
                          <small>{product.slug || productId}</small>
                        </div>
                      </div>
                    </td>

                    <td>{product.category || "Uncategorized"}</td>

                    <td className="admin-product-price">
                      {formatPrice(product.price)}
                    </td>

                    <td>
                      <span
                        className={`admin-stock-pill ${
                          stock === 0
                            ? "out"
                            : stock <= 10
                              ? "low"
                              : "available"
                        }`}
                      >
                        {stock} units
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-status-pill ${
                          product.status === "inactive" ? "inactive" : "active"
                        }`}
                      >
                        {product.status || "active"}
                      </span>
                    </td>

                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          title="Edit product"
                          aria-label={`Edit ${product.name}`}
                          onClick={() => onEdit(product)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="delete"
                          title="Delete product"
                          aria-label={`Delete ${product.name}`}
                          onClick={() => onDelete(product)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
