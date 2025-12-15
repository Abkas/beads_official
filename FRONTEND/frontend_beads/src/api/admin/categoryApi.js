import { axiosInstance } from "../../lib/axios";

// Get all categories
export async function getAllCategories() {
  try {
    const response = await axiosInstance.get("/categories/");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error.response?.data?.detail || "Failed to fetch categories");
  }
}

// Create category (admin only)
export async function createCategory(categoryData) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.post("/categories/", categoryData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error(error.response?.data?.detail || "Failed to create category");
  }
}

// Update category (admin only)
export async function updateCategory(categoryId, categoryData) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.put(`/categories/${categoryId}`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error(error.response?.data?.detail || "Failed to update category");
  }
}

// Delete category (admin only)
export async function deleteCategory(categoryId) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.delete(`/categories/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error(error.response?.data?.detail || "Failed to delete category");
  }
}
