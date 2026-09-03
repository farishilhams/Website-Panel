import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ShieldCheck,
  Store,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import MPStoreLogo from "../components/MPStoreLogo";
import { validateUsername, validateEmail, validatePassword, validatePhone } from "../utils/validators";

const BENEFIT_VIEWER = [
  "Baca berita & artikel terbaru",
  "Lihat program promosi aktif",
  "Pantau katalog rewards",
];
const BENEFIT_RESELLER = [
  "Tukar poin dengan hadiah eksklusif",
  "Akses katalog mitra rewards",
  "Kelola pohon referral Anda",
];

const InputField = ({ label, icon: Icon, required = false, error, children, ...inputProps }) => (
  <div>
    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#94A3B8" }}>
      {label} {required && <span style={{ color: "#F87171" }}>*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon size={15} className="text-slate-500" />
        </div>
      )}
      {children || (
        <input
          {...inputProps}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl text-sm font-medium text-white transition`}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: `1px solid ${error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.12)"}`,
            color: "#ffffff",
            WebkitTextFillColor: "#ffffff",
            outline: "none",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#0033CC";
            e.target.style.boxShadow = "0 0 0 3px rgba(0,51,204,0.18)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.09)";
            e.target.style.boxShadow = "none";
          }}
        />
      )}
    </div>
    {error && <p className="text-xs mt-1" style={{ color: "#F87171" }}>{error}</p>}
  </div>
);

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "", email: "", password: "",
    telpon: "", address: "", role: "viewer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Sisi Klien: Validasi Komprehensif
    const uErr = validateUsername(formData.username);
    if (uErr) { setErrorMsg(uErr); return; }
    const eErr = validateEmail(formData.email);
    if (eErr) { setErrorMsg(eErr); return; }
    const pErr = validatePassword(formData.password);
    if (pErr) { setErrorMsg(pErr); return; }
    const phErr = validatePhone(formData.telpon);
    if (phErr) { setErrorMsg(phErr); return; }

    setLoading(true);
    try {
      await api.post("/api/user/register", {
        username_users: formData.username,
        email_users: formData.email,
        password_users: formData.password,
        telpon_users: formData.telpon,
        address_users: formData.address,
        role: formData.role,
      });
      setSuccessMsg("Pendaftaran berhasil! Mengarahkan ke halaman login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Pendaftaran gagal. Silakan periksa kembali data Anda.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const isReseller = formData.role === "reseller";
  const benefits = isReseller ? BENEFIT_RESELLER : BENEFIT_VIEWER;

  return (
    <div
      className="min-h-screen w-full flex bg-[#0A0D14] overflow-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ===================== LEFT PANEL ===================== */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] relative flex-col justify-between p-10 xl:p-14 overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,51,204,0.22) 0%, transparent 70%)", animation: "orbDrift 9s ease-in-out infinite" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,187,51,0.18) 0%, transparent 70%)", animation: "orbDrift 12s ease-in-out infinite reverse" }} />
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Top Logo */}
        <div className="relative z-10" style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s" }}>
          <MPStoreLogo size={42} showText={true} textColor="white" />
        </div>

        {/* Center */}
        <div className="relative z-10 space-y-8"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateX(-20px)", transition: "all 0.7s ease 0.2s" }}>
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: "rgba(0,187,51,0.1)", border: "1px solid rgba(0,187,51,0.3)", color: "#00BB33" }}>
              <UserPlus size={13} /> Daftar Mitra Baru
            </span>
            <h2 className="text-4xl font-black text-white leading-tight">
              Bergabunglah Bersama{" "}
              <span style={{ color: "#00BB33" }}>Komunitas</span>{" "}
              <span style={{ color: "#0033CC" }}>MPStore</span>
            </h2>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Pilih tipe akun sesuai kebutuhan Anda — pantau berita sebagai Viewer atau maksimalkan penghasilan sebagai Mitra Reseller.
            </p>
          </div>

          {/* Dynamic Benefits */}
          <div className="rounded-2xl p-5 space-y-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Keuntungan {isReseller ? "Mitra Reseller" : "Akun Viewer"}
            </p>
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2.5"
                style={{ opacity: mounted ? 1 : 0, transition: `opacity 0.5s ease ${0.4 + i * 0.1}s` }}>
                <CheckCircle2 size={15} style={{ color: isReseller ? "#00BB33" : "#0033CC", flexShrink: 0 }} />
                <span className="text-sm text-slate-300 font-medium">{b}</span>
              </div>
            ))}
          </div>

          {/* Role Preview */}
          <div className="flex gap-3">
            <div className="flex-1 rounded-xl p-3 text-center transition"
              style={{ background: !isReseller ? "rgba(0,51,204,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${!isReseller ? "rgba(0,51,204,0.4)" : "rgba(255,255,255,0.07)"}` }}>
              <ShieldCheck size={20} className="mx-auto mb-1.5" style={{ color: !isReseller ? "#0033CC" : "#4B5563" }} />
              <p className="text-xs font-bold text-white">Viewer</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Pantau & baca</p>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center transition"
              style={{ background: isReseller ? "rgba(0,187,51,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${isReseller ? "rgba(0,187,51,0.4)" : "rgba(255,255,255,0.07)"}` }}>
              <Store size={20} className="mx-auto mb-1.5" style={{ color: isReseller ? "#00BB33" : "#4B5563" }} />
              <p className="text-xs font-bold text-white">Reseller</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Rewards & referral</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-700">
          © {new Date().getFullYear()} MPStore. Seluruh hak cipta dilindungi.
        </div>
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-px self-stretch"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(0,51,204,0.4) 30%, rgba(0,187,51,0.3) 70%, transparent)" }} />

      {/* ===================== RIGHT PANEL — Form ===================== */}
      <div
        className="w-full lg:flex-1 flex items-center justify-center p-5 sm:p-8 overflow-y-auto"
        style={{ background: "linear-gradient(160deg, #0f1623 0%, #0A0D14 100%)" }}
      >
        <div className="w-full max-w-md py-6"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateX(20px)", transition: "all 0.7s ease 0.15s" }}>
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <MPStoreLogo size={40} showText={true} textColor="white" />
          </div>

          {/* Card */}
          <div className="rounded-3xl p-7 sm:p-9 space-y-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", boxShadow: "0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" }}>

            {/* Header */}
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Buat Akun Baru ✨
              </h1>
              <p className="text-xs text-slate-500 mt-1.5">Lengkapi form di bawah ini untuk mendaftar.</p>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl text-xs flex items-center gap-2.5 animate-fade-in"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5" }}>
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success */}
            {successMsg && (
              <div className="p-3.5 rounded-2xl text-xs flex items-center gap-2.5 animate-fade-in"
                style={{ background: "rgba(0,187,51,0.08)", border: "1px solid rgba(0,187,51,0.25)", color: "#6EE7B7" }}>
                <CheckCircle2 size={15} style={{ color: "#00BB33", flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selector */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "#94A3B8" }}>
                  Tipe Akun
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "viewer", label: "Viewer / Tamu", sub: "Pantau berita & promo", icon: ShieldCheck, color: "#0033CC" },
                    { value: "reseller", label: "Mitra Reseller", sub: "Rewards & referral", icon: Store, color: "#00BB33" },
                  ].map(({ value, label, sub, icon: Icon, color }) => {
                    const active = formData.role === value;
                    return (
                      <button key={value} type="button"
                        onClick={() => setFormData({ ...formData, role: value })}
                        className="p-3.5 rounded-2xl text-left transition"
                        style={{
                          background: active ? `${color}18` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${active ? `${color}55` : "rgba(255,255,255,0.07)"}`,
                          boxShadow: active ? `0 0 18px ${color}22` : "none",
                        }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <Icon size={16} style={{ color: active ? color : "#4B5563" }} />
                          {active && <div className="w-2 h-2 rounded-full" style={{ background: color }} />}
                        </div>
                        <p className="text-xs font-bold text-white">{label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid 2 col for username/email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Username" icon={User} required name="username" value={formData.username} onChange={handleChange} placeholder="Masukkan username" />
                <InputField label="Email" icon={Mail} required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Masukkan email" />
              </div>

              {/* Phone */}
              <InputField label="No. Telepon / WA" icon={Phone} type="text" name="telpon" value={formData.telpon} onChange={handleChange} placeholder="Masukkan nomor telepon / WhatsApp" />

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#94A3B8" }}>Alamat Lengkap</label>
                <div className="relative">
                  <div className="absolute top-3 left-3.5 pointer-events-none">
                    <MapPin size={15} className="text-slate-500" />
                  </div>
                  <textarea name="address" rows={2} value={formData.address} onChange={handleChange}
                    placeholder="Masukkan alamat lengkap..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium resize-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "white", outline: "none" }}
                    onFocus={(e) => { e.target.style.borderColor = "#0033CC"; e.target.style.boxShadow = "0 0 0 3px rgba(0,51,204,0.18)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#94A3B8" }}>
                  Password <span style={{ color: "#F87171" }}>*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock size={15} className="text-slate-500" />
                  </div>
                  <input type={showPassword ? "text" : "password"} name="password" required
                    value={formData.password} onChange={handleChange} placeholder="Masukkan kata sandi"
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm font-medium"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "white", outline: "none" }}
                    onFocus={(e) => { e.target.style.borderColor = "#0033CC"; e.target.style.boxShadow = "0 0 0 3px rgba(0,51,204,0.18)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.boxShadow = "none"; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button id="btn-register-submit" type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2.5 mt-2 transition"
                style={{
                  background: isReseller
                    ? "linear-gradient(135deg, #00BB33, #00DD44)"
                    : "linear-gradient(135deg, #0033CC, #2255EE)",
                  color: "white",
                  boxShadow: isReseller
                    ? "0 8px 24px rgba(0,187,51,0.3)"
                    : "0 8px 24px rgba(0,51,204,0.3)",
                  opacity: loading ? 0.7 : 1,
                }}>
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white" style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <>
                    <span>{isReseller ? "Daftar sebagai Reseller" : "Daftar sebagai Viewer"}</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-xs text-slate-600">
              Sudah punya akun?{" "}
              <Link to="/login" className="font-bold transition" style={{ color: "#0033CC" }}
                onMouseEnter={(e) => (e.target.style.color = "#2255EE")}
                onMouseLeave={(e) => (e.target.style.color = "#0033CC")}>
                Masuk di Sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
