/**
 * In-Memory Data Cache for MPStore Frontend
 * Menyimpan data API sementara di memori agar saat navigasi antar halaman
 * (misal dari Promo ke Rewards ke Berita), data langsung tampil secara INSTAN (0 detik)
 * tanpa loading berkedip atau kotak kosong (Stale-While-Revalidate pattern).
 */

const cacheStore = new Map();

export const getCachedData = (key) => {
  return cacheStore.get(key) || null;
};

export const setCachedData = (key, data) => {
  cacheStore.set(key, data);
};

export const clearCacheKey = (key) => {
  cacheStore.delete(key);
};

export const clearAllCache = () => {
  cacheStore.clear();
};

// Cache gambar yang sudah pernah dimuat di sesi ini agar tidak pernah berkedip hitam
export const loadedImagesCache = new Set();

export default {
  getCachedData,
  setCachedData,
  clearCacheKey,
  clearAllCache,
  loadedImagesCache,
};
