
import { useEffect, useState } from "react";
import { ImagePlus, X, Save } from "lucide-react";

const INITIAL_FORM = {
  name: "",
  description: "",
  status: "active",
};

export default function CategoryForm({
  editingCategory,
  onSubmit,
  onCancel,
  submitting = false,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Load existing category data when editing.
  useEffect(() => {
    if (editingCategory) {
      setForm({
        name: editingCategory.name || "",
        description: editingCategory.description || "",
        status: editingCategory.status || "active",
      });
      setPreview(editingCategory.image || "");
      setImage(null);
    } else {
      setForm(INITIAL_FORM);
      setPreview("");
      setImage(null);
    }
  }, [editingCategory]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Please select a JPG, PNG or WEBP image.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2 MB.");
      event.target.value = "";
      return;
    }

    setImage(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  function handleRemoveImage() {
    setImage(null);
    setPreview(editingCategory?.image || "");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter a category name.");
      return;
    }

    await onSubmit({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      image,
    });
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <div className="category-form-heading">
        <div>
          <h3>
            {editingCategory ? "Edit Category" : "Create Category"}
          </h3>
          <p>
            Add medical equipment categories to your catalogue.
          </p>
        </div>

        <button
          type="button"
          className="category-close-button"
          onClick={onCancel}
          aria-label="Close category form"
          disabled={submitting}
        >
          <X size={19} />
        </button>
      </div>

      <div className="category-form-grid">
        <div className="category-field">
          <label htmlFor="category-name">Category Name *</label>
          <input
            id="category-name"
            type="text"
            name="name"
            placeholder="e.g. Diagnostic Equipment"
            value={form.name}
            onChange={handleChange}
            maxLength={80}
            required
          />
        </div>

        <div className="category-field">
          <label htmlFor="category-status">Status</label>
          <select
            id="category-status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="category-field category-field-full">
          <label htmlFor="category-description">Description</label>
          <textarea
            id="category-description"
            name="description"
            placeholder="Write a short category description..."
            value={form.description}
            onChange={handleChange}
            rows={4}
            maxLength={500}
          />
        </div>

        <div className="category-field category-field-full">
          <label>Category Image</label>

          <div className="category-upload-area">
            {preview ? (
              <div className="category-image-preview">
                <img src={preview} alt="Category preview" />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  aria-label="Remove selected image"
                >
                  <X size={17} />
                </button>
              </div>
            ) : (
              <label
                className="category-upload-label"
                htmlFor="category-image"
              >
                <ImagePlus size={30} />
                <strong>Click to upload image</strong>
                <span>JPG, PNG or WEBP · Maximum 2 MB</span>
              </label>
            )}

            <input
              id="category-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              hidden
            />
          </div>
        </div>
      </div>

      <div className="category-form-actions">
        <button
          type="button"
          className="category-secondary-button"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="category-primary-button"
          disabled={submitting}
        >
          <Save size={17} />
          {submitting
            ? "Saving..."
            : editingCategory
              ? "Update Category"
              : "Create Category"}
        </button>
      </div>
    </form>
  );
}
