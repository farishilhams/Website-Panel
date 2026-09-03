import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthRole } from "../utils/authHelper";

export default function RedirectAfterLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = getAuthRole();

    if (!role) {
      navigate("/login", { replace: true });
      return;
    }

    switch (role) {
      case "super_admin":
        navigate("/dashboard", { replace: true });
        break;
      case "content_admin":
        navigate("/content-admin/dashboard", { replace: true });
        break;
      case "marketing":
        navigate("/marketing/dashboard", { replace: true });
        break;
      case "reseller":
        navigate("/reseller/dashboard", { replace: true });
        break;
      case "viewer":
      default:
        navigate("/viewer/dashboard", { replace: true });
        break;
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white font-sans">
      <div className="text-center space-y-3 animate-fade-in">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-bold">
          Mengalihkan ke dashboard peran Anda...
        </p>
      </div>
    </div>
  );
}
