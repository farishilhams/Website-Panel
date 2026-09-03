require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL || "https://your-project.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || "your-supabase-key";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.warn("⚠️ SUPABASE_URL atau SUPABASE_KEY belum diisi di file .env");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

module.exports = supabase;
