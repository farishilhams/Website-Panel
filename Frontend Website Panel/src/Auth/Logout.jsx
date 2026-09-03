import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthSession } from "../utils/authHelper";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    clearAuthSession();
    navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-300">
          Sedang keluar dari sesi...
        </span>
      </div>
    </div>
  );
}
