
import { Edit2, Trash2, FolderOpen } from "lucide-react";

export default function CategoryTable({
  categories = [],
  loading = false,
  search = "",
  onEdit,
  onDelete,
}) {
  const filteredCategories = categories.filter((category) => {
    const searchText = search.trim().toLowerCase();

    return (
      category.name?.toLowerCase().includes(searchText) ||
      category.description?.toLowerCase().includes(searchText)
    );
  });

  if (loading) {
    return (
      <div className="category-table-message">
        Loading categories...
      </div>
    );
  }

  if (filteredCategories.length === 0) {
    return (
      <div className="category-empty-state">
        <FolderOpen size={38} />

        <h3>No categories found</h3>

        <p>
          {search
            ? "Try searching with another keyword."
            : "Create your first category to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="category-table-wrapper">
      <table className="category-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredCategories.map((category) => (
            <tr key={category._id || category.id}>
              <td>
                <div className="category-table-info">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                    />
                  ) : (
                    <div className="category-table-placeholder">
                      <FolderOpen size={20} />
                    </div>
                  )}

                  <div>
                    <strong>{category.name}</strong>
                    <small>{category.slug || "No slug"}</small>
                  </div>
                </div>
              </td>

              <td>
                <span className="category-description-cell">
                  {category.description || "No description"}
                </span>
              </td>

              <td>
                <span
                  className={`category-status ${
                    category.status === "active"
                      ? "status-active"
                      : "status-inactive"
                  }`}
                >
                  {category.status || "inactive"}
                </span>
              </td>

              <td>
                {category.createdAt
                  ? new Date(category.createdAt).toLocaleDateString()
                  : "—"}
              </td>

              <td>
                <div className="category-table-actions">
                  <button
                    type="button"
                    className="category-action-edit"
                    onClick={() => onEdit(category)}
                    title="Edit category"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Edit2 size={17} />
                  </button>

                  <button
                    type="button"
                    className="category-action-delete"
                    onClick={() => onDelete(category)}
                    title="Delete category"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="category-table-footer">
        Showing {filteredCategories.length} of {categories.length} categories
      </div>
    </div>
  );
}
