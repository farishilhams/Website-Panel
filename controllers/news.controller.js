const News = require("../models/news.model");
const {
  uploadFileToStorage,
  deleteFileFromStorage,
} = require("../utils/supabaseStorage");

// Helper untuk generate URL gambar
const makeImageUrl = (req, imageName) => {
  if (!imageName) return null;
  if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
    return imageName;
  }
  if (imageName.startsWith("uploads/")) {
    return `${req.protocol}://${req.get("host")}/${imageName}`;
  }
  return `${req.protocol}://${req.get("host")}/uploads/news/${imageName}`;
};

// Controller untuk membuat berita baru
exports.createNews = async (req, res) => {
  try {
    const { title, description, status, category_id, link, type } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadFileToStorage(req.file, "news");
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Gambar harus diunggah" });
    }

    const result = await News.createNews({
      title,
      description,
      status: status || "0",
      category_id,
      link,
      type,
      image: imageUrl,
    });

    res.status(200).json({
      message: "Berita berhasil dibuat",
      id: result.insertId,
      image: makeImageUrl(req, imageUrl),
    });
  } catch (error) {
    console.error("Error create news:", error);
    res
      .status(500)
      .json({ message: "Gagal membuat berita", error: error.message });
  }
};

// Controller untuk mengupdate data berita
exports.updateNews = async (req, res) => {
  try {
    const id = req.params.id;

    const existingNews = await News.getNewsById(id);
    if (!existingNews) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    let imageUrl = existingNews.image;
    if (req.file) {
      await deleteFileFromStorage(existingNews.image);
      imageUrl = await uploadFileToStorage(req.file, "news");
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const { title, description, status, category_id, link, type } = req.body;

    const updatedData = {
      title: title !== undefined ? title : existingNews.title,
      description: description !== undefined ? description : existingNews.description,
      status: status !== undefined ? status : existingNews.status,
      category_id: category_id !== undefined ? category_id : existingNews.category_id,
      link: link !== undefined ? link : existingNews.link,
      type: type !== undefined ? type : existingNews.type,
      image: imageUrl,
    };

    await News.updateNews(id, updatedData);

    res.status(200).json({
      message: "Berita berhasil diperbarui",
      image: makeImageUrl(req, updatedData.image),
    });
  } catch (err) {
    console.error("Update News Error:", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk menghapus data berita
exports.deleteNews = async (req, res) => {
  try {
    const id = req.params.id;

    const existingNews = await News.getNewsById(id);
    if (!existingNews) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    if (existingNews.image) {
      await deleteFileFromStorage(existingNews.image);
    }

    await News.deleteNews(id);

    res.status(200).json({ message: "Berita berhasil dihapus" });
  } catch (error) {
    console.error("Error delete news:", error);
    res.status(500).json({ message: "Gagal menghapus berita" });
  }
};

// Controller untuk mengambil data berita gabungan
exports.getsearchPaginatedNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      type: req.query.type,
      status: req.query.status,
      category_id: req.query.category_id,
      search: req.query.search,
      limit,
      offset,
    };

    const results = await News.searchPaginatedNews(filters);

    const formattedData = results.map((item) => ({
      ...item,
      image: makeImageUrl(req, item.image),
    }));

    res.status(200).json({
      page,
      limit,
      total: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error get search paginated news:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data berita", error: error.message });
  }
};

// Controller untuk mendapatkan berita berdasarkan ID
exports.getNewsById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await News.getNewsById(id);
    if (!result) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    res.status(200).json({
      data: {
        ...result,
        image: makeImageUrl(req, result.image),
      },
    });
  } catch (error) {
    console.error("Error get news by ID:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data berita", error: error.message });
  }
};

// Controller untuk statistik berita
exports.getNewsStats = async (req, res) => {
  try {
    const result = await News.countNewsByStatus();
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error get news stats:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil statistik berita", error: error.message });
  }
};
