import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Shield,
  Smartphone,
  Gift,
  MapPin,
  Store,
} from "lucide-react";
import MPStoreLogo from "../components/MPStoreLogo";

import { setAuthSession } from "../utils/authHelper";

// Business Ecosystem Cards (Menampilkan apa yang ada di ekosistem MPStore)
const STAT_CARDS = [
  { icon: Smartphone, label: "Layanan Transaksi", value: "Pulsa & PPOB Terlengkap", color: "#0033CC" },
  { icon: Gift, label: "Program Loyalitas", value: "Poin & Hadiah Eksklusif", color: "#00BB33" },
  { icon: MapPin, label: "Jaringan Distribusi", value: "Gerai M-Point Tersebar", color: "#F59E0B" },
  { icon: Store, label: "Ekosistem Usaha", value: "Solusi Kasir & Toko UMKM", color: "#8B5CF6" },
];

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await api.post("/api/user/login", {
        email_users: formData.username.trim(),
        password_users: formData.password,
      });
      const { token, role, username, id_users } = response.data;
      if (!token || !role) throw new Error("Respon server tidak valid.");
      setAuthSession({
        token,
        role,
        username: username || formData.username,
        id_users,
      });
      navigate("/redirect");
    } catch (err) {
      console.error("Login Error:", err);
      const msg =
        err.response?.data?.message ||
        "Gagal masuk. Periksa kembali username dan password Anda.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0A0D14] text-slate-100 overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* =========================================
          LEFT PANEL — Brand & Animated Showcase
          ========================================= */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-1/2 relative flex-col justify-between overflow-hidden p-10 xl:p-14">

        {/* Animated Background Orbs */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,51,204,0.25) 0%, transparent 70%)",
            animation: "orbDrift 10s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,187,51,0.2) 0%, transparent 70%)",
            animation: "orbDrift 14s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(0,33,102,0.6) 0%, transparent 70%)",
          }}
        />

        {/* Grid overlay pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top Logo */}
        <div
          className="relative z-10"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease" }}
        >
          <MPStoreLogo size={44} showText={true} textColor="white" />
        </div>

        {/* Center Content */}
        <div
          className="relative z-10 space-y-8"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0)" : "translateX(-20px)",
            transition: "all 0.7s ease 0.2s",
          }}
        >
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold" style={{ borderColor: "rgba(0,187,51,0.4)", background: "rgba(0,187,51,0.08)", color: "#00BB33" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Portal Manajemen Bisnis MPStore
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Pusat Kendali{" "}
              <span style={{ color: "#0033CC" }}>Modern</span>{" "}
              &{" "}
              <span style={{ color: "#00BB33" }}>Terpadu</span>
            </h2>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-md">
              Kelola konten berita, banner slider promosi, katalog hadiah rewards poin loyalty, titik gerai mitra, dan masukan komunitas dalam satu dashboard yang aman dan terpusat.
            </p>
          </div>

          {/* Animated Stat Cards */}
          <div className="grid grid-cols-2 gap-3">
            {STAT_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-4 flex items-start gap-3 card-hover"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(12px)",
                    transition: `all 0.6s ease ${0.3 + i * 0.1}s`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${card.color}22`, border: `1px solid ${card.color}44` }}
                  >
                    <Icon size={18} style={{ color: card.color }} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium leading-tight">{card.label}</p>
                    <p className="text-sm font-extrabold text-white mt-0.5">{card.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature Bullets */}
          <div className="flex flex-wrap gap-2">
            {[
              "Manajemen Konten & Media",
              "Program Rewards & Poin",
              "Jaringan Mitra M-Point",
              "Pohon Referral Reseller",
            ].map((feat, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <CheckCircle2 size={12} style={{ color: "#00BB33" }} />
                {feat}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 text-xs text-slate-600">
          © {new Date().getFullYear()} MPStore. Seluruh hak cipta dilindungi.
        </div>
      </div>

      {/* =========================================
          RIGHT PANEL — Login Form
          ========================================= */}
      <div
        className="w-full lg:w-[48%] xl:w-1/2 flex items-center justify-center p-6 sm:p-10 relative"
        style={{ background: "linear-gradient(160deg, #0f1623 0%, #0A0D14 60%, #0a1020 100%)" }}
      >
        {/* Subtle border left divider on lg+ */}
        <div className="hidden lg:block absolute left-0 inset-y-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,51,204,0.4) 30%, rgba(0,187,51,0.3) 70%, transparent)" }} />

        <div
          className="w-full max-w-md"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0)" : "translateX(20px)",
            transition: "all 0.7s ease 0.15s",
          }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <MPStoreLogo size={40} showText={true} textColor="white" />
          </div>

          {/* Card */}
          <div
            className="rounded-3xl p-8 sm:p-10 space-y-7"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Selamat Datang Kembali 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Masukkan kredensial akun Anda untuk mengakses panel MPStore.
              </p>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div
                className="p-4 rounded-2xl text-xs flex items-center gap-3 animate-fade-in"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5" }}
              >
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Username / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-500" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    spellCheck="false"
                    placeholder="Masukkan username atau email"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium text-white placeholder-slate-500"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#ffffff",
                      WebkitTextFillColor: "#ffffff",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0033CC";
                      e.target.style.boxShadow = "0 0 0 3px rgba(0,51,204,0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.12)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-400">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Untuk pemulihan atau reset kata sandi, silakan hubungi tim Super Admin MPStore atau perbarui kata sandi mandiri melalui menu Edit Profil di dalam panel akun Anda."
                      )
                    }
                    className="text-xs font-semibold transition cursor-pointer"
                    style={{ color: "#3B82F6" }}
                    onMouseEnter={(e) => (e.target.style.color = "#60A5FA")}
                    onMouseLeave={(e) => (e.target.style.color = "#3B82F6")}
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={16} className="text-slate-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    placeholder="Masukkan kata sandi"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm font-medium text-white placeholder-slate-500"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#ffffff",
                      WebkitTextFillColor: "#ffffff",
                      outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0033CC";
                      e.target.style.boxShadow = "0 0 0 3px rgba(0,51,204,0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.12)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-login-submit"
                type="submit"
                disabled={loading}
                className="btn-mp-blue w-full py-4 rounded-xl text-sm flex items-center justify-center gap-2.5 shadow-lg"
                style={{
                  boxShadow: "0 8px 24px rgba(0,51,204,0.35)",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <>
                    <div
                      className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
                    />
                    <span>Sedang Masuk...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="text-xs text-slate-600 font-medium">atau</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-xs text-slate-500">
                Belum memiliki akun?{" "}
                <Link
                  to="/register"
                  className="font-bold transition"
                  style={{ color: "#00BB33" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00DD44")}
                  onMouseLeave={(e) => (e.target.style.color = "#00BB33")}
                >
                  Daftar Sebagai Mitra Baru
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Note */}
          <p className="text-center text-xs text-slate-700 mt-6">
            Dengan masuk, Anda menyetujui{" "}
            <span style={{ color: "rgba(0,51,204,0.7)" }}>Syarat & Ketentuan</span>{" "}
            MPStore.
          </p>
        </div>
      </div>
    </div>
  );
}
