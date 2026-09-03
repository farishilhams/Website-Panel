const Mpoint = require("../models/mpoint.model");
const XLSX = require("xlsx");

// Controller untuk membuat data mpoint baru
exports.createMpoint = async (req, res) => {
    try {
        // Ambil data dari request body
        const data = req.body;
        // Panggil model untuk create mpoint
        const result = await Mpoint.createMpoint(data);
        res.status(200).json({ message: "Mpoint berhasil dibuat", idreseller: result.insertIdReseller });
    } catch (err) {
        console.error("Create Mpoint Error:", err);
        res.status(500).json({ message: "Gagal membuat mpoint" });
    }
};

// Controller untuk melakukan pencarian mpoint dengan pagination dan filter (GABUNGAN)
exports.searchPaginatedMpoint = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const search = req.query.search || null;
        const status = req.query.status || null;
        const tipe_toko = req.query.tipe_toko || null;
        const created_by = req.query.created_by || null;
        const start_date = req.query.start_date || null;
        const end_date = req.query.end_date || null;

        // Panggil model Search (gabungan semua filter)
        const mpoints = await Mpoint.searchPaginatedMpoint({
            search,
            status,
            tipe_toko,
            created_by,
            start_date,
            end_date,
            limit,
            offset,
        });

        if (mpoints.length === 0) {
            return res.status(404).json({ message: "Mpoint tidak ditemukan" });
        }

        res.status(200).json({
            message: "Mpoint berhasil diambil",
            total: mpoints.length,
            page,
            limit,
            data: mpoints,
        });
    } catch (err) {
        console.error("Get Paginated Mpoint Error:", err);
        res.status(500).json({ message: "Gagal mengambil data mpoint" });
    }
};

// Controller untuk mengambil data mpoint berdasarkan id
exports.getMpointById = async (req, res) => {
    try {
      // Ambil parameter ID dari URL params
      const idreseller = req.params.id;
      // Panggil model untuk get mpoint by id
      const result = await Mpoint.getMpointById(idreseller);
      // Cek apakah data ditemukan
      if (!result) {
        return res.status(404).json({ message: "Mpoint tidak ditemukan" });
      }
      res.status(200).json(result);
    } catch (err) {
        console.error("Get Mpoint By ID Error:", err);
        res.status(500).json({ message: "Gagal mengambil data mpoint" });
    }
};

// Controller untuk mengupdate data mpoint
exports.updateMpoint = async (req, res) => {
    try {
        // Ambil parameter ID dan data dari request 
        const idreseller = req.params.idreseller;
        const data = req.body;

        // Panggil model untuk update mpoint
        const result = await Mpoint.updateMpoint(idreseller, data);

        // Cek apakah data ditemukan
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Mpoint tidak ditemukan" });
        }
        res.status(200).json({ message: "Mpoint berhasil diperbarui" });
    } catch (err) {
        console.error("Update Mpoint Error:", err);
        res.status(500).json({ message: "Gagal memperbarui mpoint" });
    }
};

// Controller untuk menghapus data mpoint
exports.deleteMpoint = async (req, res) => {
    try {
        // Ambil parameter ID dari URL params
        const idreseller = req.params.idreseller;
        // Panggil model untuk delete mpoint
        const result = await Mpoint.deleteMpoint(idreseller);

        // Cek apakah data ditemukan
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Mpoint tidak ditemukan" });
        }
        res.status(200).json({ message: "Mpoint berhasil dihapus" });
    } catch (err) {
        console.error("Delete Mpoint Error:", err);
        res.status(500).json({ message: "Gagal menghapus mpoint" });
    }
};

// Controller untuk mendapatkan statistik mpoint berdasarkan status
exports.statistikMpointByStatus = async (req, res) => {
    try {
        // Ambil parameter status dari query parameter
        const status = req.params.status;
        // Panggil model untuk statistik mpoint
        const result = await Mpoint.statistikMpointByStatus(status);
        res.status(200).json(result);
    } catch (err) {
        console.error("Statistik Mpoint Error:", err);
        res.status(500).json({ message: "Gagal menghitung statistik mpoint" });
    }
};

// Controller untuk eksport data mpoint ke Excel
exports.exportMpointToExcel = async (req, res) => {
  try {
    // Ambil semua data mpoint tanpa pagination (untuk export semua data)
    const result = await Mpoint.searchPaginatedMpoint({});

    // Cek apakah ada data
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Tidak ada data untuk diexport" });
    }

    // Buat workbook dan worksheet baru menggunakan XLSX
    const ws = XLSX.utils.json_to_sheet(result);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mpoint");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Set header response untuk download excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="mpoint.xlsx"`
    );

    res.send(buf);
  } catch (error) {
    console.error("Export Mpoint Error:", error);
    res.status(500).json({ message: "Gagal export Excel mpoint" });
  }
};