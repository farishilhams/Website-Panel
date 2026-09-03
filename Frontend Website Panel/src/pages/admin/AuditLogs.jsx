import { useState, useEffect } from "react";
import Header from "../../components/admin/Header";
import ConfirmModal from "../../components/shared/ConfirmModal";
import { getAuditLogs, clearAuditLogs, recordAuditLog } from "../../utils/auditLogger";
import { exportToCSV } from "../../utils/exportUtils";
import {
  History,
  Search,
  Download,
  Trash2,
  ShieldCheck,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
} from "lucide-react";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [clearModalOpen, setClearModalOpen] = useState(false);

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const handleExport = () => {
    exportToCSV(
      logs,
      "Log_Audit_MPStore",
      [
        { key: "id", label: "Log ID" },
        { key: "timestamp", label: "Waktu (UTC)" },
        { key: "actor", label: "Pengguna" },
        { key: "role", label: "Peran" },
        { key: "action", label: "Jenis Aksi" },
        { key: "target", label: "Detail Objek / Data" },
        { key: "status", label: "Status" },
        { key: "ip", label: "Alamat IP" },
      ]
    );
    recordAuditLog("EXPORT_REPORT", "Ekspor File Log Audit Sistem");
    setLogs(getAuditLogs());
  };

  const handleClear = () => {
    clearAuditLogs();
    setLogs([]);
    setClearModalOpen(false);
  };

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      !searchTerm ||
      log.actor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchAction =
      actionFilter === "ALL" ||
      (actionFilter === "AUTH" && log.action.includes("LOGIN")) ||
      (actionFilter === "DATA" && (log.action.includes("UPDATE") || log.action.includes("CREATE"))) ||
      (actionFilter === "DELETE" && log.action.includes("DELETE")) ||
      (actionFilter === "SYSTEM" && (log.action.includes("SYSTEM") || log.action.includes("EXPORT")));

    return matchSearch && matchAction;
  });

  const getActionBadge = (action) => {
    if (action.includes("LOGIN")) {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }
    if (action.includes("CREATE") || action.includes("UPDATE")) {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
    if (action.includes("DELETE")) {
      return "bg-rose-100 text-rose-700 border-rose-200";
    }
    return "bg-purple-100 text-purple-700 border-purple-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <Header />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
              <History className="text-indigo-600" />
              <span>Log Audit & Aktivitas Sistem</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Catatan riwayat rekam jejak operasional, perubahan data, dan autentikasi untuk akuntabilitas sistem MPStore
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Ekspor Log (CSV)</span>
            </button>
            <button
              onClick={() => setClearModalOpen(true)}
              className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Bersihkan riwayat log"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Bersihkan Log</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoComplete="off"
              spellCheck="false"
              placeholder="Cari user, aksi, atau detail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Action Filter Pills */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {[
              { id: "ALL", label: "Semua Aksi" },
              { id: "AUTH", label: "Autentikasi" },
              { id: "DATA", label: "Perubahan Data" },
              { id: "DELETE", label: "Penghapusan" },
              { id: "SYSTEM", label: "Sistem & Ekspor" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActionFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  actionFilter === f.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Log ID</th>
                  <th className="py-3.5 px-4">Waktu</th>
                  <th className="py-3.5 px-4">Pengguna (Actor)</th>
                  <th className="py-3.5 px-4">Aktivitas</th>
                  <th className="py-3.5 px-4">Objek / Detail</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Activity size={32} className="mx-auto text-slate-300 mb-2" />
                      Belum ada catatan aktivitas yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600 text-[11px]">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-slate-400" />
                          <span>
                            {new Date(item.timestamp).toLocaleString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                            {item.actor.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold">{item.actor}</span>
                            <span className="block text-[10px] text-slate-400 uppercase font-mono">
                              {item.role}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold border ${getActionBadge(
                            item.action
                          )}`}
                        >
                          {item.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600 max-w-xs truncate">
                        {item.target}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 size={12} />
                          <span>Berhasil</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Clear Logs Modal */}
      <ConfirmModal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        onConfirm={handleClear}
        title="Bersihkan Log Audit"
        message="Apakah Anda yakin ingin mengosongkan seluruh riwayat log aktivitas? Tindakan ini tidak dapat dibatalkan."
        confirmText="Bersihkan Semua"
      />
    </div>
  );
}
