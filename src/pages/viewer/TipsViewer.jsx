import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import AppImage from "../../components/shared/AppImage";
import Header from "../../components/admin/Header";
import {
  Lightbulb,
  Search,
  ExternalLink,
  Youtube,
  Clock,
  Eye,
} from "lucide-react";

export default function TipsViewer() {
  const [tipsList, setTipsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTips();
  }, [page, searchTerm]);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
      });
      if (searchTerm) params.append("search", searchTerm);

      const res = await api.get(`/api/tips?${params.toString()}`);
      const data = res.data?.data || [];
      setTipsList(data);
      setTotalPages(Math.ceil((res.data?.total || data.length) / 6) || 1);
    } catch (err) {
      console.error("Fetch Tips Error:", err);
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
              <Lightbulb className="text-teal-600" />
              <span>Daftar Tips & Edukasi</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Koleksi tips transaksi dan video tutorial edukasi mitra
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
              placeholder="Cari judul tips..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition"
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
        ) : tipsList.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Lightbulb size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Belum Ada Tips Edukasi
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tidak ada tips yang cocok dengan pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tipsList.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="w-full h-44 relative bg-slate-900 overflow-hidden">
                  <AppImage
                    src={item.image}
                    alt={item.title}
                    category="tips"
                    allowZoom={true}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full"
                  />

                  {item.youtube && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600/90 text-white font-bold text-[10px] uppercase shadow-sm">
                        <Youtube size={12} />
                        <span>VIDEO</span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-teal-600 transition">
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

                    {item.youtube && (
                      <a
                        href={item.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition"
                      >
                        <span>Tonton Video</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
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
    </div>
  );
}