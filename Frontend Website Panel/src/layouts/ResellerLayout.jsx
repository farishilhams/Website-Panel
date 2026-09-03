import ResellerNavbar from "../components/reseller/ResellerNavbar";
import ResellerBottomNav from "../components/reseller/ResellerBottomNav";
import RunningTextTicker from "../components/shared/RunningTextTicker";
import PromoPopup from "../components/shared/PromoPopup";
import IntroOnboarding from "../components/shared/IntroOnboarding";

/**
 * ResellerLayout — Layout untuk role: reseller
 * Navbar horizontal di atas (desktop)
 * Running Text siaran informasi penting
 * Intro Onboarding tur panduan fitur (sekali saja untuk pengguna baru)
 * Modal Promo Popup otomatis jika ada penawaran aktif
 * Bottom navigation bar pada mobile (app-style)
 * Background gelap ala marketplace e-commerce
 */
export default function ResellerLayout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ background: "#0A0D14" }}
    >
      {/* Top Navbar (Desktop & Tablet) */}
      <ResellerNavbar />

      {/* Running Text Ticker Siaran Langsung */}
      <RunningTextTicker variant="emerald" />

      {/* Main Content — extra padding bottom on mobile for bottom nav */}
      <main className="flex-1 animate-fade-in pb-20 lg:pb-0">
        {children}
      </main>

      {/* Intro Onboarding Tur Panduan Fitur (sekali untuk pengguna baru) */}
      <IntroOnboarding />

      {/* Promo Popup Modal (jika ada promo aktif hari ini) */}
      <PromoPopup />

      {/* Bottom Nav (Mobile only — hidden on xl+) */}
      <ResellerBottomNav />
    </div>
  );
}
