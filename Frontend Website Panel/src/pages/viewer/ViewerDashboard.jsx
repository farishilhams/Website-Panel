import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import AppImage from "../../components/shared/AppImage";
import {
  Newspaper,
  Image as ImageIcon,
  Gift,
  Sparkles,
  MapPin,
  Megaphone,
  ArrowRight,
  ChevronRight,
  Clock,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";

import { getCachedData, setCachedData } from "../../utils/dataCache";
import { getAuthUsername } from "../../utils/authHelper";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

export default function ViewerDashboard() {
  const cached = getCachedData("viewer_portal");
  const [news, setNews] = useState(cached?.news || []);
  const [sliders, setSliders] = useState(cached?.sliders || []);
  const [promotions, setPromotions] = useState(cached?.promotions || []);
  const [announcements, setAnnouncements] = useState(cached?.announcements || []);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(!cached);
  const username = getAuthUsername() || "Tamu";
  const greeting = getGreeting();

  useEffect(() => {
    fetchViewerPortalData();
  }, []);

  useEffect(() => {
    if (sliders.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliders]);

  const fetchViewerPortalData = async () => {
    if (!news.length) setLoading(true);
    try {
      const [resNews, resSliders, resPromos, resPengumuman] =
        await Promise.allSettled([
          api.get("/api/news?status=1&limit=6"),
          api.get("/api/sliders?status=1&limit=5"),
          api.get("/api/promotion?status=1&limit=4"),
          api.get("/api/pengumuman?status=1&limit=3"),
        ]);

      const newNews = resNews.status === "fulfilled" ? (resNews.value.data?.data || []) : news;
      const newSliders = resSliders.status === "fulfilled" ? (resSliders.value.data?.data || []) : sliders;
      const newPromos = resPromos.status === "fulfilled" ? (resPromos.value.data?.data || []) : promotions;
      const newAnnouncements = resPengumuman.status === "fulfilled" ? (resPengumuman.value.data?.data || []) : announcements;

      setNews(newNews);
      setSliders(newSliders);
      setPromotions(newPromos);
      setAnnouncements(newAnnouncements);

      setCachedData("viewer_portal", {
        news: newNews,
        sliders: newSliders,
        promotions: newPromos,
        announcements: newAnnouncements,
      });
    } catch (err) {
      console.error("Fetch Viewer Portal Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 pt-6 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Welcome Greeting Banner */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-cyan-400">{greeting}, {username}! 👋</p>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
              Portal Informasi MPStore
            </h1>
            <p className="text-xs text-slate-400 mt-1">Berita terkini, promo menarik, dan informasi layanan untuk Anda.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Clock size={14} />
            <span>{new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>

        {/* 2. Hero Media Banner Showcase */}
        {sliders.length > 0 && (
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
            <div className="w-full h-64 sm:h-80 md:h-96 relative">
              <AppImage
                src={sliders[activeSlide]?.image}
                alt={sliders[activeSlide]?.title || "Banner"}
                category="slider"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 space-y-2">
                <span className="inline-block px-3 py-1 rounded-lg bg-cyan-600 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
                  Sorotan Utama #{activeSlide + 1}
                </span>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-tight max-w-3xl">
                  {sliders[activeSlide]?.title || "MPStore Inovasi Digital"}
                </h2>
              </div>

              {/* Slider Controls */}
              {sliders.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveSlide(
                        (prev) => (prev - 1 + sliders.length) % sliders.length
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setActiveSlide((prev) => (prev + 1) % sliders.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* 3. Berita Resmi & Editorial Feed (Magazine Style) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                <Newspaper size={14} />
                <span>Publikasi Media</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Berita & Artikel Terkini
              </h2>
            </div>
            <Link
              to="/viewer/berita"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Lihat Semua Berita</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <article
                key={item.id}
                className="group bg-slate-900 rounded-3xl border border-slate-800 hover:border-cyan-500/50 shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="w-full h-48 relative bg-slate-950 overflow-hidden">
                  <AppImage
                    src={item.image}
                    alt={item.title}
                    category="news"
                    allowZoom={true}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Clock size={12} />
                      <span>
                        {new Date(item.created_at || Date.now()).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-white group-hover:text-cyan-400 transition line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <Link
                      to="/viewer/berita"
                      className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Baca Selengkapnya</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4. Siaran Pengumuman & Katalog Flyer Promosi */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Siaran Pengumuman */}
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Megaphone className="text-amber-400" size={20} />
                <span>Pengumuman Resmi</span>
              </h3>
              <Link
                to="/viewer/pengumuman"
                className="text-xs font-bold text-amber-400 hover:underline"
              >
                Arsip Pengumuman →
              </Link>
            </div>

            <div className="space-y-3">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-white truncate">
                      {a.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(a.created_at || Date.now()).toLocaleDateString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {a.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Brosur Promosi */}
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="text-pink-400" size={20} />
                <span>Brosur & Materi Promosi</span>
              </h3>
              <Link
                to="/viewer/promotion"
                className="text-xs font-bold text-pink-400 hover:underline"
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="space-y-3">
              {promotions.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-slate-950 border border-slate-800"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                    <AppImage
                      src={p.image}
                      alt={p.title}
                      category="promotion"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-white truncate">
                      {p.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Program Promosi Aktif
                    </p>
                  </div>
                  <Link
                    to="/viewer/promotion"
                    className="p-2 text-pink-400 hover:bg-pink-500/10 rounded-lg transition"
                  >
                    <ExternalLink size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
