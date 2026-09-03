const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

// Middleware verifikasi token untuk user saja
exports.verifyToken = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];

  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Token tidak ditemukan" });
  }

  const token = tokenHeader.split(" ")[1];

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token tidak valid" });

    if (decoded.id_users) {
      req.userId = decoded.id_users;
      req.role = decoded.role;
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
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
