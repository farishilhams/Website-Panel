const express = require("express");
const router = express.Router();
const introController = require("../controllers/intro.controller");
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");
const {
  validateCreateIntro,
  validateUpdateIntro,
  validateImageIntro,
  validateImageIntroOptional,
  validateIntroQueryFilters,
} = require("../middlewares/validation.middleware");
const { getUploader } = require("../middlewares/multer.middleware");
const uploadIntroImage = getUploader("intro").single("image");

// Route untuk membuat intro baru - Hanya Super Admin dan Content Admin yang bisa buat intro baru
router.post(
  "/create",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  uploadIntroImage,
  validateImageIntro,
  validateCreateIntro,
  introController.createIntro
);

// Route untuk mengambil intro gabungan (pagination + filter + search) - Semua user bisa mencari intro
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
  validateIntroQueryFilters,
  introController.getSearchPaginatedIntro
);

// Route untuk mendapatkan statistik intro - Hanya Super Admin dan Content Admin yang bisa lihat statistik
router.get(
  "/stats",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  introController.getIntroStats
);

// Route untuk mendapatkan intro berdasarkan ID - Semua user bisa melihat intro berdasarkan ID
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
  introController.getIntroById
);

// Route untuk mengupdate intro - Hanya Super Admin dan Content Admin yang bisa mengupdate intro berdasarkan ID
router.put(
  "/update/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  uploadIntroImage,
  validateImageIntroOptional,
  validateUpdateIntro,
  introController.updateIntro
);

// Route untuk menghapus intro berdasarkan ID - Hanya Super Admin dan Content Admin yang bisa menghapus intro berdasarkan ID
router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  introController.deleteIntro
);

module.exports = router;
