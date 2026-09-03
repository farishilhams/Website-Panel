import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../utils/authHelper";

/**
 * SplashScreen — Halaman loading / sambutan utama di http://localhost:5173
 * Background diselaraskan dengan tema halaman Login / Register (Deep Dark #0A0D14
 * dengan orb glowing biru & hijau MPStore), tanpa tombol "Mulai Sekarang",
 * dan dilengkapi progress bar otomatis yang mulus.
 */
export default function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleProceed = () => {
    setIsExiting(true);
    setTimeout(() => {
      const token = getAuthToken();
      if (token) {
        navigate("/redirect", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }, 400);
  };

  useEffect(() => {
    // Progress bar auto increment (0 -> 100% over ~3.2s)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.4;
      });
    }, 35);

    // Auto-advance setelah progress selesai
    const timer = setTimeout(() => {
      handleProceed();
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden font-sans transition-all duration-500 select-none ${isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      style={{
        background: "linear-gradient(135deg, #07090E 0%, #0A0D14 50%, #0F131D 100%)",
      }}
    >
      {/* Background Animated Subtle Glows — Selaras dengan Login/Register */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(0, 51, 204, 0.35) 0%, transparent 70%)",
          animation: "orbDrift 10s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none opacity-35 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(0, 187, 51, 0.3) 0%, transparent 70%)",
          animation: "orbDrift 12s ease-in-out infinite reverse",
        }}
      />

      {/* Decorative Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-xl w-full px-6 flex flex-col items-center text-center animate-fade-in">

        {/* Emblem Logo with Soft Glow Card */}
        <div className="mb-6 relative">
          <div
            className="absolute -inset-4 rounded-3xl blur-2xl animate-pulse"
            style={{
              background: "linear-gradient(135deg, rgba(0,51,204,0.4), rgba(0,187,51,0.4))",
            }}
          />
          <div
            className="relative p-4 rounded-3xl backdrop-blur-xl shadow-2xl transition-transform duration-300 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <img
              src="/assets/mpstore-icon.png"
              alt="MPStore Emblem"
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Headline Group — Tata Letak Rapi, Seimbang & Proporsional */}
        <div className="mb-4 space-y-1">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
            Selamat Datang di Website Panel
          </h1>
          <div className="pt-1">
            <span className="text-4xl sm:text-6xl font-black tracking-tight drop-shadow-lg inline-flex items-center">
              <span style={{ color: "#3B82F6" }}>MP</span>
              <span style={{ color: "#10B981" }}>Store</span>
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-300 font-medium tracking-wide max-w-md mb-8 drop-shadow">
          Portal Pusat Manajemen Operasional Bisnis, Promosi, & Mitra MPStore
        </p>

        {/* Smooth Progress Bar & Status */}
        <div className="w-full max-w-xs space-y-2.5">
          <div
            className="w-full h-2 rounded-full overflow-hidden p-0.5"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-100 ease-out"
              style={{
                width: `${Math.min(100, progress)}%`,
                background: "linear-gradient(90deg, #0033CC 0%, #00BB33 100%)",
                boxShadow: "0 0 14px rgba(0, 187, 51, 0.7)",
              }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 px-1">
            <span>
              {progress < 40
                ? "Memuat konfigurasi sistem..."
                : progress < 85
                  ? "Menyiapkan portal..."
                  : "Siap digunakan"}
            </span>
            <span className="text-emerald-400 font-bold">{Math.round(Math.min(100, progress))}%</span>
          </div>
        </div>

      </div>

      {/* Footer copyright */}
      <div className="absolute bottom-4 text-center text-xs font-medium text-slate-500 tracking-wide">
        © {new Date().getFullYear()} MPStore. Seluruh hak cipta dilindungi.
      </div>
    </div>
  );
}
