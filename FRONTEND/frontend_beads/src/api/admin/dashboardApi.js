import { axiosInstance } from "../../lib/axios";

// Get dashboard statistics
export async function getDashboardStats() {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.get("/admin/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to fetch dashboard stats");
  }
}
