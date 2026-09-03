import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Image as ImageIcon,
  Sparkles,
  Gift,
  MapPin,
  Megaphone,
  Lightbulb,
  MessageCircle,
  BarChart2,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  Search,
  UserCheck,
} from "lucide-react";
import MPStoreLogo from "../MPStoreLogo";
import EditProfileModal from "../shared/EditProfileModal";
import { getAuthUsername, clearAuthSession, getAuthUserId } from "../../utils/authHelper";

const MP_BLUE = "#0033CC";
const MP_GREEN = "#00BB33";

export default function ViewerNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(getAuthUsername() || "Tamu");
  const [customAvatar, setCustomAvatar] = useState(
    localStorage.getItem(`mp_user_avatar_custom_${getAuthUserId()}`) || ""
  );
  const [avatarPreset, setAvatarPreset] = useState(
    localStorage.getItem(`mp_user_avatar_preset_${getAuthUserId()}`) || "from-blue-600 to-indigo-600"
  );

  const username = currentUsername || "Tamu";

  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail?.username) setCurrentUsername(e.detail.username);
      if (e.detail?.avatarCustom !== undefined) setCustomAvatar(e.detail.avatarCustom);
      if (e.detail?.avatarPreset !== undefined) setAvatarPreset(e.detail.avatarPreset);
    };
    window.addEventListener("user-profile-updated", handleProfileUpdate);

    const handleOpenModal = () => setIsProfileModalOpen(true);
    window.addEventListener("open-edit-profile-modal", handleOpenModal);

    return () => {
      window.removeEventListener("user-profile-updated", handleProfileUpdate);
      window.removeEventListener("open-edit-profile-modal", handleOpenModal);
    };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  const navLinks = [
    { name: "Beranda", path: "/viewer/dashboard", icon: LayoutDashboard },
    { name: "Berita", path: "/viewer/berita", icon: Newspaper },
    { name: "Promo", path: "/viewer/promotion", icon: Sparkles },
    { name: "Rewards", path: "/viewer/rewards", icon: Gift },
    { name: "M-Point", path: "/viewer/mpoint", icon: MapPin },
    { name: "Pengumuman", path: "/viewer/pengumuman", icon: Megaphone },
    { name: "Tips", path: "/viewer/tips", icon: Lightbulb },
    { name: "Kuesioner", path: "/viewer/kuesioner", icon: MessageCircle },
    { name: "Laporan", path: "/viewer/newsreport", icon: BarChart2 },
  ];

  return (
    <nav
      className="sticky top-0 z-50 text-white"
      style={{
        background: "rgba(10,13,20,0.97)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,51,204,0.2)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Main Nav */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[58px] gap-2">

          {/* Brand */}
          <Link to="/viewer/dashboard" className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
            <MPStoreLogo size={34} showText={true} textColor="white" />
            <span
              className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider"
              style={{ background: "rgba(0,51,204,0.12)", border: "1px solid rgba(0,51,204,0.3)", color: "#6EA6FF" }}
            >
              Portal Publik
            </span>
          </Link>

          {/* Desktop Nav — Single Row, No Text Wrap */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink-0 flex-nowrap">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-xl text-[11px] xl:text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-200"
                  style={{
                    background: isActive ? "rgba(0,51,204,0.9)" : "transparent",
                    color: isActive ? "white" : "rgba(255,255,255,0.6)",
                    boxShadow: isActive ? "0 0 16px rgba(0,51,204,0.3)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.color = "white";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    }
                  }}
                >
                  <Icon size={14} style={{ color: isActive ? "white" : MP_BLUE }} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Controls: Search & Profile */}
          <div className="hidden md:flex items-center gap-2 shrink-0 whitespace-nowrap">
            {/* Quick Search Trigger (Clean, No Live Badge, No Shortcut Key) */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl transition cursor-pointer text-xs font-medium shrink-0 whitespace-nowrap"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)",
              }}
              title="Cari konten atau halaman..."
            >
              <Search size={14} className="text-slate-400 shrink-0" />
              <span className="whitespace-nowrap">Cari konten...</span>
            </button>

            {/* Profile */}
            <div className="relative shrink-0">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition cursor-pointer shrink-0 whitespace-nowrap"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {customAvatar ? (
                  <img
                    src={customAvatar}
                    alt="Avatar"
                    className="w-7 h-7 rounded-lg object-cover border border-blue-500/40 shrink-0"
                  />
                ) : (
                  <div
                    className={`w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center shrink-0 bg-gradient-to-tr ${avatarPreset}`}
                  >
                    {(username || "T").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-white hidden sm:block truncate max-w-[80px]">
                  {username}
                </span>
                <ChevronDown size={12} className="text-slate-500 shrink-0" />
              </button>

              {profileDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdown(false)} />
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl py-2 z-50 animate-fade-in"
                    style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
                  >
                    <div
                      className="px-4 py-3"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <p className="text-xs text-slate-400 font-medium">Masuk sebagai</p>
                      <p className="text-sm font-bold text-white truncate mt-0.5">{username}</p>
                      <span
                        className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(0,51,204,0.18)",
                          border: "1px solid rgba(0,51,204,0.35)",
                          color: "#6EA6FF",
                        }}
                      >
                        Viewer (Publik)
                      </span>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdown(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium flex items-center gap-2.5 transition cursor-pointer"
                        style={{ color: "#38BDF8" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(56,189,248,0.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <UserCheck size={13} /> Edit Profil
                      </button>
                      <button onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs font-semibold flex items-center gap-2.5 transition"
                        style={{ color: "#F87171" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                        <LogOut size={13} /> Keluar (Logout)
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Button */}
          <button
            className="flex lg:hidden items-center p-2 rounded-xl transition"
            style={{ background: "rgba(255,255,255,0.06)", color: "white" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t px-4 py-4 space-y-1 animate-fade-in"
          style={{ borderColor: "rgba(0,51,204,0.15)", background: "rgba(10,13,20,0.98)" }}
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition"
                style={{
                  background: isActive ? "rgba(0,51,204,0.9)" : "rgba(255,255,255,0.03)",
                  color: isActive ? "white" : "rgba(255,255,255,0.6)",
                }}>
                <Icon size={16} style={{ color: isActive ? "white" : MP_BLUE }} />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              {customAvatar ? (
                <img
                  src={customAvatar}
                  alt="Avatar"
                  className="w-8 h-8 rounded-xl object-cover border border-blue-500/40 shrink-0"
                />
              ) : (
                <div
                  className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center text-white shrink-0 bg-gradient-to-tr ${avatarPreset}`}
                >
                  {(username || "T").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-white leading-tight">{username}</p>
                <p className="text-[10px] text-blue-400 font-medium">Viewer (Publik)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsProfileModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 cursor-pointer"
              >
                Profil
              </button>
              <button onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171" }}>
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Universal Edit Profile Modal */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(newUsername) => setCurrentUsername(newUsername)}
      />
    </nav>
  );
}
