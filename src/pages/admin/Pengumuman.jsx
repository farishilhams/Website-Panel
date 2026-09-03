import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import Header from "../../components/admin/Header";
import ConfirmModal from "../../components/shared/ConfirmModal";
import {
  Megaphone,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Radio,
} from "lucide-react";

export default function Pengumuman() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "1",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Delete
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
    fetchAnnouncements();
  }, [page, searchTerm]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
      });
      if (searchTerm) params.append("search", searchTerm);

      const res = await api.get(`/api/pengumuman?${params.toString()}`);
      const data = res.data?.data || [];
      setAnnouncements(data);
      setTotalPages(Math.ceil((res.data?.total || data.length) / 6) || 1);
    } catch (err) {
      console.error("Fetch Pengumuman Error:", err);
      showToast("Gagal memuat pengumuman", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setFormData({
      title: "",
      description: "",
      status: "1",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setSelectedItem(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      status: item.status?.toString() || "1",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (isEditMode) {
        await api.put(`/api/pengumuman/update/${selectedItem.id}`, formData);
        showToast("Pengumuman berhasil diperbarui!");
      } else {
        await api.post("/api/pengumuman/create", formData);
        showToast("Pengumuman baru berhasil diterbitkan!");
      }

      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (err) {
      console.error("Submit Error:", err);
      showToast(
        err.response?.data?.message || "Gagal menyimpan pengumuman",
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
      await api.delete(`/api/pengumuman/delete/${deleteTarget.id}`);
      showToast("Pengumuman berhasil dihapus!");
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchAnnouncements();
    } catch (err) {
      console.error("Delete Error:", err);
      showToast("Gagal menghapus pengumuman", "error");
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
              <Megaphone className="text-amber-500" />
              <span>Manajemen Siaran Pengumuman</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Siarkan informasi penting dan rilis sistem kepada seluruh mitra & pengguna
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Buat Pengumuman Baru</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari judul pengumuman..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-48 bg-white rounded-3xl border border-slate-200 animate-shimmer"
              />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Megaphone size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Belum Ada Pengumuman
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Terbitkan pengumuman resmi pertama untuk mitra & pengguna.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                      <Radio size={20} />
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        item.status === "1" || item.status === 1
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {item.status === "1" || item.status === 1 ? (
                        <CheckCircle2 size={11} />
                      ) : (
                        <XCircle size={11} />
                      )}
                      <span>
                        {item.status === "1" || item.status === 1
                          ? "Siaran Aktif"
                          : "Nonaktif"}
                      </span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-amber-600 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed whitespace-pre-line line-clamp-4">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
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
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                      title="Edit Pengumuman"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget(item);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Hapus Pengumuman"
                    >
                      <Trash2 size={15} />
                    </button>
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
                <Megaphone size={18} className="text-amber-400" />
                <span>
                  {isEditMode ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
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
                  Judul Pengumuman *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan judul pengumuman..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Isi Pengumuman Lengkap *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tuliskan isi pengumuman secara rinci..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Status Siaran
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="1">Aktif / Siarkan Sekarang</option>
                  <option value="0">Nonaktif / Draft</option>
                </select>
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
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submitLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>
                    {isEditMode ? "Simpan Perubahan" : "Terbitkan Pengumuman"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Pengumuman"
        message={`Apakah Anda yakin ingin menghapus pengumuman "${deleteTarget?.title}"?`}
        confirmText="Ya, Hapus"
        isLoading={deleteLoading}
      />
    </div>
  );
}
