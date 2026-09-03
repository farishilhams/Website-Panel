import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import { getAuthUserId, getAuthUsername, getAuthRole } from "../../utils/authHelper";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

// Curated avatar styles (preset color gradients & icons)
const AVATAR_PRESETS = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-purple-600 to-pink-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-blue-600",
];

export default function EditProfileModal({ isOpen, onClose, onProfileUpdated }) {
  const userId = getAuthUserId();
  const currentRole = getAuthRole() || "viewer";

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    username_users: "",
    email_users: "",
    telpon_users: "",
    address_users: "",
    password_users: "",
  });

  const [selectedAvatar, setSelectedAvatar] = useState(
    localStorage.getItem(`mp_user_avatar_preset_${userId}`) || AVATAR_PRESETS[0]
  );
  const [customAvatarUrl, setCustomAvatarUrl] = useState(
    localStorage.getItem(`mp_user_avatar_custom_${userId}`) || ""
  );

  // Load existing profile when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      setError("");
      setSuccess("");
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    setFetching(true);
    try {
      const res = await api.get(`/api/user/profile/${userId}`);
      const user = res.data;
      if (user) {
        setFormData({
          username_users: user.username_users || "",
          email_users: user.email_users || "",
          telpon_users: user.telpon_users || "",
          address_users: user.address_users || "",
          password_users: "",
        });
        if (user.avatar_custom) {
          setCustomAvatarUrl(user.avatar_custom);
          localStorage.setItem(`mp_user_avatar_custom_${userId}`, user.avatar_custom);
        } else {
          setCustomAvatarUrl("");
          localStorage.removeItem(`mp_user_avatar_custom_${userId}`);
        }
        if (user.avatar_preset) {
          setSelectedAvatar(user.avatar_preset);
          localStorage.setItem(`mp_user_avatar_preset_${userId}`, user.avatar_preset);
        }
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      // Fallback to session username if API fails
      setFormData((prev) => ({
        ...prev,
        username_users: getAuthUsername() || "",
      }));
    } finally {
      setFetching(false);
    }
  };

  // Handle custom image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Hanya file gambar (JPG, PNG, WEBP) yang diperbolehkan.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto maksimal 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setCustomAvatarUrl(base64);
      localStorage.setItem(`mp_user_avatar_custom_${userId}`, base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset) => {
    setSelectedAvatar(preset);
    setCustomAvatarUrl("");
    localStorage.setItem(`mp_user_avatar_preset_${userId}`, preset);
    localStorage.removeItem(`mp_user_avatar_custom_${userId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.username_users.trim()) {
      setError("Nama pengguna (username) wajib diisi.");
      return;
    }

    if (!formData.email_users.trim()) {
      setError("Alamat email wajib diisi.");
      return;
    }

    if (formData.password_users && formData.password_users.length < 6) {
      setError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username_users: formData.username_users.trim(),
        email_users: formData.email_users.trim(),
        telpon_users: formData.telpon_users.trim(),
        address_users: formData.address_users.trim(),
        avatar_custom: customAvatarUrl || "",
        avatar_preset: selectedAvatar || "from-blue-600 to-indigo-600",
      };

      if (formData.password_users && formData.password_users.trim()) {
        payload.password_users = formData.password_users.trim();
      }

      await api.put(`/api/user/update/${userId}`, payload);

      // Update sessionStorage so header and navbars reflect the new username immediately
      sessionStorage.setItem("username", formData.username_users.trim());

      // Update localStorage avatar cache
      if (customAvatarUrl) {
        localStorage.setItem(`mp_user_avatar_custom_${userId}`, customAvatarUrl);
      } else {
        localStorage.removeItem(`mp_user_avatar_custom_${userId}`);
      }
      localStorage.setItem(`mp_user_avatar_preset_${userId}`, selectedAvatar || "from-blue-600 to-indigo-600");

      // Broadcast event to notify Header, ResellerNavbar, ViewerNavbar, Sidebar
      window.dispatchEvent(
        new CustomEvent("user-profile-updated", {
          detail: {
            username: formData.username_users.trim(),
            avatarPreset: selectedAvatar,
            avatarCustom: customAvatarUrl,
          },
        })
      );

      setSuccess("Profil Anda berhasil diperbarui!");
      if (onProfileUpdated) onProfileUpdated(formData.username_users.trim());

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Update profile error:", err);
      const msg =
        err.response?.data?.message ||
        "Gagal memperbarui profil. Periksa kembali isian Anda.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center min-h-screen">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card — Pinned Header, Scrollable Body, Pinned Footer */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-10 animate-scale-up font-sans my-auto flex flex-col max-h-[88vh]">
        {/* Header Bar with MPStore theme (Pinned Top) */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                Edit Profil Saya
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                Peran: <strong className="text-blue-600 dark:text-blue-400">{(currentRole || "viewer").replace(/_/g, " ")}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        {fetching ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={32} className="animate-spin text-blue-600 mb-3" />
            <p className="text-xs font-medium">Memuat data profil...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
            {/* Scrollable Form Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              {/* Alerts */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-400">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{success}</span>
                </div>
              )}

            {/* Avatar Selection & Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Foto Profil & Gaya Avatar
              </label>
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                {/* Current Avatar Preview */}
                <div className="relative group shrink-0">
                  {customAvatarUrl ? (
                    <img
                      src={customAvatarUrl}
                      alt="Avatar"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                    />
                  ) : (
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${selectedAvatar} text-white flex items-center justify-center font-black text-2xl shadow-md`}
                    >
                      {formData.username_users?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  {/* Upload overlay */}
                  <label className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition">
                    <Camera size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Avatar presets or custom file button */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${preset} transition transform hover:scale-110 ${
                          selectedAvatar === preset && !customAvatarUrl
                            ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 scale-105"
                            : "opacity-75 hover:opacity-100"
                        }`}
                        title="Pilih tema warna avatar"
                      />
                    ))}
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      <Camera size={13} />
                      <span>{customAvatarUrl ? "Ganti foto dari perangkat" : "Unggah foto kustom"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Input: Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Nama Pengguna (Username) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.username_users}
                  onChange={(e) => setFormData({ ...formData, username_users: e.target.value })}
                  placeholder="Masukkan nama pengguna"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                />
              </div>
            </div>

            {/* Input: Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Alamat Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={formData.email_users}
                  onChange={(e) => setFormData({ ...formData, email_users: e.target.value })}
                  placeholder="contoh@domain.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                />
              </div>
            </div>

            {/* Input: No. Telepon */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Nomor Telepon / WhatsApp
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={formData.telpon_users}
                  onChange={(e) => setFormData({ ...formData, telpon_users: e.target.value })}
                  placeholder="081234567890"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                />
              </div>
            </div>

            {/* Input: Alamat */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Alamat Domisili
              </label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-3 text-slate-400" />
                <textarea
                  rows={2}
                  value={formData.address_users}
                  onChange={(e) => setFormData({ ...formData, address_users: e.target.value })}
                  placeholder="Masukkan alamat lengkap"
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                />
              </div>
            </div>

            {/* Input: Password Baru (Opsional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Kata Sandi Baru <span className="text-[10px] font-normal text-slate-400">(Kosongkan jika tidak ingin mengubah)</span>
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={formData.password_users}
                  onChange={(e) => setFormData({ ...formData, password_users: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                />
              </div>
            </div>
          </div>

          {/* Pinned Footer Buttons (Always Visible) */}
          <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-slate-800/70 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
