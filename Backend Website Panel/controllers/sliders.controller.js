const Sliders = require("../models/sliders.model");
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
  return `${req.protocol}://${req.get("host")}/uploads/sliders/${imageName}`;
};

// Controller untuk membuat sliders baru
exports.createSliders = async (req, res) => {
  try {
    const { title, link, status, jenis } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadFileToStorage(req.file, "sliders");
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Gambar harus diunggah" });
    }

    const result = await Sliders.createSliders({
      title,
      link,
      status: status || "0",
      jenis,
      image: imageUrl,
    });

    res.status(200).json({
      message: "Sliders berhasil dibuat",
      id: result.insertId,
      image: makeImageUrl(req, imageUrl),
    });
  } catch (err) {
    console.error("Create Sliders Error:", err);
    res.status(500).json({ message: "Gagal membuat sliders" });
  }
};

// Controller untuk mengupdate sliders
exports.updateSliders = async (req, res) => {
  try {
    const id = req.params.id;

    const existingSliders = await Sliders.getSlidersById(id);
    if (!existingSliders) {
      return res.status(404).json({ message: "Sliders tidak ditemukan" });
    }

    let imageUrl = existingSliders.image;
    if (req.file) {
      await deleteFileFromStorage(existingSliders.image);
      imageUrl = await uploadFileToStorage(req.file, "sliders");
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const { title, link, status, jenis } = req.body;

    const updatedData = {
      title: title !== undefined ? title : existingSliders.title,
      image: imageUrl,
      link: link !== undefined ? link : existingSliders.link,
      status: status !== undefined ? status : existingSliders.status,
      jenis: jenis !== undefined ? jenis : existingSliders.jenis,
    };

    await Sliders.updateSliders(id, updatedData);

    return res.status(200).json({
      message: "Sliders berhasil diperbarui",
      image: makeImageUrl(req, updatedData.image),
    });
  } catch (err) {
    console.error("Update Sliders Error:", err);
    return res.status(500).json({ message: "Gagal memperbarui sliders" });
  }
};

// Controller untuk menghapus sliders
exports.deleteSliders = async (req, res) => {
  try {
    const id = req.params.id;
    const sliders = await Sliders.getSlidersById(id);

    if (!sliders) {
      return res.status(404).json({ message: "Sliders tidak ditemukan" });
    }

    if (sliders.image) {
      await deleteFileFromStorage(sliders.image);
    }

    await Sliders.deleteSliders(id);

    return res.status(200).json({ message: "Sliders berhasil dihapus" });
  } catch (err) {
    console.error("Delete Sliders Error:", err);
    return res.status(500).json({ message: "Gagal menghapus sliders" });
  }
};

// Controller untuk mengambil data sliders gabungan
exports.searchPaginatedSliders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      status: req.query.status,
      jenis: req.query.jenis,
      search: req.query.search,
      limit,
      offset,
    };

    const results = await Sliders.searchPaginatedSliders(filters);

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
  } catch (err) {
    console.error("Get Search Paginated Sliders Error:", err);
    res
      .status(500)
      .json({ message: "Gagal mengambil data sliders", error: err.message });
  }
};
exports.getsearchPaginatedSliders = exports.searchPaginatedSliders;
exports.getSearchPaginatedSliders = exports.searchPaginatedSliders;


// Controller untuk mendapatkan sliders berdasarkan ID
exports.getSlidersById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Sliders.getSlidersById(id);
    if (!result) {
      return res.status(404).json({ message: "Sliders tidak ditemukan" });
    }

    res.status(200).json({
      data: {
        ...result,
        image: makeImageUrl(req, result.image),
      },
    });
  } catch (err) {
    console.error("Get Sliders By ID Error:", err);
    res.status(500).json({ message: "Gagal mengambil data sliders" });
  }
};
