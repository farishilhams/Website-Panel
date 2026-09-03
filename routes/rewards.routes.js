const express = require("express");
const router = express.Router();
const rewardsController = require("../controllers/rewards.controller");
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");
const { getUploader } = require("../middlewares/multer.middleware");
const {
  validateCreateRewards,
  validateUpdateRewards,
  validateImageReward,
  validateImageRewardsOptional,
  validateRewardQueryFilters,
} = require("../middlewares/validation.middleware");
const uploadRewardImage = getUploader("rewards").single("image");

// Route untuk membuat reward baru - Hanya Super Admin dan Marketing yang bisa buat reward baru
router.post(
  "/create",
  verifyToken,
  verifyRole(["super_admin", "marketing"]),
  uploadRewardImage,
  validateImageReward,
  validateCreateRewards,
  rewardsController.createRewards
);

// Route untuk mendapatkan rewards dengan pagination - SATU ROUTE UNTUK SEMUA FILTER
// Bisa filter by: status, category, point, idhadiah, search, pagination
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
  validateRewardQueryFilters,
  rewardsController.getSearchPaginatedRewards
);

// Route untuk mendapatkan statistik reward - Hanya Super Admin dan Marketing yang bisa lihat statistik
router.get(
  "/stats",
  verifyToken,
  verifyRole(["super_admin", "marketing"]),
  rewardsController.getRewardsStats
);

// Route untuk mendapatkan reward berdasarkan ID - Semua user bisa lihat reward berdasarkan ID
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
  rewardsController.getRewardsById
);

// Route untuk mengupdate reward berdasarkan ID - Hanya Super Admin dan Marketing yang bisa update reward berdasarkan ID
router.put(
  "/update/:id",
  verifyToken,
  verifyRole(["super_admin", "marketing"]),
  uploadRewardImage,
  validateImageRewardsOptional,
  validateUpdateRewards,
  rewardsController.updateRewards
);

// Route untuk menghapus reward berdasarkan ID - Hanya Super Admin dan Marketing yang bisa delete reward berdasarkan ID
router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole(["super_admin", "marketing"]),
  rewardsController.deleteRewards
);

module.exports = router;
