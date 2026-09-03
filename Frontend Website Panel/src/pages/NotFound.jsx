import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Compass } from "lucide-react";
import MPStoreLogo from "../components/MPStoreLogo";
import { getAuthToken, getAuthRole } from "../utils/authHelper";

export default function NotFound() {
  const navigate = useNavigate();
  const token = getAuthToken();
  const role = getAuthRole() || "viewer";

  const getHomeRedirect = () => {
    if (!token) return "/login";
    switch (role) {
      case "super_admin":
        return "/dashboard";
      case "content_admin":
        return "/content-admin/dashboard";
      case "marketing":
        return "/marketing/dashboard";
      case "reseller":
        return "/reseller/dashboard";
      case "viewer":
        return "/viewer/dashboard";
      default:
        return "/login";
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-white font-sans relative overflow-hidden select-none"
      style={{
        background: "linear-gradient(135deg, #0A0D14 0%, #0d1528 50%, #0A0D14 100%)",
      }}
    >
      {/* Background Animated Glows */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl animate-orb"
        style={{ background: "radial-gradient(circle, #0033CC 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl animate-orb"
        style={{ background: "radial-gradient(circle, #00BB33 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-lg w-full text-center space-y-6 animate-scale-up">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <MPStoreLogo size={42} showText={true} textColor="white" />
        </div>

        {/* 404 Visual Icon */}
        <div className="relative inline-flex items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
          <span className="text-7xl sm:text-8xl font-black tracking-tight drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400">
            404
          </span>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tautan yang Anda masukkan tidak valid.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </button>
          <Link
            to={getHomeRedirect()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
          >
            <Home size={16} />
            <span>Ke Halaman Utama</span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 text-xs text-slate-600 font-medium">
        © {new Date().getFullYear()} MPStore. Seluruh hak cipta dilindungi.
      </div>
    </div>
  );
}
