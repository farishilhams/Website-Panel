const Tips = require("../models/tips.model");
const {
  uploadFileToStorage,
  deleteFileFromStorage,
} = require("../utils/supabaseStorage");

// Helper: buat URL gambar absolut
const makeImageUrl = (req, imageName) => {
  if (!imageName) return null;
  if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
    return imageName;
  }
  if (imageName.startsWith("uploads/")) {
    return `${req.protocol}://${req.get("host")}/${imageName}`;
  }
  return `${req.protocol}://${req.get("host")}/uploads/tips/${imageName}`;
};

// Controller untuk menambahkan tips baru
exports.createTips = async (req, res) => {
  try {
    const { title, youtube, description } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadFileToStorage(req.file, "tips");
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Gambar harus diunggah" });
    }

    const result = await Tips.createTips({
      title,
      image: imageUrl,
      youtube,
      description,
    });

    return res.status(200).json({
      message: "Berhasil menambahkan tips",
      id: result.insertId,
      image: makeImageUrl(req, imageUrl),
    });
  } catch (error) {
    console.error("Create Tips Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk mengupdate tips
exports.updateTips = async (req, res) => {
  try {
    const id = req.params.id;

    const existingTips = await Tips.getTipsById(id);
    if (!existingTips) {
      return res.status(404).json({ message: "Tips tidak ditemukan" });
    }

    let imageUrl = existingTips.image;
    if (req.file) {
      await deleteFileFromStorage(existingTips.image);
      imageUrl = await uploadFileToStorage(req.file, "tips");
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const { title, youtube, description } = req.body;

    const updatedData = {
      title: title !== undefined ? title : existingTips.title,
      image: imageUrl,
      youtube: typeof youtube !== "undefined" ? youtube : existingTips.youtube,
      description: description !== undefined ? description : existingTips.description,
    };

    await Tips.updateTips(id, updatedData);

    return res.status(200).json({
      message: "Tips berhasil diperbarui",
      image: makeImageUrl(req, updatedData.image),
    });
  } catch (error) {
    console.error("Update Tips Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk menghapus tips
exports.deleteTips = async (req, res) => {
  try {
    const id = req.params.id;
    const tips = await Tips.getTipsById(id);

    if (!tips) {
      return res.status(404).json({ message: "Tips tidak ditemukan" });
    }

    if (tips.image) {
      await deleteFileFromStorage(tips.image);
    }

    await Tips.deleteTips(id);

    return res.status(200).json({ message: "Tips berhasil dihapus" });
  } catch (error) {
    console.error("Delete Tips Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk mengambil data tips gabungan
exports.searchPaginatedTips = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      title: req.query.title,
      description: req.query.description,
      youtube: req.query.youtube,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      search: req.query.search,
      limit,
      offset,
    };

    const results = await Tips.searchPaginatedTips(filters);

    const formattedData = results.map((item) => ({
      ...item,
      image: makeImageUrl(req, item.image),
    }));

    return res.status(200).json({
      page,
      limit,
      total: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("Get Search Paginated Tips Error:", error);
    return res.status(500).json({
      message: "Gagal mengambil data tips",
      error: error.message,
    });
  }
};
exports.getsearchPaginatedTips = exports.searchPaginatedTips;
exports.getSearchPaginatedTips = exports.searchPaginatedTips;


// Controller untuk mendapatkan tips berdasarkan ID
exports.getTipsById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Tips.getTipsById(id);
    if (!result) {
      return res.status(404).json({ message: "Tips tidak ditemukan" });
    }

    return res.status(200).json({
      data: {
        ...result,
        image: makeImageUrl(req, result.image),
      },
    });
  } catch (error) {
    console.error("Get Tips By ID Error:", error);
    return res.status(500).json({ message: "Gagal mengambil data tips" });
  }
};
