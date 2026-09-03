import axios from "axios";
import { getAuthToken, clearAuthSession } from "./authHelper";

// Base API URL: In production on Vercel, uses same-origin (""), locally uses localhost:3001
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.PROD ? "" : "http://localhost:3001");

// Axios client
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor for JWT
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiry handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/") {
        console.warn("Session expired. Logging out...");
        clearAuthSession();
        window.location.href = "/login?expired=1";
      }
    }
    return Promise.reject(error);
  }
);

// Diverse curated high-definition images for each module category
export const DIVERSE_PLACEHOLDERS = {
  slider: [
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556742049-0a67e5572263?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80",
  ],
  news: [
    "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
  ],
  rewards: [
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop&q=80",
  ],
  promotion: [
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80",
  ],
  tips: [
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
  ],
  popup: [
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80",
  ],
  intro: [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=80",
  ],
};

export const PLACEHOLDERS = {
  slider: DIVERSE_PLACEHOLDERS.slider[0],
  news: DIVERSE_PLACEHOLDERS.news[0],
  rewards: DIVERSE_PLACEHOLDERS.rewards[0],
  popup: DIVERSE_PLACEHOLDERS.popup[0],
  tips: DIVERSE_PLACEHOLDERS.tips[0],
  promotion: DIVERSE_PLACEHOLDERS.promotion[0],
  intro: DIVERSE_PLACEHOLDERS.intro[0],
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  default: DIVERSE_PLACEHOLDERS.default[0],
};

// Return a distinct, unique image per item/title/id
export const getDiverseImage = (category = "default", seed = "") => {
  const list = DIVERSE_PLACEHOLDERS[category] || DIVERSE_PLACEHOLDERS.default;
  if (!seed) return list[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % list.length;
  return list[index];
};

// Safe image URL resolver
export const getImageUrl = (imagePath, category = "default", seed = "") => {
  if (!imagePath || typeof imagePath !== "string" || imagePath.trim() === "") {
    return getDiverseImage(category, seed);
  }
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const cleanPath = imagePath.replace(/^\/+/, "");
  return `${API_BASE_URL}/${cleanPath}`;
};

export default api;
