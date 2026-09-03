import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import Header from "../../components/admin/Header";
import ConfirmModal from "../../components/shared/ConfirmModal";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  Reply,
  Trash2,
  Clock,
  User,
  Phone,
  HelpCircle,
  X,
  Filter,
} from "lucide-react";

export default function AdminKuesioner() {
  const [kuesionerList, setKuesionerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reply Modal
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // Delete Modal
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
    fetchKuesioner();
  }, [page, statusFilter, searchTerm]);

  const fetchKuesioner = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
      });
      if (statusFilter) params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await api.get(`/api/kuesioner?${params.toString()}`);
      const data = res.data?.data || [];
      setKuesionerList(data);
      setTotalPages(Math.ceil((res.data?.total || data.length) / 6) || 1);
    } catch (err) {
      console.error("Fetch Kuesioner Error:", err);
      showToast("Gagal memuat data kuesioner", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReply = (item) => {
    setSelectedItem(item);
    setAdminResponse(item.tanggapan_admin || "");
    setReplyModalOpen(true);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    setSubmitLoading(true);

    try {
      await api.put(`/api/kuesioner/update/${selectedItem.id}`, {
        tanggapan_admin: adminResponse,
        status: "1", // Status resolved/dijawab
      });

      showToast("Tanggapan admin berhasil dikirim!");
      setReplyModalOpen(false);
      fetchKuesioner();
    } catch (err) {
      console.error("Reply error:", err);
      showToast("Gagal mengirim tanggapan", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/kuesioner/delete/${deleteTarget.id}`);
      showToast("Kuesioner berhasil dihapus!");
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchKuesioner();
    } catch (err) {
      console.error("Delete Error:", err);
      showToast("Gagal menghapus kuesioner", "error");
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
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            <MessageSquare className="text-violet-600" />
            <span>Manajemen Kuesioner & Feedback</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tinjau tanggapan kuesioner, keluhan, dan berikan balasan langsung kepada reseller
          </p>
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
              placeholder="Cari nama, pertanyaan, atau nomor HP..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-500 transition"
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
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="1">Sudah Dibalas</option>
              <option value="0">Menunggu Balasan</option>
            </select>
          </div>
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
        ) : kuesionerList.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Belum Ada Respon Kuesioner
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tidak ada data kuesioner yang sesuai dengan filter Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kuesionerList.map((item) => (
              <div
                key={item.id}
                className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* User Badge & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs">
                        {item.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">
                          {item.username || "Mitra MPStore"}
                        </h4>
                        {item.phone && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <Phone size={10} />
                            <span>{item.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        item.status === "1" || item.status === 1
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.status === "1" || item.status === 1 ? (
                        <CheckCircle2 size={11} />
                      ) : (
                        <Clock size={11} />
                      )}
                      <span>
                        {item.status === "1" || item.status === 1
                          ? "Dijawab"
                          : "Menunggu"}
                      </span>
                    </span>
                  </div>

                  {/* Pertanyaan */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-violet-600 uppercase flex items-center gap-1">
                      <HelpCircle size={12} />
                      <span>Pertanyaan / Masukan</span>
                    </span>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {item.pertanyaan || item.jawaban || "Tidak ada rincian pertanyaan."}
                    </p>
                  </div>

                  {/* Tanggapan Admin Jika Ada */}
                  {item.tanggapan_admin && (
                    <div className="p-3 bg-violet-50/60 rounded-2xl border border-violet-100 space-y-1">
                      <span className="text-[10px] font-bold text-violet-700 uppercase flex items-center gap-1">
                        <Reply size={12} />
                        <span>Balasan Admin</span>
                      </span>
                      <p className="text-xs text-violet-900 leading-relaxed font-medium">
                        {item.tanggapan_admin}
                      </p>
                    </div>
                  )}
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
                      onClick={() => handleOpenReply(item)}
                      className="px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Reply size={14} />
                      <span>{item.tanggapan_admin ? "Edit Balasan" : "Balas"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget(item);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Hapus Kuesioner"
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

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setReplyModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-fade-in">
            <div className="p-5 px-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Reply size={18} className="text-violet-400" />
                <span>Balas Respon Kuesioner</span>
              </h3>
              <button
                onClick={() => setReplyModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReplySubmit} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-[11px] font-bold text-slate-500 uppercase">
                  Pertanyaan Pengguna:
                </p>
                <p className="text-xs text-slate-800 font-semibold mt-1">
                  "{selectedItem?.pertanyaan || selectedItem?.jawaban}"
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tanggapan / Jawaban Resmi Admin *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan jawaban atau konfirmasi solusi untuk mitra..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-500 transition resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setReplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-md shadow-violet-600/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submitLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>Kirimkan Balasan</span>
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
        title="Hapus Kuesioner"
        message={`Apakah Anda yakin ingin menghapus respon kuesioner dari ${deleteTarget?.username}?`}
        confirmText="Ya, Hapus"
        isLoading={deleteLoading}
      />
    </div>
  );
}