/**
 * Form Validation Utilities for MPStore Frontend
 * Standar validasi sisi klien yang ketat dan informatif sebelum request dikirim ke backend.
 */

export const validateEmail = (email) => {
  if (!email || !email.trim()) return "Email wajib diisi.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "Format email tidak valid (contoh: user@domain.com).";
  }
  return null;
};

export const validateUsername = (username) => {
  if (!username || !username.trim()) return "Username wajib diisi.";
  if (username.trim().length < 3) {
    return "Username minimal terdiri dari 3 karakter.";
  }
  const usernameRegex = /^[a-zA-Z0-9._-]+$/;
  if (!usernameRegex.test(username.trim())) {
    return "Username hanya boleh memuat huruf, angka, titik, strip (-), atau underscore (_).";
  }
  return null;
};

export const validatePassword = (password, isEdit = false) => {
  if (!isEdit && (!password || !password.trim())) {
    return "Kata sandi wajib diisi.";
  }
  if (password && password.length < 6) {
    return "Kata sandi minimal terdiri dari 6 karakter.";
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return null; // Opsional
  const cleanPhone = phone.replace(/[\s-+()]/g, "");
  if (!/^\d+$/.test(cleanPhone)) {
    return "Nomor telepon hanya boleh memuat angka.";
  }
  if (cleanPhone.length < 9 || cleanPhone.length > 15) {
    return "Nomor telepon harus terdiri dari 9 hingga 15 digit angka.";
  }
  return null;
};

export const validateImageFile = (file, maxMB = 2) => {
  if (!file) return null;
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    return "Format gambar tidak didukung. Harap gunakan file JPG, PNG, WEBP, atau GIF.";
  }
  const maxBytes = maxMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `Ukuran file gambar terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maksimal ${maxMB} MB.`;
  }
  return null;
};

export const validateRequired = (val, fieldName = "Field") => {
  if (val === undefined || val === null || String(val).trim() === "") {
    return `${fieldName} wajib diisi.`;
  }
  return null;
};

export default {
  validateEmail,
  validateUsername,
  validatePassword,
  validatePhone,
  validateImageFile,
  validateRequired,
};
