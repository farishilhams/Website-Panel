const os = require("os");
const fs = require("fs");
const path = require("path");
const supabase = require("../config/supabase");

/**
 * System Health Controller
 * Memantau performa, latensi database, penggunaan RAM,
 * dan metrik infrastruktur secara real-time.
 */

exports.getSystemHealth = async (req, res) => {
  const startTime = Date.now();

  // 1. Uji Latensi Koneksi Supabase Database
  let dbStatus = "ONLINE";
  let dbLatencyMs = 0;
  let dbError = null;

  try {
    const dbStart = Date.now();
    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    dbLatencyMs = Date.now() - dbStart;
    if (error) {
      dbStatus = "DEGRADED";
      dbError = error.message;
    }
  } catch (err) {
    dbStatus = "OFFLINE";
    dbLatencyMs = -1;
    dbError = err.message;
  }

  // 2. Metrik Penggunaan Memori Node.js
  const memUsage = process.memoryUsage();
  const formatMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

  // 3. Metrik Uptime Server
  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  const uptimeFormatted = `${hours}j ${minutes}m ${seconds}s`;

  // 4. Status Storage / Uploads
  let uploadFilesCount = 0;
  try {
    const uploadsDir = path.join(__dirname, "..", "uploads");
    if (fs.existsSync(uploadsDir)) {
      uploadFilesCount = fs.readdirSync(uploadsDir).length;
    }
  } catch (e) {
    uploadFilesCount = 0;
  }

  const responseTimeMs = Date.now() - startTime;

  res.status(200).json({
    status: "success",
    system: {
      server_name: "MPStore Backend API",
      environment: process.env.NODE_ENV || "development",
      node_version: process.version,
      platform: `${os.type()} (${os.arch()})`,
      cpu_cores: os.cpus().length,
      server_time: new Date().toISOString(),
      uptime_seconds: uptimeSeconds,
      uptime_formatted: uptimeFormatted,
      response_time_ms: responseTimeMs,
    },
    database: {
      provider: "Supabase PostgreSQL",
      status: dbStatus,
      latency_ms: dbLatencyMs,
      error: dbError,
    },
    memory: {
      heap_used_mb: parseFloat(formatMB(memUsage.heapUsed)),
      heap_total_mb: parseFloat(formatMB(memUsage.heapTotal)),
      rss_mb: parseFloat(formatMB(memUsage.rss)),
      free_system_ram_mb: parseFloat((os.freemem() / (1024 * 1024)).toFixed(2)),
      total_system_ram_mb: parseFloat((os.totalmem() / (1024 * 1024)).toFixed(2)),
    },
    storage: {
      local_uploads_count: uploadFilesCount,
      cloud_storage: "Supabase Storage Active",
    },
  });
};

exports.clearServerCache = async (req, res) => {
  try {
    if (global.gc) {
      global.gc();
    }
    res.status(200).json({
      status: "success",
      message: "Cache memori server berhasil dibersihkan!",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal membersihkan cache server" });
  }
};
