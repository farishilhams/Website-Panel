const Pengumuman = require("../models/pengumuman.model");

// Controller untuk membuat pengumuman baru
exports.createPengumuman = async (req, res) => {
  try {
    // Ambil data dari request body
    const { title, description, status } = req.body;

    // Validasi input
    if (!title || !description || !status) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    // Set waktu sekarang untuk created_at dan updated_at
    const create_at = new Date();
    const update_at = create_at;

    // Buat pengumuman baru
    const newPengumuman = {
      title,
      description,
      status,
    };

    // Panggil model untuk create pengumuman
    const result = await Pengumuman.createPengumuman(newPengumuman);

    res.status(201).json({
      message: "Pengumuman berhasil dibuat",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Create Pengumuman Error:", err);
    res.status(500).json({ message: "Gagal membuat pengumuman" });
  }
};

// Controller untuk mengupdate pengumuman berdasarkan ID
exports.updatePengumuman = async (id, title, description, status) => {
  // Validasi input pengumuman
  const data = {
    title,
    description,
    status,
  };
  // Panggil model untuk update pengumuman
  return await Pengumuman.updatePengumuman(id, data);
};

// Controller untuk menghapus pengumuman berdasarkan ID
exports.deletePengumuman = async (req, res) => {
  try {
    // Ambil ID pengumuman dari request params
    const id = req.params.id;
    // Panggil model untuk delete pengumuman
    const pengumuman = await Pengumuman.getPengumumanById(id);
    // Cek apakah pengumuman ditemukan
    if (!pengumuman) {
      return res.status(404).json({ message: "Pengumuman tidak ditemukan" });
    }
    await Pengumuman.deletePengumuman(id);
    res.status(200).json({ message: "Pengumuman berhasil dihapus" });
  } catch (err) {
    console.error("Delete Pengumuman Error:", err);
    res.status(500).json({ message: "Gagal menghapus pengumuman" });
  }
};

// Controller untuk mendapatkan pengumuman berdasarkan ID
exports.getPengumumanById = async (req, res) => {
  try {
    // Ambil ID pengumuman dari request params
    const id = req.params.id;
    // Panggil model untuk get pengumuman by id
    const pengumuman = await Pengumuman.getPengumumanById(id);
    // Cek apakah pengumuman ditemukan
    if (!pengumuman) {
      return res.status(404).json({ message: "Pengumuman tidak ditemukan" });
    }
    res.status(200).json(pengumuman);
  } catch (err) {
    console.error("Get Pengumuman By ID Error:", err);
    res.status(500).json({ message: "Gagal mengambil data pengumuman" });
  }
};

// Controller untuk mendapatkan pengumuman berdasarkan ID internal
exports.getPengumumanByIdInternal = async (id) => {
  // Panggil model untuk get pengumuman by id internal
  return await Pengumuman.getPengumumanById(id);
};

// Controller untuk melakukan pencarian pengumuman dengan pagination dan filter
exports.getsearchPaginatedPengumuman = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || null;
    const status = req.query.status || null;

    // Panggil model Search
    const pengumuman = await Pengumuman.searchPaginatedPengumuman({
      search,
      status,
      limit,
      offset,
    });

    if (pengumuman.length === 0) {
      return res.status(404).json({ message: "Pengumuman tidak ditemukan" });
    }

    res.status(200).json({
      message: "Pengumuman berhasil diambil",
      total: pengumuman.length,
      page,
      limit,
      data: pengumuman,
    });
  } catch (err) {
    console.error("Get Paginated Pengumuman Error:", err);
    res.status(500).json({ message: "Gagal mengambil data pengumuman" });
  }
};

// Controller untuk mendapatkan statistik pengumuman
exports.getPengumumanStats = async (req, res) => {
  try {
    // Panggil model untuk get statistik pengumuman
    const stats = await Pengumuman.countPengumumanByStatus();
    res.status(200).json(stats);
  } catch (err) {
    console.error("Get Pengumuman Stats Error:", err);
    res.status(500).json({ message: "Gagal menghitung statistik pengumuman" });
  }
};
