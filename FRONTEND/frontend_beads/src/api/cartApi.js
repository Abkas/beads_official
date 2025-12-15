import { axiosInstance } from "../lib/axios";

// Get user cart
export const getUserCart = async () => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.get("/users/me/cart", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Add item to cart
export const addToCart = async (product_id, quantity = 1) => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.post("/users/me/cart", 
    { product_id, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Update cart item quantity
export const updateCartItem = async (product_id, quantity) => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.put("/users/me/cart",
    { product_id, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Remove item from cart
export const removeFromCart = async (product_id) => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.delete(`/users/me/cart/${product_id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Clear entire cart
export const clearCart = async () => {
  const token = localStorage.getItem("access_token");
  const response = await axiosInstance.delete("/users/me/cart", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
