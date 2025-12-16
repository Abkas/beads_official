import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import NavItems from "../ui/NavItems";
import OfferForm from "../components/OfferForm";
import { getAllOffers, deleteOffer } from "../../../api/admin/offerApi";

const Promotions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("offers"); // offers or coupons

  // Offers State
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [deleteOfferModal, setDeleteOfferModal] = useState({ show: false, id: null, title: null });

  useEffect(() => {
    if (activeTab === "offers") {
      fetchOffers();
    }
  }, [activeTab]);

  const fetchOffers = async () => {
    try {
      setLoadingOffers(true);
      const data = await getAllOffers();
      // Normalize IDs to ensure they exist
      const normalizedOffers = data.map(offer => ({
        ...offer,
        id: offer.id || offer._id
      }));
      setOffers(normalizedOffers);
    } catch (error) {
      toast.error("Failed to fetch offers");
      console.error("Fetch offers error:", error);
    } finally {
      setLoadingOffers(false);
    }
  };

  const handleOfferAdded = () => {
    setShowAddOffer(false);
    fetchOffers();
    toast.success("Offer created successfully");
  };

  const handleOfferUpdated = () => {
    setEditingOffer(null);
    fetchOffers();
    toast.success("Offer updated successfully");
  };

  const handleEditOffer = (offer) => {
    // Ensure the offer has a valid ID
    if (!offer.id && !offer._id) {
      toast.error("Invalid offer data - missing ID");
      return;
    }
    setEditingOffer({
      ...offer,
      id: offer.id || offer._id
    });
    setShowAddOffer(false);
  };

  const handleDeleteOffer = async (offerId) => {
    try {
      await deleteOffer(offerId);
      setOffers(offers.filter(offer => offer.id !== offerId));
      setDeleteOfferModal({ show: false, id: null, title: null });
      toast.success("Offer deleted successfully");
    } catch (error) {
      toast.error("Failed to delete offer");
      console.error("Delete offer error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
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
      <div className="flex-1 lg:ml-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-foreground">Promotions</h1>
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

        {/* Promotions Content */}
        <main className="p-4 sm:p-6 animate-fade-in">
          <div className="rounded-xl border border-border bg-card shadow-card">
            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex gap-4 px-6 pt-6">
                <button
                  onClick={() => setActiveTab("offers")}
                  className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "offers"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Offers
                </button>
                <button
                  onClick={() => setActiveTab("coupons")}
                  className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "coupons"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Coupons
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "offers" ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Special Offers</h2>
                    <button 
                      onClick={() => {
                        setShowAddOffer(!showAddOffer);
                        setEditingOffer(null);
                      }}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Offer
                      </span>
                    </button>
                  </div>

                  {showAddOffer && (
                    <OfferForm 
                      onOfferAdded={handleOfferAdded}
                      onCancel={() => setShowAddOffer(false)}
                    />
                  )}

                  {editingOffer && (
                    <OfferForm 
                      editOffer={editingOffer}
                      onOfferAdded={handleOfferUpdated}
                      onCancel={() => setEditingOffer(null)}
                    />
                  )}

                  <div className="space-y-3 mt-6">
                    {loadingOffers ? (
                      <div className="text-center py-12">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-primary"></div>
                        <p className="text-sm text-muted-foreground mt-4">Loading offers...</p>
                      </div>
                    ) : offers.length > 0 ? (
                      offers.map((offer) => (
                        <div key={offer.id} className="rounded-lg border border-border hover:bg-muted/50 transition-colors overflow-hidden">
                          {/* Header Section */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 border-b border-border bg-card">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`h-16 w-16 rounded-lg ${offer.color || 'bg-gradient-to-br from-primary/20 to-primary/5'} flex items-center justify-center flex-shrink-0 text-2xl`}>
                                {offer.icon ? (
                                  <span className="text-white">{offer.icon}</span>
                                ) : (
                                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <h3 className="text-base font-bold text-foreground">{offer.name}</h3>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    offer.is_active 
                                      ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                                  }`}>
                                    {offer.is_active ? "Active" : "Inactive"}
                                  </span>
                                  {offer.priority > 0 && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-medium">
                                      Priority: {offer.priority}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded inline-block mb-2">
                                  slug: {offer.slug}
                                </p>
                                {offer.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 sm:flex-shrink-0">
                              <button 
                                onClick={() => handleEditOffer(offer)}
                                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                title="Edit offer"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => setDeleteOfferModal({ show: true, id: offer.id, title: offer.name })}
                                className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                title="Delete offer"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Details Section */}
                          <div className="p-4 bg-muted/30">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {/* Discount */}
                              <div className="flex items-center gap-2 bg-card p-3 rounded-lg border border-border">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Discount</p>
                                  <p className="text-sm font-semibold text-foreground">
                                    {offer.discount_type === "percentage" 
                                      ? `${offer.discount_value}% OFF` 
                                      : `NPR ${offer.discount_value} OFF`}
                                  </p>
                                </div>
                              </div>

                              {/* Bonus */}
                              {offer.bonus_text && (
                                <div className="flex items-center gap-2 bg-card p-3 rounded-lg border border-border">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Bonus</p>
                                    <p className="text-sm font-semibold text-foreground">{offer.bonus_text}</p>
                                  </div>
                                </div>
                              )}

                              {/* Date Range */}
                              {offer.start_date && offer.end_date && (
                                <div className="flex items-center gap-2 bg-card p-3 rounded-lg border border-border">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Valid Period</p>
                                    <p className="text-xs font-medium text-foreground">
                                      {new Date(offer.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(offer.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <svg className="h-16 w-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                        <p className="text-muted-foreground mb-4">No offers found</p>
                        <button 
                          onClick={() => setShowAddOffer(true)}
                          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Create your first offer
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Coupon Codes</h2>
                    <button 
                      disabled
                      className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Coupon
                      </span>
                    </button>
                  </div>

                  {/* Coupons content placeholder */}
                  <div className="text-center py-12">
                    <svg className="h-16 w-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <p className="text-muted-foreground mb-2">Coupon management coming soon</p>
                    <p className="text-sm text-muted-foreground">Create and manage discount coupon codes for your customers</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Delete Offer Modal */}
      {deleteOfferModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center gap-3 p-6 border-b border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <svg className="h-6 w-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">Delete Offer?</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-foreground mb-2">
                Are you sure you want to delete the offer <span className="font-semibold">"{deleteOfferModal.title}"</span>?
              </p>
              <p className="text-xs text-muted-foreground">
                This offer will be permanently removed from your promotions.
              </p>
            </div>

            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => setDeleteOfferModal({ show: false, id: null, title: null })}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOffer(deleteOfferModal.id)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;
