import { useState, useEffect } from "react";
import IntroTourModal from "./IntroTourModal";
import { getAuthUsername } from "../../utils/authHelper";

/**
 * IntroOnboarding — Komponen wrapper yang otomatis menampilkan slide
 * tur panduan fitur (IntroTourModal) SEKALI SAJA untuk pengguna baru.
 *
 * Konsep alur:
 *   SplashScreen (branding 3.5s) → Login → Redirect → Dashboard
 *   → [IntroOnboarding muncul otomatis jika pengguna BELUM PERNAH melihat intro]
 *   → Pengguna klik "Selesai & Mulai" → Tidak muncul lagi (disimpan di localStorage)
 *
 * Berbeda dengan:
 *   - SplashScreen: Animasi branding loading, SELALU tampil saat buka website.
 *   - PromoPopup: Flyer promosi harian dari marketing, per SESI (sessionStorage).
 *   - IntroOnboarding: Tur panduan fitur untuk edukasi pengguna baru, SEKALI SEUMUR AKUN (localStorage).
 */
export default function IntroOnboarding() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const username = getAuthUsername() || "user";
    const introKey = `intro_completed_${username}`;
    const hasCompletedIntro = localStorage.getItem(introKey);

    if (!hasCompletedIntro) {
      // Delay sedikit agar layout selesai render dulu, lalu tampilkan intro
      const timer = setTimeout(() => {
        setShowIntro(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    const username = getAuthUsername() || "user";
    const introKey = `intro_completed_${username}`;
    localStorage.setItem(introKey, "true");
    setShowIntro(false);
  };

  return (
    <IntroTourModal
      isOpen={showIntro}
      onClose={handleClose}
    />
  );
}
