import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import Header from "../../components/admin/Header";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  User,
  Phone,
  HelpCircle,
  Reply,
  Eye,
} from "lucide-react";

export default function ViewerKuesioner() {
  const [kuesionerList, setKuesionerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchKuesioner();
  }, [page, searchTerm]);

  const fetchKuesioner = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
      });
      if (searchTerm) params.append("search", searchTerm);

      const res = await api.get(`/api/kuesioner?${params.toString()}`);
      const data = res.data?.data || [];
      setKuesionerList(data);
      setTotalPages(Math.ceil((res.data?.total || data.length) / 6) || 1);
    } catch (err) {
      console.error("Fetch Kuesioner Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <Header />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
              <MessageSquare className="text-violet-600" />
              <span>Daftar Kuesioner Reseller</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pantau respon survei dan tanggapan admin kepada mitra
            </p>
          </div>
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
              placeholder="Cari respon kuesioner..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-500 transition"
            />
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
              Tidak ada kuesioner yang ditemukan.
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

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-violet-600 uppercase flex items-center gap-1">
                      <HelpCircle size={12} />
                      <span>Pertanyaan / Masukan</span>
                    </span>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {item.pertanyaan || item.jawaban}
                    </p>
                  </div>

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
    </div>
  );
}
