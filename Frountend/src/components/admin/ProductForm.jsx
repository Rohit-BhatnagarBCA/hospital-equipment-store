
/**
 * ProductForm
 *
 * Reusable create/edit form for medical equipment products.
 * Supports image previews, one video preview and existing media removal.
 */

import { useEffect, useState } from "react";
import {
  ImagePlus,
  Video,
  X,
  Upload,
  Save,
  LoaderCircle,
} from "lucide-react";

const EMPTY_FORM = {
  name: "",
  category: "",
  description: "",
  price: "",
  originalPrice: "",
  stockQuantity: "0",
  badge: "",
  status: "active",
};

export default function ProductForm({
  product = null,
  onSubmit,
  onCancel,
  saving = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [newImages, setNewImages] = useState([]);
  const [newVideo, setNewVideo] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);

  useEffect(() => {
    setForm(
      product
        ? {
            name: product.name || "",
            category:
              typeof product.category === "string"
                ? product.category
                : product.category?.name || "",
            description: product.description || "",
            price: product.price ?? "",
            originalPrice: product.originalPrice ?? "",
            stockQuantity: product.stockQuantity ?? 0,
            badge: product.badge || "",
            status: product.status || "active",
          }
        : EMPTY_FORM
    );

    setExistingImages(
      Array.isArray(product?.images) ? product.images : []
    );

    setExistingVideos(
      Array.isArray(product?.videos) ? product.videos : []
    );

    setNewImages([]);
    setNewVideo(null);
  }, [product]);

  // Revoke temporary preview URLs when selected files change or component unmounts.
  useEffect(() => {
    return () => {
      newImages.forEach((item) => URL.revokeObjectURL(item.preview));
      if (newVideo?.preview) URL.revokeObjectURL(newVideo.preview);
    };
  }, [newImages, newVideo]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleImageSelection(event) {
    const selected = Array.from(event.target.files || []);
    const validFiles = selected.filter((file) => {
      const validType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      const validSize = file.size <= 2 * 1024 * 1024;
      return validType && validSize;
    });

    if (validFiles.length !== selected.length) {
      window.alert("Only JPG, PNG or WEBP images up to 2 MB are allowed.");
    }

    const availableSlots = 5 - existingImages.length - newImages.length;
    const acceptedFiles = validFiles.slice(0, Math.max(0, availableSlots));

    if (acceptedFiles.length < validFiles.length) {
      window.alert("A product can have a maximum of 5 images.");
    }

    setNewImages((previous) => [
      ...previous,
      ...acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);

    event.target.value = "";
  }

  function removeNewImage(index) {
    setNewImages((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  function handleVideoSelection(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];

    if (!validTypes.includes(file.type) || file.size > 20 * 1024 * 1024) {
      window.alert("Select an MP4, WEBM or MOV video up to 20 MB.");
      return;
    }

    setNewVideo({
      file,
      preview: URL.createObjectURL(file),
    });
    setExistingVideos([]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.category.trim()) {
      window.alert("Product name and category are required.");
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    // Preserve media that the admin chose not to remove.
    formData.append("existingImages", JSON.stringify(existingImages));
    formData.append("existingVideos", JSON.stringify(existingVideos));

    newImages.forEach(({ file }) => {
      formData.append("images", file);
    });

    if (newVideo?.file) {
      formData.append("video", newVideo.file);
    }

    await onSubmit(formData);
  }

  return (
    <form className="admin-product-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <label className="admin-field">
          <span>Product Name *</span>
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            placeholder="e.g. Digital Patient Monitor"
            maxLength={200}
            required
          />
        </label>

        <label className="admin-field">
          <span>Category *</span>
          <input
            name="category"
            value={form.category}
            onChange={updateField}
            placeholder="e.g. Patient Monitoring"
            maxLength={100}
            required
          />
        </label>

        <label className="admin-field">
          <span>Selling Price (₹) *</span>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={updateField}
            min="0"
            step="0.01"
            placeholder="45000"
            required
          />
        </label>

        <label className="admin-field">
          <span>Original Price (₹)</span>
          <input
            type="number"
            name="originalPrice"
            value={form.originalPrice}
            onChange={updateField}
            min="0"
            step="0.01"
            placeholder="52000"
          />
        </label>

        <label className="admin-field">
          <span>Available Quantity *</span>
          <input
            type="number"
            name="stockQuantity"
            value={form.stockQuantity}
            onChange={updateField}
            min="0"
            step="1"
            required
          />
        </label>

        <label className="admin-field">
          <span>Product Badge</span>
          <input
            name="badge"
            value={form.badge}
            onChange={updateField}
            placeholder="e.g. Best Seller"
            maxLength={100}
          />
        </label>

        <label className="admin-field">
          <span>Product Status</span>
          <select name="status" value={form.status} onChange={updateField}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <label className="admin-field admin-field-full">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            rows={4}
            maxLength={5000}
            placeholder="Describe the medical equipment, its usage and key benefits..."
          />
        </label>
      </div>

      <div className="admin-media-section">
        <div className="admin-media-heading">
          <div>
            <h3>Product Images</h3>
            <p>Up to 5 images · JPG, PNG or WEBP · Maximum 2 MB each</p>
          </div>

          <label className="admin-upload-button">
            <ImagePlus size={17} />
            Add Images
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageSelection}
              disabled={existingImages.length + newImages.length >= 5}
              hidden
            />
          </label>
        </div>

        <div className="admin-media-grid">
          {existingImages.map((url, index) => (
            <div className="admin-media-preview" key={`${url}-${index}`}>
              <img src={url} alt={`Existing product ${index + 1}`} />
              <button
                type="button"
                aria-label="Remove image"
                onClick={() =>
                  setExistingImages((previous) =>
                    previous.filter((_, itemIndex) => itemIndex !== index)
                  )
                }
              >
                <X size={15} />
              </button>
              <small>Saved</small>
            </div>
          ))}

          {newImages.map((item, index) => (
            <div className="admin-media-preview" key={item.preview}>
              <img src={item.preview} alt={`New product ${index + 1}`} />
              <button
                type="button"
                aria-label="Remove selected image"
                onClick={() => removeNewImage(index)}
              >
                <X size={15} />
              </button>
              <small>New</small>
            </div>
          ))}

          {existingImages.length + newImages.length === 0 && (
            <div className="admin-media-empty">
              <ImagePlus size={25} />
              <span>No product images selected</span>
            </div>
          )}
        </div>
      </div>

      <div className="admin-media-section">
        <div className="admin-media-heading">
          <div>
            <h3>Product Video</h3>
            <p>One video · MP4, WEBM or MOV · Maximum 20 MB</p>
          </div>

          <label className="admin-upload-button">
            <Video size={17} />
            Choose Video
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoSelection}
              hidden
            />
          </label>
        </div>

        {newVideo ? (
          <div className="admin-video-preview">
            <video src={newVideo.preview} controls />
            <button
              type="button"
              className="admin-remove-video"
              onClick={() => setNewVideo(null)}
            >
              <X size={15} /> Remove selected video
            </button>
          </div>
        ) : existingVideos.length > 0 ? (
          <div className="admin-video-preview">
            <video src={existingVideos[0]} controls />
            <button
              type="button"
              className="admin-remove-video"
              onClick={() => setExistingVideos([])}
            >
              <X size={15} /> Remove saved video
            </button>
          </div>
        ) : (
          <div className="admin-media-empty">
            <Video size={25} />
            <span>No product video selected</span>
          </div>
        )}
      </div>

      <div className="admin-form-actions">
        <button
          type="button"
          className="admin-secondary-button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="admin-primary-button"
          disabled={saving}
        >
          {saving ? (
            <LoaderCircle size={17} className="admin-spin" />
          ) : (
            <Save size={17} />
          )}
          {saving ? "Saving..." : product ? "Update Product" : "Save Product"}
        </button>
      </div>
    </form>
  );
}
