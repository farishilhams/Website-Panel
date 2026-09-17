/**
 * Security Helper Utilities
 * Proteksi terhadap PostgREST Filter Injection & Manipulasi Input Query
 */

/**
 * Membersihkan string input pengguna sebelum disematkan ke string filter PostgREST (.or() / .ilike())
 * Mencegah PostgREST injection yang memanfaatkan koma (,), tanda kurung (), titik dua (:), dan backslash.
 * @param {string} input - String pencarian dari pengguna
 * @returns {string} - String yang aman digunakan dalam query PostgREST
 */
function sanitizePostgrestFilter(input) {
  if (!input || typeof input !== "string") return "";
  
  // Buang karakter kontrol PostgREST: koma, kurung, titik dua, backslash, kutip
  return input
    .replace(/[,\(\)\:\\\"\'\`]/g, " ")
    .replace(/\s+/g, " ") // Rapikan spasi berlebih
    .trim();
}

/**
 * Memvalidasi apakah buffer file cocok dengan tanda tangan biner (magic bytes) format yang diizinkan
 * @param {Buffer} buffer - Buffer file biner
 * @returns {string|null} - MIME type valid atau null jika format tidak sah
 */
function getMimeTypeFromMagicBytes(buffer) {
  if (!buffer || buffer.length < 4) return null;
  const hex = buffer.toString("hex", 0, 8).toUpperCase();

  // JPEG: FF D8 FF
  if (hex.startsWith("FFD8FF")) return "image/jpeg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (hex.startsWith("89504E47")) return "image/png";
  // GIF: 47 49 46 38
  if (hex.startsWith("47494638")) return "image/gif";
  // PDF: 25 50 44 46 (%PDF)
  if (hex.startsWith("25504446")) return "application/pdf";
  // WEBP: 'RIFF' di byte 0-3 dan 'WEBP' di byte 8-11
  if (hex.startsWith("52494646") && buffer.length >= 12) {
    const webpHeader = buffer.toString("ascii", 8, 12);
    if (webpHeader === "WEBP") return "image/webp";
  }

  return null;
}

module.exports = {
  sanitizePostgrestFilter,
  getMimeTypeFromMagicBytes,
};
