# 🏬 Website Panel MPStore

Platform web panel manajemen ekosistem digital MPStore terpadu berbasis arsitektur **Modern Full-Stack Single Project** yang menggabungkan antarmuka Frontend modern dan layanan RESTful API Backend dengan sistem keamanan berlapis, 5 peran pengguna (*Role-Based Access Control / RBAC*), serta desain responsif (*Mobile-First*).

---

## 📁 Struktur Direktori Terpadu (Full-Stack Unified)

Struktur proyek kini disatukan dalam satu repositori utama yang bersih, efisien, dan siap dideploy ke **Vercel** dengan arsitektur *Zero-Config*:

```plaintext
Website Panel MPStore/
├── src/                         # Seluruh kode sumber Frontend (React 19 + Vite 6 + TailwindCSS 4)
│   ├── components/              # Komponen modular: Admin, Reseller, Viewer, dan Shared
│   ├── pages/                   # Halaman dashboard, profil, dan modul fitur per role
│   ├── layouts/                 # Layout peran: AdminLayout, ResellerLayout, ViewerLayout
│   ├── utils/                   # Helper API (Axios), autentikasi, audit log, data cache
│   └── Auth/                    # Portal Login, Register, Logout, dan Redirect Role
│
├── public/                      # Aset gambar publik, logo MPStore, favicon, ikon PWA
│
├── api/                         # Serverless Function Entrypoint untuk Vercel
│   └── index.js                 # Handler eksekusi Express API di cloud serverless
│
├── controllers/                 # 15 Controller logika bisnis & respon API
├── routes/                      # 15 Modul rute API terproteksi JWT & otorisasi RBAC
├── middlewares/                 # Middleware Auth JWT, verifikasi role, validasi input, Multer
├── models/                      # Abstraksi data layer Supabase Cloud Database (PostgreSQL)
├── database/                    # Skema SQL Supabase & file cadangan database
├── config/                      # Konfigurasi Supabase client & environment variable
├── utils/                       # Utilitas backend (Supabase Storage upload, format data)
├── uploads/                     # Direktori penampungan berkas sementara
│
├── app.js                       # Konfigurasi aplikasi Express, CORS dinamis & security headers
├── server.js                    # Server runner Express untuk lingkungan lokal (Port 3001)
├── vite.config.ts               # Konfigurasi Vite dengan proxy otomatis ke backend lokal
├── vercel.json                  # Routing pintar: /api/* ke backend serverless, rute lain ke Vite SPA
├── package.json                 # Manajemen dependensi tunggal gabungan Frontend & Backend
└── .gitignore                   # Proteksi kredensial .env, build output (dist), & node_modules
```

---

## 👥 5 Tingkat Peran Pengguna (RBAC)

Platform ini menyediakan 5 portal pengalaman yang dirancang spesifik sesuai tanggung jawab pengguna:

| Peran | Username Default | Password Default | Hak Akses & Fitur Utama |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `super-admin` | `superadmin` | Kendali penuh seluruh modul, manajemen akun user, audit logging keamanan sistem, dan monitor kesehatan server (*live*) |
| **Content Admin** | `content-admin` | `superadmin` | Kurasi artikel berita, banner slider utama, popup promosi dialog, materi edukasi tips, dan siaran pengumuman |
| **Marketing** | `marketing` | `superadmin` | Manajemen kampanye promo flyer/PDF, katalog voucher loyalty rewards, banner slider, dan running text ticker |
| **Mitra Reseller** | `reseller` | `superadmin` | Portal e-commerce mitra, penukaran poin loyalty rewards, pencarian jaringan gerai M-Point, dan pohon relasi referral |
| **Viewer (Publik)** | `viewer` | `superadmin` | Portal majalah digital publik, baca berita terkini, info promo aktif, tips usaha, dan pengisian survei kuesioner |

---

## 🔌 15 Endpoint RESTful API Backend

Seluruh layanan backend terintegrasi langsung dengan Supabase PostgreSQL dan terproteksi autentikasi JWT:

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
| `/api/system/health` | `GET, POST` | Monitor latensi database Supabase, penggunaan RAM, dan status uptime |

---

## 🛡️ Standar Keamanan & Infrastruktur

- **Same-Domain Deployment**: Frontend dan API Backend berjalan di bawah domain yang sama pada Vercel, mengeliminasi isu CORS dan risiko keamanan antar-domain.
- **Dynamic CORS Whitelist**: Pembatasan domain asal (*origin*) yang memvalidasi klien resmi dan permintaan internal.
- **HTTP Security Headers**: Penerapan `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, dan `X-XSS-Protection: 1; mode=block`.
- **Pure JavaScript Hashing**: Menggunakan `bcryptjs` murni tanpa dependensi native C++ untuk kompatibilitas lintas sistem operasi dan lingkungan serverless.
- **Session-Only Storage**: Proteksi sesi aman otomatis terhapus saat tab browser ditutup demi keamanan perangkat publik.
- **Credential Protection**: Seluruh kredensial sensitif disimpan secara eksklusif dalam environment variables dan terlindungi oleh `.gitignore`.

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Framework**: React 19 + Vite 6
- **Styling**: TailwindCSS 4 + Custom Glassmorphism Design Tokens (Brand MPStore: `#0033CC` & `#00BB33`)
- **Routing**: React Router DOM v7 (Role-Aware Smart Routing & Layout Switcher)
- **Icons**: Lucide React & React Icons
- **Fitur Khusus**: Spotlight Command Palette (Pencarian Cepat `Ctrl+K`), Onboarding Tour Modal, Animasi Interaktif, Network Status Offline Banner, Modal Zoom Gambar Responsif.

### Backend
- **Runtime**: Node.js (Express 5)
- **Database**: PostgreSQL (Supabase Cloud Database)
- **Autentikasi**: JSON Web Token (JWT) + Bcrypt Password Hashing (`bcryptjs`)
- **Ekspor Data**: SheetJS (`xlsx`) ringan & cepat untuk laporan Excel
- **File Upload**: Multer + Supabase Storage Cloud Integration

---

## 🚀 Panduan Menjalankan di Komputer Lokal

### 1. Instalasi Dependensi
Jalankan di folder utama:
```bash
npm install
```

### 2. Menjalankan Aplikasi
Anda dapat memilih perintah yang paling sesuai dengan kebutuhan:

```bash
# OPSI A: Jalankan Frontend dan Backend SEKALIGUS (Rekomendasi!)
npm run dev:all

# OPSI B: Jalankan Frontend Saja
npm run dev
# Website aktif di http://localhost:5173

# OPSI C: Jalankan Backend Saja
npm run server
# API aktif di http://localhost:3001
```

### 3. Membangun Bundle Produksi (Build)
```bash
npm run build
# Hasil build terkompilasi ke folder /dist
```

---

## 🌐 Panduan Deployment ke Vercel (100% Gratis)

1. Buka [vercel.com](https://vercel.com/) dan login dengan akun GitHub Anda.
2. Klik tombol **`Add New...`** ➔ Pilih **`Project`**.
3. Di samping repositori **`Website-Panel`**, klik tombol **`Import`**.
4. **Konfigurasi Project**:
   - **Framework Preset**: Pilih **`Vite`** *(otomatis terdeteksi)*
   - **Root Directory**: Biarkan default **`./`** *(tanpa perlu diubah)*
   - **Build & Output Settings**: Biarkan default (`npm run build` ➔ `dist`)
5. **Environment Variables**:
   Buka accordion **Environment Variables** dan tambahkan 4 kunci berikut:
   - `JWT_SECRET` = `supersecretjwtkey`
   - `SUPABASE_URL` = `https://evhbcdcgqjfjwyrqdmau.supabase.co`
   - `SUPABASE_KEY` = `<YOUR_SUPABASE_SERVICE_ROLE_KEY>` (lihat di file .env lokal Anda)
   - `SUPABASE_STORAGE_BUCKET` = `website panel`
6. Klik **`Deploy`**. Dalam 20–30 detik, website panel MPStore Anda akan langsung aktif secara publik!
