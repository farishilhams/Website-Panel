const Kuesioner = require("../models/kuesioner.model");
const ExcelJS = require("exceljs");

// Controller untuk membuat kuesioner (User bertanya / Admin menjawab)
exports.createKuesioner = async (req, res) => {
  try {
    // Ambil data user dari middleware auth
    const id_users = req.userId;
    const role = req.role;

    // Ambil data dari request body
    const { pesan, parent_id, is_admin_reply } = req.body;

    // Validasi berdasarkan role
    if (role === "viewer") {
      // Viewer hanya bisa buat pertanyaan (bukan jawaban admin)
      if (is_admin_reply) {
        return res.status(403).json({
          message: "Viewer tidak diizinkan mengirim jawaban admin",
        });
      }
      // Viewer tidak bisa reply ke pertanyaan lain (parent_id harus null)
      if (parent_id) {
        return res.status(403).json({
          message: "Viewer tidak bisa membalas pertanyaan lain",
        });
      }
    }

    // Validasi: Admin tidak boleh membuat pertanyaan sebagai viewer
    if (!is_admin_reply && role !== "viewer") {
      return res.status(403).json({
        message: "Admin tidak boleh membuat pertanyaan sebagai viewer",
      });
    }

    // Panggil model untuk create kuesioner
    const result = await Kuesioner.createKuesioner({
      id_users,
      role,
      pesan,
      parent_id: parent_id || null,
      is_admin_reply: is_admin_reply || false,
    });

    res.status(200).json({ message: "Kuesioner berhasil ditambahkan" });
  } catch (error) {
    console.error("Error (createKuesioner):", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk membalas kuesioner oleh Admin
exports.replyToKuesioner = async (req, res) => {
  try {
    // Ambil data user dari middleware auth
    const id_users = req.userId;
    const role = req.role;

    // Ambil data dari request
    const { pesan } = req.body;
    const parent_id = req.params.parent_id;

    // Create reply dengan flag admin reply
    const result = await Kuesioner.createKuesioner({
      id_users,
      role,
      pesan,
      parent_id,
      is_admin_reply: true,
    });

    // Update status pertanyaan parent menjadi answered
    await Kuesioner.updateStatusToAnswered(parent_id);
    res.status(200).json({ message: "Berhasil membalas kuesioner" });
  } catch (error) {
    console.error("Error (replyToKuesioner):", error);
    res.status(500).json({ message: "Gagal membalas kuesioner" });
  }
};

// Controller untuk mengambil kuesioner berdasarkan ID
exports.getKuesionerById = async (req, res) => {
  try {
    // Ambil ID dari parameter
    const id = req.params.id;
    const role = req.role;
    const userId = req.userId;

    // Panggil model untuk get kuesioner by ID
    const result = await Kuesioner.getKuesionerById(id);
    if (!result) {
      return res.status(404).json({ message: "Kuesioner tidak ditemukan" });
    }

    // Validasi: viewer hanya bisa melihat kuesioner milik sendiri
    if (role === "viewer" && result.id_users !== userId) {
      return res
        .status(403)
        .json({ message: "Tidak diizinkan melihat kuesioner ini" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk update kuesioner (Opsional)
exports.updateKuesioner = async (req, res) => {
  try {
    // Ambil data dari request
    const { id } = req.params;
    const { pesan } = req.body;
    const role = req.role;
    const userId = req.userId;

    // Cek apakah kuesioner ada
    const kuesioner = await Kuesioner.getKuesionerById(id);
    if (!kuesioner) {
      return res.status(404).json({ message: "Kuesioner tidak ditemukan" });
    }

    // Validasi: Viewer hanya bisa mengubah kuesioner milik sendiri
    if (role === "viewer") {
      if (kuesioner.id_users !== userId) {
        return res
          .status(403)
          .json({ message: "Tidak diizinkan mengubah kuesioner ini" });
      }
    }

    // Validasi: Admin hanya bisa mengubah kuesioner milik sendiri
    if (["super_admin", "content_admin"].includes(role)) {
      if (!kuesioner.is_admin_reply) {
        return res
          .status(403)
          .json({
            message: "Pertanyaan dari viewer tidak dapat diubah oleh admin",
          });
      }
      if (kuesioner.id_users !== userId) {
        return res
          .status(403)
          .json({ message: "Admin hanya bisa ubah pesan yang dibuat sendiri" });
      }
    }

    // Panggil model untuk update pesan
    await Kuesioner.updatePesanById(id, pesan);
    res.json({ message: "Pesan admin berhasil diperbarui" });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk menghapus kuesioner
exports.deleteKuesioner = async (req, res) => {
  try {
    // Ambil data dari request
    const { id } = req.params;
    const role = req.role;
    const userId = req.userId;

    // Cek apakah kuesioner ada
    const kuesioner = await Kuesioner.getKuesionerById(id);
    if (!kuesioner) {
      return res.status(404).json({ message: "Kuesioner tidak ditemukan" });
    }

    // Validasi: Viewer hanya bisa menghapus kuesioner milik sendiri
    if (kuesioner.role === "viewer" && kuesioner.id_users !== userId) {
      // Admin bisa menghapus kuesioner milik viewer
      if (role !== "super_admin" && role !== "content_admin") {
        return res
          .status(403)
          .json({ message: "Tidak diizinkan menghapus kuesioner ini" });
      }
    }

    // Panggil model untuk delete kuesioner
    await Kuesioner.deleteKuesioner(id);
    res.json({ message: "Kuesioner berhasil dihapus" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk melakukan pencarian kuesioner dengan filter dan pagination
exports.getSearchPaginatedKuesioner = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || null;
    const role = req.query.role || null;
    const status = req.query.status || null;
    const is_admin_reply = req.query.is_admin_reply || null;
    const start_date = req.query.start_date || null;
    const end_date = req.query.end_date || null;
    const sortBy = req.query.sortBy || "created_at";
    const sortOrder = req.query.sortOrder || "DESC";

    // Panggil model Search
    const kuesioner = await Kuesioner.getSearchPaginatedKuesioner({
      search,
      role,
      status,
      is_admin_reply,
      start_date,
      end_date,
      sortBy,
      sortOrder,
      limit,
      offset,
    });

    if (kuesioner.data.length === 0) {
      return res.status(404).json({ message: "Kuesioner tidak ditemukan" });
    }

    res.status(200).json({
      message: "Kuesioner berhasil diambil",
      total: kuesioner.total,
      page,
      limit,
      data: kuesioner.data,
    });
  } catch (err) {
    console.error("Get Paginated Kuesioner Error:", err);
    res.status(500).json({ message: "Gagal mengambil data kuesioner" });
  }
};

// Controller untuk statistik kuesioner berdasarkan role
exports.statistikKuesionerByRole = async (req, res) => {
  try {
    // Panggil model untuk get statistik by role
    const stats = await Kuesioner.statistikKuesionerByRole();
    res.status(200).json({
      total_roles: stats.length,
      data: stats,
    });
  } catch (error) {
    console.error("Statistik Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk export kuesioner ke Excel
exports.exportKuesionerToExcel = async (req, res) => {
  try {
    // Ambil query parameters untuk filter (sama seperti search pagination)
    const {
      search = "",
      role = "",
      status = "",
      is_admin_reply = "",
      start_date = "",
      end_date = "",
      sortBy = "created_at",
      sortOrder = "DESC",
    } = req.query;

    // Siapkan parameter untuk export (tanpa pagination)
    const params = {
      limit: null, // No limit untuk export semua
      offset: 0,
      search: search.trim(),
      role,
      status,
      is_admin_reply: is_admin_reply
        ? ["true", "1"].includes(is_admin_reply.toLowerCase())
          ? 1
          : 0
        : "",
      start_date,
      end_date,
      sortBy,
      sortOrder: sortOrder.toUpperCase(),
    };

    // Ambil data kuesioner dengan filter yang sama
    const result = await Kuesioner.getSearchPaginatedKuesioner(params);

    // Buat workbook dan worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Kuesioner");

    // Set kolom header Excel
    worksheet.columns = [
      { header: "ID", key: "id", width: 8 },
      { header: "ID User", key: "id_users", width: 10 },
      { header: "Username", key: "username_users", width: 20 },
      { header: "Role", key: "role", width: 15 },
      { header: "Pesan", key: "pesan", width: 40 },
      { header: "Parent ID", key: "parent_id", width: 10 },
      { header: "Admin Reply", key: "is_admin_reply", width: 10 },
      { header: "Status", key: "status", width: 12 },
      { header: "Created At", key: "created_at", width: 20 },
    ];

    // Tambahkan data ke worksheet
    result.data.forEach((row) => worksheet.addRow(row));

    // Set header response untuk download Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="kuesioner.xlsx"`
    );

    // Write dan end response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ message: "Gagal export Excel kuesioner" });
  }
};

// Controller untuk statistik harian kuesioner
exports.dailyStatistics = async (req, res) => {
  try {
    // Panggil model untuk get daily stats
    const result = await Kuesioner.getDailyStats();
    res.status(200).json({
      message: "Statistik harian berhasil diambil",
      data: result,
    });
  } catch (error) {
    console.error("Daily Stats Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
