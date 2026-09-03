import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import AppImage from "../../components/shared/AppImage";
import Header from "../../components/admin/Header";
import ConfirmModal from "../../components/shared/ConfirmModal";
import {
  Gift,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Coins,
  Tag,
  Clock,
  X,
  UploadCloud,
} from "lucide-react";

import { getCachedData, setCachedData } from "../../utils/dataCache";
import { validateImageFile } from "../../utils/validators";

export default function RewardsPage() {
  const cached = getCachedData("rewards_admin");
  const [rewards, setRewards] = useState(cached?.data || []);
  const [loading, setLoading] = useState(!cached);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(cached?.totalPages || 1);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "1",
    point: "100",
    idhadiah: "",
    category: "F",
    image: null,
    imagePreview: "",
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
    fetchRewards();
  }, [page, categoryFilter, searchTerm]);

  const fetchRewards = async () => {
    // Only show full loading if we have no cached data at all
    if (!rewards.length) setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "8",
      });
      if (categoryFilter) params.append("category", categoryFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await api.get(`/api/rewards?${params.toString()}`);
      const data = res.data?.data || [];
      const totalPagesCalculated = Math.ceil((res.data?.total || data.length) / 8) || 1;
      setRewards(data);
      setTotalPages(totalPagesCalculated);

      if (!searchTerm && !categoryFilter && page === 1) {
        setCachedData("rewards_admin", { data, totalPages: totalPagesCalculated });
      }
    } catch (err) {
      console.error("Fetch Rewards Error:", err);
      showToast("Gagal memuat data hadiah", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setSelectedReward(null);
    setFormData({
      title: "",
      description: "",
      status: "1",
      point: "100",
      idhadiah: "HDH-" + Math.floor(1000 + Math.random() * 9000),
      category: "F",
      image: null,
      imagePreview: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setSelectedReward(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      status: item.status?.toString() || "1",
      point: item.point?.toString() || "100",
      idhadiah: item.idhadiah || "",
      category: item.category || "F",
      image: null,
      imagePreview: item.image || "",
    });
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const err = validateImageFile(file, 2);
      if (err) {
        showToast(err, "error");
        e.target.value = "";
        return;
      }
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
      payload.append("status", formData.status);
      payload.append("point", formData.point);
      payload.append("idhadiah", formData.idhadiah);
      payload.append("category", formData.category);
      if (formData.image) payload.append("image", formData.image);

      if (isEditMode) {
        await api.put(`/api/rewards/update/${selectedReward.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Hadiah rewards berhasil diperbarui!");
      } else {
        if (!formData.image) {
          showToast("Foto produk hadiah wajib diunggah!", "error");
          setSubmitLoading(false);
          return;
        }
        await api.post("/api/rewards/create", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Hadiah baru berhasil ditambahkan ke katalog!");
      }

      setIsModalOpen(false);
      fetchRewards();
    } catch (err) {
      console.error("Submit Error:", err);
      showToast(err.response?.data?.message || "Gagal menyimpan hadiah", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/rewards/delete/${deleteTarget.id}`);
      showToast("Hadiah berhasil dihapus!");
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchRewards();
    } catch (err) {
      console.error("Delete Error:", err);
      showToast("Gagal menghapus hadiah", "error");
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
              <Gift className="text-rose-600" />
              <span>Manajemen Katalog Rewards & Poin</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Atur daftar hadiah loyalty poin fisik dan digital untuk seluruh mitra MPStore
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Tambah Hadiah Baru</span>
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
              autoComplete="off"
              spellCheck="false"
              placeholder="Cari nama hadiah..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            <option value="F">Barang Fisik (F)</option>
            <option value="D">Produk Digital (D)</option>
          </select>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-72 bg-white rounded-3xl border border-slate-200 animate-shimmer"
              />
            ))}
          </div>
        ) : rewards.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Gift size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Belum Ada Hadiah
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tambahkan produk hadiah reward pertama Anda untuk penukaran poin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {rewards.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="w-full h-44 relative bg-slate-100 overflow-hidden">
                  <AppImage
                    src={item.image}
                    alt={item.title}
                    category="rewards"
                    allowZoom={true}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full"
                  />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-white font-bold text-[10px] uppercase shadow-sm ${
                        item.category === "D"
                          ? "bg-purple-600"
                          : "bg-rose-600"
                      }`}
                    >
                      {item.category === "D" ? "DIGITAL" : "FISIK"}
                    </span>
                  </div>

                  {/* Status Pill */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm ${
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
                          ? "Tersedia"
                          : "Habis"}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-rose-600 transition line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 font-extrabold text-xs">
                      <Coins size={14} className="text-amber-500" />
                      <span>{Number(item.point || 0).toLocaleString()} Poin</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Edit Hadiah"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(item);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Hapus Hadiah"
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
                <Gift size={18} className="text-rose-400" />
                <span>
                  {isEditMode ? "Edit Item Hadiah" : "Tambah Hadiah Baru"}
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
                  Nama Hadiah / Reward *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama hadiah..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Poin Penukaran *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.point}
                    onChange={(e) =>
                      setFormData({ ...formData, point: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kategori Hadiah
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    <option value="F">Fisik (Barang Nyata)</option>
                    <option value="D">Digital (Saldo / Voucher)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Deskripsi & Syarat Penukaran
                </label>
                <textarea
                  rows={3}
                  placeholder="Keterangan mengenai hadiah dan tata cara klaim..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Foto Produk Hadiah {!isEditMode && "*"}
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-rose-500 rounded-2xl p-4 text-center transition bg-slate-50/50">
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
                    <span className="text-xs font-bold text-rose-600 hover:text-rose-700">
                      Pilih foto hadiah
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
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submitLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>
                    {isEditMode ? "Simpan Perubahan" : "Tambahkan Hadiah"}
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
        title="Hapus Hadiah"
        message={`Apakah Anda yakin ingin menghapus item hadiah "${deleteTarget?.title}"?`}
        confirmText="Ya, Hapus"
        isLoading={deleteLoading}
      />
    </div>
  );
}
