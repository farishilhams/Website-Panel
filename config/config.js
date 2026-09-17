require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

if (isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET === "supersecretjwtkey")) {
  console.error("❌ KRITIS: JWT_SECRET belum dikonfigurasi dengan aman di environment production!");
}

module.exports = {
  jwtSecret: process.env.JWT_SECRET || "mpstore_dev_secret_replace_in_production_987654321",
  port: process.env.PORT || 3001,
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || "",
  supabaseBucket: process.env.SUPABASE_STORAGE_BUCKET || "mpstore",
};


