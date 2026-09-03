const NewsReports = require("../models/news_reports.model");
const ExcelJS = require("exceljs");

// Controller untuk menghitung jumlah views news report
exports.trackNewsViews = async (req, res) => {
  try {
    // Ambil id berita dari parameter
    const { id_berita } = req.params;
    // Ambil id pengguna dari request
    const id_users = req.userId;

    // Panggil model untuk menghitung views
    await NewsReports.insertOrUpdateReport({ id_users, id_berita });
    res
      .status(200)
      .json({ message: "Berhasil mengupdate jumlah views berita" });
  } catch (err) {
    console.error("Track News Views Error:", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk mendapatkan news report berdasarkan ID
exports.getNewsReportById = async (req, res) => {
  try {
    // Ambil ID dari request params
    const id = req.params.id;

    // Panggil model untuk get news report by id
    const report = await NewsReports.getNewsReportById(id);

    // Cek apakah report ditemukan
    if (!report) {
      return res.status(404).json({ message: "News report tidak ditemukan" });
    }
    res.status(200).json(report);
  } catch (err) {
    console.error("Get News Report By ID Error:", err);
    res.status(500).json({ message: "Gagal mengambil data news report" });
  }
};

// Controller untuk melakukan pencarian news reports dengan filter dan pagination
exports.searchPaginatedNewsReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || null;
    const id_users = req.query.id_users || null;
    const id_berita = req.query.id_berita || null;
    const min_views = req.query.min_views || null;

    // Panggil model Search
    const reports = await NewsReports.searchPaginatedNewsReports({
      search,
      id_users,
      id_berita,
      min_views,
      limit,
      offset,
    });

    if (reports.length === 0) {
      return res.status(404).json({ message: "News reports tidak ditemukan" });
    }

    res.status(200).json({
      message: "News reports berhasil diambil",
      total: reports.length,
      page,
      limit,
      data: reports,
    });
  } catch (err) {
    console.error("Get Paginated News Reports Error:", err);
    res.status(500).json({ message: "Gagal mengambil data news reports" });
  }
};

// Controller untuk eksport laporan berita ke Excel
exports.exportNewsReportsToExcel = async (req, res) => {
  try {
    // Ambil semua laporan berita tanpa pagination (untuk export semua data)
    const data = await NewsReports.searchPaginatedNewsReports({});

    // Cek apakah ada data
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Tidak ada data untuk diexport" });
    }

    // Buat workbook dan worksheet baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Berita");

    // Set kolom header untuk Excel
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "ID User", key: "id_users", width: 10 },
      { header: "Username", key: "username", width: 20 },
      { header: "ID Berita", key: "id_berita", width: 10 },
      { header: "Judul Berita", key: "judul_berita", width: 30 },
      { header: "Jumlah Views", key: "jumlah", width: 15 },
      { header: "Created At", key: "created_at", width: 25 },
    ];

    // Isi data baris
    data.forEach((row) => {
      worksheet.addRow({
        id: row.id,
        id_users: row.id_users,
        username: row.username,
        id_berita: row.id_berita,
        judul_berita: row.judul_berita,
        jumlah: row.jumlah,
        created_at: row.created_at,
      });
    });

    // Set response header
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=news_reports.xlsx"
    );

    // Write workbook ke response dan end
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Export Excel News Reports Error:", err);
    res.status(500).json({ message: "Gagal export Excel laporan berita" });
  }
};