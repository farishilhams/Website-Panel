import ViewerNavbar from "../components/viewer/ViewerNavbar";
import ViewerBottomNav from "../components/viewer/ViewerBottomNav";
import RunningTextTicker from "../components/shared/RunningTextTicker";
import PromoPopup from "../components/shared/PromoPopup";
import IntroOnboarding from "../components/shared/IntroOnboarding";

/**
 * ViewerLayout — Layout untuk role: viewer
 * Navbar horizontal di atas dengan live ticker bar
 * Running Text siaran informasi berjalan
 * Intro Onboarding tur panduan fitur (sekali saja untuk pengguna baru)
 * Modal Promo Popup otomatis jika ada penawaran aktif
 * Bottom navigation bar pada mobile (app-style)
 * Background gelap ala media portal / majalah digital
 */
export default function ViewerLayout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ background: "#0A0D14" }}
    >
      {/* Top Navbar */}
      <ViewerNavbar />

      {/* Running Text Ticker Siaran Langsung */}
      <RunningTextTicker variant="blue" />

      {/* Main Content — extra padding bottom on mobile for bottom nav */}
      <main className="flex-1 animate-fade-in pb-20 lg:pb-0">
        {children}
      </main>

      {/* Intro Onboarding Tur Panduan Fitur (sekali untuk pengguna baru) */}
      <IntroOnboarding />

      {/* Promo Popup Modal (jika ada promo aktif hari ini) */}
      <PromoPopup />

      {/* Bottom Nav (Mobile only — hidden on lg+) */}
      <ViewerBottomNav />
    </div>
  );
}
