import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  BellRing,
  Image as ImageIcon,
  Megaphone,
  Gift,
  Sparkles,
  MapPin,
  Flame,
  Lightbulb,
  BookOpen,
  MessageSquare,
  Users2,
  UserCog,
  History,
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import MPStoreLogo from "../MPStoreLogo";
import {
  getAuthRole,
  getAuthUsername,
  clearAuthSession,
} from "../../utils/authHelper";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Refs for tracking and restoring scroll position
  const desktopScrollRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const activeLinkRef = useRef(null);

  const role = getAuthRole() || "super_admin";
  const [currentUsername, setCurrentUsername] = useState(getAuthUsername() || "Admin");
  const [customAvatar, setCustomAvatar] = useState(
    localStorage.getItem(`mp_user_avatar_custom_${sessionStorage.getItem("user_id") || "1"}`) || ""
  );
  const [avatarPreset, setAvatarPreset] = useState(
    localStorage.getItem(`mp_user_avatar_preset_${sessionStorage.getItem("user_id") || "1"}`) || "from-blue-600 to-indigo-600"
  );

  const username = currentUsername || "Admin";

  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail?.username) setCurrentUsername(e.detail.username);
      if (e.detail?.avatarCustom !== undefined) setCustomAvatar(e.detail.avatarCustom);
      if (e.detail?.avatarPreset !== undefined) setAvatarPreset(e.detail.avatarPreset);
    };
    window.addEventListener("user-profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("user-profile-updated", handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    sessionStorage.removeItem("admin_sidebar_scroll_top");
    navigate("/login");
  };

  // Restore scroll position before browser paints (zero flicker)
  useLayoutEffect(() => {
    const saved = sessionStorage.getItem("admin_sidebar_scroll_top");
    if (saved !== null) {
      const top = parseInt(saved, 10) || 0;
      if (desktopScrollRef.current) {
        desktopScrollRef.current.scrollTop = top;
      }
      if (mobileScrollRef.current) {
        mobileScrollRef.current.scrollTop = top;
      }
    }
  }, [location.pathname]);

  // If active link is not visible on direct load, scroll into view smoothly
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_sidebar_scroll_top");
    if (!saved && activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [location.pathname]);

  const handleScroll = (e) => {
    sessionStorage.setItem("admin_sidebar_scroll_top", String(e.target.scrollTop));
  };

  const handleLinkClick = () => {
    if (desktopScrollRef.current) {
      sessionStorage.setItem(
        "admin_sidebar_scroll_top",
        String(desktopScrollRef.current.scrollTop)
      );
    }
    setMobileOpen(false);
  };

  const getHomePath = () => {
    switch (role) {
      case "super_admin": return "/dashboard";
      case "content_admin": return "/content-admin/dashboard";
      case "marketing": return "/marketing/dashboard";
      default: return "/dashboard";
    }
  };

  const menuGroups = [
    {
      title: "UTAMA",
      items: [
        { name: "Dashboard", path: getHomePath(), icon: LayoutDashboard, roles: ["super_admin", "content_admin", "marketing"] },
      ],
    },
    {
      title: "KONTEN & PUBLIKASI",
      items: [
        { name: "Berita & Artikel", path: "/admin/Berita", icon: Newspaper, roles: ["super_admin", "content_admin", "marketing"] },
        { name: "Banner Slider", path: "/slider", icon: ImageIcon, roles: ["super_admin", "content_admin", "marketing"] },
        { name: "Popup Promosi", path: "/popup", icon: BellRing, roles: ["super_admin", "content_admin"] },
        { name: "Pengumuman", path: "/pengumuman", icon: Megaphone, roles: ["super_admin", "content_admin"] },
        { name: "Tips & Panduan", path: "/tips", icon: Lightbulb, roles: ["super_admin", "content_admin"] },
        { name: "Onboarding Intro", path: "/intro", icon: BookOpen, roles: ["super_admin", "content_admin"] },
      ],
    },
    {
      title: "PROGRAM & MARKETING",
      items: [
        { name: "Program Promosi", path: "/promotion", icon: Sparkles, roles: ["super_admin", "marketing"] },
        { name: "Hadiah Rewards", path: "/rewards", icon: Gift, roles: ["super_admin", "marketing"] },
        { name: "Gerai M-Point", path: "/mpoint", icon: MapPin, roles: ["super_admin", "content_admin"] },
        { name: "Running Text", path: "/runnings", icon: Flame, roles: ["super_admin", "marketing"] },
      ],
    },
    {
      title: "KOMUNITAS & RELASI",
      items: [
        { name: "Pohon Referral", path: "/InteraksiPage", icon: Users2, roles: ["super_admin", "marketing"] },
        { name: "Kuesioner Mitra", path: "/admin/kuesioner", icon: MessageSquare, roles: ["super_admin", "content_admin"] },
        { name: "Laporan Berita", path: "/admin/newsreport", icon: FileText, roles: ["super_admin", "content_admin"] },
      ],
    },
    {
      title: "PENGATURAN SISTEM",
      items: [
        { name: "Manajemen User", path: "/admin/user", icon: UserCog, roles: ["super_admin"] },
        { name: "Log Audit Sistem", path: "/admin/audit-logs", icon: History, roles: ["super_admin"] },
        { name: "Kesehatan Sistem", path: "/admin/system-health", icon: Activity, roles: ["super_admin"] },
      ],
    },
  ];

  const renderContent = (scrollRef) => (
    <>
      {/* Brand Header */}
      <div
        className="flex items-center justify-between p-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        {!collapsed ? (
          <Link to={getHomePath()} className="flex items-center" onClick={handleLinkClick}>
            <MPStoreLogo size={34} showText={true} textColor="white" />
          </Link>
        ) : (
          <div className="w-full flex justify-center">
            <MPStoreLogo size={32} showText={false} variant="icon" />
          </div>
        )}

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-lg transition"
          style={{ background: "rgba(255,255,255,0.05)", color: "#94A3B8" }}
          title={collapsed ? "Perluas Sidebar" : "Perkecil Sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Scrollable Area with Scroll State Preservation */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar"
      >
        {menuGroups.map((group, groupIdx) => {
          const visibleItems = group.items.filter((item) => item.roles.includes(role));
          if (visibleItems.length === 0) return null;
          return (
            <div key={groupIdx}>
              {!collapsed && (
                <p
                  className="px-3 text-[10px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  {group.title}
                </p>
              )}
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== "/" &&
                      item.path !== "/dashboard" &&
                      location.pathname.startsWith(item.path));

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      ref={isActive ? activeLinkRef : null}
                      onClick={handleLinkClick}
                      title={collapsed ? item.name : undefined}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                      style={{
                        background: isActive ? "rgba(0,51,204,0.85)" : "transparent",
                        color: isActive ? "white" : "rgba(255,255,255,0.5)",
                        boxShadow: isActive
                          ? "0 0 16px rgba(0,51,204,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                          : "none",
                        justifyContent: collapsed ? "center" : "flex-start",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                          e.currentTarget.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                        }
                      }}
                    >
                      <Icon
                        size={17}
                        style={{
                          color: isActive ? "white" : "rgba(255,255,255,0.4)",
                          transition: "transform 0.2s",
                          flexShrink: 0,
                        }}
                      />
                      {!collapsed && <span className="truncate">{item.name}</span>}

                      {/* Active indicator dot */}
                      {isActive && !collapsed && (
                        <span
                          className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: "#00BB33" }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Footer */}
      <div
        className="p-3 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        {!collapsed ? (
          <div
            className="flex items-center justify-between p-2.5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {customAvatar ? (
                <img
                  src={customAvatar}
                  alt="Avatar"
                  className="w-8 h-8 rounded-xl object-cover border border-blue-500/40 shrink-0"
                />
              ) : (
                <div
                  className={`w-8 h-8 rounded-xl text-white font-bold flex items-center justify-center text-xs shrink-0 bg-gradient-to-tr ${avatarPreset}`}
                >
                  {(username || "A").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {username || "Admin"}
                </p>
                <p
                  className="text-[10px] truncate capitalize"
                  style={{ color: "#00BB33" }}
                >
                  {(role || "admin").replace(/_/g, " ")}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg transition"
              style={{ color: "rgba(255,255,255,0.35)" }}
              title="Keluar (Logout)"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#F87171";
                e.currentTarget.style.background = "rgba(239,68,68,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full py-2 flex items-center justify-center rounded-xl transition"
            style={{ color: "rgba(255,255,255,0.35)" }}
            title="Keluar"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#F87171";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.35)";
            }}
          >
            <LogOut size={17} />
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl shadow-xl"
        style={{ background: "#0033CC", color: "white" }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 z-40"
        style={{
          width: collapsed ? "72px" : "256px",
          background: "#0A0D14",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {renderContent(desktopScrollRef)}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <aside
        className="lg:hidden fixed top-0 left-0 h-screen z-40 flex flex-col transition-transform duration-300"
        style={{
          width: "272px",
          background: "#0A0D14",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {renderContent(mobileScrollRef)}
      </aside>
    </>
  );
}