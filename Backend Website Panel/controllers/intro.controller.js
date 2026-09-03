const Intro = require("../models/intro.model");
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
  return `${req.protocol}://${req.get("host")}/uploads/intro/${imageName}`;
};

// Controller untuk membuat intro baru
exports.createIntro = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadFileToStorage(req.file, "intro");
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Gambar harus diunggah" });
    }

    const result = await Intro.createIntro({
      title,
      image: imageUrl,
      description,
      isActive: isActive || "N",
    });

    return res.status(200).json({
      message: "Intro berhasil dibuat",
      id: result.insertId,
      image: makeImageUrl(req, imageUrl),
    });
  } catch (error) {
    console.error("Create Intro Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan" });
  }
};

// Controller untuk update intro
exports.updateIntro = async (req, res) => {
  try {
    const id = req.params.id;

    const existingIntro = await Intro.getIntroById(id);
    if (!existingIntro) {
      return res.status(404).json({ message: "Intro tidak ditemukan" });
    }

    let imageUrl = existingIntro.image;
    if (req.file) {
      await deleteFileFromStorage(existingIntro.image);
      imageUrl = await uploadFileToStorage(req.file, "intro");
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const { title, description, isActive } = req.body;

    const updatedData = {
      title: title !== undefined ? title : existingIntro.title,
      image: imageUrl,
      description: description !== undefined ? description : existingIntro.description,
      isActive: typeof isActive !== "undefined" ? isActive : existingIntro.isActive,
    };

    await Intro.updateIntro(id, updatedData);

    return res.status(200).json({
      message: "Intro berhasil diperbarui",
      image: makeImageUrl(req, updatedData.image),
    });
  } catch (error) {
    console.error("Update Intro Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan" });
  }
};

// Controller untuk menghapus intro
exports.deleteIntro = async (req, res) => {
  try {
    const id = req.params.id;
    const existingIntro = await Intro.getIntroById(id);

    if (!existingIntro) {
      return res.status(404).json({ message: "Intro tidak ditemukan" });
    }

    if (existingIntro.image) {
      await deleteFileFromStorage(existingIntro.image);
    }

    await Intro.deleteIntro(id);

    return res.status(200).json({ message: "Intro berhasil dihapus" });
  } catch (error) {
    console.error("Delete Intro Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan" });
  }
};

// Controller untuk mengambil data intro gabungan
exports.getSearchPaginatedIntro = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const params = {
      limit,
      offset,
      search: req.query.search,
      isActive: req.query.isActive,
      sortBy: req.query.sortBy || "created_at",
      sortOrder: req.query.sortOrder || "DESC",
    };

    const result = await Intro.getSearchPaginatedIntro(params);

    const formattedData = (result.data || []).map((item) => ({
      ...item,
      image: makeImageUrl(req, item.image),
    }));

    return res.status(200).json({
      message: "Data intro berhasil diambil",
      page,
      limit,
      total: result.total,
      data: formattedData,
    });
  } catch (error) {
    console.error("Get Search Paginated Intro Error:", error);
    return res.status(500).json({
      message: "Gagal mengambil data intro",
      error: error.message,
    });
  }
};

// Controller untuk mendapatkan intro berdasarkan ID
exports.getIntroById = async (req, res) => {
  try {
    const id = req.params.id;

    const intro = await Intro.getIntroById(id);
    if (!intro) {
      return res.status(404).json({ message: "Intro tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Data intro berhasil diambil",
      data: {
        ...intro,
        image: makeImageUrl(req, intro.image),
      },
    });
  } catch (error) {
    console.error("Get Intro By ID Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan" });
  }
};

// Controller untuk statistik intro
exports.getIntroStats = async (req, res) => {
  try {
    const result = await Intro.countIntroByIsActive();
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error get intro stats:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil statistik intro", error: error.message });
  }
};
