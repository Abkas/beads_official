import { useState, useEffect } from "react";
import { createOffer, updateOffer } from "../../../api/admin/offerApi";
import toast from "react-hot-toast";

const TAILWIND_COLORS = [
  { value: "bg-primary", label: "Primary Blue" },
  { value: "bg-destructive", label: "Red/Sale" },
  { value: "bg-success", label: "Green" },
  { value: "bg-warning", label: "Yellow/Orange" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-pink-500", label: "Pink" },
  { value: "bg-indigo-500", label: "Indigo" },
];

export default function OfferForm({ editOffer = null, onOfferAdded, onCancel }) {
  const [offerForm, setOfferForm] = useState({
    name: "",
    slug: "",
    description: "",
    discount_type: "percentage",
    discount_value: 0,
    color: "bg-primary",
    icon: "",
    bonus_text: "",
    is_active: true,
    priority: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  // Load edit data when editOffer changes
  useEffect(() => {
    if (editOffer) {
      setOfferForm({
        name: editOffer.name || "",
        slug: editOffer.slug || "",
        description: editOffer.description || "",
        discount_type: editOffer.discount_type || "percentage",
        discount_value: editOffer.discount_value || 0,
        color: editOffer.color || "bg-primary",
        icon: editOffer.icon || "",
        bonus_text: editOffer.bonus_text || "",
        is_active: editOffer.is_active !== undefined ? editOffer.is_active : true,
        priority: editOffer.priority || 0,
      });
    }
  }, [editOffer]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOfferForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-generate slug from name if name changes
    if (name === "name" && !editOffer) {
      const autoSlug = value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      setOfferForm((prev) => ({ ...prev, slug: autoSlug }));
    }
  };

  const resetForm = () => {
    setOfferForm({
      name: "",
      slug: "",
      description: "",
      discount_type: "percentage",
      discount_value: 0,
      color: "bg-primary",
      icon: "",
      bonus_text: "",
      is_active: true,
      priority: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!offerForm.name.trim()) {
      toast.error("Offer name is required");
      return;
    }

    if (!offerForm.slug.trim()) {
      toast.error("Offer slug is required");
      return;
    }

    if (offerForm.discount_value <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }

    setSubmitting(true);
    try {
      const offerData = {
        name: offerForm.name.trim(),
        slug: offerForm.slug.trim(),
        description: offerForm.description.trim() || "",
        discount_type: offerForm.discount_type,
        discount_value: parseFloat(offerForm.discount_value),
        color: offerForm.color,
        icon: offerForm.icon.trim() || null,
        bonus_text: offerForm.bonus_text.trim() || null,
        is_active: offerForm.is_active,
        priority: parseInt(offerForm.priority),
      };

      let result;
      if (editOffer && (editOffer.id || editOffer._id)) {
        const offerId = editOffer.id || editOffer._id;
        result = await updateOffer(offerId, offerData);
        toast.success("Offer updated successfully");
      } else {
        result = await createOffer(offerData);
        toast.success("Offer created successfully");
      }

      // Normalize the result
      const normalizedResult = {
        ...result,
        id: result.id || result._id,
      };

      onOfferAdded(normalizedResult);
      if (!editOffer) {
        resetForm();
      }
    } catch (error) {
      console.error("Error saving offer:", error);
      toast.error(error.response?.data?.detail || "Failed to save offer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        {editOffer ? "Edit Offer" : "Add New Offer"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Offer Name *
              </label>
              <input
                type="text"
                name="name"
                value={offerForm.name}
                onChange={handleInputChange}
                placeholder="e.g., Summer Sale"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Slug (URL-friendly) *
              </label>
              <input
                type="text"
                name="slug"
                value={offerForm.slug}
                onChange={handleInputChange}
                placeholder="e.g., summer-sale"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={offerForm.description}
              onChange={handleInputChange}
              placeholder="Offer description..."
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Discount Type *
              </label>
              <select
                name="discount_type"
                value={offerForm.discount_type}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={submitting}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Discount Value *
              </label>
              <input
                type="number"
                name="discount_value"
                value={offerForm.discount_value}
                onChange={handleInputChange}
                placeholder={offerForm.discount_type === "percentage" ? "15" : "100"}
                min="0"
                step={offerForm.discount_type === "percentage" ? "1" : "0.01"}
                max={offerForm.discount_type === "percentage" ? "100" : undefined}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Priority
              </label>
              <input
                type="number"
                name="priority"
                value={offerForm.priority}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Badge Color
              </label>
              <select
                name="color"
                value={offerForm.color}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={submitting}
              >
                {TAILWIND_COLORS.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Icon/Emoji (optional)
              </label>
              <input
                type="text"
                name="icon"
                value={offerForm.icon}
                onChange={handleInputChange}
                placeholder="🔥 or ⭐"
                maxLength="2"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Bonus Text (optional)
            </label>
            <input
              type="text"
              name="bonus_text"
              value={offerForm.bonus_text}
              onChange={handleInputChange}
              placeholder="e.g., Free Shipping, Gift Wrap"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={submitting}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={offerForm.is_active}
              onChange={handleInputChange}
              className="rounded border-border text-primary focus:ring-primary"
              disabled={submitting}
            />
            <label className="text-sm text-foreground">Active</label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? editOffer
                  ? "Updating..."
                  : "Creating..."
                : editOffer
                ? "Update Offer"
                : "Create Offer"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
