const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const cors = require("cors");

// Disable X-Powered-By header
app.disable("x-powered-by");

// Daftar origin yang diizinkan untuk CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Menggunakan middleware CORS dengan validasi origin dinamis
app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan request tanpa origin (seperti curl/Postman/server-to-server) atau origin terdaftar
      if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Standard HTTP Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Middleware untuk parsing JSON dan data URL-encoded dari request body
app.use(bodyParser.json()); // Untuk parsing request dengan tipe JSON
app.use(bodyParser.urlencoded({ extended: true })); // Untuk parsing request dengan tipe x-www-form-urlencoded

const fs = require("fs");

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

// Health check / Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "MPStore Panel API Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "MPStore Panel API v1",
    endpoints: {
      user: "/api/user",
      news: "/api/news",
      news_reports: "/api/news_reports",
      pengumuman: "/api/pengumuman",
      popup: "/api/popup",
      sliders: "/api/sliders",
      promotion: "/api/promotion",
      rewards: "/api/rewards",
      mpoint: "/api/mpoint",
      kuesioner: "/api/kuesioner",
      runnings: "/api/runnings",
      tips: "/api/tips",
      intro: "/api/intro",
      interaksi: "/api/interaksi",
    },
  });
});

// Import route user
const userRoutes = require("./routes/user.routes");

// Import route pengumuman
const pengumumanRoutes = require("./routes/pengumuman.routes");

// Import route news
const newsRoutes = require("./routes/news.routes");

// Import route rewards
const rewardsRoutes = require("./routes/rewards.routes");

// Import route promotion
const promotionRoutes = require("./routes/promotion.routes");

// Import route sliders
const slidersRoutes = require("./routes/sliders.routes");

// Import route interaksi
const interaksiRoutes = require("./routes/interaksi.routes");

// Import route intro
const introRoutes = require("./routes/intro.routes");

// Import route news_reports
const newsReportsRoutes = require("./routes/news_reports.routes");

// Import route kuesioner
const kuesionerRoutes = require("./routes/kuesioner.routes");

// Import route mpoint
const mpointRoutes = require("./routes/mpoint.routes");

// Import route tips
const tipsRoutes = require("./routes/tips.routes");

// Import route runnings
const runningsRoutes = require("./routes/runnings.routes");

// Import route popup
const popupRoutes = require("./routes/popup.routes");

// Menggunakan route user dengan prefix /api/user
app.use("/api/user", userRoutes);

// Menggunakan route pengumuman dengan prefix /api/pengumuman
app.use("/api/pengumuman", pengumumanRoutes);

// Menggunakan route news dengan prefix /api/news
app.use("/api/news", newsRoutes);

// Menggunakan route rewards dengan prefix /api/rewards
app.use("/api/rewards", rewardsRoutes);

// Menggunakan route promotion dengan prefix /api/promotion
app.use("/api/promotion", promotionRoutes);

// Menggunakan route sliders dengan prefix /api/sliders
app.use("/api/sliders", slidersRoutes);

// Menggunakan route interaksi dengan prefix /api/interaksi
app.use("/api/interaksi", interaksiRoutes);

// Menggunakan route intro dengan prefix /api/intro
app.use("/api/intro", introRoutes);

// Menggunakan route news_reports dengan prefix /api/news_reports
app.use("/api/news_reports", newsReportsRoutes);

// Menggunakan route kuesioner dengan prefix /api/kuesioner
app.use("/api/kuesioner", kuesionerRoutes);

// Menggunakan route mpoint dengan prefix /api/mpoint
app.use("/api/mpoint", mpointRoutes);

// Menggunakan route tips dengan prefix /api/tips
app.use("/api/tips", tipsRoutes);

// Menggunakan route runnings dengan prefix /api/runnings
app.use("/api/runnings", runningsRoutes);

// Menggunakan route popup dengan prefix /api/popup
app.use("/api/popup", popupRoutes);

// Menggunakan route system monitor dengan prefix /api/system
const systemRoutes = require("./routes/system.routes");
app.use("/api/system", systemRoutes);

// Middleware 404 - Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
});

// Middleware Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message || err);
  const statusCode = err.status || (err.name === "MulterError" ? 400 : 500);
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Terjadi kesalahan pada server",
  });
});

module.exports = app;

