const Popup = require("../models/popup.model");
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
  return `${req.protocol}://${req.get("host")}/uploads/popup/${imageName}`;
};

// Controller untuk membuat popup baru
exports.createPopup = async (req, res) => {
  try {
    const { title, deskripsi, status, link, type, display_day } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadFileToStorage(req.file, "popup");
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Gambar harus diunggah" });
    }

    const result = await Popup.createPopup({
      title,
      image: imageUrl,
      deskripsi,
      status: status || "0",
      link,
      type: type || "T",
      display_day: display_day || "",
    });

    return res.status(200).json({
      message: "Popup berhasil dibuat",
      id: result.insertId,
      image: makeImageUrl(req, imageUrl),
    });
  } catch (err) {
    console.error("Create Popup Error:", err);
    return res.status(500).json({ message: "Gagal membuat popup" });
  }
};

// Controller untuk mengupdate popup
exports.updatePopup = async (req, res) => {
  try {
    const id = req.params.id;

    const existingPopup = await Popup.getPopupById(id);
    if (!existingPopup) {
      return res.status(404).json({ message: "Popup tidak ditemukan" });
    }

    let imageUrl = existingPopup.image;
    if (req.file) {
      await deleteFileFromStorage(existingPopup.image);
      imageUrl = await uploadFileToStorage(req.file, "popup");
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const { title, deskripsi, status, link, type, display_day } = req.body;

    const updatedData = {
      title: title !== undefined ? title : existingPopup.title,
      image: imageUrl,
      deskripsi: deskripsi !== undefined ? deskripsi : existingPopup.deskripsi,
      status: status !== undefined ? status : existingPopup.status,
      link: link !== undefined ? link : existingPopup.link,
      type: type !== undefined ? type : existingPopup.type,
      display_day: display_day !== undefined ? display_day : existingPopup.display_day,
    };

    await Popup.updatePopup(id, updatedData);

    return res.status(200).json({
      message: "Popup berhasil diperbarui",
      image: makeImageUrl(req, updatedData.image),
    });
  } catch (err) {
    console.error("Update Popup Error:", err);
    return res.status(500).json({ message: "Gagal memperbarui popup" });
  }
};

// Controller untuk menghapus popup
exports.deletePopup = async (req, res) => {
  try {
    const id = req.params.id;

    const existingPopup = await Popup.getPopupById(id);
    if (!existingPopup) {
      return res.status(404).json({ message: "Popup tidak ditemukan" });
    }

    if (existingPopup.image) {
      await deleteFileFromStorage(existingPopup.image);
    }

    await Popup.deletePopup(id);

    return res.status(200).json({ message: "Popup berhasil dihapus" });
  } catch (err) {
    console.error("Delete Popup Error:", err);
    return res.status(500).json({ message: "Gagal menghapus popup" });
  }
};

// Controller untuk mengambil data popup gabungan
exports.getsearchPaginatedPopup = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      type: req.query.type,
      status: req.query.status,
      display_day: req.query.display_day,
      search: req.query.search,
      limit,
      offset,
    };

    const results = await Popup.searchPaginatedPopup(filters);

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
    console.error("Get Search Paginated Popup Error:", err);
    return res
      .status(500)
      .json({ message: "Gagal mengambil data popup", error: err.message });
  }
};

// Controller untuk mendapatkan popup berdasarkan ID
exports.getPopupById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Popup.getPopupById(id);
    if (!result) {
      return res.status(404).json({ message: "Popup tidak ditemukan" });
    }

    return res.status(200).json({
      data: {
        ...result,
        image: makeImageUrl(req, result.image),
      },
    });
  } catch (err) {
    console.error("Get Popup By ID Error:", err);
    return res.status(500).json({ message: "Gagal mengambil data popup" });
  }
};

// Controller untuk toggle status popup
exports.togglePopupStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const existingPopup = await Popup.getPopupById(id);
    if (!existingPopup) {
      return res.status(404).json({ message: "Popup tidak ditemukan" });
    }

    await Popup.togglePopupStatus(id, status);

    return res.status(200).json({
      message: `Status popup berhasil diubah menjadi ${status === "1" ? "Aktif" : "Non-Aktif"}`,
      status,
    });
  } catch (err) {
    console.error("Toggle Popup Status Error:", err);
    return res.status(500).json({ message: "Gagal mengubah status popup" });
  }
};
