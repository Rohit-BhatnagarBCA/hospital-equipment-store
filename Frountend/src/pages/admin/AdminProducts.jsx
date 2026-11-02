
/**
 * AdminProducts
 *
 * Main product management page.
 * Connects the product form and product table to the admin API.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Package, RefreshCw } from "lucide-react";

// Import paths are relative to src/pages/admin/.
import ProductForm from "../../components/admin/ProductForm";
import ProductTable from "../../components/admin/ProductTable";

import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "../../services/adminApi";

/**
 * Extracts the product array from common API response formats.
 * Supports both direct and nested response data.
 */
function extractProducts(response) {
  const products =
    response?.products ??
    response?.data?.products ??
    response?.data ??
    response;

  if (Array.isArray(products)) {
    return products;
  }

  throw new Error("Invalid products response received from the server.");
}

/**
 * Returns a consistent product identifier.
 */
function getProductId(product) {
  return product?._id || product?.id || null;
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  /**
   * Fetch all products from the admin API.
   */
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetchAdminProducts({
        search: "",
        page: 1,
        limit: 50,
      });

      const productList = extractProducts(response);
      setProducts(productList);
    } catch (err) {
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /**
   * Filter products locally using name, category and slug.
   */
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const name = String(product.name || "").toLowerCase();
      const category = String(product.category || "").toLowerCase();
      const slug = String(product.slug || "").toLowerCase();

      return (
        name.includes(query) ||
        category.includes(query) ||
        slug.includes(query)
      );
    });
  }, [products, search]);

  /**
   * Open the form for creating a new product.
   */
  function openCreateForm() {
    setEditingProduct(null);
    setFormOpen(true);
    setError("");
    setSuccess("");
  }

  /**
   * Open the form with the selected product.
   */
  function openEditForm(product) {
    setEditingProduct(product);
    setFormOpen(true);
    setError("");
    setSuccess("");
  }

  /**
   * Close the product form.
   */
  function closeForm() {
    if (saving) {
      return;
    }

    setFormOpen(false);
    setEditingProduct(null);
  }

  /**
   * Create or update a product.
   */
  async function handleSave(formData) {
    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingProduct) {
        const productId = getProductId(editingProduct);

        if (!productId) {
          throw new Error("Product ID is missing. Unable to update product.");
        }

        await updateAdminProduct(productId, formData);
        setSuccess("Product updated successfully.");
      } else {
        await createAdminProduct(formData);
        setSuccess("Product added successfully.");
      }

      setFormOpen(false);
      setEditingProduct(null);

      await loadProducts();
    } catch (err) {
      setError(err.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  /**
   * Delete a product after user confirmation.
   */
  async function handleDelete(product) {
    if (deletingId) {
      return;
    }

    const productId = getProductId(product);

    if (!productId) {
      setError("Product ID is missing. Unable to delete product.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(productId);
      setError("");
      setSuccess("");

      await deleteAdminProduct(productId);

      setProducts((previous) =>
        previous.filter(
          (item) => String(getProductId(item)) !== String(productId)
        )
      );

      setSuccess("Product deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete product.");
    } finally {
      setDeletingId(null);
    }
  }

  // Calculate product status counts.
  const activeCount = products.filter(
    (product) => product.status !== "inactive"
  ).length;

  const inactiveCount = products.length - activeCount;

  return (
    <div className="admin-products-page">
      {/* Page heading and primary action */}
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">CATALOGUE MANAGEMENT</span>
          <h1>Products</h1>
          <p>Add, edit and manage your medical equipment products.</p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openCreateForm}
          disabled={saving}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* API feedback messages */}
      {error && (
        <div className="admin-alert error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-alert success" role="status">
          {success}
        </div>
      )}

      {/* Product summary cards */}
      <div className="admin-stat-grid admin-product-summary">
        <article className="admin-stat-card">
          <div className="admin-stat-icon blue">
            <Package size={21} />
          </div>
          <p>Total Products</p>
          <strong className="admin-stat-value">{products.length}</strong>
          <small>All catalogue products</small>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-icon green">
            <Package size={21} />
          </div>
          <p>Active Products</p>
          <strong className="admin-stat-value">{activeCount}</strong>
          <small>Visible in public catalogue</small>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-icon orange">
            <Package size={21} />
          </div>
          <p>Inactive Products</p>
          <strong className="admin-stat-value">{inactiveCount}</strong>
          <small>Hidden from public catalogue</small>
        </article>
      </div>

      {/* Product create/edit form */}
      {formOpen && (
        <section className="admin-panel admin-product-editor">
          <div className="admin-panel-heading">
            <div>
              <h2>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <p>
                Enter product details and upload its photos or demonstration
                video.
              </p>
            </div>
          </div>

          <ProductForm
            product={editingProduct}
            onSubmit={handleSave}
            onCancel={closeForm}
            saving={saving}
          />
        </section>
      )}

      {/* Product listing and actions */}
      <ProductTable
        products={visibleProducts}
        search={search}
        onSearchChange={setSearch}
        onEdit={openEditForm}
        onDelete={handleDelete}
        loading={loading}
        deletingId={deletingId}
      />

      {/* Manual refresh and result count */}
      <div className="admin-products-refresh">
        <button
          type="button"
          className="admin-secondary-button"
          onClick={loadProducts}
          disabled={loading || saving}
        >
          <RefreshCw size={15} />
          Refresh Products
        </button>

        <span>
          Showing {visibleProducts.length} of {products.length} products
        </span>
      </div>
    </div>
  );
}
