import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import AppImage from "./AppImage";
import { X, Sparkles, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * PromoPopup — Modal dialog promosi yang otomatis muncul saat mitra/pengguna
 * membuka portal Reseller atau Viewer jika ada promosi aktif.
 */
export default function PromoPopup() {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchActivePopup = async () => {
      try {
        let res = await api.get("/api/popup?status=1&limit=10");
        let list = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        if (list.length === 0) {
          res = await api.get("/api/popup?limit=10");
          list = Array.isArray(res.data)
            ? res.data
            : res.data?.data || [];
        }

        const activePopup = list.find((p) => {
          const isActive = p.status === "1" || p.status === 1 || p.status === "aktif" || list.length === 1;
          const isDismissed = sessionStorage.getItem(`dismissed_popup_${p.id}`);
          return isActive && !isDismissed;
        }) || (list.length > 0 && !sessionStorage.getItem(`dismissed_popup_${list[0].id}`) ? list[0] : null);

        if (activePopup) {
          setPopup(activePopup);
          setVisible(true);
        }
      } catch (err) {
        console.error("Fetch Promo Popup Error:", err);
      }
    };

    fetchActivePopup();
  }, []);

  const handleDismiss = () => {
    if (popup) {
      sessionStorage.setItem(`dismissed_popup_${popup.id}`, "true");
    }
    setVisible(false);
  };

  if (!popup || !visible) return null;

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-scale-up text-white">
        {/* Top Badges & Close Button */}
        <div className="absolute top-3.5 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black uppercase text-emerald-400 border border-emerald-500/30 pointer-events-auto flex items-center gap-1.5 shadow-md">
            <Sparkles size={12} className="text-emerald-400" />
            <span>PENAWARAN SPESIAL</span>
          </span>
          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-white/20 transition flex items-center justify-center pointer-events-auto cursor-pointer"
            title="Tutup Promosi"
          >
            <X size={16} />
          </button>
        </div>

        {/* Promo Image */}
        <div className="w-full h-56 relative bg-slate-950 overflow-hidden">
          <AppImage
            src={popup.image}
            alt={popup.title}
            category="slider"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 -mt-4 relative z-10 bg-slate-900">
          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-white tracking-tight leading-snug">
              {popup.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
              {popup.deskripsi || popup.description || "Dapatkan promo dan cashback transaksi spesial di aplikasi MPStore sekarang juga!"}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={handleDismiss}
              className="text-xs text-slate-400 hover:text-white transition font-medium"
            >
              Nanti Saja
            </button>

            {popup.link ? (
              <a
                href={popup.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDismiss}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
              >
                <span>Lihat Detail Promo</span>
                <ExternalLink size={13} />
              </a>
            ) : (
              <Link
                to="/promotion"
                onClick={handleDismiss}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
              >
                <span>Lihat Katalog Promo</span>
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
