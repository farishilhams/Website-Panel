import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import Header from "../../components/admin/Header";
import {
  Users2,
  Search,
  Clock,
  Eye,
} from "lucide-react";

export default function InteraksiViewer() {
  const [interaksiList, setInteraksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInteraksi();
  }, [page, searchTerm]);

  const fetchInteraksi = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "8",
      });
      if (searchTerm) params.append("search", searchTerm);

      const res = await api.get(`/api/interaksi?${params.toString()}`);
      const data = res.data?.data || [];
      setInteraksiList(data);
      setTotalPages(Math.ceil((res.data?.total || data.length) / 8) || 1);
    } catch (err) {
      console.error("Fetch Interaksi Error:", err);
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
              <Users2 className="text-emerald-600" />
              <span>Data Interaksi & Referral Reseller</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pantau pohon relasi referral antara mitra dan perujuk
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
              placeholder="Cari nama reseller / perujuk..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Grid Cards List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-48 bg-white rounded-3xl border border-slate-200 animate-shimmer"
              />
            ))}
          </div>
        ) : interaksiList.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users2 size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Belum Ada Data Interaksi
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tidak ada data yang cocok dengan pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interaksiList.map((item, idx) => (
              <div
                key={item.id_interaksi || item.id || idx}
                className="group bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-[10px] uppercase border border-emerald-200">
                      REFERRAL #{idx + 1 + (page - 1) * 8}
                    </span>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Reseller Mitra
                      </span>
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {item.nama_reseller || `Reseller #${item.id_reseller}`}
                      </p>
                      {item.telepon_reseller && (
                        <p className="text-[10px] text-slate-500 font-mono">
                          {item.telepon_reseller}
                        </p>
                      )}
                    </div>

                    <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">
                        Direferensikan Oleh
                      </span>
                      <p className="text-xs font-bold text-emerald-900 truncate">
                        {item.nama_reference || `Agen #${item.id_reference}`}
                      </p>
                      {item.telepon_reference && (
                        <p className="text-[10px] text-emerald-700 font-mono">
                          {item.telepon_reference}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium mt-3">
                  <span>ID Reseller: {item.id_reseller}</span>
                  <span className="text-emerald-600 font-bold">
                    Ref ID: {item.id_reference}
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