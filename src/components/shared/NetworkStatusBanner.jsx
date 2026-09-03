import { useState, useEffect } from "react";
import { WifiOff, Wifi, X } from "lucide-react";

/**
 * NetworkStatusBanner — Mendeteksi status koneksi internet secara real-time
 * Memberitahu pengguna saat offline dan mengonfirmasi saat online kembali.
 */
export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);
  const [isReconnected, setIsReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsReconnected(true);
      setShowBanner(true);
      const timer = setTimeout(() => {
        setShowBanner(false);
        setIsReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsReconnected(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner && isOnline) return null;

  return (
    <aside
      aria-label="Network Status"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-[92%] sm:w-auto px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl backdrop-blur-xl border transition-all duration-300 animate-slide-up flex items-center justify-between gap-3 select-none"
      style={{
        background: isReconnected
          ? "rgba(0, 187, 51, 0.95)"
          : "rgba(220, 38, 38, 0.95)",
        borderColor: isReconnected ? "rgba(0, 255, 100, 0.4)" : "rgba(255, 100, 100, 0.4)",
        color: "white",
        boxShadow: isReconnected
          ? "0 10px 30px rgba(0, 187, 51, 0.4)"
          : "0 10px 30px rgba(220, 38, 38, 0.4)",
      }}
    >
      <div className="flex items-center gap-2">
        {isReconnected ? (
          <Wifi size={16} className="text-white shrink-0 animate-pulse" />
        ) : (
          <WifiOff size={16} className="text-white shrink-0 animate-pulse" />
        )}
        <span>
          {isReconnected
            ? "Koneksi Terhubung Kembali. Data telah disinkronkan."
            : "Koneksi Terputus. Menampilkan data tersimpan dari memori cache."}
        </span>
      </div>

      <button
        onClick={() => setShowBanner(false)}
        className="p-1 rounded-lg hover:bg-white/20 transition shrink-0 cursor-pointer"
        title="Tutup pemberitahuan"
      >
        <X size={14} />
      </button>
    </aside>
  );
}
