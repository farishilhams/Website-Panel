import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import Header from "../../components/admin/Header";
import StatCard from "../../components/shared/StatCard";
import AppImage from "../../components/shared/AppImage";
import { getAuthUsername } from "../../utils/authHelper";
import {
  ShieldCheck,
  UserCog,
  Users2,
  Newspaper,
  Image as ImageIcon,
  Sparkles,
  Gift,
  MapPin,
  Flame,
  MessageSquare,
  Megaphone,
  ArrowRight,
  TrendingUp,
  Server,
  Database,
  Lock,
  Plus,
  Compass,
  Lightbulb,
} from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    news: 0,
    sliders: 0,
    rewards: 0,
    promotions: 0,
    runnings: 0,
    kuesioner: 0,
    mpoints: 0,
    pengumuman: 0,
  });

  const [userRoleCounts, setUserRoleCounts] = useState({
    super_admin: 0,
    content_admin: 0,
    marketing: 0,
    reseller: 0,
    viewer: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = getAuthUsername() || "Super Admin";
  const greeting = getGreeting();

  useEffect(() => {
    fetchGlobalStats();
  }, []);

  const fetchGlobalStats = async () => {
    setLoading(true);
    try {
      const [
        resUsers,
        resUserStats,
        resNews,
        resSliders,
        resMpoints,
        resRewards,
        resPromos,
      ] = await Promise.allSettled([
        api.get("/api/user?limit=4"),
        api.get("/api/user/stats"),
        api.get("/api/news?limit=3"),
        api.get("/api/sliders?limit=1"),
        api.get("/api/mpoint?limit=1"),
        api.get("/api/rewards?limit=1"),
        api.get("/api/promotion?limit=1"),
      ]);

      if (resUsers.status === "fulfilled") {
        setRecentUsers(resUsers.value.data?.data || []);
      }

      if (resUserStats.status === "fulfilled") {
        const d = resUserStats.value.data || {};
        setUserRoleCounts({
          super_admin: d.super_admin || 0,
          content_admin: d.content_admin || 0,
          marketing: d.marketing || 0,
          reseller: d.reseller || 0,
          viewer: d.viewer || 0,
        });
        setStats((prev) => ({ ...prev, users: d.total || 0 }));
      }

      if (resNews.status === "fulfilled") {
        const d = resNews.value.data;
        setRecentNews(d?.data || []);
        setStats((prev) => ({ ...prev, news: d?.total || 0 }));
      }

      if (resSliders.status === "fulfilled") {
        setStats((prev) => ({ ...prev, sliders: resSliders.value.data?.total || 0 }));
      }

      if (resMpoints.status === "fulfilled") {
        setStats((prev) => ({ ...prev, mpoints: resMpoints.value.data?.total || 0 }));
      }

      if (resRewards.status === "fulfilled") {
        setStats((prev) => ({ ...prev, rewards: resRewards.value.data?.total || 0 }));
      }

      if (resPromos.status === "fulfilled") {
        setStats((prev) => ({ ...prev, promos: resPromos.value.data?.total || 0 }));
      }
    } catch (err) {
      console.error("Fetch Global Stats Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <Header />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Super Admin Command Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-slate-800">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span>Super Admin Command Hub</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {greeting}, {username} ⚡
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pantau operasional platform, kelola layanan produk transaksi, kurasi konten publikasi, serta kembangkan jaringan mitra dan gerai MPStore secara terpadu.
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/admin/tambah-user"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Tambah Pengguna Baru</span>
              </Link>
              <Link
                to="/admin/user"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-extrabold rounded-xl transition border border-slate-700 flex items-center gap-1.5"
              >
                <UserCog size={15} />
                <span>Manajemen Hak Akses Role</span>
              </Link>
            </div>
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none hidden md:block" />
        </div>

        {/* Global Statistics Cards (Clickable) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            index={0}
            title="Total Pengguna Terdaftar"
            value={stats.users || 6}
            change="5 Tingkat Role"
            isPositive={true}
            gradient="from-indigo-600 to-blue-600"
            icon={Users2}
            to="/admin/user"
          />
          <StatCard
            index={1}
            title="Artikel & Berita Terbit"
            value={stats.news || 0}
            change="Publikasi Resmi"
            isPositive={true}
            gradient="from-blue-600 to-cyan-600"
            icon={Newspaper}
            to="/admin/Berita"
          />
          <StatCard
            index={2}
            title="Titik Gerai M-Point"
            value={stats.mpoints || 0}
            change="Jaringan Agen"
            isPositive={true}
            gradient="from-emerald-600 to-teal-600"
            icon={MapPin}
            to="/mpoint"
          />
          <StatCard
            index={3}
            title="Katalog Loyalty Rewards"
            value={stats.rewards || 0}
            change="Hadiah Poin"
            isPositive={true}
            gradient="from-rose-600 to-pink-600"
            icon={Gift}
            to="/rewards"
          />
        </div>

        {/* Role Distribution & User Management Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Role Distribution Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <UserCog className="text-indigo-600" size={18} />
                <span>Distribusi 5 Peran (Roles)</span>
              </h3>
              <Link
                to="/admin/user"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Kelola User →
              </Link>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <span className="text-xs font-bold text-indigo-900">Super Admin</span>
                </div>
                <span className="text-xs font-extrabold text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">
                  {userRoleCounts.super_admin} Akun
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-xs font-bold text-blue-900">Content Admin</span>
                </div>
                <span className="text-xs font-extrabold text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                  {userRoleCounts.content_admin} Akun
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-pink-50/60 border border-pink-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-pink-600" />
                  <span className="text-xs font-bold text-pink-900">Marketing</span>
                </div>
                <span className="text-xs font-extrabold text-pink-700 bg-white px-2.5 py-0.5 rounded-lg border border-pink-200">
                  {userRoleCounts.marketing} Akun
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">Mitra Reseller</span>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  {userRoleCounts.reseller} Akun
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <span className="text-xs font-bold text-slate-800">Viewer / Tamu</span>
                </div>
                <span className="text-xs font-extrabold text-slate-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                  {userRoleCounts.viewer} Akun
                </span>
              </div>
            </div>
          </div>

          {/* Quick Module Launchpad for Super Admin */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <Database className="text-slate-800" size={18} />
              <span>Pusat Navigasi Modul Super Admin</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link
                to="/admin/Berita"
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition group"
              >
                <Newspaper size={20} className="text-blue-600 mb-2 group-hover:scale-110 transition" />
                <h4 className="font-bold text-xs text-slate-800">Berita & Konten</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Artikel & informasi</p>
              </Link>

              <Link
                to="/slider"
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 transition group"
              >
                <ImageIcon size={20} className="text-purple-600 mb-2 group-hover:scale-110 transition" />
                <h4 className="font-bold text-xs text-slate-800">Banner Slider</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Carousel beranda</p>
              </Link>

              <Link
                to="/promotion"
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-pink-500 hover:bg-pink-50/40 transition group"
              >
                <Sparkles size={20} className="text-pink-600 mb-2 group-hover:scale-110 transition" />
                <h4 className="font-bold text-xs text-slate-800">Program Promosi</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Flyer & brosur PDF</p>
              </Link>

              <Link
                to="/rewards"
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-500 hover:bg-rose-50/40 transition group"
              >
                <Gift size={20} className="text-rose-600 mb-2 group-hover:scale-110 transition" />
                <h4 className="font-bold text-xs text-slate-800">Katalog Rewards</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Hadiah loyalty poin</p>
              </Link>

              <Link
                to="/mpoint"
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/40 transition group"
              >
                <MapPin size={20} className="text-cyan-600 mb-2 group-hover:scale-110 transition" />
                <h4 className="font-bold text-xs text-slate-800">Gerai M-Point</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Titik koordinat agen</p>
              </Link>

              <Link
                to="/admin/kuesioner"
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-500 hover:bg-violet-50/40 transition group"
              >
                <MessageSquare size={20} className="text-violet-600 mb-2 group-hover:scale-110 transition" />
                <h4 className="font-bold text-xs text-slate-800">Kuesioner Mitra</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Feedback & balasan</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
