const express = require("express");
const router = express.Router();
const KuesionerController = require("../controllers/kuesioner.controller");
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");
const {
  validateCreateKuesioner,
  validateReplyKuesioner,
  validateUpdateKuesioner,
  validateKuesionerQueryFilters,
} = require("../middlewares/validation.middleware");

const ALL_ROLES = ["super_admin", "content_admin", "marketing", "reseller", "viewer"];

// Route untuk membuat kuesioner baru - Viewer, Reseller, dan Admin bisa isi
router.post(
  "/create",
  verifyToken,
  verifyRole(ALL_ROLES),
  validateCreateKuesioner,
  KuesionerController.createKuesioner
);

// Route untuk mengambil kuesioner gabungan (pagination + filter + search)
router.get(
  "/",
  verifyToken,
  verifyRole(ALL_ROLES),
  validateKuesionerQueryFilters,
  KuesionerController.getSearchPaginatedKuesioner
);

// Route untuk mendapatkan statistik kuesioner
router.get(
  "/stats",
  verifyToken,
  verifyRole(ALL_ROLES),
  KuesionerController.statistikKuesionerByRole
);

// Route untuk export to Excel kuesioner - Hanya Super Admin dan Content Admin
router.get(
  "/export/excel",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  KuesionerController.exportKuesionerToExcel
);

// Route untuk mendapatkan statistik kuesioner harian
router.get(
  "/stats/daily",
  verifyToken,
  verifyRole(ALL_ROLES),
  KuesionerController.dailyStatistics
);

// Route untuk membalas kuesioner - Super Admin dan Content Admin
router.post(
  "/reply/:parent_id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  validateReplyKuesioner,
  KuesionerController.replyToKuesioner
);

// Route untuk mendapatkan kuesioner berdasarkan ID
router.get(
  "/:id",
  verifyToken,
  verifyRole(ALL_ROLES),
  KuesionerController.getKuesionerById
);

// Route untuk mengupdate kuesioner
router.put(
  "/update/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin", "viewer"]),
  validateUpdateKuesioner,
  KuesionerController.updateKuesioner
);

// Route untuk menghapus kuesioner berdasarkan ID
router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  KuesionerController.deleteKuesioner
);

module.exports = router;
