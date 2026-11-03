
import { useCallback, useEffect, useState } from "react";
import { Plus, Search, Tags } from "lucide-react";

import CategoryForm from "../components/admin/CategoryForm";
import CategoryTable from "../components/admin/CategoryTable";

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryApi";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await fetchCategories();

      setCategories(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function openCreateForm() {
  console.log("ADD CATEGORY CLICKED");

  setEditingCategory(null);
  setShowForm(true);
  setError("");
  setSuccess("");
}

  function openEditForm(category) {
    setEditingCategory(category);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingCategory(null);
  }

  async function handleSubmit(categoryData) {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      if (editingCategory) {
        const id = editingCategory._id || editingCategory.id;

        await updateCategory(id, categoryData);

        setSuccess("Category updated successfully.");
      } else {
        await createCategory(categoryData);

        setSuccess("Category created successfully.");
      }

      closeForm();
      await loadCategories();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const id = category._id || category.id;

      await deleteCategory(id);

      setSuccess("Category deleted successfully.");

      await loadCategories();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <section className="admin-categories-page">
      <div className="category-page-heading">
        <div>
          <div className="category-page-title">
            <span className="category-page-icon">
              <Tags size={23} />
            </span>

            <div>
              <h1>Categories</h1>
              <p>
                Manage your medical equipment product categories.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="category-primary-button"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {error && (
        <div className="category-alert category-alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="category-alert category-alert-success">
          {success}
        </div>
      )}

      {showForm && (
        <CategoryForm
          editingCategory={editingCategory}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          submitting={submitting}
        />
      )}

      <div className="category-list-card">
        <div className="category-list-heading">
          <div>
            <h2>All Categories</h2>
            <p>
              {categories.length} categories in your catalogue
            </p>
          </div>

          <div className="category-search">
            <Search size={17} />

            <input
              type="search"
              placeholder="Search categories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <CategoryTable
          categories={categories}
          loading={loading}
          search={search}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
}
