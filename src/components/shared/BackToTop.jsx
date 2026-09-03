import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300 || document.documentElement.scrollTop > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      title="Kembali ke atas"
      // bottom-24 on mobile (above bottom nav 64px + 16px gap), bottom-6 on lg+ (no bottom nav)
      className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-40 w-11 h-11 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl shadow-blue-600/30 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-blue-400/30 animate-fade-in"
    >
      <ArrowUp size={18} />
    </button>
  );
}
