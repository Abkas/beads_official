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

// Admin: Get all orders
export const getAllOrdersAdmin = async () => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.get("/orders/", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Admin: Get order by ID
export const getOrderByIdAdmin = async (orderId) => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`/orders/admin/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Admin: Update order status
export const updateOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(`/orders/${orderId}/status`, 
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Admin: Update payment status
export const updatePaymentStatus = async (orderId, payment_status) => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(`/orders/${orderId}/payment`, 
    { payment_status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
