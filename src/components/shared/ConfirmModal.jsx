import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Hapus",
  message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  confirmText = "Hapus Data",
  cancelText = "Batal",
  isDanger = true,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={!isLoading ? onClose : undefined}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-fade-in">
        {/* Header */}
        <div className="p-6 pb-4 flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isDanger
                ? "bg-rose-100 text-rose-600"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 leading-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/80 rounded-xl transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2 ${
              isDanger
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
            }`}
          >
            {isLoading && (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{isLoading ? "Memproses..." : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
