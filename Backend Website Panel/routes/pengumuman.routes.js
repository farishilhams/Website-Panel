const express = require("express");
const router = express.Router();
const pengumumanController = require("../controllers/pengumuman.controller");
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");
const {
  validateCreateOrUpdatePengumuman,
  validatePengumumanQueryFilters,
} = require("../middlewares/validation.middleware");

// Route untuk membuat pengumuman baru - Hanya Super Admin dan Content Admin yang bisa membuat pengumuman baru
router.post(
  "/create",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  validateCreateOrUpdatePengumuman,
  pengumumanController.createPengumuman
);

// Route untuk mendapatkan semua pengumuman - Semua user bisa lihat pengumuman
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
  validatePengumumanQueryFilters,
  pengumumanController.getsearchPaginatedPengumuman
);

// Route untuk mendapatkan statistik pengumuman - Hanya Super Admin dan Content Admin yang bisa lihat statistik
router.get(
  "/stats",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  pengumumanController.getPengumumanStats
);

// Route untuk mendapatkan pengumuman berdasarkan ID - Semua user bisa lihat pengumuman berdasarkan ID
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
  pengumumanController.getPengumumanById
);

// Route untuk mengubah pengumuman berdasarkan ID - Hanya Super Admin dan Content Admin yang bisa mengupdate pengumuman berdasarkaN ID
router.put(
  "/update/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  validateCreateOrUpdatePengumuman,
  async (req, res) => {
    try {
      const { title, description, status } = req.body;
      const id = req.params.id;

      const pengumuman = await pengumumanController.getPengumumanByIdInternal(
        id
      );
      if (!pengumuman)
        return res.status(404).json({ message: "Pengumuman tidak ditemukan" });

      await pengumumanController.updatePengumuman(
        id,
        title,
        description,
        status
      );
      res.status(200).json({ message: "Pengumuman berhasil diperbarui" });
    } catch (err) {
      console.error("Update Pengumuman Error:", err);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }
);
// Route untuk menghapus pengumuman berdasarkan ID - Hanya Super Admin dan Content Admin yang bisa menghapus pengumuman berdasarkan ID
router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  pengumumanController.deletePengumuman
);

module.exports = router;
