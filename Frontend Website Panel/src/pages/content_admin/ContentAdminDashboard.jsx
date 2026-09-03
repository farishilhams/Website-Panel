import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import Header from "../../components/admin/Header";
import StatCard from "../../components/shared/StatCard";
import AppImage from "../../components/shared/AppImage";
import {
  Newspaper,
  Image as ImageIcon,
  BellRing,
  Megaphone,
  Lightbulb,
  Compass,
  MessageSquare,
  Plus,
  ChevronRight,
} from "lucide-react";
import { getAuthUsername } from "../../utils/authHelper";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

export default function ContentAdminDashboard() {
  const [news, setNews] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [popups, setPopups] = useState([]);
  const [kuesioner, setKuesioner] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = getAuthUsername() || "Admin Konten";
  const greeting = getGreeting();

  useEffect(() => {
    fetchContentData();
  }, []);

  const fetchContentData = async () => {
    setLoading(true);
    try {
      const [resNews, resSliders, resPopups, resKuesioner] = await Promise.allSettled([
        api.get("/api/news?limit=100"),
        api.get("/api/sliders?limit=100"),
        api.get("/api/popup?limit=100"),
        api.get("/api/kuesioner?limit=100"),
      ]);

      if (resNews.status === "fulfilled") {
        setNews(resNews.value.data?.data || []);
      }
      if (resSliders.status === "fulfilled") {
        setSliders(resSliders.value.data?.data || []);
      }
      if (resPopups.status === "fulfilled") {
        setPopups(resPopups.value.data?.data || []);
      }
      if (resKuesioner.status === "fulfilled") {
        setKuesioner(resKuesioner.value.data?.data || []);
      }
    } catch (err) {
      console.error("Fetch Content Admin Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <Header />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-100 text-xs font-bold border border-white/20">
              <Newspaper size={14} />
              <span>Portal Divisi Publikasi & Kurasi Konten</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {greeting}, {username}! ✍️
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Kelola artikel berita resmi, banner utama carousel, popup promosi, panduan tips edukasi, dan siaran pengumuman untuk seluruh mitra MPStore.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/admin/Berita"
                className="px-4 py-2 bg-white text-blue-700 text-xs font-extrabold rounded-xl shadow-md hover:bg-blue-50 transition flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Tulis Berita Baru</span>
              </Link>
              <Link
                to="/pengumuman"
                className="px-4 py-2 bg-blue-900/40 text-white text-xs font-extrabold rounded-xl hover:bg-blue-900/60 transition border border-white/20 flex items-center gap-1.5"
              >
                <Megaphone size={15} />
                <span>Siarkan Pengumuman</span>
              </Link>
            </div>
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none hidden md:block" />
        </div>

        {/* Quick Metrics (Clickable) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            index={0}
            title="Total Artikel Berita"
            value={news.length}
            change="Publikasi konten resmi"
            gradient="from-blue-500 to-indigo-600"
            icon={Newspaper}
            to="/admin/Berita"
          />
          <StatCard
            index={1}
            title="Banner Slider Aktif"
            value={sliders.filter(s => s.status === 1 || s.status === "1").length || sliders.length}
            change="Rotasi carousel beranda"
            gradient="from-purple-500 to-violet-600"
            icon={ImageIcon}
            to="/slider"
          />
          <StatCard
            index={2}
            title="Popup Promosi"
            value={popups.length}
            change="Modal dialog aktif"
            gradient="from-emerald-500 to-teal-600"
            icon={BellRing}
            to="/popup"
          />
          <StatCard
            index={3}
            title="Feedback Kuesioner"
            value={kuesioner.length}
            change="Masukan & tanggapan mitra"
            gradient="from-amber-500 to-orange-600"
            icon={MessageSquare}
            to="/admin/kuesioner"
          />
        </div>

        {/* Berita & Popup Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Berita Terbit */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <Newspaper className="text-blue-600" size={18} />
                <span>Berita Terakhir Diterbitkan</span>
              </h3>
              <Link
                to="/admin/Berita"
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Kelola Berita →
              </Link>
            </div>

            <div className="space-y-3">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-blue-50/50 transition"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                    <AppImage
                      src={item.image}
                      alt={item.title}
                      category="news"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-800 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(item.created_at || Date.now()).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popup & Onboarding Shortcuts */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <Compass className="text-violet-600" size={18} />
              <span>Akses Cepat Pengaturan Tampilan</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/popup"
                className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-100/50 transition space-y-1 block"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-2">
                  <BellRing size={16} />
                </div>
                <h4 className="font-bold text-xs text-slate-800">
                  Popup Sambutan
                </h4>
                <p className="text-[11px] text-slate-500">
                  Atur modal pop-up promosi saat login
                </p>
              </Link>

              <Link
                to="/intro"
                className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 hover:bg-indigo-100/50 transition space-y-1 block"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold mb-2">
                  <Compass size={16} />
                </div>
                <h4 className="font-bold text-xs text-slate-800">
                  Onboarding Intro
                </h4>
                <p className="text-[11px] text-slate-500">
                  Ubah slide perkenalan fitur aplikasi
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
