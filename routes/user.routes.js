const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  verifyToken,
  verifyRole,
  checkSelfOrAdmin,
} = require("../middlewares/auth.middleware");
const {
  validateUserRegister,
  validateUserLogin,
  validateUpdateUser,
  validateResetPassword,
  validateUsersQueryFilters,
} = require("../middlewares/validation.middleware");
const { authLimiter } = require("../middlewares/rateLimiter.middleware");

// Route untuk Register User - Dilindungi authLimiter
router.post(
  "/register",
  authLimiter,
  validateUserRegister,
  userController.register
);

// Route untuk login User - Dilindungi authLimiter
router.post(
  "/login",
  authLimiter,
  validateUserLogin,
  userController.login
);

// Route untuk mendapatkan users dengan pagination - SATU ROUTE UNTUK SEMUA FILTER
// Bisa filter by: role, search, pagination
router.get(
  "/",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  validateUsersQueryFilters,
  userController.getSearchPaginatedUsers
);

// Route untuk statistik users - Hanya bisa Super Admin dan Content Admin yang bisa lihat statistik
router.get(
  "/stats",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  userController.getUsersStats
);

// Route untuk mendapatkan user berdasarkan id - Hanya User sendiri atau Admin yang bisa lihat user berdasarkan ID sendiri
router.get(
  "/profile/:id",
  verifyToken,
  checkSelfOrAdmin,
  userController.getUserId
);

// Route untuk update profile user sendiri berdasarkan id - Hanya untuk User sendiri atau Admin yang bisa update berdasarkan ID sendiri
router.put(
  "/update/:id",
  verifyToken,
  checkSelfOrAdmin,
  validateUpdateUser,
  userController.updateUserById
);

// Route untuk menghapus user berdasarkan id - Hanya untuk Super Admin yang bisa menghapus semua user berdasarkan ID
router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole(["super_admin"]),
  userController.deleteUser
);

// Route untuk reset password user berdasarkan id - Hanya User sendiri atau Super Admin yang bisa reset password
router.patch(
  "/reset-password/:id",
  verifyToken,
  checkSelfOrAdmin,
  validateResetPassword,
  userController.resetUserPasswordById
);

module.exports = router;
