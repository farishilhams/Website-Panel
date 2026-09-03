import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import Header from "../../components/admin/Header";
import ConfirmModal from "../../components/shared/ConfirmModal";
import {
  Flame,
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

export default function RunningsPage() {
  const [runningList, setRunningList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
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
    fetchRunnings();
  }, [page, searchTerm]);

  const fetchRunnings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
      });
      if (searchTerm) params.append("search", searchTerm);

      const res = await api.get(`/api/runnings?${params.toString()}`);
      const data = res.data?.data || [];
      setRunningList(data);
      setTotalPages(Math.ceil((res.data?.total || data.length) / 6) || 1);
    } catch (err) {
      console.error("Fetch Runnings Error:", err);
      showToast("Gagal memuat running text", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setFormData({
      name: "",
      status: "1",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setSelectedItem(item);
    setFormData({
      name: item.name || item.text || "",
      text: item.text || item.name || "",
      status: item.status?.toString() || "1",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const payload = {
      ...formData,
      text: formData.name || formData.text,
      name: formData.name || formData.text,
    };

    try {
      if (isEditMode) {
        await api.put(`/api/runnings/update/${selectedItem.id}`, payload);
        showToast("Running text berhasil diperbarui!");
      } else {
        await api.post("/api/runnings/create", payload);
        showToast("Running text baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      fetchRunnings();
    } catch (err) {
      console.error("Submit Error:", err);
      showToast(
        err.response?.data?.message || "Gagal menyimpan running text",
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
      await api.delete(`/api/runnings/delete/${deleteTarget.id}`);
      showToast("Running text berhasil dihapus!");
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchRunnings();
    } catch (err) {
      console.error("Delete Error:", err);
      showToast("Gagal menghapus running text", "error");
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
              <Flame className="text-orange-500" />
              <span>Manajemen Running Text Ticker</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Atur teks pengumuman berjalan (*marquee ticker*) yang bergerak di layar aplikasi
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Tambah Running Text</span>
          </button>
        </div>

        {/* Live Preview Box */}
        {runningList.filter((r) => r.status === "1" || r.status === 1).length >
          0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/15 overflow-hidden flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-black/20 text-[10px] font-extrabold uppercase shrink-0 flex items-center gap-1">
              <Radio size={12} className="animate-pulse" />
              <span>LIVE TICKER</span>
            </span>
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <div className="inline-block animate-marquee font-medium text-xs">
                {runningList
                  .filter((r) => r.status === "1" || r.status === 1)
                  .map((r) => r.name)
                  .join(" ••• ")}
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari isi teks berjalan..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-44 bg-white rounded-3xl border border-slate-200 animate-shimmer"
              />
            ))}
          </div>
        ) : runningList.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Flame size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Belum Ada Running Text
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Buat pesan teks berjalan pertama Anda untuk disiarkan di aplikasi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {runningList.map((item) => (
              <div
                key={item.id}
                className="group bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
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
                          ? "Tayang Aktif"
                          : "Nonaktif"}
                      </span>
                    </span>
                  </div>

                  <p className="font-bold text-slate-800 text-sm leading-snug group-hover:text-orange-600 transition line-clamp-3">
                    "{item.name || item.text}"
                  </p>
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
                      className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition"
                      title="Edit Running Text"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget(item);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Hapus Running Text"
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
                <Flame size={18} className="text-orange-400" />
                <span>
                  {isEditMode
                    ? "Edit Running Text"
                    : "Tambah Running Text Baru"}
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
                  Isi Pesan Running Text *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tuliskan teks bergerak yang akan disiarkan di beranda aplikasi..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Status Penayangan
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="1">Aktif / Tayangkan di Ticker</option>
                  <option value="0">Nonaktif / Simpan Saja</option>
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
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submitLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>
                    {isEditMode ? "Simpan Perubahan" : "Terbitkan Ticker"}
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
        title="Hapus Running Text"
        message={`Apakah Anda yakin ingin menghapus running text "${deleteTarget?.name}"?`}
        confirmText="Ya, Hapus"
        isLoading={deleteLoading}
      />
    </div>
  );
}