import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavItems from "../ui/NavItems";
import { verifyToken } from "../../../api/UserApi";
import { getAllCategories, deleteCategory } from "../../../api/admin/categoryApi";
import { getAllOffers, deleteOffer } from "../../../api/admin/offerApi";
import CategoryForm from "../components/CategoryForm";
import toast from "react-hot-toast";

const Settings = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddOffer, setShowAddOffer] = useState(false);

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const result = await verifyToken();
        if (result.isValid) {
          setAdminData(result.user);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchAdminData();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        // Normalize the data to use 'id' instead of '_id'
        const normalizedData = data.map(cat => ({
          ...cat,
          id: cat.id || cat._id
        }));
        setCategories(normalizedData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getAllOffers();
        const normalizedData = data.map(offer => ({
          ...offer,
          id: offer.id || offer._id
        }));
        setOffers(normalizedData);
      } catch (error) {
        console.error("Error fetching offers:", error);
        toast.error("Failed to load offers");
      }
    };
    fetchOffers();
  }, []);

  const handleCategoryAdded = (newCategory) => {
    setCategories([...categories, newCategory]);
    setShowAddCategory(false);
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories(categories.map(cat => 
      cat.id === updatedCategory.id ? { ...updatedCategory, id: updatedCategory.id || updatedCategory._id } : cat
    ));
    setEditingCategory(null);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowAddCategory(false);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      await deleteOffer(offerId);
      setOffers(offers.filter(offer => offer.id !== offerId));
      toast.success("Offer deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to delete offer");
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
            <h1 className="text-lg font-semibold text-foreground">Settings</h1>
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
                <span className="text-sm font-medium text-primary-foreground">
                  {adminData?.firstname?.[0] || adminData?.username?.[0] || 'A'}{adminData?.lastname?.[0] || 'D'}
                </span>
              </div>
              {adminData && (
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {adminData.firstname && adminData.lastname 
                      ? `${adminData.firstname} ${adminData.lastname}` 
                      : adminData.username || 'Admin User'}
                  </p>
                  <p className="text-xs text-muted-foreground">{adminData.email}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Settings Content */}
        <main className="p-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Admin Profile */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">Admin Profile</h2>
              {adminData ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {adminData.firstname?.[0] || adminData.username?.[0] || 'A'}{adminData.lastname?.[0] || 'D'}
                      </span>
                    </div>
                    <div>
                      <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                        Upload Photo
                      </button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {adminData.firstname && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
                        <input
                          type="text"
                          defaultValue={adminData.firstname}
                          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    )}
                    {adminData.lastname && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
                        <input
                          type="text"
                          defaultValue={adminData.lastname}
                          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                  {adminData.email && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                      <input
                        type="email"
                        defaultValue={adminData.email}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  )}
                  {adminData.phone && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                      <input
                        type="tel"
                        defaultValue={adminData.phone}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  )}
                  <div className="pt-4 flex justify-end">
                    <button className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Loading admin data...</div>
              )}
            </div>

            {/* Store Settings */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">Store Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-border">
                    <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                      Upload Logo
                    </button>
                    <p className="text-xs text-muted-foreground mt-1">Recommended: 200x200px</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Store Name</label>
                  <input
                    type="text"
                    defaultValue="ShopAdmin Store"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Store Email</label>
                  <input
                    type="email"
                    defaultValue="contact@store.com"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Support Phone</label>
                  <input
                    type="tel"
                    defaultValue="+1 (800) 123-4567"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Store Address</label>
                  <textarea
                    rows={3}
                    defaultValue="123 Commerce Street&#10;New York, NY 10001&#10;United States"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <button className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Categories</h2>
                <button 
                  onClick={() => {
                    setShowAddCategory(!showAddCategory);
                    setEditingCategory(null);
                  }}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Add Category
                </button>
              </div>

              {showAddCategory && (
                <CategoryForm 
                  categories={categories}
                  onCategoryAdded={handleCategoryAdded}
                  onCancel={() => setShowAddCategory(false)}
                />
              )}

              {editingCategory && (
                <CategoryForm 
                  categories={categories}
                  editCategory={editingCategory}
                  onCategoryAdded={handleCategoryUpdated}
                  onCancel={() => setEditingCategory(null)}
                />
              )}

              <div className="space-y-3 mt-6">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading categories...</div>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {category.image_url ? (
                            <img 
                              src={category.image_url} 
                              alt={category.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{category.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {category.product_count || 0} products
                            {category.product_count > 0 && (
                              <button
                                onClick={() => navigate(`/admin/products?category=${category.id}`)}
                                className="ml-2 text-primary hover:underline"
                              >
                                View
                              </button>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditCategory(category)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No categories found</div>
                )}
              </div>
            </div>

            {/* Offers/Promotions */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Offers & Promotions</h2>
                <button 
                  onClick={() => setShowAddOffer(!showAddOffer)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Add Offer
                </button>
              </div>
              <div className="space-y-3">
                {offers.length > 0 ? (
                  offers.map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${offer.color}`}></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{offer.name}</p>
                            {offer.icon && <span className="text-sm">{offer.icon}</span>}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {offer.discount_type === 'percentage' ? `${offer.discount_value}% off` : `$${offer.discount_value} off`}
                            {offer.bonus_text && ` • ${offer.bonus_text}`}
                            {offer.product_count > 0 && (
                              <>
                                {` • ${offer.product_count} products`}
                                <button
                                  onClick={() => navigate(`/admin/products?offer=${offer.id}`)}
                                  className="ml-2 text-primary hover:underline"
                                >
                                  View
                                </button>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${offer.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                          {offer.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No offers found</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
