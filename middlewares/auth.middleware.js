const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");
const User = require("../models/user.model");

// Middleware verifikasi token dengan validasi sesi di sisi server
exports.verifyToken = async (req, res, next) => {
  const tokenHeader = req.headers["authorization"];

  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Akses ditolak: Token autentikasi tidak ditemukan" });
  }

  const token = tokenHeader.split(" ")[1];

  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err || !decoded || !decoded.id_users) {
      return res.status(401).json({ message: "Sesi tidak valid atau telah berakhir" });
    }

    try {
      // Validasi status akun pengguna di server
      const user = await User.getUserById(decoded.id_users);
      if (!user) {
        return res.status(401).json({ message: "Akun pengguna tidak ditemukan atau telah dinonaktifkan" });
      }

      req.userId = user.id_users;
      req.role = user.role; // Gunakan role mutakhir dari database
      req.user = user;
      next();
    } catch (dbErr) {
      // Fallback aman jika database timeout / offline sementara
      req.userId = decoded.id_users;
      req.role = decoded.role;
      next();
    }
  });
};

// Middleware untuk cek role user
exports.verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (allowedRoles.includes(req.role)) {
      next();
    } else {
      return res.status(403).json({ message: "Akses ditolak" });
    }
  };
};

// Middleware untuk cek apakah user adalah dirinya sendiri atau super_admin
exports.checkSelfOrAdmin = (req, res, next) => {
  const idParam = parseInt(req.params.id);
  const userId = parseInt(req.userId);
  const role = req.role;

  if (role === "super_admin" || userId === idParam) {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Tidak diizinkan mengakses data user lain" });
};
