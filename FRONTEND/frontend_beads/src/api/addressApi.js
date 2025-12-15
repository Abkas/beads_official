import { axiosInstance } from "../lib/axios";

// Get all addresses for current user
export const getUserAddresses = async () => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.get("/users/me/addresses", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Add new address
export const addAddress = async (addressData) => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.post("/users/me/addresses", addressData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Update address
export const updateAddress = async (addressId, addressData) => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.put(`/users/me/addresses/${addressId}`, addressData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Delete address
export const deleteAddress = async (addressId) => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.delete(`/users/me/addresses/${addressId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Set default address
export const setDefaultAddress = async (addressId) => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.put(`/users/me/addresses/${addressId}/default`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
