const express = require("express");
const router = express.Router();
const newsController = require("../controllers/news.controller");
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");
const { getUploader } = require("../middlewares/multer.middleware");
const {
  validateCreateOrUpdateNews,
  validateImageNews,
  validateImageNewsOptional,
  validateNewsQueryFilters,
} = require("../middlewares/validation.middleware");
const uploadNewsImage = getUploader("news").single("image");

// Route untuk membuat berita baru - Hanya Super Admin dan Content Admin yang bisa buat berita
router.post(
  "/create",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  uploadNewsImage,
  validateImageNews,
  validateCreateOrUpdateNews,
  newsController.createNews
);

// Route untuk mengambil berita gabungan (pagination + filter + search) - Semua user bisa mencari berita 
router.get(
  "/",
  verifyToken,
  verifyRole([
    "super_admin",
    "content_admin",
    "marketing",
    "reseller",
    "viewer",
  ]),
  validateNewsQueryFilters,
  newsController.getsearchPaginatedNews
);

// Route untuk mendapatkan statistik berita - Hanya Super Admin dan Content Admin yang bisa lihat statistik
router.get(
  "/stats",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  newsController.getNewsStats
);

// Route untuk mendapatkan berita berdasarkan ID - Semua user bisa lihat berita berdasarkan ID
router.get(
  "/:id",
  verifyToken,
  verifyRole([
    "super_admin",
    "content_admin",
    "marketing",
    "reseller",
    "viewer",
  ]),
  newsController.getNewsById
);

// Route untuk mengupdate berita - Hanya Super Admin dan Content Admin yang bisa mengupdate berita berdasarkan ID
router.put(
  "/update/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  uploadNewsImage,
  validateImageNewsOptional,
  validateCreateOrUpdateNews,
  newsController.updateNews
);

// Route untuk menghapus berita berdasarkan ID - Hanya Super Admin dan Content Admin yang bisa menghapus berita berdasarkan ID
router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  newsController.deleteNews
);

module.exports = router;
