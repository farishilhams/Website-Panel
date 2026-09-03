const express = require("express");
const router = express.Router();
const popupController = require("../controllers/popup.controller");
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");
const {
  validateCreatePopup,
  validateUpdatePopup,
  validateImagePopup,
  validateImagePopupOptional,
  validatePopupQueryFilters,
  validateTogglePopupStatus,
} = require("../middlewares/validation.middleware");
const { getUploader } = require("../middlewares/multer.middleware");
const uploadPopupImage = getUploader("popup").single("image");

// Route untuk membuat popup baru - Hanya Super Admin dan Content Admin yang bisa buat popup baru
router.post(
  "/create",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  uploadPopupImage,
  validateImagePopup,
  validateCreatePopup,
  popupController.createPopup
);

// Route untuk mengambil popup gabungan (pagination + filter + search) - Semua user bisa mencari popup
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
  validatePopupQueryFilters,
  popupController.getsearchPaginatedPopup
);

// Route untuk mendapatkan popup berdasarkan ID - Semua user bisa lihat popup berdasarkan ID
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
  popupController.getPopupById
);

// Route untuk mengupdate popup - Hanya Super Admin dan Content Admin yang bisa update popup berdasarkan ID
router.put(
  "/update/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  uploadPopupImage,
  validateImagePopupOptional,
  validateUpdatePopup,
  popupController.updatePopup
);

// Route untuk menghapus popup berdasarkan ID - Hanya Super Admin dan Content Admin yang bisa menghapus popup berdasarkan ID
router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  popupController.deletePopup
);

// Route untuk mendapatkan toggle status popup - Hanya Super Admin dan Content Admin yang bisa mengedit toggle status popup berdasarkan ID
router.put(
  "/toggle-status/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  validateTogglePopupStatus,
  popupController.togglePopupStatus
);

module.exports = router;
