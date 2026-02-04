// Admin authentication utilities

const TOKEN_KEY = 'naz_admin_token';

// Save token to localStorage
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove token (logout)
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    // Decode and check expiration
    const payload = JSON.parse(atob(token));
    if (!payload.authenticated || !payload.exp) {
      return false;
    }
    // Check if token is expired
    if (Date.now() > payload.exp) {
      removeToken();
      return false;
    }
    return true;
  } catch {
    removeToken();
    return false;
  }
};

// Get token expiration time in ms
export const getTokenExpiration = (): number | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token));
    return payload.exp || null;
  } catch {
    return null;
  }
};
