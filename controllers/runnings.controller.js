const Runnings = require("../models/runnings.model");

// Controller untuk membuat runnings baru
exports.createRunnings = async (req, res) => {
  try {
    // Ambil data dari request body
    const data = req.body;
    // Panggil model untuk create runnings
    const result = await Runnings.createRunnings(data);
    res
      .status(200)
      .json({
        message: "Runnings berhasil dibuat",
        idreseller: result.insertId,
      });
  } catch (err) {
    console.error("Create Runnings Error:", err);
    res.status(500).json({ message: "Gagal membuat runnings" });
  }
};

// Controller untuk memperbarui runnings
exports.updateRunnings = async (req, res) => {
  try {
    // Ambil id runnings dari parameter
    const id = req.params.id;
    // Ambil data dari request body
    const data = req.body;
    // Panggil model untuk update runnings
    const result = await Runnings.updateRunnings(id, data);

    // Cek apakah runnings ditemukan
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Runnings tidak ditemukan" });
    }
    res.status(200).json({ message: "Runnings berhasil diupdate" });
  } catch (err) {
    console.error("Update Runnings Error:", err);
    res.status(500).json({ message: "Gagal memperbarui runnings" });
  }
};

// Controller untuk menghapus runnings
exports.deleteRunnings = async (req, res) => {
  try {
    // Ambil id runnings dari parameter
    const id = req.params.id;
    // Panggil model untuk delete runnings
    const result = await Runnings.deleteRunnings(id);

    // Cek apakah runnings ditemukan
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Runnings tidak ditemukan" });
    }
    res.status(200).json({ message: "Runnings berhasil dihapus" });
  } catch (err) {
    console.error("Delete Runnings Error:", err);
    res.status(500).json({ message: "Gagal menghapus runnings" });
  }
};

// Controller untuk melakukan pencarian runnings dengan pagination dan filter
exports.getsearchPaginatedRunnings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || null;

    // Panggil model Search (gabungan semua filter)
    const runnings = await Runnings.searchPaginatedRunnings({
      search,
      limit,
      offset,
    });

    if (runnings.length === 0) {
      return res.status(404).json({ message: "Runnings tidak ditemukan" });
    }

    res.status(200).json({
      message: "Runnings berhasil diambil",
      total: runnings.length,
      page,
      limit,
      data: runnings,
    });
  } catch (err) {
    console.error("Get Paginated Runnings Error:", err);
    res.status(500).json({ message: "Gagal mengambil data runnings" });
  }
};

// Controller untuk mendapatkan runnings berdasarkan id
exports.getRunningsById = async (req, res) => {
  try {
    // Ambil id runnings dari parameter
    const id = req.params.id;
    // Panggil model untuk get runnings by id
    const result = await Runnings.getRunningsById(id);

    // Cek apakah runnings ditemukan
    if (!result) {
      return res.status(404).json({ message: "Runnings tidak ditemukan" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Get Runnings by ID Error:", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};