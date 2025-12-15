import { useState, useEffect } from "react";
import { createCategory, updateCategory } from "../../../api/admin/categoryApi";
import toast from "react-hot-toast";

export default function CategoryForm({ categories, editCategory = null, onCategoryAdded, onCancel }) {
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    parent_category: "",
    image_url: "",
    is_active: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Load edit data when editCategory changes
  useEffect(() => {
    if (editCategory) {
      setCategoryForm({
        name: editCategory.name || "",
        slug: editCategory.slug || "",
        description: editCategory.description || "",
        parent_category: editCategory.parent_category || "",
        image_url: editCategory.image_url || "",
        is_active: editCategory.is_active !== undefined ? editCategory.is_active : true
      });
      setImagePreview(editCategory.image_url || null);
    }
  }, [editCategory]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Auto-generate slug from name if name changes and slug is empty
    if (name === 'name' && !categoryForm.slug) {
      const autoSlug = value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      setCategoryForm(prev => ({ ...prev, slug: autoSlug }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.success) {
        setCategoryForm(prev => ({ ...prev, image_url: data.url }));
        setImagePreview(data.url);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setCategoryForm(prev => ({ ...prev, image_url: "" }));
    setImagePreview(null);
  };

  const resetForm = () => {
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
      parent_category: "",
      image_url: "",
      is_active: true
    });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!categoryForm.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!categoryForm.slug.trim()) {
      toast.error("Category slug is required");
      return;
    }

    setSubmitting(true);
    try {
      const categoryData = { 
        name: categoryForm.name.trim(),
        slug: categoryForm.slug.trim(),
        description: categoryForm.description.trim() || "",
        parent_category: categoryForm.parent_category || null,
        image_url: categoryForm.image_url.trim() || null,
        is_active: categoryForm.is_active
      };

      let result;
      if (editCategory) {
        // Update existing category
        result = await updateCategory(editCategory.id || editCategory._id, categoryData);
      } else {
        // Create new category
        result = await createCategory(categoryData);
      }
      
      // Normalize the category to use 'id'
      const normalizedCategory = {
        ...result,
        id: result.id || result._id
      };
      
      resetForm();
      onCategoryAdded(normalizedCategory);
      toast.success(editCategory ? "Category updated successfully" : "Category added successfully");
    } catch (error) {
      toast.error(error.message || (editCategory ? "Failed to update category" : "Failed to add category"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <div className="mb-4 p-6 rounded-lg border border-border bg-muted/30 space-y-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        {editCategory ? "Edit Category" : "Add New Category"}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Category Name *</label>
              <input
                type="text"
                name="name"
                value={categoryForm.name}
                onChange={handleInputChange}
                placeholder="e.g., Electronics"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Slug (URL-friendly) *</label>
              <input
                type="text"
                name="slug"
                value={categoryForm.slug}
                onChange={handleInputChange}
                placeholder="e.g., electronics"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Description</label>
            <textarea
              name="description"
              value={categoryForm.description}
              onChange={handleInputChange}
              placeholder="Category description..."
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Parent Category</label>
              <select
                name="parent_category"
                value={categoryForm.parent_category}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={submitting}
              >
                <option value="">None (Main Category)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Category Image</label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-32 w-32 rounded-lg object-cover border border-border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={submitting || uploading}
                  className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90 disabled:opacity-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <div className="rounded-lg border-2 border-dashed border-border bg-muted px-4 py-3 text-center hover:bg-muted/80 transition-colors">
                    <svg className="mx-auto h-8 w-8 text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-muted-foreground">
                      {uploading ? "Uploading..." : "Click to upload image"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={submitting || uploading}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={categoryForm.is_active}
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
              {submitting ? (editCategory ? "Updating..." : "Creating...") : (editCategory ? "Update Category" : "Create Category")}
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
