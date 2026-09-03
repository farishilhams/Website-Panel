const express = require("express");
const router = express.Router();
const runningsController = require("../controllers/runnings.controller");
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");
const {
  validateCreateOrUpdateRunnings,
  validateRunningsQueryFilters,
} = require("../middlewares/validation.middleware");

// Route untuk membuat running baru - Hanya Super Admin dan Content Admin yang bisa buat running baru
router.post(
  "/create",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  validateCreateOrUpdateRunnings,
  runningsController.createRunnings
);

// Route untuk mengambil runnings gabungan (pagination + search) - Semua user bisa mencari runnings
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
  validateRunningsQueryFilters,
  runningsController.getsearchPaginatedRunnings
);

// Route untuk mendapatkan running berdasarkan ID - Semua user bisa lihat running berdasarkan ID
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
  runningsController.getRunningsById
);

// Route untuk mengupdate running berdasarkan ID - Hanya Super Admin dan Content Admin yang bisa update running berdasarkan ID
router.put(
  "/update/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  validateCreateOrUpdateRunnings,
  runningsController.updateRunnings
);

// Route untuk menghapus running berdasarkan ID - Hanya Super Admin dan Content Admin yang bisa hapus running berdasarkan ID
router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  runningsController.deleteRunnings
);

module.exports = router;
