# 🏬 MPStore Web Panel

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
| **Super Admin** | `super-admin` / `superadmin` | Kendali penuh seluruh modul, manajemen akun user, audit logging keamanan, dan monitor kesehatan server live |
| **Content Admin** | `content-admin` / `contentadmin` | Kurasi artikel berita, banner slider utama, popup promosi dialog, materi edukasi tips, dan siaran pengumuman |
| **Marketing** | `marketing` / `marketing123` | Manajemen kampanye promo flyer/PDF, katalog voucher loyalty rewards, banner slider, dan running text ticker |
| **Mitra Reseller** | `reseller` / `reseller123` | Portal e-commerce mitra, penukaran poin loyalty rewards, pencarian jaringan gerai M-Point, dan pohon relasi referral |
| **Viewer (Publik)** | `viewer` / `viewer123` | Portal majalah digital publik, baca berita terkini, info promo aktif, tips usaha, dan pengisian survei kuesioner |

---

## 🔌 15 Endpoint RESTful API Backend

Layanan backend terintegrasi dengan Supabase PostgreSQL dan terproteksi JWT Authentication:

| Endpoint | Metode | Deskripsi Modul Layanan |
| :--- | :--- | :--- |
| `/api/user` | `GET, POST, PUT, DELETE` | Autentikasi sesi JWT, login/register, dan manajemen akun 5 role |
| `/api/news` | `GET, POST, PUT, DELETE` | Publikasi dan kurasi artikel berita resmi |
| `/api/sliders` | `GET, POST, PUT, DELETE` | Banner carousel slider interaktif halaman beranda |
| `/api/promotion` | `GET, POST, PUT, DELETE` | Katalog penawaran promosi dan flyer berkas PDF |
| `/api/rewards` | `GET, POST, PUT, DELETE` | Katalog penukaran hadiah program loyalitas mitra |
| `/api/mpoint` | `GET, POST, PUT, DELETE` | Informasi saldo poin dan direktori titik gerai M-Point |
| `/api/runnings` | `GET, POST, PUT, DELETE` | Siaran pesan berjalan (*running text marquee ticker*) |
| `/api/pengumuman` | `GET, POST, PUT, DELETE` | Siaran pengumuman resmi dan informasi mendesak |
| `/api/popup` | `GET, POST, PUT, DELETE` | Dialog popup promosi otomatis saat website dibuka |
| `/api/tips` | `GET, POST, PUT, DELETE` | Modul edukasi tips & trik pengembangan usaha mitra |
| `/api/kuesioner` | `GET, POST, PUT, DELETE` | Kuesioner dan survei kepuasan layanan pelanggan |
| `/api/interaksi` | `GET, POST, PUT` | Struktur pohon relasi agen referral downline mitra |
| `/api/intro` | `GET, POST, PUT, DELETE` | Slide panduan onboarding interaktif pengguna baru |
| `/api/news_reports`| `GET, POST, DELETE` | Laporan moderasi tanggapan dan komentar artikel |
| `/api/system/health` | `GET, POST` | Monitor latensi database Supabase, penggunaan RAM, dan uptime |

---

## 🛡️ Standar Keamanan & Infrastruktur

- **Dynamic CORS Whitelist**: Pembatasan domain asal (*origin*) yang hanya mengizinkan klien terdaftar.
- **HTTP Security Headers**: Penerapan `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, dan `X-XSS-Protection: 1; mode=block`.
- **Session-Only Storage**: Proteksi sesi aman otomatis terhapus saat browser ditutup untuk keamanan di perangkat publik.
- **Credential Protection**: Seluruh kredensial sensitif disimpan secara eksklusif dalam environment variables dan terlindungi oleh `.gitignore`.

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
- **File Upload**: Multer + Cloud/Local Upload Handler

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

