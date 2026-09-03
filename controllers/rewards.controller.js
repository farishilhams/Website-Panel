const Rewards = require("../models/rewards.model");
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
  return `${req.protocol}://${req.get("host")}/uploads/rewards/${imageName}`;
};

// Controller: Create new rewards
exports.createRewards = async (req, res) => {
  try {
    const { title, status, point, description, idhadiah, category } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadFileToStorage(req.file, "rewards");
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Gambar harus diunggah" });
    }

    const result = await Rewards.createRewards({
      title,
      image: imageUrl,
      status: status || "0",
      point: point !== undefined ? String(point) : "0",
      description,
      idhadiah,
      category,
    });

    return res.status(200).json({
      message: "Berhasil menambahkan rewards",
      id: result.insertId,
      image: makeImageUrl(req, imageUrl),
    });
  } catch (err) {
    console.error("Create Rewards Error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk mengupdate rewards
exports.updateRewards = async (req, res) => {
  try {
    const id = req.params.id;

    const existingRewards = await Rewards.getRewardsById(id);
    if (!existingRewards) {
      return res.status(404).json({ message: "Rewards tidak ditemukan" });
    }

    let imageUrl = existingRewards.image;
    if (req.file) {
      await deleteFileFromStorage(existingRewards.image);
      imageUrl = await uploadFileToStorage(req.file, "rewards");
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const { title, status, point, description, idhadiah, category } = req.body;

    const updatedData = {
      title: title !== undefined ? title : existingRewards.title,
      image: imageUrl,
      status: status !== undefined ? status : existingRewards.status,
      point: point !== undefined ? String(point) : existingRewards.point,
      description: description !== undefined ? description : existingRewards.description,
      idhadiah: idhadiah !== undefined ? idhadiah : existingRewards.idhadiah,
      category: category !== undefined ? category : existingRewards.category,
    };

    await Rewards.updateRewards(id, updatedData);

    return res.status(200).json({
      message: "Rewards berhasil diupdate",
      image: makeImageUrl(req, updatedData.image),
    });
  } catch (err) {
    console.error("Update Rewards Error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk menghapus rewards
exports.deleteRewards = async (req, res) => {
  try {
    const id = req.params.id;
    const existingRewards = await Rewards.getRewardsById(id);

    if (!existingRewards) {
      return res.status(404).json({ message: "Rewards tidak ditemukan" });
    }

    if (existingRewards.image) {
      await deleteFileFromStorage(existingRewards.image);
    }

    await Rewards.deleteRewards(id);

    return res.status(200).json({ message: "Rewards berhasil dihapus" });
  } catch (err) {
    console.error("Delete Rewards Error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk mengambil data rewards gabungan
exports.getSearchPaginatedRewards = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      status: req.query.status,
      category: req.query.category,
      point: req.query.point,
      idhadiah: req.query.idhadiah,
      search: req.query.search,
      limit,
      offset,
    };

    const results = await Rewards.searchPaginatedRewards(filters);

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
    console.error("Get Search Paginated Rewards Error:", err);
    return res.status(500).json({
      message: "Gagal mengambil data rewards",
      error: err.message,
    });
  }
};
exports.getsearchPaginatedRewards = exports.getSearchPaginatedRewards;


// Controller untuk mendapatkan rewards berdasarkan ID
exports.getRewardsById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Rewards.getRewardsById(id);
    if (!result) {
      return res.status(404).json({ message: "Rewards tidak ditemukan" });
    }

    return res.status(200).json({
      data: {
        ...result,
        image: makeImageUrl(req, result.image),
      },
    });
  } catch (err) {
    console.error("Get Rewards By ID Error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk statistik rewards
exports.getRewardsStats = async (req, res) => {
  try {
    const result = await Rewards.countRewardsByStatus();
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error get rewards stats:", error);
    res.status(500).json({
      message: "Gagal mengambil statistik rewards",
      error: error.message,
    });
  }
};
