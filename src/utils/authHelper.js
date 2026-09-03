/**
 * authHelper.js — Manajemen Sesi Autentikasi Terpusat (Session-Only Architecture)
 *
 * Standar Panel Admin / Bisnis:
 * - Data sesi (token, role, username, id_users) disimpan di sessionStorage.
 * - Saat tab atau browser ditutup (close), sessionStorage otomatis dihapus oleh browser.
 * - Saat website dibuka kembali, pengguna WAJIB login ulang (tidak langsung ke riwayat dashboard).
 * - Saat refresh (F5) dalam sesi yang sama, sesi tetap aktif.
 */

const AUTH_KEYS = ["token", "role", "username", "id_users", "userId", "userName"];

/**
 * Menyimpan sesi login baru ke sessionStorage dan membersihkan sisa localStorage
 */
export const setAuthSession = ({ token, role, username, id_users }) => {
  // Simpan ke sessionStorage (otomatis hangus saat browser / tab ditutup)
  if (token) sessionStorage.setItem("token", token);
  if (role) sessionStorage.setItem("role", role);
  if (username) sessionStorage.setItem("username", username);
  if (id_users) sessionStorage.setItem("id_users", id_users);

  // Bersihkan sisa token di localStorage agar tidak ada kebocoran sesi lama
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
};

/**
 * Mendapatkan token JWT yang sedang aktif dari sesi
 */
export const getAuthToken = () => {
  return sessionStorage.getItem("token") || null;
};

/**
 * Mendapatkan role pengguna saat ini
 */
export const getAuthRole = () => {
  return sessionStorage.getItem("role") || null;
};

/**
 * Mendapatkan username pengguna saat ini
 */
export const getAuthUsername = () => {
  return sessionStorage.getItem("username") || null;
};

/**
 * Mendapatkan ID user saat ini
 */
export const getAuthUserId = () => {
  return sessionStorage.getItem("id_users") || null;
};

/**
 * Mengecek apakah pengguna memiliki sesi aktif
 */
export const isSessionActive = () => {
  return !!getAuthToken();
};

/**
 * Menghapus seluruh sesi autentikasi (Logout / Session Expired)
 */
export const clearAuthSession = () => {
  AUTH_KEYS.forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
};
