# 🏬 Website Panel MPStore

Platform web panel manajemen operasional dan ekosistem digital terpadu berbasis **Full-Stack Single Project** yang mengintegrasikan aplikasi Frontend dan Backend dengan sistem keamanan bertingkat, 5 peran pengguna (*Role-Based Access Control / RBAC*), dan antarmuka modern responsif (*Mobile-First*).

---

## 📁 Struktur Direktori Proyek

```plaintext
Website Panel MPStore/
├── src/                     # Seluruh Komponen, Halaman, dan Layout Frontend (React + Vite)
│   ├── components/          # Komponen UI Admin, Reseller, Viewer, dan Shared
│   ├── pages/               # Halaman dashboard & modul fitur 5 role
│   ├── layouts/             # Layout terpisah (AdminLayout, ResellerLayout, ViewerLayout)
│   ├── utils/               # Helper API, autentikasi JWT, audit log, data cache
│   └── Auth/                # Alur Login, Register, Logout, Redirect
│
├── api/                     # Serverless API Handler
│   └── index.js             # Entry point API runtime
│
├── controllers/             # 15 Controller modul logika bisnis backend
├── routes/                  # 15 Rute API terproteksi JWT & RBAC
├── middlewares/             # Autentikasi JWT, validasi input & upload multer
├── models/                  # Abstraksi data layer Supabase PostgreSQL
├── database/                # Skema SQL database Supabase
├── config/                  # Konfigurasi Supabase & Environment
├── utils/                   # Utilitas helper backend (storage, dll)
├── uploads/                 # Direktori upload file lokal
├── public/                  # Aset statis (Logo MPStore, favicon, ikon web)
│
├── app.js                   # Konfigurasi aplikasi Express & middleware keamanan
├── server.js                # Runner server backend lokal
├── vite.config.ts           # Konfigurasi Vite & proxy rute API lokal
├── vercel.json              # Konfigurasi perutean cerdas API & SPA
├── package.json             # Dependensi terpadu Frontend & Backend
└── .gitignore               # Proteksi kredensial .env & dependensi
```

---

## 👥 5 Tingkat Peran Pengguna (RBAC)

Platform ini memiliki 5 portal pengalaman yang disesuaikan secara khusus berdasarkan hak akses:

| Peran | Kredensial Default | Hak Akses & Fitur Utama |
| :--- | :--- | :--- |
| **Super Admin** | `super-admin` / `superadmin` | Kendali penuh seluruh modul, manajemen akun pengguna, audit logging keamanan, dan monitor kesehatan server live |
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

- **Dynamic CORS Whitelist**: Pembatasan domain asal (*origin*) yang mengizinkan akses klien terdaftar dan sesi server-to-server.
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
- **Autentikasi**: JSON Web Token (JWT) + BcryptJS Password Hashing
- **File Upload**: Multer Storage Handler
- **Data Export**: SheetJS (XLSX) Lightweight Reporting

---

## 💻 Panduan Menjalankan Secara Lokal

### 1. Instalasi Dependensi
Jalankan perintah ini di direktori utama:
```bash
npm install
```

### 2. Menjalankan Aplikasi
Pilih mode yang diinginkan:

- **Jalankan Frontend & Backend Sekaligus (Rekomendasi)**:
  ```bash
  npm run dev:all
  ```
  *Frontend aktif di `http://localhost:5173` dan Backend aktif di `http://localhost:3001`.*

- **Jalankan Frontend Saja**:
  ```bash
  npm run dev
  ```

- **Jalankan Backend Saja**:
  ```bash
  npm run server
  ```

- **Build Produksi**:
  ```bash
  npm run build
  ```
