import { axiosInstance } from "../lib/axios";

// Signup: POST /signup
export async function signup({ username, email, password ,firstname,lastname, phone }) {
  try {
    const payload = {
      username,
      email,
      password,
      firstname,
      lastname,
      phone: phone && typeof phone === "string" && phone.trim() !== "" ? phone : null
    };
    const response = await axiosInstance.post("users/register", payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Signup failed");
  }
}

// Login: POST /login
export async function login({ email, password }) {
  try {
    const response = await axiosInstance.post("users/login", {
      email,
      password
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
      return response.data;
    } else {
      throw new Error("Login failed: No access token received");
    }
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Login failed");
  }
}

// Logout: Remove token from localStorage and clear user session
export function logout() {
  localStorage.removeItem("access_token");
  // Clear any other stored user data
  sessionStorage.clear();
  // Force reload user state
  window.dispatchEvent(new Event('storage'));
  // Reload the page
  window.location.reload();
}

// Verify token with backend and get user data
export async function verifyToken() {
  const token = localStorage.getItem("access_token");
  if (!token) return { isValid: false, error: "No token found" };

  try {
    const response = await axiosInstance.get("/get-user", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return {
      isValid: true,
      user: response.data
    };
  } catch (error) {
    // If token is invalid, clear it from storage
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
    }
    return {
      isValid: false,
      error: error.response?.data?.detail || "Token verification failed"
    }
  }
}