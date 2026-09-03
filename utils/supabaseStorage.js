const path = require("path");
const fs = require("fs");
const supabase = require("../config/supabase");
const { supabaseBucket } = require("../config/config");

/**
 * Upload buffer file ke Supabase Storage (atau fallback lokal jika credentials belum diisi)
 * @param {Object} file - Objek file dari Multer (file.buffer, file.originalname, file.mimetype)
 * @param {string} folder - Nama folder/kategori (contoh: 'news', 'popup', 'sliders')
 * @returns {Promise<string>} - Public URL gambar
 */
async function uploadFileToStorage(file, folder = "general") {
  if (!file) return null;

  const ext = path.extname(file.originalname).toLowerCase();
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = `${folder}/${fileName}`;

  // Jika Supabase URL dan Key sudah di-set
  if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY && process.env.SUPABASE_URL !== "https://your-project-id.supabase.co") {
    try {
      const { data, error } = await supabase.storage
        .from(supabaseBucket)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        console.error("Supabase Storage Upload Error:", error.message);
        throw error;
      }

      const { data: publicData } = supabase.storage
        .from(supabaseBucket)
        .getPublicUrl(filePath);

      return publicData.publicUrl;
    } catch (err) {
      console.warn("Gagal upload ke Supabase Storage, menggunakan fallback lokal:", err.message);
    }
  }

  // Fallback ke penyimpanan lokal folder uploads/ jika offline / dev lokal
  const localDir = path.join(__dirname, "../uploads", folder);
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }
  const localFilePath = path.join(localDir, fileName);
  fs.writeFileSync(localFilePath, file.buffer);

  // Return path relatif uploads
  return `uploads/${folder}/${fileName}`;
}

/**
 * Hapus file dari Supabase Storage jika ada
 * @param {string} fileUrl - Public URL file
 */
async function deleteFileFromStorage(fileUrl) {
  if (!fileUrl) return;

  try {
    if (fileUrl.includes(supabaseBucket)) {
      const parts = fileUrl.split(`${supabaseBucket}/`);
      if (parts.length > 1) {
        const filePath = decodeURIComponent(parts[1]);
        await supabase.storage.from(supabaseBucket).remove([filePath]);
      }
    }
  } catch (err) {
    console.error("Error menghapus file dari storage:", err.message);
  }
}

module.exports = {
  uploadFileToStorage,
  deleteFileFromStorage,
};
