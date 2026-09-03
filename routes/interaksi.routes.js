const express = require("express");
const router = express.Router();
const interaksiController = require("../controllers/interaksi.controller");
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");
const {
  validateCreateInteraksi,
  validateInteraksiQueryFilters,
} = require("../middlewares/validation.middleware");

const ALL_ROLES = ["super_admin", "content_admin", "marketing", "reseller", "viewer"];

// Route untuk membuat interaksi baru
router.post(
  "/create",
  verifyToken,
  verifyRole(["super_admin", "content_admin", "marketing", "reseller"]),
  validateCreateInteraksi,
  interaksiController.createInteraksi
);

// Route untuk mendapatkan interaksi dengan pagination - Bisa dilihat oleh semua role termasuk viewer
router.get(
  "/",
  verifyToken,
  verifyRole(ALL_ROLES),
  validateInteraksiQueryFilters,
  interaksiController.searchPaginatedInteraksi
);

// Route untuk export data interaksi ke excel
router.get(
  "/export/excel",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  interaksiController.exportExcelInteraksi
);

// Route untuk statistik interaksi
router.get(
  "/stats",
  verifyToken,
  verifyRole(ALL_ROLES),
  interaksiController.getInteraksiStats
);

module.exports = router;
