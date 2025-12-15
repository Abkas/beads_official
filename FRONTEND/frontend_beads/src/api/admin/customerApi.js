import { axiosInstance } from "../../lib/axios";

// Get all customers (admin only)
export async function getAllCustomers() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axiosInstance.get("/admin/customers", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error(error.response?.data?.detail || "Failed to fetch customers");
  }
}

// Get customer by ID (admin only)
export async function getCustomerById(customerId) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axiosInstance.get(`/admin/customers/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw new Error(error.response?.data?.detail || "Failed to fetch customer");
  }
}
