const multer = require("multer");
const path = require("path");
const { getMimeTypeFromMagicBytes } = require("../utils/securityHelper");

// Menggunakan memory storage dengan pembungkus validasi biner otomatis (Prinsip 12)
const getUploader = (entityName = "general") => {
  const storage = multer.memoryStorage();

  // Filter ekstensi awal
  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"];
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Format file tidak didukung. Harap upload format gambar (.jpg, .jpeg, .png, .gif, .webp) atau PDF."
        ),
        false
      );
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Batas ukuran 5MB
  });

  return {
    single: (fieldName) => {
      const multerSingle = upload.single(fieldName);
      return (req, res, next) => {
        multerSingle(req, res, (err) => {
          if (err) return next(err);

          // Validasi tanda tangan biner (magic bytes) jika ada file yang diunggah
          if (req.file && req.file.buffer) {
            const detectedMime = getMimeTypeFromMagicBytes(req.file.buffer);
            if (!detectedMime) {
              return res.status(400).json({
                status: "fail",
                message:
                  "Integritas file gagal: Format biner file tidak cocok dengan format yang diizinkan atau file rusak.",
              });
            }
            // Terapkan MIME type asli hasil deteksi biner
            req.file.mimetype = detectedMime;
          }
          next();
        });
      };
    },
  };
};

module.exports = { getUploader };
