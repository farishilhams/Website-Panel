const express = require("express");
const router = express.Router();
const mpointController = require("../controllers/mpoint.controller");
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");
const {
  validateCreateOrUpdateMpoint,
  validateMpointQueryFilters,
} = require("../middlewares/validation.middleware");

// Route untuk membuat data mpoint baru - Hanya Super Admin dan Content Admin yang bisa buat data mpoint baru
router.post(
  "/create",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  validateCreateOrUpdateMpoint,
  mpointController.createMpoint
);

// Route untuk mengambil mpoint gabungan (pagination + filter + search) - Semua user bisa mencari mpoint
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
  validateMpointQueryFilters,
  mpointController.searchPaginatedMpoint
);

// Route untuk mendapatkan data mpoint berdasarkan statistik - Hanya Super Admin dan Content Admin yang bisa lihat statistik
router.get(
  "/stats",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  mpointController.statistikMpointByStatus
);

// Route untuk export data mpoint ke excel - Hanya Super Admin dan Content Admin yang bisa export data mpoint ke excel
router.get(
  "/export/excel",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  mpointController.exportMpointToExcel
);

// Route untuk mendapatkan data mpoint berdasarkan ID - Semua user bisa lihat data mpoint berdasarkan ID
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
  mpointController.getMpointById
);

// Route untuk mengupdate data mpoint - Hanya Super Admin dan Content Admin yang bisa mengupdate data mpoint berdasarkan ID
router.put(
  "/update/:idreseller",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  validateCreateOrUpdateMpoint,
  mpointController.updateMpoint
);

// Route untuk menghapus data mpoint - Hanya Super Admin dan Content Admin yang bisa menghapus data mpoint berdasarkan ID Reseller
router.delete(
  "/delete/:idreseller",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  mpointController.deleteMpoint
);

module.exports = router;
