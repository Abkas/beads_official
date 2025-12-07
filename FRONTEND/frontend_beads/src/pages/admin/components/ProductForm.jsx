import { Link, useParams } from "react-router-dom";
import NavItems from "../ui/NavItems";
import { useEffect, useState } from "react";

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEdit]);


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-foreground">
        Loading product...
      </div>
    );
  }

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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <Link to="/admin/products" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold text-foreground">{isEdit ? "Edit Product" : "Add Product"}</h1>
          </div>
        </header>

        <main className="p-6 animate-fade-in">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left side */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Product Title</label>
                      <input
                        type="text"
                        defaultValue={product?.title || ""}
                        placeholder="Enter product title"
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                      <textarea
                        rows={5}
                        defaultValue={product?.description || ""}
                        placeholder="Enter product description"
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Media</h2>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer">
                    <svg className="h-12 w-12 text-muted-foreground mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium text-foreground mb-1">Click to upload images</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    <input type="file" className="hidden" multiple accept="image/*" />
                  </div>
                </div>

                {/* Pricing */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Pricing</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Price</label>
                      <input
                        type="text"
                        defaultValue={product?.price}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">Compare at Price</label>
                      <input
                        type="text"
                        defaultValue={product?.comparePrice}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">Cost per Item</label>
                      <input
                        type="text"
                        defaultValue={product?.cost}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold mb-4">Inventory</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">SKU</label>
                      <input
                        type="text"
                        defaultValue={product?.sku}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">Barcode</label>
                      <input
                        type="text"
                        defaultValue={product?.barcode}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">Quantity</label>
                      <input
                        type="number"
                        defaultValue={product?.stock}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Status */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold mb-4">Status</h2>
                  <select
                    defaultValue={product?.status || "active"}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Category */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold mb-4">Category</h2>
                  <select
                    defaultValue={product?.category}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
                  >
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home">Home & Garden</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                  >
                    {isEdit ? "Update Product" : "Create Product"}
                  </button>

                  <Link
                    to="/admin/products"
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground text-center hover:bg-muted"
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
