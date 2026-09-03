const express = require("express");
const router = express.Router();
const tipsController = require("../controllers/tips.controller");
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");
const {
  validateCreateTips,
  validateUpdateTips,
  validateImageTipsOptional,
  validateImageTips,
  validateTipsQueryFilters,
} = require("../middlewares/validation.middleware");
const { getUploader } = require("../middlewares/multer.middleware");
const uploadTipsImage = getUploader("tips").single("image");

// Route untuk membuat tips baru - Hanya Super Admin dan Content Admin Konten yang bisa buat tips baru
router.post(
  "/create",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  uploadTipsImage,
  validateImageTips,
  validateCreateTips,
  tipsController.createTips
);

// Route untuk mendapatkan tips gabungan (pagination + filter + search) - Semua user bisa mencari tips
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
  validateTipsQueryFilters,
  tipsController.searchPaginatedTips
);

// Route untuk mendapatkan tips berdasarkan ID - Semua user bisa lihat tips berdasarkan ID
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
  tipsController.getTipsById
);

// Route untuk mengupdate tips berdasarkan ID - Hanya super admin dan content admin yang bisa mengupdate tips berdasarkan ID
router.put(
  "/update/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  uploadTipsImage,
  validateImageTipsOptional,
  validateUpdateTips,
  tipsController.updateTips
);

// Route untuk menghapus tips berdasarkan ID - Hanya super admin dan content admin yang bisa menghapus tips berdasarkan ID
router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  tipsController.deleteTips
);

module.exports = router;
