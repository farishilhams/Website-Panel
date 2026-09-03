import { useNavigate, useLocation, Link } from "react-router-dom";
import { Store, Gift, Sparkles, MapPin, Users2, Lightbulb } from "lucide-react";

const MP_GREEN = "#00BB33";
const MP_BLUE = "#0033CC";

const NAV_LINKS = [
  { name: "Beranda", path: "/reseller/dashboard", icon: Store },
  { name: "Rewards", path: "/rewards", icon: Gift },
  { name: "Promo", path: "/promotion", icon: Sparkles },
  { name: "M-Point", path: "/mpoint", icon: MapPin },
  { name: "Referral", path: "/InteraksiPage", icon: Users2 },
  { name: "Tips", path: "/tips", icon: Lightbulb },
];

export default function ResellerBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(10,13,20,0.97)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,187,51,0.15)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.5)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-stretch justify-around px-1 py-1.5">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-all duration-200 min-w-0"
              style={{
                background: isActive ? "rgba(0,187,51,0.12)" : "transparent",
                color: isActive ? MP_GREEN : "rgba(255,255,255,0.35)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  size={20}
                  style={{
                    color: isActive ? MP_GREEN : "rgba(255,255,255,0.35)",
                    filter: isActive ? `drop-shadow(0 0 6px ${MP_GREEN}88)` : "none",
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
                      background: MP_GREEN,
                      animation: "glowGreen 2s infinite",
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "52px",
                  textAlign: "center",
                  color: isActive ? MP_GREEN : "rgba(255,255,255,0.35)",
                  fontFamily: "'Poppins', sans-serif",
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
