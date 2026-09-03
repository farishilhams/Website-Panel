import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Sparkles,
  Gift,
  MapPin,
  Megaphone,
  Lightbulb,
  MessageCircle,
  BarChart2,
} from "lucide-react";

const MP_BLUE = "#0033CC";

const NAV_LINKS = [
  { name: "Beranda", path: "/viewer/dashboard", icon: LayoutDashboard },
  { name: "Berita", path: "/viewer/berita", icon: Newspaper },
  { name: "Promo", path: "/viewer/promotion", icon: Sparkles },
  { name: "Rewards", path: "/viewer/rewards", icon: Gift },
  { name: "M-Point", path: "/viewer/mpoint", icon: MapPin },
  { name: "Info", path: "/viewer/pengumuman", icon: Megaphone },
  { name: "Tips", path: "/viewer/tips", icon: Lightbulb },
  { name: "Survey", path: "/viewer/kuesioner", icon: MessageCircle },
  { name: "Report", path: "/viewer/newsreport", icon: BarChart2 },
];

// Hanya tampilkan 5 item terpenting di bottom nav mobile
const MOBILE_NAV = NAV_LINKS.slice(0, 5);

export default function ViewerBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(10,13,20,0.97)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,51,204,0.2)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.5)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-stretch justify-around px-1 py-1.5">
        {MOBILE_NAV.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-all duration-200 min-w-0"
              style={{
                background: isActive ? "rgba(0,51,204,0.12)" : "transparent",
                color: isActive ? MP_BLUE : "rgba(255,255,255,0.35)",
              }}
            >
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon
                  size={20}
                  style={{
                    color: isActive ? "#6EA6FF" : "rgba(255,255,255,0.35)",
                    filter: isActive ? "drop-shadow(0 0 6px rgba(0,51,204,0.8))" : "none",
                    transition: "all 0.2s",
                  }}
                />
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-2px",
                      right: "-2px",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#6EA6FF",
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#6EA6FF" : "rgba(255,255,255,0.35)",
                  fontFamily: "'Poppins', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
