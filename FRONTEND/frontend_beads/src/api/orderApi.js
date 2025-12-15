import { axiosInstance } from "../lib/axios";

// Get user's orders
export const getUserOrders = async () => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.get("/orders/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get order by ID
export const getOrderById = async (orderId) => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Create new order
export const createOrder = async (orderData) => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.post("/orders/", orderData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Cancel order
export const cancelOrder = async (orderId) => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.post(`/orders/${orderId}/cancel`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
