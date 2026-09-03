import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import AppImage from "../../components/shared/AppImage";
import Header from "../../components/admin/Header";
import ConfirmModal from "../../components/shared/ConfirmModal";
import {
  Newspaper,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  X,
  UploadCloud,
} from "lucide-react";

export default function Berita() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "1",
    type: "1",
    status: "1",
    link: "",
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
    fetchStats();
  }, []);

  useEffect(() => {
    fetchNews();
  }, [page, statusFilter, searchTerm]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/news/stats");
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (e) {
      console.error("Fetch stats error:", e);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "8",
      });
      if (statusFilter) params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await api.get(`/api/news?${params.toString()}`);
      const data = res.data?.data || [];
      setNewsList(data);
      setTotalPages(Math.ceil((res.data?.total || data.length) / 8) || 1);
    } catch (err) {
      console.error("Fetch News Error:", err);
      showToast("Gagal mengambil data berita", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setSelectedNews(null);
    setFormData({
      title: "",
      description: "",
      category_id: "1",
      type: "1",
      status: "1",
      link: "",
      image: null,
      imagePreview: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setSelectedNews(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      category_id: item.category_id || "1",
      type: item.type || "1",
      status: item.status?.toString() || "1",
      link: item.link || "",
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
      payload.append("description", formData.description);
      payload.append("category_id", formData.category_id);
      payload.append("type", formData.type);
      payload.append("status", formData.status);
      if (formData.link) payload.append("link", formData.link);
      if (formData.image) payload.append("image", formData.image);

      if (isEditMode) {
        await api.put(`/api/news/update/${selectedNews.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Berita berhasil diperbarui!");
      } else {
        if (!formData.image) {
          showToast("Gambar berita wajib diunggah!", "error");
          setSubmitLoading(false);
          return;
        }
        await api.post("/api/news/create", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Berita baru berhasil diterbitkan!");
      }

      setIsModalOpen(false);
      fetchNews();
      fetchStats();
    } catch (err) {
      console.error("Submit Error:", err);
      showToast(
        err.response?.data?.message || "Gagal menyimpan data berita",
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
      await api.delete(`/api/news/delete/${deleteTarget.id}`);
      showToast("Berita berhasil dihapus!");
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchNews();
      fetchStats();
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Gagal menghapus berita", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <Header />

      {/* Floating Toast */}
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
        {/* Page Title & Stats Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
              <Newspaper className="text-blue-600" />
              <span>Manajemen Berita & Artikel</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Publikasikan berita promosi, artikel edukasi, dan pengumuman untuk website & aplikasi MPStore
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Tambah Berita Baru</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari judul berita..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="1">Aktif / Diterbitkan</option>
              <option value="0">Draft / Nonaktif</option>
            </select>
          </div>
        </div>

        {/* News Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-72 bg-white rounded-2xl border border-slate-200 animate-shimmer"
              />
            ))}
          </div>
        ) : newsList.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Newspaper size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Belum Ada Berita
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Belum ada artikel berita yang cocok dengan pencarian Anda. Klik tombol Tambah Berita Baru untuk membuat artikel pertama.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {newsList.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Thumbnail Image */}
                <div className="w-full h-44 relative bg-slate-100 overflow-hidden">
                  <AppImage
                    src={item.image}
                    alt={item.title}
                    category="news"
                    allowZoom={true}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full"
                  />

                  {/* Status Badge Overlay */}
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
                          : "Draft"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock size={11} />
                      {new Date(
                        item.created_at || Date.now()
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Edit Berita"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(item);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Hapus Berita"
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

      {/* Modal Add / Edit Berita */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-fade-in max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 px-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Newspaper size={18} className="text-blue-400" />
                <span>
                  {isEditMode ? "Edit Artikel Berita" : "Tambah Berita Baru"}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body */}
            <form
              onSubmit={handleSubmit}
              className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Judul Berita *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan judul berita menarik..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Deskripsi / Isi Berita *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan isi ringkasan atau detail berita..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Status Publikasi
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="1">Aktif / Terbitkan Langsung</option>
                    <option value="0">Draft / Nonaktif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Link Terkait (Opsional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://mpstore.co.id/news/..."
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Upload Gambar Drag & Drop / File Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Foto / Gambar Banner {!isEditMode && "*"}
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-4 text-center transition bg-slate-50/50">
                  {formData.imagePreview ? (
                    <div className="relative max-w-xs mx-auto mb-2 rounded-xl overflow-hidden shadow-sm">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-full h-36 object-cover"
                      />
                    </div>
                  ) : (
                    <UploadCloud
                      size={32}
                      className="mx-auto text-slate-400 mb-1"
                    />
                  )}

                  <label className="cursor-pointer">
                    <span className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      Pilih file gambar
                    </span>
                    <span className="text-xs text-slate-400">
                      {" "}
                      (JPG, PNG, WebP)
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

              {/* Action Buttons */}
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
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submitLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>
                    {isEditMode ? "Simpan Perubahan" : "Terbitkan Berita"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Berita"
        message={`Apakah Anda yakin ingin menghapus berita "${deleteTarget?.title}"? Tindakan ini akan menghapus data beserta gambarnya secara permanen.`}
        confirmText="Ya, Hapus"
        isLoading={deleteLoading}
      />
    </div>
  );
}