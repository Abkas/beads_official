import { useState, useEffect } from "react";
import { getUserAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from "../../api/addressApi";
import { verifyToken } from "../../api/UserApi";
import toast from "react-hot-toast";

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    address_type: "Home",
    country: "Nepal",
    province: "",
    district: "",
    city: "",
    tole: "",
    landmark: "",
  });
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  useEffect(() => {
    fetchAddresses();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const result = await verifyToken();
      if (result.isValid) {
        setUserData(result.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const data = await getUserAddresses();
      console.log("Fetched addresses:", data);
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
        toast.success("Address updated successfully");
      } else {
        await addAddress(formData);
        toast.success("Address added successfully");
      }
      fetchAddresses();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save address");
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      full_name: address.full_name || "",
      phone_number: address.phone_number || "",
      address_type: address.address_type || "Home",
      country: address.country || "Nepal",
      province: address.province || "",
      district: address.district || "",
      city: address.city || "",
      tole: address.tole || "",
      landmark: address.landmark || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    try {
      await deleteAddress(addressId);
      setAddresses(addresses.filter(addr => addr.id !== addressId));
      setDeleteModal({ show: false, id: null });
      toast.success("Address deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      fetchAddresses();
      toast.success("Default address updated");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to set default address");
    }
  };

  const resetForm = () => {
    const defaultName = userData ? `${userData.firstname || ''} ${userData.lastname || ''}`.trim() : "";
    const defaultPhone = userData?.phone || "";
    
    setFormData({
      full_name: defaultName,
      phone_number: defaultPhone,
      address_type: "Home",
      country: "Nepal",
      province: "",
      district: "",
      city: "",
      tole: "",
      landmark: "",
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleAddNewAddress = () => {
    const defaultName = userData ? `${userData.firstname || ''} ${userData.lastname || ''}`.trim() : "";
    const defaultPhone = userData?.phone || "";
    
    setFormData({
      full_name: defaultName,
      phone_number: defaultPhone,
      address_type: "Home",
      country: "Nepal",
      province: "",
      district: "",
      city: "",
      tole: "",
      landmark: "",
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif font-bold" style={{ color: "var(--foreground)" }}>
          My Addresses
        </h2>
        {!showForm && (
          <button
            onClick={handleAddNewAddress}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors font-medium"
          >
            + Add New Address
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-8 p-6 border rounded-lg" style={{ borderColor: "var(--border)", backgroundColor: "var(--muted)" }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  placeholder="9841234567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                Address Type
              </label>
              <select
                value={formData.address_type}
                onChange={(e) => setFormData({ ...formData, address_type: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                  Province *
                </label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  placeholder="Bagmati"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                  City/District *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, city: value, district: value });
                  }}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  placeholder="Kathmandu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                Tole (Area/Locality)
              </label>
              <input
                type="text"
                value={formData.tole}
                onChange={(e) => setFormData({ ...formData, tole: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                placeholder="Dillibazar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                Landmark
              </label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                placeholder="Near Sajha Park"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors font-medium"
              >
                {editingAddress ? "Update Address" : "Add Address"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border rounded-lg hover:bg-muted transition-colors font-medium"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address.id}
              className="relative p-6 border-2 rounded-xl transition-all duration-300"
              style={{
                borderColor: address.is_default ? "var(--primary)" : "var(--border)",
                backgroundColor: address.is_default ? "var(--primary-light)" : "var(--card-bg)",
                boxShadow: address.is_default ? "0 0 20px rgba(var(--primary-rgb), 0.3)" : "none",
              }}
            >
              {/* Address Type Badge - Top Right */}
              <div className="absolute top-4 right-4">
                <span 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm"
                  style={{
                    backgroundColor: address.address_type === 'Home' ? '#10b981' : address.address_type === 'Work' ? '#3b82f6' : '#8b5cf6',
                    color: 'white'
                  }}
                >
                  {address.address_type === 'Home' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  )}
                  {address.address_type === 'Work' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  )}
                  {address.address_type === 'Other' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {address.address_type}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1 pr-24">
                  {address.is_default && (
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-bold text-primary uppercase tracking-wide">
                        Default Address
                      </span>
                    </div>
                  )}
                  <p className="font-bold text-xl mb-2" style={{ color: "var(--foreground)" }}>
                    {address.full_name}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      {address.phone_number}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 mb-2">
                    <svg className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {address.tole && <span>{address.tole}, </span>}
                      <span>{address.city}, {address.district}</span>
                      <br />
                      <span style={{ color: "var(--text-muted)" }}>{address.province}, {address.country}</span>
                    </div>
                  </div>
                  {address.landmark && (
                    <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-muted/50 rounded-lg inline-flex">
                      <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        {address.landmark}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 absolute bottom-6 right-6">
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="px-4 py-2 text-sm font-medium border-2 rounded-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                      style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                      title="Set as default"
                    >
                      Set as Default
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2.5 rounded-lg hover:bg-primary/10 transition-colors border"
                      style={{ color: "var(--primary)", borderColor: "var(--border)" }}
                      title="Edit"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteModal({ show: true, id: address.id })}
                      className="p-2.5 rounded-lg hover:bg-destructive/10 transition-colors border"
                      style={{ color: "var(--destructive)", borderColor: "var(--border)" }}
                      title="Delete"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border rounded-lg" style={{ borderColor: "var(--border)" }}>
            <svg className="h-16 w-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-muted-foreground">No addresses added yet</p>
            <button
              onClick={handleAddNewAddress}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors font-medium"
            >
              Add Your First Address
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center gap-3 p-6 border-b border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <svg className="h-6 w-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Delete Address?</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-foreground">
                Are you sure you want to delete this address?
              </p>
            </div>

            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.id)}
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

export default AddressManager;
