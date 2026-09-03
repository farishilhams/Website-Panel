import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import AppImage from "../../components/shared/AppImage";
import Header from "../../components/admin/Header";
import ConfirmModal from "../../components/shared/ConfirmModal";
import {
  Image as ImageIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  UploadCloud,
  Layers,
} from "lucide-react";

export default function Slider() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSlider, setSelectedSlider] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    jenis: "QR",
    status: "1",
    image: null,
    imagePreview: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3500);
  };

  useEffect(() => {
    fetchSliders();
  }, [page, jenisFilter, searchTerm]);

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
      });
      if (jenisFilter) params.append("jenis", jenisFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await api.get(`/api/sliders?${params.toString()}`);
      const data = res.data?.data || [];
      setSliders(data);
      setTotalPages(Math.ceil((res.data?.total || data.length) / 6) || 1);
    } catch (err) {
      console.error("Fetch Sliders Error:", err);
      showToast("Gagal memuat data slider", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setSelectedSlider(null);
    setFormData({
      title: "",
      link: "",
      jenis: "QR",
      status: "1",
      image: null,
      imagePreview: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setSelectedSlider(item);
    setFormData({
      title: item.title || "",
      link: item.link || "",
      jenis: item.jenis || "QR",
      status: item.status?.toString() || "1",
      image: null,
      imagePreview: item.image || "",
    });
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("link", formData.link);
      payload.append("jenis", formData.jenis);
      payload.append("status", formData.status);
      if (formData.image) payload.append("image", formData.image);

      if (isEditMode) {
        await api.put(`/api/sliders/update/${selectedSlider.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Slider berhasil diperbarui!");
      } else {
        if (!formData.image) {
          showToast("Gambar banner slider wajib diunggah!", "error");
          setSubmitLoading(false);
          return;
        }
        await api.post("/api/sliders/create", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Slider baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      fetchSliders();
    } catch (err) {
      console.error("Submit error:", err);
      showToast(
        err.response?.data?.message || "Gagal menyimpan slider",
        "error"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/sliders/delete/${deleteTarget.id}`);
      showToast("Slider berhasil dihapus!");
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchSliders();
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Gagal menghapus slider", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <Header />

      {toast.show && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl text-white text-xs font-bold animate-fade-in ${
            toast.type === "error" ? "bg-rose-600" : "bg-emerald-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Page Title & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
              <ImageIcon className="text-purple-600" />
              <span>Manajemen Slider Banner Utama</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Atur banner promosi carousel yang tampil di beranda aplikasi dan website
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Tambah Slider Banner</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari judul slider..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <select
            value={jenisFilter}
            onChange={(e) => {
              setJenisFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="">Semua Kategori (Jenis)</option>
            <option value="QR">QR Code</option>
            <option value="EVT">Event & Promo</option>
            <option value="TOPUP">Top Up</option>
            <option value="VOUCHER">Voucher</option>
          </select>
        </div>

        {/* Sliders Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-64 bg-white rounded-3xl border border-slate-200 animate-shimmer"
              />
            ))}
          </div>
        ) : sliders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ImageIcon size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Belum Ada Slider Banner
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tambahkan gambar banner beranda pertama Anda sekarang.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sliders.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Banner Thumbnail */}
                <div className="w-full h-48 relative bg-slate-900 overflow-hidden">
                  <AppImage
                    src={item.image}
                    alt={item.title}
                    category="slider"
                    allowZoom={true}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full"
                  />

                  {/* Jenis & Status Pills */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-600/90 text-white font-bold text-[10px] uppercase shadow-sm">
                      {item.jenis || "BANNER"}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-sm ${
                        item.status === "1" || item.status === 1
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      {item.status === "1" || item.status === 1 ? (
                        <CheckCircle2 size={11} />
                      ) : (
                        <XCircle size={11} />
                      )}
                      <span>
                        {item.status === "1" || item.status === 1
                          ? "Aktif"
                          : "Nonaktif"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Banner Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-purple-600 transition">
                      {item.title}
                    </h3>
                    {item.link && (
                      <p className="text-xs text-slate-400 font-mono mt-1 truncate">
                        {item.link}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(
                        item.created_at || Date.now()
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition"
                        title="Edit Slider"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(item);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Hapus Slider"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              Sebelumnya
            </button>
            <span className="text-xs text-slate-500 font-semibold px-2">
              Halaman {page} dari {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-fade-in">
            <div className="p-5 px-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <ImageIcon size={18} className="text-purple-400" />
                <span>
                  {isEditMode ? "Edit Slider Banner" : "Tambah Slider Banner Baru"}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Judul Banner *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan judul banner..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tautan / Link Tujuan (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://mpstore.co.id/promo/..."
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kategori (Jenis)
                  </label>
                  <select
                    value={formData.jenis}
                    onChange={(e) =>
                      setFormData({ ...formData, jenis: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="QR">QR Code</option>
                    <option value="EVT">Event</option>
                    <option value="TOPUP">Top Up</option>
                    <option value="VOUCHER">Voucher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Status Tayang
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="1">Aktif / Tayangkan</option>
                    <option value="0">Nonaktif / Sembunyikan</option>
                  </select>
                </div>
              </div>

              {/* Upload Foto Banner */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Foto Banner Slider {!isEditMode && "*"}
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-purple-500 rounded-2xl p-4 text-center transition bg-slate-50/50">
                  {formData.imagePreview ? (
                    <div className="relative max-w-xs mx-auto mb-2 rounded-xl overflow-hidden shadow-sm">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  ) : (
                    <UploadCloud
                      size={32}
                      className="mx-auto text-slate-400 mb-1"
                    />
                  )}

                  <label className="cursor-pointer">
                    <span className="text-xs font-bold text-purple-600 hover:text-purple-700">
                      Pilih file gambar banner
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submitLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>
                    {isEditMode ? "Simpan Slider" : "Tambahkan Slider"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Slider Banner"
        message={`Apakah Anda yakin ingin menghapus banner "${deleteTarget?.title}"?`}
        confirmText="Ya, Hapus"
        isLoading={deleteLoading}
      />
    </div>
  );
}