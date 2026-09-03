import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import AppImage from "./AppImage";
import { X, ChevronLeft, ChevronRight, Sparkles, Compass } from "lucide-react";

/**
 * IntroTourModal — Menampilkan slide perkenalan fitur aplikasi / sambutan interaktif
 * Digunakan oleh:
 * 1. Admin/Content-Admin di /intro untuk "Live Preview Tampilan Pengguna"
 * 2. Pengunjung di SplashScreen ("Lihat Panduan Fitur")
 * 3. Reseller & Viewer di portal mereka ("Tur Fitur")
 */
export default function IntroTourModal({ isOpen, onClose, previewData = null }) {
  const [intros, setIntros] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    if (previewData && previewData.length > 0) {
      setIntros(previewData);
      setCurrentIndex(0);
      setLoading(false);
      return;
    }

    const fetchActiveIntros = async () => {
      setLoading(true);
      try {
        let res = await api.get("/api/intro?limit=10&isActive=Y");
        let list = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        
        if (list.length === 0) {
          res = await api.get("/api/intro?limit=10");
          list = Array.isArray(res.data)
            ? res.data
            : res.data?.data || [];
        }

        const active = list.filter(
          (item) => item.isActive === "Y" || item.status === "1" || item.status === 1 || list.length === 1
        );
        setIntros(active.length > 0 ? active : list);
        setCurrentIndex(0);
      } catch (err) {
        console.error("Fetch Intro Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveIntros();
  }, [isOpen, previewData]);

  if (!isOpen) return null;

  const currentItem = intros[currentIndex] || {
    title: "Selamat Datang di Ekosistem MPStore",
    description: "Platform terpadu untuk kebutuhan pulsa, PPOB, loyalty rewards, dan jaringan mitra UMKM.",
    image: "https://images.unsplash.com/photo-1556742049-0a67e5572263?w=1200&auto=format&fit=crop&q=80",
  };

  const handleNext = () => {
    if (currentIndex < intros.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-scale-up text-white flex flex-col">
        {/* Header Close Button & Step Badge */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-emerald-400 border border-emerald-500/30 pointer-events-auto flex items-center gap-1.5">
            <Compass size={13} />
            <span>Panduan Fitur #{currentIndex + 1} dari {Math.max(1, intros.length)}</span>
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-white/20 transition flex items-center justify-center pointer-events-auto cursor-pointer"
            title="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        {/* Slide Image Showcase */}
        <div className="w-full h-64 sm:h-72 relative bg-slate-950 overflow-hidden">
          <AppImage
            src={currentItem.image}
            alt={currentItem.title}
            category="slider"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        {/* Slide Text Content */}
        <div className="p-6 sm:p-8 space-y-4 -mt-6 relative z-10 bg-slate-900 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {currentItem.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentItem.description}
            </p>
          </div>

          {/* Dots Indicator */}
          {intros.length > 1 && (
            <div className="flex items-center justify-center gap-2 py-2">
              {intros.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? "w-7 bg-emerald-500 shadow-md shadow-emerald-500/50"
                      : "w-2 bg-slate-700 hover:bg-slate-600"
                  }`}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Sebelumnya</span>
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <span>{currentIndex === intros.length - 1 ? "Selesai & Mulai" : "Selanjutnya"}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
