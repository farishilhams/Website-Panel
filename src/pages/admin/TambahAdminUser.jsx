import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../utils/api";
import Header from "../../components/admin/Header";
import { validateUsername, validateEmail, validatePassword, validatePhone } from "../../utils/validators";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  CheckCircle2,
} from "lucide-react";

export default function TambahAdminUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    telpon: "",
    address: "",
    role: "content_admin",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

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
        password_users: formData.password,
        email_users: formData.email,
        telpon_users: formData.telpon,
        address_users: formData.address,
        role: formData.role,
      });

      setSuccessMsg("Akun baru berhasil dibuat!");
      setTimeout(() => {
        navigate("/admin/user");
      }, 1200);
    } catch (err) {
      console.error("Create User Error:", err);
      const msg =
        err.response?.data?.message ||
        "Gagal menambahkan pengguna baru. Silakan periksa kembali data.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <Header />

      <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Top Back Link */}
        <Link
          to="/admin/user"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Manajemen User</span>
        </Link>

        {/* Card Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                Tambah Akun Pengguna Baru
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Buat akun admin atau reseller baru dengan hak akses yang ditentukan
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Masukkan username..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@mpstore.co.id"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  No. Telepon / WA
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="text"
                    name="telpon"
                    value={formData.telpon}
                    onChange={handleChange}
                    placeholder="08123456789"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Role Hak Akses *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Shield size={16} />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition cursor-pointer"
                  >
                    <option value="content_admin">Content Admin</option>
                    <option value="marketing">Marketing</option>
                    <option value="reseller">Reseller</option>
                    <option value="viewer">Viewer</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alamat Domisili
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                  <MapPin size={16} />
                </div>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Jl. Raya Perjuangan No. 45..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kata Sandi (Password) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Link
                to="/admin/user"
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition flex items-center gap-2 disabled:opacity-50"
              >
                {loading && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>Simpan & Buat Akun</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
