import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import NavItems from "../ui/NavItems";
import { getProductById, createProduct, updateProductDetails, updateProductPrice, updateProductStock, changeProductAvailability, getAllCategories } from "../../../api/admin/productApi";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    is_available: true,
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit && id) {
      fetchProduct();
    }
  }, [id, isEdit]);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        category: data.category || "",
        subcategory: data.subcategory || "",
        price: data.original_price || "",
        discount_price: data.discount_price || "",
        stock_quantity: data.stock_quantity || "",
        is_available: data.is_available ?? true,
        is_active: data.is_active ?? true,
      });
      setImageUrls(data.image_urls || []);
    } catch (error) {
      toast.error("Failed to fetch product details");
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      if (isEdit) {        
        // Update product details (name, description, category, is_active)
        const detailsData = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          is_active: formData.is_active,
          tags: [],
          image_urls: imageUrls
        };
        await updateProductDetails(id, detailsData);

        // Update price if changed
        const priceData = {
          price: parseFloat(formData.price),
          currency: "NPR",
          discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        };
        await updateProductPrice(id, priceData);

        // Update stock
        const stockData = {
          stock_quantity: parseInt(formData.stock_quantity)
        };
        await updateProductStock(id, stockData);

        // Update availability
        await changeProductAvailability(id, { is_available: formData.is_available });

        toast.success("Product updated successfully!");
      } else {
        // For create mode, send all data at once
        const productData = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          subcategory: formData.subcategory || null,
          price: parseFloat(formData.price),
          discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
          stock_quantity: parseInt(formData.stock_quantity),
          is_available: formData.is_available,
          tags: [],
          image_urls: imageUrls,
        };
        await createProduct(productData);
        toast.success("Product created successfully!");
      }
      
      navigate("/admin/products");
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || "An error occurred";
      toast.error(isEdit ? `Failed to update product: ${errorMsg}` : `Failed to create product: ${errorMsg}`);
      console.error("Error submitting form:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">ShopAdmin</span>
        </div>
        <NavItems />
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <Link to="/admin/products" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold text-foreground">{isEdit ? "Edit Product" : "Add Product"}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">AD</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@store.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Form Content */}
        <main className="p-6 animate-fade-in">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Product Title</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product title"
                        required
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                      <textarea
                        rows={5}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter product description"
                        required
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Product Images</h2>
                  
                  {/* File Upload */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => document.getElementById('file-upload').click()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-foreground font-medium text-sm transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Upload Images
                      </button>
                      <span className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</span>
                    </div>
                    <input 
                      id="file-upload"
                      type="file" 
                      multiple 
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        if (files.length === 0) return;
                        
                        try {
                          setLoading(true);
                          toast.loading(`Uploading ${files.length} image(s)...`, { id: 'upload' });
                          
                          const formData = new FormData();
                          files.forEach(file => formData.append('files', file));
                          
                          const response = await fetch('http://localhost:8000/upload/images', {
                            method: 'POST',
                            body: formData
                          });
                          
                          const result = await response.json();
                          
                          if (result.success && result.uploaded.length > 0) {
                            const newUrls = result.uploaded.map(item => item.url);
                            setImageUrls([...imageUrls, ...newUrls]);
                            toast.success(`${result.uploaded.length} image(s) uploaded!`, { id: 'upload' });
                          } else {
                            toast.error('Upload failed', { id: 'upload' });
                          }
                        } catch (error) {
                          console.error('Upload error:', error);
                          toast.error('Failed to upload images', { id: 'upload' });
                        } finally {
                          setLoading(false);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>

                  {/* Image Preview Grid */}
                  {imageUrls.length > 0 ? (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">Images ({imageUrls.length})</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors">
                            <img 
                              src={url} 
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/placeholder.svg';
                                e.target.classList.add('opacity-50');
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setImageUrls(imageUrls.filter((_, i) => i !== index));
                                  toast.success('Image removed');
                                }}
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg transform scale-90 group-hover:scale-100"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-border rounded-lg p-6 text-center bg-muted/20">
                      <svg className="h-10 w-10 text-muted-foreground mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-muted-foreground">No images uploaded yet</p>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Pricing</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Original Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NPR</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          required
                          className="w-full rounded-lg border border-border bg-background pl-12 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Discount Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NPR</span>
                        <input
                          type="number"
                          name="discount_price"
                          value={formData.discount_price}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full rounded-lg border border-border bg-background pl-12 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Stock Quantity</label>
                      <input
                        type="number"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleChange}
                        placeholder="0"
                        required
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Status & Availability</h2>
                  <div className="space-y-4">
                    {/* Available Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <label htmlFor="is_available" className="text-sm font-medium text-foreground block">
                          Available for Purchase
                        </label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formData.is_available ? 'Customers can buy this product' : 'Product hidden from store'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, is_available: !prev.is_available }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border ${
                          formData.is_available 
                            ? 'bg-primary border-primary' 
                            : 'bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            formData.is_available ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <label htmlFor="is_active" className="text-sm font-medium text-foreground block">
                          Product Active
                        </label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formData.is_active ? 'Product is active in system' : 'Product is inactive'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border ${
                          formData.is_active 
                            ? 'bg-green-500 border-green-500' 
                            : 'bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            formData.is_active ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Category */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Category</h2>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id || cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-2">No categories available. Please create categories first.</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
                  </button>
                  <Link
                    to="/admin/products"
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground text-center hover:bg-muted transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ProductForm;
