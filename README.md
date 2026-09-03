# 🏬 MPStore Web Panel (Monorepo)

> **Platform Web Panel Manajemen Ekosistem Digital MPStore Berbasis Role-Based Access Control (RBAC) 5 Tingkat Pengguna Menggunakan Integrasi Express.js RESTful API, React 19 + Vite, dan Database Cloud Supabase PostgreSQL**

Platform panel terpadu **MPStore Indonesia** berbasis **Monorepo** yang mengintegrasikan aplikasi Frontend dan Backend dengan sistem keamanan bertingkat, 5 peran pengguna (*Role-Based Access Control / RBAC*), dan desain modern responsif (*Mobile-First*).

---

## 📁 Struktur Direktori Monorepo

```plaintext
Website Panel MPStore/
├── Frontend Website Panel/      # Antarmuka Pengguna (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/          # Komponen Admin, Reseller, Viewer, dan Shared
│   │   ├── pages/               # Halaman dashboard & modul per role
│   │   ├── layouts/             # Layout terpisah (AdminLayout, ResellerLayout, ViewerLayout)
│   │   ├── utils/               # Helper API, autentikasi, audit log, cache
│   │   └── Auth/                # Halaman Login, Register, Logout, Redirect
│   ├── vercel.json              # Konfigurasi rewrite SPA routing Vercel
│   └── package.json
│
├── Backend Website Panel/       # RESTful API Server (Node.js + Express + Supabase)
│   ├── controllers/             # 15 Controller modul fitur
│   ├── routes/                  # 15 Rute API terproteksi JWT & RBAC
│   ├── middlewares/             # Autentikasi JWT, validasi role & upload multer
│   ├── models/                  # Abstraksi data layer Supabase PostgreSQL
│   ├── database/                # Skema SQL database Supabase
│   ├── api/index.js             # Serverless function handler Vercel
│   ├── vercel.json              # Konfigurasi deployment serverless Vercel
│   └── package.json
│
└── .gitignore                   # Proteksi kredensial .env & node_modules
```

---

## 👥 5 Tingkat Peran Pengguna (RBAC)

Platform ini memiliki 5 portal pengalaman yang disesuaikan secara khusus:

| Peran | Kredensial Default | Hak Akses & Fitur Utama |
| :--- | :--- | :--- |
| **Super Admin** | `super-admin` / `superadmin` | Kendali penuh, manajemen akun user, audit log keamanan, monitor kesehatan server live |
| **Content Admin** | `content-admin` / `contentadmin` | Kurasi artikel berita, banner slider utama, popup promosi, siaran pengumuman |
| **Marketing** | `marketing` / `marketing123` | Manajemen kampanye promo, katalog voucher rewards, banner slider, running text ticker |
| **Mitra Reseller** | `reseller` / `reseller123` | Portal e-commerce mitra, penukaran poin loyalty, pencarian gerai M-Point, pohon referral |
| **Viewer (Publik)** | `viewer` / `viewer123` | Portal majalah publik, baca berita terkini, info promo, survei kuesioner masukan |

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Framework**: React 19 + Vite 6
- **Styling**: TailwindCSS 4 + Custom Glassmorphism Design Tokens (Brand MPStore: `#0033CC` & `#00BB33`)
- **Routing**: React Router DOM v7 (Role-Aware Smart Routing & Layout Switcher)
- **Icons**: Lucide React
- **Fitur Khusus**: Spotlight Command Palette (Pencarian Cepat), Onboarding Tour Modal, Smooth Count Up Animation, Network Status Offline Banner, Safe Touch Image Modal.

### Backend
- **Runtime**: Node.js (Express 5)
- **Database**: PostgreSQL (Supabase Cloud Database)
- **Autentikasi**: JSON Web Token (JWT) + Bcrypt Password Hashing
- **Keamanan**: Dynamic CORS Origin Whitelist, HTTP Security Headers (`nosniff`, `SAMEORIGIN`, `XSS Protection`), Session-Only Storage.
- **Monitoring**: Latensi database live, utilitas RAM/Heap memory, dan server uptime tracking.

---

## 🚀 Panduan Menjalankan Secara Lokal

### 1. Backend
```bash
cd "Backend Website Panel"
npm install
npm start
# Server berjalan di http://localhost:3001
```

### 2. Frontend
```bash
cd "Frontend Website Panel"
npm install
npm run dev
# Aplikasi web berjalan di http://localhost:5173
```

---

## ☁️ Panduan Hosting ke Vercel (Monorepo)

Aplikasi ini telah disiapkan untuk langsung di-hosting ke **Vercel**:

1. **Deploy Frontend**:
   - Di dashboard Vercel, pilih repository ini.
   - Set **Root Directory** ke: `Frontend Website Panel`
   - Framework Preset: **Vite**
   - Tambahkan Environment Variable:
     - `VITE_API_URL` = URL backend Anda (misal `https://api-mpstore.vercel.app` atau URL backend produksi).

2. **Deploy Backend**:
   - Buat project baru di Vercel yang mengarah ke repository yang sama.
   - Set **Root Directory** ke: `Backend Website Panel`
   - Framework Preset: **Other**
   - Tambahkan Environment Variables dari `.env`:
     - `SUPABASE_URL` = URL project Supabase Anda
     - `SUPABASE_KEY` = Supabase Anon/Service Key
     - `JWT_SECRET` = Kunci rahasia JWT Anda
     - `PORT` = `3001`
