import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import Header from "../../components/admin/Header";
import StatCard from "../../components/shared/StatCard";
import AppImage from "../../components/shared/AppImage";
import {
  Sparkles,
  Gift,
  Image as ImageIcon,
  Flame,
  Users2,
  TrendingUp,
  ChevronRight,
  Radio,
  Plus,
} from "lucide-react";
import { getAuthUsername } from "../../utils/authHelper";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

export default function MarketingDashboard() {
  const [promotions, setPromotions] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [runnings, setRunnings] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = getAuthUsername() || "Tim Marketing";
  const greeting = getGreeting();

  useEffect(() => {
    fetchMarketingData();
  }, []);

  const fetchMarketingData = async () => {
    setLoading(true);
    try {
      const [resPromos, resSliders, resRunnings, resRewards] = await Promise.allSettled([
        api.get("/api/promotion?limit=100"),
        api.get("/api/sliders?limit=100"),
        api.get("/api/runnings?limit=100"),
        api.get("/api/rewards?limit=100"),
      ]);

      if (resPromos.status === "fulfilled") {
        setPromotions(resPromos.value.data?.data || []);
      }
      if (resSliders.status === "fulfilled") {
        setSliders(resSliders.value.data?.data || []);
      }
      if (resRunnings.status === "fulfilled") {
        setRunnings(resRunnings.value.data?.data || []);
      }
      if (resRewards.status === "fulfilled") {
        setRewards(resRewards.value.data?.data || []);
      }
    } catch (err) {
      console.error("Fetch Marketing Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <Header />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 p-6 sm:p-8 text-white shadow-xl shadow-pink-900/10">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-pink-100 text-xs font-bold border border-white/20">
              <Sparkles size={14} />
              <span>Portal Divisi Marketing & Campaign</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {greeting}, {username}! 🚀
            </h1>
            <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed">
              Kelola flyer promosi, program voucher loyalti rewards, running text ticker pengumuman, dan banner slider promosi untuk memaksimalkan konversi mitra.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/promotion"
                className="px-4 py-2 bg-white text-pink-700 text-xs font-extrabold rounded-xl shadow-md hover:bg-pink-50 transition flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Buat Flyer Promosi</span>
              </Link>
              <Link
                to="/slider"
                className="px-4 py-2 bg-pink-900/40 text-white text-xs font-extrabold rounded-xl hover:bg-pink-900/60 transition border border-white/20 flex items-center gap-1.5"
              >
                <ImageIcon size={15} />
                <span>Atur Banner Slider</span>
              </Link>
            </div>
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none hidden md:block" />
        </div>

        {/* Quick Metrics (Clickable) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            index={0}
            title="Total Promosi Aktif"
            value={promotions.filter(p => p.status === 1 || p.status === "1").length || promotions.length}
            change="Brosur & flyer katalog"
            gradient="from-pink-500 to-rose-600"
            icon={Sparkles}
            to="/promotion"
          />
          <StatCard
            index={1}
            title="Banner Slider Aktif"
            value={sliders.filter(s => s.status === 1 || s.status === "1").length || sliders.length}
            change="Carousel beranda"
            gradient="from-purple-500 to-indigo-600"
            icon={ImageIcon}
            to="/slider"
          />
          <StatCard
            index={2}
            title="Katalog Rewards"
            value={rewards.length}
            change="Program poin mitra"
            gradient="from-rose-500 to-amber-600"
            icon={Gift}
            to="/rewards"
          />
          <StatCard
            index={3}
            title="Running Ticker"
            value={runnings.filter(r => r.status === 1 || r.status === "1").length || runnings.length}
            change="Siaran live aktif"
            gradient="from-orange-500 to-amber-500"
            icon={Flame}
            to="/runnings"
          />
        </div>

        {/* Live Running Text Ticker */}
        {runnings.filter((r) => r.status === "1" || r.status === 1).length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/15 overflow-hidden flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-black/20 text-[10px] font-extrabold uppercase shrink-0 flex items-center gap-1">
              <Radio size={12} className="animate-pulse" />
              <span>LIVE TICKER</span>
            </span>
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <div className="inline-block animate-marquee font-medium text-xs">
                {runnings
                  .filter((r) => r.status === "1" || r.status === 1)
                  .map((r) => r.name)
                  .join(" ••• ")}
              </div>
            </div>
            <Link
              to="/runnings"
              className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-xl transition shrink-0"
            >
              Ubah Ticker
            </Link>
          </div>
        )}

        {/* Promotion & Slider Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Promosi Terbaru */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <Sparkles className="text-pink-600" size={18} />
                <span>Flyer Promosi Aktif</span>
              </h3>
              <Link
                to="/promotion"
                className="text-xs font-bold text-pink-600 hover:text-pink-700"
              >
                Kelola Semua →
              </Link>
            </div>

            <div className="space-y-3">
              {promotions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-pink-50/50 transition"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                    <AppImage
                      src={item.image}
                      alt={item.title}
                      category="promotion"
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

          {/* Slider Banners */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <ImageIcon className="text-purple-600" size={18} />
                <span>Banner Slider Beranda</span>
              </h3>
              <Link
                to="/slider"
                className="text-xs font-bold text-purple-600 hover:text-purple-700"
              >
                Kelola Slider →
              </Link>
            </div>

            <div className="space-y-3">
              {sliders.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-purple-50/50 transition"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                    <AppImage
                      src={item.image}
                      alt={item.title}
                      category="slider"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-800 truncate">
                      {item.title}
                    </h4>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-extrabold text-[9px] uppercase">
                      {item.jenis || "BANNER"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
