import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import { Flame, Radio } from "lucide-react";

/**
 * RunningTextTicker — Menampilkan siaran teks berjalan (Running Text)
 * yang dikelola oleh Marketing & Super Admin di /runnings.
 * Tampil di atas layar untuk portal Reseller dan Viewer.
 */
export default function RunningTextTicker({ variant = "emerald" }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchRunnings = async () => {
      try {
        const res = await api.get("/api/runnings?limit=5");
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        const active = list.filter(
          (item) => item.status === "1" || item.status === 1 || item.status === "aktif"
        );
        setItems(active.length > 0 ? active : list.slice(0, 10));
      } catch (err) {
        console.error("Fetch Running Text Error:", err);
      }
    };

    fetchRunnings();
  }, []);

  if (items.length === 0) return null;

  const tickerText = items.map((i) => i.text || i.name).join("   ✦   ");

  const isEmerald = variant === "emerald";

  return (
    <div
      className={`w-full py-2 px-4 border-b flex items-center gap-3 overflow-hidden select-none ${isEmerald
        ? "bg-slate-950/90 border-slate-800 text-emerald-300"
        : "bg-slate-950/90 border-slate-800 text-blue-300"
        }`}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-sm ${isEmerald
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            }`}
        >
          <Radio size={11} className="animate-pulse" />
          <span>INFO TERKINI</span>
        </span>

        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="inline-block animate-marquee font-medium text-xs">
            {tickerText}
          </div>
        </div>
      </div>
    </div>
  );
}
