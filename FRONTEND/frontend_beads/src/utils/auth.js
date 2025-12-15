// Decode JWT token
export function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated() {
  const token = localStorage.getItem("access_token");
  if (!token) return false;
  
  const payload = decodeToken(token);
  if (!payload) return false;
  
  // Check if token is expired
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    localStorage.removeItem("access_token");
    return false;
  }
  
  return true;
}

// Check if user is admin
export function isAdmin() {
  const token = localStorage.getItem("access_token");
  if (!token) return false;
  
  const payload = decodeToken(token);
  return payload?.is_admin === true;
}

// Get current user info from token
export function getCurrentUser() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  
  const payload = decodeToken(token);
  if (!payload) return null;
  
  return {
    user_id: payload.user_id,
    email: payload.email,
    is_admin: payload.is_admin || false
  };
}
