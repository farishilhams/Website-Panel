import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop — Otomatis mengembalikan scroll ke posisi paling atas
 * setiap kali pengguna berpindah halaman (route change).
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
