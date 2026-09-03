const express = require("express");
const router = express.Router();
const slidersController = require("../controllers/sliders.controller");
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");
const { getUploader } = require("../middlewares/multer.middleware");
const {
  validateCreateSliders,
  validateUpdateSliders,
  validateImageSliders,
  validateImageSlidersOptional,
  validateSlidersQueryFilters,
} = require("../middlewares/validation.middleware");
const uploadSliderImage = getUploader("sliders").single("image");

// Route untuk membuat slider baru - Hanya Super Admin dan Marketing yang bisa buat slider baru
router.post(
  "/create",
  verifyToken,
  verifyRole(["super_admin", "marketing"]),
  uploadSliderImage,
  validateImageSliders,
  validateCreateSliders,
  slidersController.createSliders
);

// Route untuk mendapatkan sliders dengan pagination - SATU ROUTE UNTUK SEMUA FILTER
// Bisa filter by: jenis, status, search, pagination
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
  validateSlidersQueryFilters,
  slidersController.searchPaginatedSliders
)

// Route untuk mendapatkan slider berdasarkan ID - Semua user bisa lihat slider berdasarkan ID
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
  slidersController.getSlidersById
);
 
// Route untuk mengupdate slider - Hanya Super Admin dan Marketing yang bisa update slider berdasarkan ID
router.put(
  "/update/:id",
  verifyToken,
  verifyRole(["super_admin", "marketing"]),
  uploadSliderImage,
  validateImageSlidersOptional,
  validateUpdateSliders,
  slidersController.updateSliders
);

// Route untuk menghapus slider berdasarkan ID - Hanya Super Admin dan Marketing yang bisa hapus slider berdasarkan ID
router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole(["super_admin", "marketing"]),
  slidersController.deleteSliders
);

module.exports = router;
