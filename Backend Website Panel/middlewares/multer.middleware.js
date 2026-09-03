const multer = require("multer");
const path = require("path");

// Menggunakan memory storage agar buffer file dapat dikirim langsung ke Supabase Storage
const getUploader = (entityName = "general") => {
  const storage = multer.memoryStorage();

  // Filter file yang diizinkan
  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"];
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Format file tidak didukung. Harap upload format gambar (.jpg, .jpeg, .png, .gif, .webp) atau PDF."), false);
    }
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 }, // Batas ukuran file 15MB
  });
};

module.exports = { getUploader };
