const express = require("express");
const router = express.Router();
const systemController = require("../controllers/system.controller");
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");

// Endpoint status kesehatan server (Super Admin & Content Admin)
router.get(
  "/",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  systemController.getSystemHealth
);

router.get(
  "/health",
  verifyToken,
  verifyRole(["super_admin", "content_admin"]),
  systemController.getSystemHealth
);

// Endpoint pembersihan cache server (Hanya Super Admin)
router.post(
  "/clear-cache",
  verifyToken,
  verifyRole(["super_admin"]),
  systemController.clearServerCache
);

module.exports = router;
