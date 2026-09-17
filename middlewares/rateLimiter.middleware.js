const { rateLimit } = require("express-rate-limit");

/**
 * Rate limiter untuk endpoint sensitif seperti login dan registrasi.
 * Maksimal 10 request per 15 menit per alamat IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // Maksimal 10 percobaan
  standardHeaders: true, // Kembalikan info rate limit di header `RateLimit-*`
  legacyHeaders: false, // Nonaktifkan header usang `X-RateLimit-*`
  message: {
    status: "fail",
    message: "Terlalu banyak percobaan masuk/daftar dari perangkat ini. Harap coba kembali setelah 15 menit demi keamanan akun Anda.",
  },
});

/**
 * Rate limiter umum untuk seluruh endpoint API.
 * Maksimal 150 request per menit per alamat IP.
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 150, // Maksimal 150 request per menit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Batas frekuensi permintaan data terlampaui. Harap perlambat request Anda.",
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
};
