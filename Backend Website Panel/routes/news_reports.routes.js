const express = require("express");
const router = express.Router();
const newsReportsController = require("../controllers/news_reports.controller");
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");
const {
  validateTrackNewsViews,
  validateNewsReportsQueryFilters,
} = require("../middlewares/validation.middleware");

// Route untuk pencarian laporan berita dengan pagination - Hanya Super Admin dan Content Admin yang bisa mencari laporan berita
router.get(
  "/",
  verifyToken,
  verifyRole(["super_admin", "content_admin", "viewer"]),
  validateNewsReportsQueryFilters,
  newsReportsController.searchPaginatedNewsReports
);

// Route untuk export laporan berita ke excel - Hanya Super Admin dan Content Admin yang bisa export laporan berita ke excel
router.get(
  "/export/excel",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  newsReportsController.exportNewsReportsToExcel
);

// Route untuk mencatat view berita - Semua user yang login bisa view berita
router.post(
  "/track/:id_berita",
  verifyToken,
  validateTrackNewsViews,
  newsReportsController.trackNewsViews
);

// Route untuk mendapatkan news report berdasarkan ID - Super Admin dan Content Admin yang bisa lihat laporan berita berdasarkan ID
router.get(
  "/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin", "viewer"]),
  newsReportsController.getNewsReportById
);

module.exports = router;
