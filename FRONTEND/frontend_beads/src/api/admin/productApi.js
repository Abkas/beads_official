import { axiosInstance } from "../../lib/axios";

// Get all products with filters (public endpoint)
export async function getAllProducts({
  category = null,
  search = null,
  minPrice = null,
  maxPrice = null,
  isAvailable = true,
  skip = 0,
  limit = 50
} = {}) {
  try {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    if (minPrice !== null) params.append("min_price", minPrice);
    if (maxPrice !== null) params.append("max_price", maxPrice);
    // Only add is_available filter if it's explicitly true or false, not null
    if (isAvailable !== null && isAvailable !== undefined) {
      params.append("is_available", isAvailable);
    }
    params.append("skip", skip);
    params.append("limit", limit);

    const response = await axiosInstance.get(`products/?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to fetch products");
  }
}

// Get single product by ID (public endpoint)
export async function getProductById(productId) {
  try {
    const response = await axiosInstance.get(`products/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to fetch product");
  }
}

// Create new product (admin only)
export async function createProduct(productData) {
  try {
    const token = localStorage.getItem("access_token");
    console.log("Sending product data:", productData);
    const response = await axiosInstance.post("products/", productData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Create product error details:", JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
}

// Update product details (admin only)
export async function updateProductDetails(productId, productData) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.put(`products/${productId}/details`, productData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to update product");
  }
}

// Update product price (admin only)
export async function updateProductPrice(productId, priceData) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.put(`products/${productId}/price`, priceData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to update product price");
  }
}

// Update product stock (admin only)
export async function updateProductStock(productId, stockData) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.put(`products/${productId}/stock`, stockData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to update product stock");
  }
}

// Change product availability (admin only)
export async function changeProductAvailability(productId, availabilityData) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.patch(`products/${productId}/availability`, availabilityData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to change product availability");
  }
}

// Delete product (admin only)
export async function deleteProduct(productId) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.delete(`products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to delete product");
  }
}

// ============ Category APIs ============

// Get all categories (public endpoint)
export async function getAllCategories() {
  try {
    const response = await axiosInstance.get("categories/");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to fetch categories");
  }
}

// Get single category by ID (public endpoint)
export async function getCategoryById(categoryId) {
  try {
    const response = await axiosInstance.get(`categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to fetch category");
  }
}

