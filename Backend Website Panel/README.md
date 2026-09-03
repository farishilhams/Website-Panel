# 🔌 MPStore Backend API Service — Layanan Backend & RESTful API Terpadu

**MPStore Backend API Service** adalah mesin backend terpusat yang melayani pertukaran data, autentikasi sesi aman, serta integrasi basis data PostgreSQL Supabase untuk seluruh aplikasi Website Panel MPStore.

---

## 🎯 Kegunaan & Cakupan Layanan API

1. **Autentikasi & Otorisasi Pengguna (Authentication & RBAC)**:
   - Manajemen sesi login dengan JWT (JSON Web Tokens) dan hashing kata sandi berbasis Bcrypt.
   - Proteksi otorisasi berbasis peran bertingkat (*Super Admin, Content Admin, Marketing, Reseller, Viewer*).
   - Pengelolaan profil mandiri oleh setiap pengguna (pembaruan username, kontak, alamat, dan kata sandi).

2. **Layanan RESTful API Modul Bisnis**:
   - `/api/news`: Distribusi artikel berita, kategori, dan gambar.
   - `/api/sliders`: Banner slider halaman depan.
   - `/api/promotion`: Katalog promosi dan berkas flyer PDF.
   - `/api/rewards`: Katalog penukaran hadiah rewards loyalitas.
   - `/api/mpoint`: Manajemen poin dan titik gerai mitra.
   - `/api/runnings`: Siaran teks berjalan (*running text*).
   - `/api/interaksi`: Pohon referral mitra dan downline agen.
   - `/api/kuesioner`: Survei kepuasan dan pengumpulan jawaban pengguna.
   - `/api/intro`: Slide panduan onboarding aplikasi.
   - `/api/audit-logs`: Pencatatan log aktivitas sistem untuk audit keamanan.
   - `/api/system/health`: Pemantauan latensi database Supabase, penggunaan memori RAM server, dan uptime.

---

## 🛡️ Standar Keamanan

- **Dynamic CORS Whitelist**: Pembatasan domain asal (*origin*) yang hanya mengizinkan klien terdaftar.
- **HTTP Security Headers**: Penerapan `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, dan `X-XSS-Protection`.
- **Session-Only Lifecycle**: Perlindungan sesi otomatis hangus saat browser ditutup untuk mencegah penyalahgunaan akun di komputer bersama.
