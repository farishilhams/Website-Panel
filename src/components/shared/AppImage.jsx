import { useState } from "react";
import { getImageUrl, getDiverseImage } from "../../utils/api";
import { loadedImagesCache } from "../../utils/dataCache";
import { ZoomIn } from "lucide-react";

export default function AppImage({
  src,
  alt = "MPStore Image",
  category = "default",
  seed = "",
  className = "",
  containerClassName = "",
  allowZoom = false,
  showSkeleton = true,
}) {
  const effectiveSeed = seed || alt || src || category;

  const finalSrc = getImageUrl(src, category, effectiveSeed);

  // Jika URL ini sudah pernah dimuat di sesi ini, langsung set loaded = true (0 delay)
  const isPrecached = Boolean(finalSrc && loadedImagesCache.has(finalSrc));

  const [loaded, setLoaded] = useState(isPrecached);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const displaySrc = error
    ? getDiverseImage(category, effectiveSeed)
    : finalSrc;

  const handleImageLoaded = () => {
    if (finalSrc) {
      loadedImagesCache.add(finalSrc);
    }
    setLoaded(true);
  };

  return (
    <>
      <div
        className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800/40 flex items-center justify-center ${containerClassName}`}
      >
        {/* Subtle Shimmer Skeleton during first load only */}
        {!loaded && showSkeleton && (
          <div className="absolute inset-0 animate-shimmer bg-slate-200/60 dark:bg-slate-700/40" />
        )}

        <img
          src={displaySrc}
          alt={alt}
          loading="lazy"
          onLoad={handleImageLoaded}
          onError={() => {
            setError(true);
            setLoaded(true);
          }}
          className={`transition-all duration-300 ease-out ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-98"
          } ${className}`}
        />

        {/* Optional Zoom Button */}
        {allowZoom && loaded && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
            className="absolute bottom-2 right-2 p-2 rounded-xl bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100 shadow-md cursor-pointer"
            title="Perbesar gambar"
          >
            <ZoomIn size={16} />
          </button>
        )}
      </div>

      {/* Lightbox Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-3 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={displaySrc}
              alt={alt}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl mx-auto"
            />
            <div className="p-3 flex justify-between items-center bg-slate-950 border border-slate-800 mt-3 rounded-2xl">
              <span className="text-xs font-bold text-slate-200 truncate pr-4">
                {alt}
              </span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
