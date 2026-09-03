const Promotion = require("../models/promotion.model");
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
  return `${req.protocol}://${req.get("host")}/uploads/promotion/${imageName}`;
};

// Controller untuk membuat promotion baru
exports.createPromotion = async (req, res) => {
  try {
    const { title, status, pdf } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadFileToStorage(req.file, "promotion");
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Gambar harus diunggah" });
    }

    const result = await Promotion.createPromotion({
      title,
      image: imageUrl,
      pdf: pdf || null,
      status: status !== undefined ? parseInt(status, 10) : 1,
    });

    return res.status(200).json({
      message: "Promotion berhasil dibuat",
      id: result.insertId,
      image: makeImageUrl(req, imageUrl),
    });
  } catch (err) {
    console.error("Create Promotion Error:", err);
    return res.status(500).json({ message: "Gagal membuat promotion" });
  }
};

// Controller untuk mengupdate promotion
exports.updatePromotion = async (req, res) => {
  try {
    const id = req.params.id;

    const existingPromotion = await Promotion.getPromotionById(id);
    if (!existingPromotion) {
      return res.status(404).json({ message: "Promotion tidak ditemukan" });
    }

    let imageUrl = existingPromotion.image;
    if (req.file) {
      await deleteFileFromStorage(existingPromotion.image);
      imageUrl = await uploadFileToStorage(req.file, "promotion");
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const { title, pdf, status } = req.body;

    const updatedData = {
      title: title !== undefined ? title : existingPromotion.title,
      image: imageUrl,
      pdf: typeof pdf !== "undefined" ? pdf : existingPromotion.pdf,
      status: status !== undefined ? status : existingPromotion.status,
    };

    await Promotion.updatePromotion(id, updatedData);

    return res.status(200).json({
      message: "Promotion berhasil diperbarui",
      image: makeImageUrl(req, updatedData.image),
    });
  } catch (err) {
    console.error("Update Promotion Error:", err);
    return res.status(500).json({ message: "Gagal memperbarui promotion" });
  }
};

// Controller untuk menghapus promotion
exports.deletePromotion = async (req, res) => {
  try {
    const id = req.params.id;
    const promotion = await Promotion.getPromotionById(id);

    if (!promotion) {
      return res.status(404).json({ message: "Promotion tidak ditemukan" });
    }

    if (promotion.image) {
      await deleteFileFromStorage(promotion.image);
    }

    await Promotion.deletePromotion(id);

    return res.status(200).json({ message: "Promotion berhasil dihapus" });
  } catch (err) {
    console.error("Delete Promotion Error:", err);
    return res.status(500).json({ message: "Gagal menghapus promotion" });
  }
};

// Controller untuk mengambil data promotion gabungan
exports.searchPaginatedPromotion = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      status: req.query.status,
      search: req.query.search,
      limit,
      offset,
    };

    const results = await Promotion.searchPaginatedPromotion(filters);

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
  } catch (err) {
    console.error("Get Search Paginated Promotion Error:", err);
    return res.status(500).json({
      message: "Gagal mengambil data promotion",
      error: err.message,
    });
  }
};
exports.getsearchPaginatedPromotion = exports.searchPaginatedPromotion;
exports.getSearchPaginatedPromotion = exports.searchPaginatedPromotion;


// Controller untuk mendapatkan promotion berdasarkan ID
exports.getPromotionById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Promotion.getPromotionById(id);
    if (!result) {
      return res.status(404).json({ message: "Promotion tidak ditemukan" });
    }

    return res.status(200).json({
      data: {
        ...result,
        image: makeImageUrl(req, result.image),
      },
    });
  } catch (err) {
    console.error("Get Promotion By ID Error:", err);
    return res.status(500).json({ message: "Gagal mengambil data promotion" });
  }
};

// Controller untuk statistik promotion
exports.getPromotionStats = async (req, res) => {
  try {
    const result = await Promotion.countPromotionByStatus();
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error get promotion stats:", error);
    res.status(500).json({
      message: "Gagal mengambil statistik promotion",
      error: error.message,
    });
  }
};
