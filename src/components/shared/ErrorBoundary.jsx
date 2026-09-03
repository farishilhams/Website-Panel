import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import MPStoreLogo from "../MPStoreLogo";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-white font-sans relative overflow-hidden"
          style={{ background: "#0A0D14" }}
        >
          <div className="max-w-md w-full text-center space-y-6 animate-scale-up p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-center mb-2">
              <MPStoreLogo size={36} showText={true} textColor="white" />
            </div>

            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                Terjadi Kendala Sistem
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aplikasi mengalami kendala teknis sementara. Data Anda tetap aman. Silakan muat ulang halaman ini.
              </p>
              {this.state.error && (
                <div className="p-2.5 bg-black/50 rounded-xl text-left border border-rose-500/20 max-h-24 overflow-y-auto">
                  <p className="text-[10px] text-rose-400 font-mono break-all">
                    {this.state.error.message || String(this.state.error)}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Muat Ulang Halaman</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <Home size={14} />
                <span>Beranda</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
