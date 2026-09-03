import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import Header from "../../components/admin/Header";
import {
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Zap,
  ShieldCheck,
  Radio,
  Layers,
} from "lucide-react";

export default function SystemHealthPage() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [cleaningCache, setCleaningCache] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3500);
  };

  const fetchHealthData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await api.get("/api/system/health");
      setHealthData(res.data);
    } catch (err) {
      console.error("System Health Fetch Error:", err);
      showToast("Gagal memuat status kesehatan server", "error");
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  // Auto-refresh interval per 10 detik
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchHealthData(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleClearCache = async () => {
    setCleaningCache(true);
    try {
      await api.post("/api/system/clear-cache");
      showToast("Cache server berhasil dibersihkan!");
      fetchHealthData(true);
    } catch (err) {
      showToast("Gagal membersihkan cache server", "error");
    } finally {
      setCleaningCache(false);
    }
  };

  const memoryPercent = healthData
    ? Math.min(
        100,
        Math.round(
          (healthData.memory.heap_used_mb / healthData.memory.heap_total_mb) *
            100
        )
      )
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 pb-16">
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
        {/* Header Title & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
              <Activity size={26} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Kesehatan Sistem & Server Monitor
                </h1>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Monitor
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Pantau latensi database, penggunaan RAM, uptime, dan performa infrastruktur server secara real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Toggle Auto Refresh */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                autoRefresh
                  ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              <Radio size={14} className={autoRefresh ? "animate-pulse" : ""} />
              <span>Auto-Sync 10s: {autoRefresh ? "ON" : "OFF"}</span>
            </button>

            {/* Manual Refresh */}
            <button
              onClick={() => fetchHealthData()}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              title="Perbarui data sekarang"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>

            {/* Clear Cache */}
            <button
              onClick={handleClearCache}
              disabled={cleaningCache}
              className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-500/10"
            >
              <Trash2 size={14} />
              <span>{cleaningCache ? "Membersihkan..." : "Bersihkan Cache"}</span>
            </button>
          </div>
        </div>

        {loading && !healthData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-slate-900 rounded-3xl border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Top 4 Key Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Database Status */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    Koneksi Database
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Database size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white flex items-center gap-2">
                    <span>{healthData?.database.status}</span>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supabase PostgreSQL ({healthData?.database.latency_ms} ms ping)
                  </p>
                </div>
              </div>

              {/* Server Latency */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    Respons API Backend
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                    <Zap size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white">
                    {healthData?.system.response_time_ms} ms
                  </div>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                    Kecepatan Optimal (&lt; 100ms)
                  </p>
                </div>
              </div>

              {/* Node.js Heap Memory */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    Beban RAM Node.js
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                    <Cpu size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white">
                    {healthData?.memory.heap_used_mb} MB
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${memoryPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {memoryPercent}% dari total alokasi ({healthData?.memory.heap_total_mb} MB)
                  </p>
                </div>
              </div>

              {/* Server Uptime */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    Waktu Aktif (Uptime)
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white">
                    {healthData?.system.uptime_formatted}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tanpa gangguan crash
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed System Specifications Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Server & Runtime Environment */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Server size={18} className="text-blue-400" />
                  <span>Spesifikasi Lingkungan Server</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">Layanan Backend</span>
                    <span className="font-bold text-white">
                      {healthData?.system.server_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">Versi Node.js</span>
                    <span className="font-bold text-emerald-400">
                      {healthData?.system.node_version}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">Platform Sistem Operasi</span>
                    <span className="font-bold text-white">
                      {healthData?.system.platform}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">Jumlah Inti CPU (Cores)</span>
                    <span className="font-bold text-white">
                      {healthData?.system.cpu_cores} Inti Pemroses
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">Lingkungan Operasional</span>
                    <span className="font-bold text-blue-400 uppercase">
                      {healthData?.system.environment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Infrastructure & Storage Status */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HardDrive size={18} className="text-purple-400" />
                  <span>Kapasitas Memori & Penyimpanan</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">RAM Fisik Sistem Bebas</span>
                    <span className="font-bold text-emerald-400">
                      {healthData?.memory.free_system_ram_mb} MB Bebas
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">Total Kapasitas RAM Server</span>
                    <span className="font-bold text-white">
                      {healthData?.memory.total_system_ram_mb} MB
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">Alokasi RSS Memori Node.js</span>
                    <span className="font-bold text-purple-400">
                      {healthData?.memory.rss_mb} MB
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">Penyimpanan Berkas Lokal</span>
                    <span className="font-bold text-white">
                      {healthData?.storage.local_uploads_count} Berkas Tersimpan
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">Cloud Storage Terhubung</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck size={14} />
                      {healthData?.storage.cloud_storage}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
