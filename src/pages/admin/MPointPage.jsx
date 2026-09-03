import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import Header from "../../components/admin/Header";
import ConfirmModal from "../../components/shared/ConfirmModal";
import {
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Building2,
  Clock,
  Navigation,
  FileSpreadsheet,
  X,
} from "lucide-react";

export default function MPointPage() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [kotaFilter, setKotaFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [formData, setFormData] = useState({
    idreseller: "",
    nama: "",
    alamat: "",
    latitude: "-7.250445",
    longitude: "112.768845",
    kota: "Surabaya",
    kecamatan: "Wonokromo",
    provinsi: "Jawa Timur",
    jam_buka: "08:00",
    jam_tutup: "21:00",
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
    fetchMPoints();
  }, [page, kotaFilter, searchTerm]);

  const fetchMPoints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "8",
      });
      if (kotaFilter) params.append("kota", kotaFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await api.get(`/api/mpoint?${params.toString()}`);
      const data = res.data?.data || [];
      setPoints(data);
      setTotalPages(Math.ceil((res.data?.total || data.length) / 8) || 1);
    } catch (err) {
      console.error("Fetch M-Point Error:", err);
      showToast("Gagal memuat data M-Point", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setSelectedPoint(null);
    setFormData({
      idreseller: "RSL-" + Math.floor(10000 + Math.random() * 90000),
      nama: "",
      alamat: "",
      latitude: "-7.250445",
      longitude: "112.768845",
      kota: "Surabaya",
      kecamatan: "Wonokromo",
      provinsi: "Jawa Timur",
      jam_buka: "08:00",
      jam_tutup: "21:00",
      status: "1",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setSelectedPoint(item);
    setFormData({
      idreseller: item.idreseller || "",
      nama: item.nama || "",
      alamat: item.alamat || "",
      latitude: item.latitude || "",
      longitude: item.longitude || "",
      kota: item.kota || "",
      kecamatan: item.kecamatan || "",
      provinsi: item.provinsi || "",
      jam_buka: item.jam_buka || "08:00",
      jam_tutup: item.jam_tutup || "21:00",
      status: item.status?.toString() || "1",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (isEditMode) {
        await api.put(`/api/mpoint/update/${selectedPoint.idreseller}`, formData);
        showToast("Lokasi M-Point berhasil diperbarui!");
      } else {
        await api.post("/api/mpoint/create", formData);
        showToast("Lokasi M-Point baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      fetchMPoints();
    } catch (err) {
      console.error("Submit Error:", err);
      showToast(
        err.response?.data?.message || "Gagal menyimpan data M-Point",
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
      await api.delete(`/api/mpoint/delete/${deleteTarget.idreseller}`);
      showToast("Titik M-Point berhasil dihapus!");
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchMPoints();
    } catch (err) {
      console.error("Delete Error:", err);
      showToast("Gagal menghapus titik M-Point", "error");
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
              <MapPin className="text-cyan-600" />
              <span>Manajemen Titik Lokasi M-Point</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Kelola koordinat GPS dan data gerai agen reseller M-Point resmi
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Tambah Lokasi Baru</span>
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
              placeholder="Cari nama gerai / reseller..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-60 bg-white rounded-3xl border border-slate-200 animate-shimmer"
              />
            ))}
          </div>
        ) : points.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <MapPin size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Belum Ada Data M-Point
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tambahkan titik gerai agen M-Point pertama Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {points.map((item) => (
              <div
                key={item.idreseller}
                className="group bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                      <Building2 size={20} />
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-xs ${
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
                          ? "Buka"
                          : "Tutup"}
                      </span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-cyan-600 transition">
                      {item.nama}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.alamat}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <MapPin size={12} className="text-cyan-500 shrink-0" />
                      <span className="truncate">
                        {item.kecamatan}, {item.kota}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Clock size={12} className="text-cyan-500 shrink-0" />
                      <span>
                        {item.jam_buka || "08:00"} - {item.jam_tutup || "21:00"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  {item.latitude && item.longitude ? (
                    <a
                      href={`https://maps.google.com/?q=${item.latitude},${item.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 transition"
                    >
                      <Navigation size={12} />
                      <span>Lihat Peta</span>
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400">
                      ID: {item.idreseller}
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition"
                      title="Edit M-Point"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget(item);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Hapus M-Point"
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
                <MapPin size={18} className="text-cyan-400" />
                <span>
                  {isEditMode ? "Edit Lokasi M-Point" : "Tambah M-Point Baru"}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Gerai / Reseller *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama gerai M-Point..."
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Lengkap *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Jl. Raya Darmo No. 12..."
                  value={formData.alamat}
                  onChange={(e) =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kota / Kabupaten
                  </label>
                  <input
                    type="text"
                    value={formData.kota}
                    onChange={(e) =>
                      setFormData({ ...formData, kota: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kecamatan
                  </label>
                  <input
                    type="text"
                    value={formData.kecamatan}
                    onChange={(e) =>
                      setFormData({ ...formData, kecamatan: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Buka
                  </label>
                  <input
                    type="time"
                    value={formData.jam_buka}
                    onChange={(e) =>
                      setFormData({ ...formData, jam_buka: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Tutup
                  </label>
                  <input
                    type="time"
                    value={formData.jam_tutup}
                    onChange={(e) =>
                      setFormData({ ...formData, jam_tutup: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500 transition"
                  />
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
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submitLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>
                    {isEditMode ? "Simpan Perubahan" : "Tambahkan Lokasi"}
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
        title="Hapus Titik M-Point"
        message={`Apakah Anda yakin ingin menghapus lokasi gerai "${deleteTarget?.nama}"?`}
        confirmText="Ya, Hapus"
        isLoading={deleteLoading}
      />
    </div>
  );
}
