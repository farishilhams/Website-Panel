// utils/roleHelper.js
import {
  getAuthToken,
  getAuthRole,
  getAuthUsername,
  getAuthUserId,
  clearAuthSession,
} from "./authHelper";

// Get user role from session
export const getUserRole = () => {
  return getAuthRole();
};

// Get user data
export const getUserData = () => {
  return {
    role: getAuthRole(),
    name: getAuthUsername(),
    id: getAuthUserId(),
    token: getAuthToken(),
  };
};

// Check if user can access main dashboard (Halaman 1)
export const canAccessMainDashboard = () => {
  const role = getUserRole();
  return ["super_admin", "content_admin", "marketing", "reseller"].includes(role);
};

// Check if user can access viewer dashboard (Halaman 2)
export const canAccessViewerDashboard = () => {
  const role = getUserRole();
  return role === "viewer";
};

// Specific permissions untuk fitur interaksi (sesuai PDF)
export const canCreateInteraksi = () => {
  const role = getUserRole();
  return ["super_admin", "content_admin", "reseller"].includes(role);
};

export const canViewInteraksi = () => {
  const role = getUserRole();
  return ["super_admin", "content_admin", "reseller"].includes(role);
};

export const canViewStats = () => {
  const role = getUserRole();
  return ["super_admin", "content_admin"].includes(role);
};

export const canExportExcel = () => {
  const role = getUserRole();
  return ["super_admin", "content_admin"].includes(role);
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getAuthToken();
};

// Clear user data (untuk logout)
export const clearUserData = () => {
  clearAuthSession();
};