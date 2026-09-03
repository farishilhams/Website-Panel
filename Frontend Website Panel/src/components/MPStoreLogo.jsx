/**
 * MPStoreLogo — Menampilkan file logo PNG resmi MPStore
 * 
 * Props:
 *   size        : number — tinggi logo dalam px (default 36)
 *   variant     : "full" | "icon" — "full" menampilkan logo lengkap (emblem + MPStore), "icon" menampilkan lambang saja
 *   subtitle    : string — teks sub-label opsional (misal "Website Panel" atau "Mitra Portal")
 *   className   : string — class styling tambahan
 */
export default function MPStoreLogo({
  size = 36,
  variant = "full",
  subtitle = "",
  className = "",
}) {
  const imageSrc = variant === "icon" ? "/assets/mpstore-icon.png" : "/assets/mpstore-logo.png";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <img
        src={imageSrc}
        alt="MPStore"
        style={{
          height: `${size}px`,
          width: "auto",
          objectFit: "contain",
          display: "block",
        }}
        className="transition-transform duration-200 hover:scale-105"
      />
      {subtitle && (
        <span
          className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider hidden sm:inline-block"
          style={{
            background: "rgba(0, 51, 204, 0.15)",
            border: "1px solid rgba(0, 51, 204, 0.35)",
            color: "#6EA6FF",
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
