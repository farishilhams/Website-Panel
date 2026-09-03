import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import AppImage from "../../components/shared/AppImage";
import Header from "../../components/admin/Header";
import {
  Newspaper,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Eye,
} from "lucide-react";

export default function BeritaViewer() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNews();
  }, [page, statusFilter, searchTerm]);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <Header />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
              <Newspaper className="text-emerald-600" />
              <span>Daftar Berita & Artikel</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pantau seluruh rilis artikel berita dan pengumuman MPStore
            </p>
          </div>
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
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
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
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
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
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Newspaper size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Belum Ada Berita
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tidak ada berita yang sesuai dengan kriteria pencarian Anda.
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

                  {/* Status Badge */}
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
                    <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-emerald-600 transition">
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

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition"
                      >
                        <span>Baca</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
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
    </div>
  );
}