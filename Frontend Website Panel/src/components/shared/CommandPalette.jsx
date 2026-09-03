import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthRole, clearAuthSession } from "../../utils/authHelper";
import {
  Search,
  LayoutDashboard,
  Newspaper,
  Image as ImageIcon,
  Sparkles,
  Gift,
  Coins,
  ClipboardList,
  Radio,
  Lightbulb,
  Megaphone,
  FileText,
  UserCog,
  History,
  Activity,
  LogOut,
  ExternalLink,
  PlusCircle,
  KeyRound,
  CornerDownLeft,
  X,
} from "lucide-react";

/**
 * CommandPalette — Spotlight Global Search (Ctrl + K / Cmd + K)
 * Navigasi kilat dan aksi cepat bergaya Linear/Vercel/Stripe.
 */
export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const role = getAuthRole() || "viewer";

  // Navigation catalog based on role with rich multi-lingual keywords
  const allCommands = [
    // 1. Dashboards
    {
      id: "dashboard",
      title: "Dashboard Utama",
      subtitle: "Ringkasan metrik dan statistik panel",
      category: "Navigasi Halaman",
      icon: LayoutDashboard,
      path: "/dashboard",
      roles: ["super_admin"],
      keywords: ["dashboard", "beranda", "metrik", "statistik", "ringkasan"],
    },
    {
      id: "content-dashboard",
      title: "Dashboard Konten",
      subtitle: "Portal kurasi konten dan media",
      category: "Navigasi Halaman",
      icon: LayoutDashboard,
      path: "/content-admin/dashboard",
      roles: ["content_admin"],
      keywords: ["dashboard", "konten", "beranda", "kurasi", "media"],
    },
    {
      id: "marketing-dashboard",
      title: "Dashboard Marketing",
      subtitle: "Portal promosi dan loyalty",
      category: "Navigasi Halaman",
      icon: LayoutDashboard,
      path: "/marketing/dashboard",
      roles: ["marketing"],
      keywords: ["dashboard", "marketing", "beranda", "promosi", "loyalty"],
    },
    {
      id: "reseller-dashboard",
      title: "Portal Mitra Reseller",
      subtitle: "Katalog hadiah, promosi & poin",
      category: "Navigasi Halaman",
      icon: LayoutDashboard,
      path: "/reseller/dashboard",
      roles: ["reseller"],
      keywords: ["dashboard", "reseller", "beranda", "mitra", "portal"],
    },
    {
      id: "viewer-dashboard",
      title: "Portal Berita & Publik",
      subtitle: "Berita, pengumuman & informasi interaktif",
      category: "Navigasi Halaman",
      icon: LayoutDashboard,
      path: "/viewer/dashboard",
      roles: ["viewer", "super_admin", "content_admin", "marketing", "reseller"],
      keywords: ["dashboard", "viewer", "publik", "portal", "beranda"],
    },

    // 2. Berita & Media
    {
      id: "news",
      title: "Manajemen Berita & Artikel",
      subtitle: "Kelola artikel dan siaran informasi",
      category: "Navigasi Halaman",
      icon: Newspaper,
      path: "/admin/Berita",
      roles: ["super_admin", "content_admin"],
      keywords: ["berita", "news", "artikel", "siaran", "kabar", "media", "post"],
    },
    {
      id: "viewer-news",
      title: "Portal Berita & Artikel",
      subtitle: "Baca berita resmi dan kabar terbaru MPStore",
      category: "Navigasi Halaman",
      icon: Newspaper,
      path: "/viewer/berita",
      roles: ["viewer"],
      keywords: ["berita", "news", "artikel", "kabar", "informasi", "bacaan"],
    },
    {
      id: "slider",
      title: "Banner Slider",
      subtitle: "Atur korsel banner halaman depan",
      category: "Navigasi Halaman",
      icon: ImageIcon,
      path: "/slider",
      roles: ["super_admin", "content_admin", "marketing"],
      keywords: ["slider", "banner", "korsel", "gambar", "carousel", "slide"],
    },
    {
      id: "popup",
      title: "Popup Promosi & Notifikasi",
      subtitle: "Kelola dialog pop-up siaran promosi",
      category: "Navigasi Halaman",
      icon: Sparkles,
      path: "/popup",
      roles: ["super_admin", "content_admin", "marketing"],
      keywords: ["popup", "pop-up", "dialog", "modal", "banner", "iklan"],
    },

    // 3. Program Promosi & Hadiah (Tersedia untuk Super Admin, Marketing, Content Admin, Reseller, Viewer)
    {
      id: "promotion",
      title: "Program Promosi & Flyer",
      subtitle: "Katalog flyer promosi, diskon dan cashback",
      category: "Navigasi Halaman",
      icon: Sparkles,
      path: "/promotion",
      roles: ["super_admin", "content_admin", "marketing", "reseller"],
      keywords: ["promotion", "promosi", "promo", "diskon", "cashback", "flyer", "katalog", "penawaran", "voucher"],
    },
    {
      id: "viewer-promotion",
      title: "Katalog Promo & Diskon",
      subtitle: "Lihat promo terbaru dan penawaran spesial",
      category: "Navigasi Halaman",
      icon: Sparkles,
      path: "/viewer/promotion",
      roles: ["viewer"],
      keywords: ["promotion", "promosi", "promo", "diskon", "cashback", "flyer", "katalog", "penawaran"],
    },
    {
      id: "rewards",
      title: "Katalog Hadiah Rewards",
      subtitle: "Tukar poin hadiah loyalitas mitra",
      category: "Navigasi Halaman",
      icon: Gift,
      path: "/rewards",
      roles: ["super_admin", "marketing", "reseller"],
      keywords: ["rewards", "reward", "hadiah", "tukar poin", "kado", "loyalty", "klaim", "katalog"],
    },
    {
      id: "viewer-rewards",
      title: "Katalog Hadiah Rewards",
      subtitle: "Daftar merchandise dan hadiah penukaran poin",
      category: "Navigasi Halaman",
      icon: Gift,
      path: "/viewer/rewards",
      roles: ["viewer"],
      keywords: ["rewards", "reward", "hadiah", "tukar poin", "loyalty", "katalog"],
    },

    // 4. M-Point & Titik Lokasi
    {
      id: "mpoints",
      title: "Gerai & Titik M-Point",
      subtitle: "Peta titik lokasi agen gerai M-Point resmi",
      category: "Navigasi Halaman",
      icon: Coins,
      path: "/mpoint",
      roles: ["super_admin", "marketing", "reseller"],
      keywords: ["mpoint", "m-point", "point", "poin", "titik", "gerai", "lokasi", "agen", "maps", "komisi"],
    },
    {
      id: "viewer-mpoint",
      title: "Peta Titik Gerai M-Point",
      subtitle: "Cari lokasi gerai agen M-Point terdekat",
      category: "Navigasi Halaman",
      icon: Coins,
      path: "/viewer/mpoint",
      roles: ["viewer"],
      keywords: ["mpoint", "m-point", "point", "poin", "titik", "lokasi", "gerai", "agen", "peta", "maps"],
    },

    // 5. Jaringan Referral & Komunitas
    {
      id: "referral",
      title: "Jaringan Pohon Referral",
      subtitle: "Struktur downline dan relasi keagenan mitra",
      category: "Navigasi Halaman",
      icon: UserCog,
      path: "/InteraksiPage",
      roles: ["super_admin", "reseller"],
      keywords: ["referral", "pohon referral", "downline", "jaringan", "agen", "relasi", "interaksi", "upline", "komunitas"],
    },

    // 6. Tips & Edukasi Bisnis
    {
      id: "tips",
      title: "Tips & Edukasi Bisnis",
      subtitle: "Panduan cara sukses transaksi PPOB & toko kelontong",
      category: "Navigasi Halaman",
      icon: Lightbulb,
      path: "/tips",
      roles: ["super_admin", "content_admin", "marketing", "reseller"],
      keywords: ["tips", "edukasi", "panduan", "trik", "tutorial", "cara", "bisnis", "sukses"],
    },
    {
      id: "viewer-tips",
      title: "Tips & Panduan Usaha",
      subtitle: "Artikel panduan praktis dan trik pengembangan usaha",
      category: "Navigasi Halaman",
      icon: Lightbulb,
      path: "/viewer/tips",
      roles: ["viewer"],
      keywords: ["tips", "panduan", "trik", "edukasi", "cara", "usaha"],
    },

    // 7. Pengumuman & Siaran
    {
      id: "pengumuman",
      title: "Papan Pengumuman Resmi",
      subtitle: "Siaran darurat dan pembaruan sistem MPStore",
      category: "Navigasi Halaman",
      icon: Megaphone,
      path: "/pengumuman",
      roles: ["super_admin", "content_admin"],
      keywords: ["pengumuman", "siaran", "edaran", "announcement", "info", "pembaruan"],
    },
    {
      id: "viewer-pengumuman",
      title: "Papan Pengumuman Resmi",
      subtitle: "Daftar pengumuman publik dari manajemen",
      category: "Navigasi Halaman",
      icon: Megaphone,
      path: "/viewer/pengumuman",
      roles: ["viewer"],
      keywords: ["pengumuman", "siaran", "edaran", "announcement", "info"],
    },
    {
      id: "runnings",
      title: "Running Text Ticker",
      subtitle: "Pesan berjalan siaran langsung",
      category: "Navigasi Halaman",
      icon: Radio,
      path: "/runnings",
      roles: ["super_admin", "marketing"],
      keywords: ["running text", "ticker", "pesan berjalan", "siaran langsung", "marquee"],
    },

    // 8. Kuesioner & Feedback
    {
      id: "kuesioner",
      title: "Kuesioner & Survei",
      subtitle: "Daftar kuesioner dan feedback mitra",
      category: "Navigasi Halaman",
      icon: ClipboardList,
      path: "/admin/kuesioner",
      roles: ["super_admin"],
      keywords: ["kuesioner", "survei", "survey", "feedback", "ulasan", "tanggapan"],
    },
    {
      id: "viewer-kuesioner",
      title: "Isi Kuesioner & Feedback",
      subtitle: "Berikan masukan untuk layanan MPStore yang lebih baik",
      category: "Navigasi Halaman",
      icon: ClipboardList,
      path: "/viewer/kuesioner",
      roles: ["viewer"],
      keywords: ["kuesioner", "survei", "survey", "feedback", "ulasan", "masukan", "tanggapan"],
    },

    // 9. Laporan Moderasi
    {
      id: "newsreport",
      title: "Laporan Komentar & Berita",
      subtitle: "Moderasi interaksi dan respon pembaca",
      category: "Navigasi Halaman",
      icon: FileText,
      path: "/admin/newsreport",
      roles: ["super_admin", "content_admin"],
      keywords: ["laporan", "report", "newsreport", "komentar", "moderasi"],
    },
    {
      id: "viewer-newsreport",
      title: "Laporan Aktivitas Berita",
      subtitle: "Statistik pembaca dan tanggapan artikel",
      category: "Navigasi Halaman",
      icon: FileText,
      path: "/viewer/newsreport",
      roles: ["viewer"],
      keywords: ["laporan", "report", "newsreport", "statistik", "bacaan"],
    },
    {
      id: "viewer-popup",
      title: "Popup & Penawaran Spesial",
      subtitle: "Lihat popup promosi dan penawaran terkini",
      category: "Navigasi Halaman",
      icon: Sparkles,
      path: "/viewer/popup",
      roles: ["viewer"],
      keywords: ["popup", "penawaran", "promo", "spesial", "modal", "iklan"],
    },
    {
      id: "viewer-intro",
      title: "Halaman Perkenalan & Panduan",
      subtitle: "Panduan lengkap cara menggunakan layanan MPStore",
      category: "Navigasi Halaman",
      icon: Lightbulb,
      path: "/viewer/intro",
      roles: ["viewer"],
      keywords: ["intro", "panduan", "perkenalan", "tutorial", "cara", "mulai", "onboarding"],
    },

    // 10. Pengaturan Sistem & Akun (Super Admin)
    {
      id: "user-management",
      title: "Manajemen Akun & User",
      subtitle: "Kelola hak akses dan peran pengguna",
      category: "Pengaturan Sistem",
      icon: UserCog,
      path: "/admin/user",
      roles: ["super_admin"],
      keywords: ["user", "pengguna", "akun", "role", "hak akses", "manajemen user", "admin"],
    },
    {
      id: "audit-logs",
      title: "Log Audit Aktivitas Sistem",
      subtitle: "Rekam jejak audit keamanan operasional",
      category: "Pengaturan Sistem",
      icon: History,
      path: "/admin/audit-logs",
      roles: ["super_admin"],
      keywords: ["audit", "log", "riwayat", "aktivitas", "keamanan", "rekam"],
    },
    {
      id: "system-health",
      title: "Kesehatan Sistem & Server Monitor",
      subtitle: "Status database, memori RAM & latensi API live",
      category: "Pengaturan Sistem",
      icon: Activity,
      path: "/admin/system-health",
      roles: ["super_admin"],
      keywords: ["server", "kesehatan", "health", "database", "ram", "memori", "latensi", "uptime"],
    },

    // 11. Quick Actions
    {
      id: "action-add-user",
      title: "Tambah Pengguna Baru",
      subtitle: "Buat akun baru dengan hak akses spesifik",
      category: "Aksi Cepat",
      icon: PlusCircle,
      path: "/admin/user/tambah",
      roles: ["super_admin"],
      keywords: ["tambah user", "buat akun", "new user", "register"],
    },
    {
      id: "action-edit-profile",
      title: "Edit Profil & Akun Saya",
      subtitle: "Ubah foto profil, nama pengguna, nomor telepon & kata sandi",
      category: "Aksi Cepat",
      icon: UserCog,
      action: () => {
        setIsOpen(false);
        // Dispatch trigger to open modal on any layout
        window.dispatchEvent(new CustomEvent("open-edit-profile-modal"));
      },
      roles: ["super_admin", "content_admin", "marketing", "reseller", "viewer"],
      keywords: ["edit profil", "profil", "profile", "foto", "avatar", "password", "sandi", "kontak", "telepon", "alamat"],
    },
    {
      id: "action-logout",
      title: "Keluar dari Sesi Panel",
      subtitle: "Akhiri sesi login saat ini dengan aman",
      category: "Aksi Cepat",
      icon: LogOut,
      action: () => {
        clearAuthSession();
        window.location.href = "/login";
      },
      roles: ["super_admin", "content_admin", "marketing", "reseller", "viewer"],
      keywords: ["keluar", "logout", "log out", "sign out", "exit"],
    },
  ];

  // Filter commands by active user role
  const roleCommands = allCommands.filter(
    (cmd) => !cmd.roles || cmd.roles.includes(role)
  );

  // Filter commands by search query across title, subtitle, category, and keywords
  const filteredCommands = roleCommands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    const matchTitle = cmd.title.toLowerCase().includes(q);
    const matchSubtitle = cmd.subtitle ? cmd.subtitle.toLowerCase().includes(q) : false;
    const matchCategory = cmd.category ? cmd.category.toLowerCase().includes(q) : false;
    const matchKeywords = cmd.keywords ? cmd.keywords.some((k) => k.toLowerCase().includes(q)) : false;
    return matchTitle || matchSubtitle || matchCategory || matchKeywords;
  });

  // Global Key Listener for Ctrl+K / Cmd+K and custom event
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation within the list
  const handleInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCommands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCommands.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    }
  };

  const executeCommand = (cmd) => {
    setIsOpen(false);
    if (cmd.action) {
      cmd.action();
    } else if (cmd.path) {
      navigate(cmd.path);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-20 px-4 sm:px-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Palette Modal */}
      <div
        className="relative w-full max-w-2xl bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl shadow-blue-950/40 overflow-hidden flex flex-col backdrop-blur-2xl animate-scale-up"
        style={{ maxHeight: "80vh" }}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-950/40">
          <Search size={20} className="text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Ketik tujuan halaman atau aksi cepat... (contoh: Berita, User, Server)"
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-hidden font-medium"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Tutup pencarian"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-1 custom-scrollbar max-h-[380px]">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <p className="text-sm font-bold text-slate-400">
                Tidak ada menu yang sesuai dengan "{query}"
              </p>
              <p className="text-xs text-slate-500">
                Coba gunakan kata kunci umum seperti "Berita", "User", "Hadiah", atau "Server".
              </p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-600/20 border border-blue-500/50 text-white shadow-md shadow-blue-950/40"
                      : "hover:bg-slate-800/60 text-slate-300 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold truncate">
                          {cmd.title}
                        </p>
                        <span
                          className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${
                            cmd.badgeColor || "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {cmd.subtitle}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <CornerDownLeft
                      size={14}
                      className="text-blue-400 shrink-0 ml-2"
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Clean Footer Tips (No Keyboard Shortcut Badges) */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Gunakan panah atas/bawah untuk memilih dan Enter untuk membuka</span>
          <span className="font-semibold text-slate-400">
            MPStore Panel Navigasi
          </span>
        </div>
      </div>
    </div>
  );
}
