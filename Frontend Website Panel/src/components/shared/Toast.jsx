import { useState, useEffect, createContext, useContext } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Floating Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white font-medium text-sm transition-all duration-300 transform translate-y-0 animate-fade-in border ${
              toast.type === "success"
                ? "bg-emerald-600/95 border-emerald-500 shadow-emerald-500/20"
                : toast.type === "error"
                ? "bg-rose-600/95 border-rose-500 shadow-rose-500/20"
                : toast.type === "warning"
                ? "bg-amber-600/95 border-amber-500 shadow-amber-500/20"
                : "bg-blue-600/95 border-blue-500 shadow-blue-500/20"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 size={20} />}
            {toast.type === "error" && <XCircle size={20} />}
            {toast.type === "warning" && <AlertTriangle size={20} />}
            {toast.type === "info" && <Info size={20} />}
            <span className="max-w-xs">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto opacity-70 hover:opacity-100 transition p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if not inside provider
    return {
      addToast: (msg) => console.log("Toast:", msg),
    };
  }
  return context;
}
