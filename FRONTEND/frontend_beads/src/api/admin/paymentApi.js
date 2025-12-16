import { axiosInstance } from "../../lib/axios";

// Get all orders for payment management
export async function getAllPayments() {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.get("/orders/", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to fetch payments");
  }
}

// Update payment status
export async function updatePaymentStatus(orderId, paymentStatus) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.patch(
      `/orders/${orderId}/payment`,
      { payment_status: paymentStatus },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to update payment status");
  }
}

// Get payment statistics
export async function getPaymentStats() {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.get("/orders/stats/payments", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to fetch payment statistics");
  }
}
