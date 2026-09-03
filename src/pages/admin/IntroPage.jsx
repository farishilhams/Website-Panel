import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import AppImage from "../../components/shared/AppImage";
import Header from "../../components/admin/Header";
import ConfirmModal from "../../components/shared/ConfirmModal";
import IntroTourModal from "../../components/shared/IntroTourModal";
import {
  Sparkles,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  UploadCloud,
  Compass,
  Eye,
} from "lucide-react";

export default function IntroPage() {
  const [intros, setIntros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIntro, setSelectedIntro] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isActive: "Y",
    link: "",
    image: null,
    imagePreview: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Tour Preview State
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3500);
  };

  useEffect(() => {
    fetchIntros();
  }, [page, statusFilter, searchTerm]);

  const fetchIntros = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
      });
      if (statusFilter) params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await api.get(`/api/intro?${params.toString()}`);
      const data = res.data?.data || [];
      setIntros(data);
      setTotalPages(Math.ceil((res.data?.total || data.length) / 6) || 1);
    } catch (err) {
      console.error("Fetch Intro Error:", err);
      showToast("Gagal memuat data intro", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setSelectedIntro(null);
    setFormData({
      title: "",
      description: "",
      isActive: "Y",
      link: "",
      image: null,
      imagePreview: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setSelectedIntro(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      isActive: item.isActive || "Y",
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
      payload.append("isActive", formData.isActive);
      if (formData.link) payload.append("link", formData.link);
      if (formData.image) payload.append("image", formData.image);

      if (isEditMode) {
        await api.put(`/api/intro/update/${selectedIntro.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Layar onboarding intro berhasil diperbarui!");
      } else {
        if (!formData.image) {
          showToast("Gambar ilustrasi intro wajib diunggah!", "error");
          setSubmitLoading(false);
          return;
        }
        await api.post("/api/intro/create", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Layar intro baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      fetchIntros();
    } catch (err) {
      console.error("Submit Error:", err);
      showToast(err.response?.data?.message || "Gagal menyimpan intro", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/intro/delete/${deleteTarget.id}`);
      showToast("Layar intro berhasil dihapus!");
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchIntros();
    } catch (err) {
      console.error("Delete Error:", err);
      showToast("Gagal menghapus intro", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <Header />

      {toast.show && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl text-white text-xs font-bold animate-fade-in ${toast.type === "error" ? "bg-rose-600" : "bg-emerald-600"
            }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
              <Compass className="text-indigo-600" />
              <span>Manajemen Onboarding Layar Intro</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Kelola slide tur panduan fitur aplikasi untuk pengenalan dan edukasi pengguna baru
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
            <button
              onClick={() => setIsTourOpen(true)}
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Eye size={16} className="text-emerald-400" />
              <span>Pratinjau Pengguna</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Tambah Layar Intro</span>
            </button>
          </div>
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
              placeholder="Cari judul intro..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="Y">Aktif (Y)</option>
            <option value="N">Nonaktif (N)</option>
          </select>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-64 bg-white rounded-3xl border border-slate-200 animate-shimmer"
              />
            ))}
          </div>
        ) : intros.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Compass size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Belum Ada Layar Intro
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tambahkan slide onboarding pertama Anda untuk menyambut pengguna baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {intros.map((item, idx) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="w-full h-48 relative bg-slate-900 overflow-hidden">
                  <AppImage
                    src={item.image}
                    alt={item.title}
                    category="intro"
                    allowZoom={true}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full"
                  />

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600/90 text-white font-bold text-[10px] uppercase shadow-sm">
                      SLIDE #{idx + 1 + (page - 1) * 6}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-sm ${item.isActive === "Y"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-700 text-slate-200"
                        }`}
                    >
                      {item.isActive === "Y" ? (
                        <CheckCircle2 size={11} />
                      ) : (
                        <XCircle size={11} />
                      )}
                      <span>{item.isActive === "Y" ? "Aktif" : "Nonaktif"}</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-600 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
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
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Edit Intro"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(item);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Hapus Intro"
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
                <Compass size={18} className="text-indigo-400" />
                <span>
                  {isEditMode ? "Edit Layar Onboarding Intro" : "Tambah Layar Intro Baru"}
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
                  Judul Slide Sambutan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan judul intro..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Uraian Deskripsi *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan secara singkat fitur dan manfaatnya..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Status Tayang
                  </label>
                  <select
                    value={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Y">Aktif / Tampilkan</option>
                    <option value="N">Nonaktif / Simpan Saja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Link Tautan (Opsional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Upload Foto */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Foto Ilustrasi Intro {!isEditMode && "*"}
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-4 text-center transition bg-slate-50/50">
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
                    <span className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                      Pilih gambar ilustrasi
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
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submitLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>
                    {isEditMode ? "Simpan Perubahan" : "Tambahkan Intro"}
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
        title="Hapus Layar Intro"
        message={`Apakah Anda yakin ingin menghapus slide intro "${deleteTarget?.title}"?`}
        confirmText="Ya, Hapus"
        isLoading={deleteLoading}
      />

      {/* Live Onboarding Tour Preview Modal */}
      <IntroTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        previewData={intros}
      />
    </div>
  );
}
