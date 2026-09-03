import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import AppImage from "../../components/shared/AppImage";
import {
  Gift,
  Coins,
  Sparkles,
  MapPin,
  Users2,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Search,
  Filter,
  Download,
  Flame,
  Award,
  ShoppingBag,
  Zap,
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

export default function ResellerDashboard() {
  const [rewards, setRewards] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [mpoints, setMpoints] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Claim Modal State
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const username = getAuthUsername() || "Mitra Reseller";
  const greeting = getGreeting();

  useEffect(() => {
    fetchResellerPortalData();
  }, []);

  const fetchResellerPortalData = async () => {
    if (!rewards.length) setLoading(true);
    try {
      const [resRewards, resPromos, resMpoints] = await Promise.allSettled([
        api.get("/api/rewards?status=1&limit=8"),
        api.get("/api/promotion?status=1&limit=4"),
        api.get("/api/mpoint?limit=4"),
      ]);

      const newRewards = resRewards.status === "fulfilled" ? (resRewards.value.data?.data || []) : rewards;
      const newPromos = resPromos.status === "fulfilled" ? (resPromos.value.data?.data || []) : promotions;
      const newMpoints = resMpoints.status === "fulfilled" ? (resMpoints.value.data?.data || []) : mpoints;

      setRewards(newRewards);
      setPromotions(newPromos);
      setMpoints(newMpoints);

      setCachedData("reseller_portal", {
        rewards: newRewards,
        promotions: newPromos,
        mpoints: newMpoints,
      });
    } catch (err) {
      console.error("Fetch Reseller Portal Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRewards = rewards.filter((item) => {
    const matchCategory =
      selectedCategory === "ALL" ||
      (selectedCategory === "F" && item.category === "F") ||
      (selectedCategory === "D" && item.category === "D");
    const matchSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleOpenClaim = (reward) => {
    setSelectedReward(reward);
    setClaimSuccess(false);
    setClaimModalOpen(true);
  };

  const handleConfirmClaim = () => {
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimModalOpen(false);
      setClaimSuccess(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      {/* 1. Hero Marketplace Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border-b border-slate-800">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Main Welcome Message */}
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                <Award size={15} />
                <span>{greeting}, {username}! 🌟 Program Loyalitas Mitra MPStore 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Tukarkan Poin Transaksi Bisnis dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Hadiah Eksklusif!</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Tingkatkan transaksi QRIS, PPOB, dan pulsa gerai Anda. Dapatkan poin reward loyalty untuk ditukarkan dengan gadget, emas, motor, dan saldo gratis.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#rewards-catalog"
                  className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition flex items-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>Jelajahi Katalog Hadiah</span>
                </a>
                <Link
                  to="/mpoint"
                  className="px-5 py-3 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-extrabold text-xs rounded-2xl transition flex items-center gap-2"
                >
                  <MapPin size={16} className="text-teal-400" />
                  <span>Cari Titik Gerai M-Point</span>
                </Link>
              </div>
            </div>

            {/* Wallet / Points Card (Clickable to Rewards) */}
            <Link
              to="/rewards"
              className="group block bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 p-6 rounded-3xl border border-slate-700 hover:border-emerald-500/50 shadow-2xl space-y-5 relative overflow-hidden transition-all duration-300 hover:shadow-emerald-500/10 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-400 transition uppercase tracking-wider flex items-center gap-1.5">
                  <span>Dompet Poin Mitra</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-extrabold text-[10px] uppercase border border-amber-500/30">
                  Level Platinum
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <Coins className="text-amber-400 animate-pulse" size={28} />
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    12.450
                  </span>
                  <span className="text-xs font-bold text-slate-400">Poin Aktif</span>
                </div>
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <Zap size={13} />
                  <span>+350 poin dari transaksi minggu ini</span>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/80 grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition">
                  <p className="text-[10px] text-slate-400">Hadiah Diklaim</p>
                  <p className="text-sm font-black text-white">4 Item</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition">
                  <p className="text-[10px] text-slate-400">Total Komisi</p>
                  <p className="text-sm font-black text-emerald-400">Rp 1.850.000</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* 2. E-Commerce Rewards Store Section */}
        <section id="rewards-catalog" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <ShoppingBag size={14} />
                <span>Marketplace Loyalty Rewards</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Pilih Hadiah Impian Anda
              </h2>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter Pills */}
              <div className="inline-flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setSelectedCategory("ALL")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedCategory === "ALL"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Semua Hadiah
                </button>
                <button
                  onClick={() => setSelectedCategory("F")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedCategory === "F"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Fisik & Gadget
                </button>
                <button
                  onClick={() => setSelectedCategory("D")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedCategory === "D"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Voucher Digital
                </button>
              </div>

              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  autoComplete="off"
                  spellCheck="false"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama hadiah..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
          </div>

          {/* Product Grid (E-Commerce Style Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRewards.map((item) => (
              <div
                key={item.id}
                className="group bg-slate-900/90 rounded-3xl border border-slate-800 hover:border-emerald-500/50 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Product Image */}
                <div className="w-full h-48 relative bg-slate-950 overflow-hidden">
                  <AppImage
                    src={item.image}
                    alt={item.title}
                    category="rewards"
                    allowZoom={true}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase shadow-md ${
                        item.category === "D"
                          ? "bg-purple-600/90 text-white"
                          : "bg-emerald-600/90 text-white"
                      }`}
                    >
                      {item.category === "D" ? "Voucher Digital" : "Hadiah Fisik"}
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Harga Penukaran
                      </span>
                      <span className="inline-flex items-center gap-1 font-black text-sm text-amber-400">
                        <Coins size={14} />
                        {Number(item.point || 0).toLocaleString()} Poin
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenClaim(item)}
                      className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold rounded-xl shadow-md transition cursor-pointer"
                    >
                      Tukar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Promo Hub & Download Center */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Promo Flyers */}
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="text-amber-400" size={20} />
                  <span>Flyer & Brosur Promosi</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Unduh brosur resmi untuk promosi ke pelanggan toko Anda
                </p>
              </div>
              <Link
                to="/promotion"
                className="text-xs font-bold text-amber-400 hover:text-amber-300"
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="space-y-3">
              {promotions.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900">
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
                    <p className="text-[11px] text-slate-400 mt-1">
                      Format: PDF & Gambar HD
                    </p>
                  </div>
                  {p.pdf ? (
                    <a
                      href={p.pdf}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition shrink-0"
                      title="Download PDF Brosur"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-500">Gambar</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Gerai M-Point & Network Locator */}
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <MapPin className="text-teal-400" size={20} />
                  <span>Jaringan Titik Gerai M-Point</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Temukan lokasi gerai agen mitra untuk setoran & penarikan tunai
                </p>
              </div>
              <Link
                to="/mpoint"
                className="text-xs font-bold text-teal-400 hover:text-teal-300"
              >
                Buka Peta →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mpoints.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-white truncate">
                      {m.nama || "Gerai M-Point"}
                    </h4>
                    <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-400 font-extrabold text-[9px]">
                      AKTIF
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {m.alamat || "Alamat lokasi agen MPStore"}
                  </p>
                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-teal-400 font-bold">
                    <span>{m.telepon || "0812345678"}</span>
                    <Link to="/mpoint" className="hover:underline">
                      Rute →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 4. Claim Reward Modal (E-Commerce Checkout Simulation) */}
      {claimModalOpen && selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            {!claimSuccess ? (
              <>
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-2xl border border-emerald-500/30">
                    <Gift size={28} />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Konfirmasi Penukaran Hadiah
                  </h3>
                  <p className="text-xs text-slate-400">
                    Poin Anda akan dipotong sesuai dengan jumlah harga hadiah.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-white">
                    {selectedReward.title}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                    <span className="text-slate-400">Biaya Poin:</span>
                    <span className="font-black text-amber-400 flex items-center gap-1">
                      <Coins size={14} />
                      {Number(selectedReward.point || 0).toLocaleString()} Poin
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setClaimModalOpen(false)}
                    className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmClaim}
                    className="py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
                  >
                    Tukar Sekarang
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-4 animate-fade-in">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-black text-white">
                  Penukaran Berhasil! 🎉
                </h3>
                <p className="text-xs text-slate-300">
                  Permintaan penukaran hadiah Anda telah kami terima. Tim MPStore akan segera memproses pengiriman hadiah Anda.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
