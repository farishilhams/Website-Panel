import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  User,
  LogOut,
  ChevronDown,
  Clock,
  UserCheck,
  Search,
} from "lucide-react";
import EditProfileModal from "../shared/EditProfileModal";
import { getAuthUsername, getAuthRole, clearAuthSession, getAuthUserId } from "../../utils/authHelper";

export default function Header({ role = "super_admin", username = "Admin" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(getAuthUsername() || username);
  const [customAvatar, setCustomAvatar] = useState(
    localStorage.getItem(`mp_user_avatar_custom_${getAuthUserId()}`) || ""
  );
  const [avatarPreset, setAvatarPreset] = useState(
    localStorage.getItem(`mp_user_avatar_preset_${getAuthUserId()}`) || "from-blue-600 to-indigo-600"
  );

  const storedRole = getAuthRole() || role;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);

    const handleProfileUpdate = (e) => {
      if (e.detail?.username) setCurrentUsername(e.detail.username);
      if (e.detail?.avatarCustom !== undefined) setCustomAvatar(e.detail.avatarCustom);
      if (e.detail?.avatarPreset) setAvatarPreset(e.detail.avatarPreset);
    };
    window.addEventListener("user-profile-updated", handleProfileUpdate);

    const handleOpenEditModal = () => setIsProfileModalOpen(true);
    window.addEventListener("open-edit-profile-modal", handleOpenEditModal);

    return () => {
      clearInterval(interval);
      window.removeEventListener("user-profile-updated", handleProfileUpdate);
      window.removeEventListener("open-edit-profile-modal", handleOpenEditModal);
    };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  // Generate breadcrumb from pathname
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const pageTitle =
    pathSegments.length > 0
      ? pathSegments[pathSegments.length - 1].replace(/-/g, " ").toUpperCase()
      : "DASHBOARD";

  const getRoleBadge = (r) => {
    switch (r) {
      case "super_admin":
        return {
          label: "Super Admin",
          color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        };
      case "content_admin":
        return {
          label: "Content Admin",
          color: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "marketing":
        return {
          label: "Marketing",
          color: "bg-pink-100 text-pink-800 border-pink-200",
        };
      case "reseller":
        return {
          label: "Mitra Reseller",
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case "viewer":
      default:
        return {
          label: "Viewer (Publik)",
          color: "bg-cyan-100 text-cyan-800 border-cyan-200",
        };
    }
  };

  const roleInfo = getRoleBadge(storedRole);

  // Header.jsx khusus untuk workspace Admin (super_admin, content_admin, marketing).
  // Untuk role reseller dan viewer, navigasi sudah ditangani oleh ResellerNavbar dan ViewerNavbar di layout.
  if (storedRole === "reseller" || storedRole === "viewer") {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-xs">
      {/* Left: Breadcrumbs & Live Date */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>MPStore Panel</span>
            <span>/</span>
            <span className="text-blue-600 font-bold">{pageTitle}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
            <Clock size={12} className="text-slate-400" />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Right: Search & Profile */}
      <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
        {/* Quick Search Spotlight Trigger */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-slate-500 text-xs font-medium transition cursor-pointer group shadow-2xs shrink-0 whitespace-nowrap"
          title="Cari fitur atau halaman..."
        >
          <Search size={14} className="text-slate-400 group-hover:text-blue-600 transition shrink-0" />
          <span className="whitespace-nowrap">Cari fitur / aksi...</span>
        </button>

        {/* Profile Card & Dropdown */}
        <div className="relative shrink-0 whitespace-nowrap">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-slate-100/80 transition-all border border-transparent hover:border-slate-200 cursor-pointer shrink-0 whitespace-nowrap"
          >
            {customAvatar ? (
              <img
                src={customAvatar}
                alt="Avatar"
                className="w-9 h-9 rounded-xl object-cover shadow-sm border border-slate-200"
              />
            ) : (
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${avatarPreset || "from-blue-600 to-indigo-600"} text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-500/20`}
              >
                {(currentUsername || username || "A").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {currentUsername || username || "Admin"}
              </p>
              <p className="text-[10px] text-slate-500 font-medium capitalize">
                {(storedRole || role || "super_admin").replace(/_/g, " ")}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in divide-y divide-slate-100">
                <div className="px-4 py-3">
                  <p className="text-xs text-slate-500 font-medium">
                    Masuk sebagai
                  </p>
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {currentUsername}
                  </p>
                  <span
                    className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleInfo.color}`}
                  >
                    {roleInfo.label}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <UserCheck size={15} className="text-blue-600" />
                    <span>Edit Profil</span>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition"
                  >
                    <LogOut size={15} />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Universal Edit Profile Modal */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(newUsername) => setCurrentUsername(newUsername)}
      />
    </header>
  );
}
