const Interaksi = require("../models/interaksi.model");
const ExcelJS = require("exceljs");

// Controller untuk menambah data interaksi
exports.createInteraksi = async (req, res) => {
  try {
    // Ambil id_reference dari request body dan id_reseller dari userId yang login
    const { id_reference } = req.body;
    const id_reseller = req.userId;

    // Validasi input id_reference harus ada
    if (!id_reference) {
      return res.status(400).json({ message: "ID Reference harus diisi" });
    }

    // Panggil model untuk create interaksi
    await Interaksi.createInteraksi({ id_reseller, id_reference });
    res.status(201).json({ message: "Data Interaksi berhasil ditambahkan" });
  } catch (err) {
    console.error("Tambah Data Interaksi Error:", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk melakukan pencarian interaksi dengan filter dan pagination
exports.searchPaginatedInteraksi = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || null;
    const id_reseller = req.query.id_reseller || null;
    const id_reference = req.query.id_reference || null;

    // Panggil model Search
    const interaksi = await Interaksi.searchPaginatedInteraksi({
      search,
      id_reseller,
      id_reference,
      limit,
      offset,
    });

    if (interaksi.length === 0) {
      return res.status(404).json({ message: "Interaksi tidak ditemukan" });
    }

    res.status(200).json({
      message: "Interaksi berhasil diambil",
      total: interaksi.length,
      page,
      limit,
      data: interaksi,
    });
  } catch (err) {
    console.error("Get Paginated Interaksi Error:", err);
    res.status(500).json({ message: "Gagal mengambil data interaksi" });
  }
};

// Controller untuk mendapatkan statistik interaksi
exports.getInteraksiStats = async (req, res) => {
  try {
    // Panggil model untuk get statistik interaksi
    const stats = await Interaksi.countInteraksiStats();
    res.status(200).json(stats);
  } catch (err) {
    console.error("Get Interaksi Stats Error:", err);
    res.status(500).json({ message: "Gagal mengambil statistik interaksi" });
  }
};

// Controller untuk export data interaksi ke Excel
exports.exportExcelInteraksi = async (req, res) => {
  try {
    // Ambil semua data interaksi dengan pagination yang besar
    const interaksi = await Interaksi.searchPaginatedInteraksi({
      search: null,
      id_reseller: null,
      id_reference: null,
      limit: 10000, // Ambil banyak data untuk export
      offset: 0,
    });
    
    if (interaksi.length === 0) {
      return res.status(404).json({ message: "Tidak ada data untuk diexport" });
    }

    // Buat workbook dan worksheet baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Interaksi");

    // Set kolom header untuk Excel
    worksheet.columns = [
      { header: "ID Interaksi", key: "id_interaksi", width: 15 },
      { header: "Reseller", key: "reseller_name", width: 25 },
      { header: "Referensi", key: "reference_name", width: 25 },
      { header: "Created At", key: "created_at", width: 20 },
      { header: "Updated At", key: "updated_at", width: 20 },
    ];

    // Tambahkan data ke worksheet
    interaksi.forEach((row) => {
      worksheet.addRow({
        id_interaksi: row.id_interaksi,
        reseller_name: row.reseller_name,
        reference_name: row.reference_name,
        created_at: row.created_at,
        updated_at: row.updated_at,
      });
    });

    // Set header response untuk download file Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=interaksi.xlsx");

    // Write workbook ke response dan end response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Export Excel Error:", err);
    res.status(500).json({ message: "Gagal export Excel" });
  }
};
