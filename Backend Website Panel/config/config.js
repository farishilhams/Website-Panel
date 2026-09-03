require("dotenv").config();

// Mengekspor konfigurasi aplikasi sebagai objek
module.exports = {
  jwtSecret: process.env.JWT_SECRET || "supersecretjwtkey", // Secret key untuk JWT
  port: process.env.PORT || 3001, // Port server Express
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || "",
  supabaseBucket: process.env.SUPABASE_STORAGE_BUCKET || "mpstore",
};


