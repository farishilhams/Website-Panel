const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/promotion.controller");
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");
const { getUploader } = require("../middlewares/multer.middleware");
const {
  validateCreatePromotion,
  validateUpdatePromotion,
  validateImagePromotion,
  validateImagePromotionOptional,
  validatePromotionQueryFilters,
} = require("../middlewares/validation.middleware");
const uploadPromotionImage = getUploader("promotion").single("image");

// Route untuk membuat promotion baru - Hanya Super Admin dan Marketing yang bisa buat promotion baru
router.post(
  "/create",
  verifyToken,
  verifyRole(["super_admin", "marketing"]),
  uploadPromotionImage,
  validateImagePromotion,
  validateCreatePromotion,
  promotionController.createPromotion
);

// Route untuk mendapatkan promotion dengan pagination - SATU ROUTE UNTUK SEMUA FILTER
// Bisa filter by: status, search, pagination
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
  validatePromotionQueryFilters,
  promotionController.searchPaginatedPromotion
);

// Route untuk mendapatkan statistik promotion - Hanya Super Admin dan Marketing yang bisa lihat statistik
router.get(
  "/stats",
  verifyToken,
  verifyRole(["super_admin", "marketing"]),
  promotionController.getPromotionStats
);

// Route untuk mendapatkan promotion berdasarkan ID - Semua user bisa lihat promotion berdasarkan ID
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
  promotionController.getPromotionById
);

// Route untuk mengupdate promotion - Hanya Super Admin dan Marketing yang bisa mengupdate promotion berdasarkan ID
router.put(
  "/update/:id",
  verifyToken,
  verifyRole(["super_admin", "marketing"]),
  uploadPromotionImage,
  validateImagePromotionOptional,
  validateUpdatePromotion,
  promotionController.updatePromotion
);

// Route untuk menghapus promotion berdasarkan ID - Hanya Super Admin dan Marketing yang bisa menghapus promotion berdasarkan ID
router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole(["super_admin", "marketing"]),
  promotionController.deletePromotion
);

module.exports = router;
