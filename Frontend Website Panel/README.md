# 🏢 MPStore Website Panel — Portal Manajemen Operasional Bisnis Terpadu

**MPStore Website Panel** adalah platform pusat kendali dan ekosistem digital terpadu untuk mengelola seluruh aspek operasional bisnis MPStore. Panel ini dirancang untuk memfasilitasi komunikasi, kurasi konten publik, promosi, program loyalitas agen/mitra, serta pengawasan sistem secara aman dan terpusat.

---

## 🎯 Kegunaan & Fungsi Utama Website Panel

1. **Pusat Distribusi Konten & Berita Resmi (Content Hub)**:
   - Pengelolaan artikel berita, siaran pers, dan informasi penting bagi seluruh mitra dan masyarakat umum.
   - Moderasi laporan pembaca (*News Reports*) dan log statistik tayangan konten.

2. **Manajemen Promosi & Banner Slider (Marketing Engine)**:
   - Pengaturan tayangan korsel banner slider interaktif di halaman beranda.
   - Publikasi katalog penawaran khusus dan brosur promosi format PDF.
   - Manajemen *Popup Promosi* dialog interaktif saat aplikasi dibuka.

3. **Program Loyalitas Mitra Reseller (Loyalty & Rewards)**:
   - Katalog penukaran hadiah rewards berjenjang berdasarkan poin keaktifan.
   - Sistem pemantauan saldo dan riwayat poin loyalitas mitra (*M-Point*).
   - Visualisasi pohon relasi referral (*Interaksi & Referral Tree*) antara reseller perujuk dan agen mitra binaan.

4. **Komunikasi Langsung & Edukasi Pelanggan (Customer Engagement)**:
   - Manajemen informasi berjalan (*Running Text Ticker*) untuk siaran pesan penting secara real-time.
   - Kuesioner dan survei kepuasan interaktif untuk menyerap aspirasi pelanggan.
   - Panduan modul tips & trik operasional bisnis praktis bagi reseller.
   - Tur pengenalan fitur (*Onboarding Intro Screen*) untuk memandu pengguna baru.

5. **Keamanan & Pemantauan Sistem Real-time (System Health & Security)**:
   - Manajemen hak akses multi-peran dengan enkripsi kata sandi standar industri (*Bcrypt & JWT Session Architecture*).
   - Pelacak aktivitas audit terperinci (*Audit Logs*) dengan filter pencarian dan ekspor laporan ke format Excel/CSV.
   - Pemantauan metrik infrastruktur server secara langsung (*Live Latency Database Supabase, Node.js Memory Heap, dan Server Uptime*).

---

## 👥 5 Hak Akses Pengguna (Role-Based System)

| Peran (Role) | Ruang Lingkup & Tanggung Jawab |
|---|---|
| **Super Admin** | Akses administratif penuh ke seluruh modul, manajemen akun pengguna, audit logging, kesehatan server, dan pengaturan sistem. |
| **Content Admin** | Pengelolaan dan kurasi konten berita, banner slider, materi edukasi tips, pengumuman, dan layar intro. |
| **Marketing** | Pengelolaan program promosi, penawaran diskon, katalog rewards loyalty, siaran running text, dan pemantauan M-Point. |
| **Mitra Reseller** | Portal mandiri untuk memantau saldo poin, menukar hadiah rewards, mengakses materi promosi, serta memantau jaringan agen referral. |
| **Viewer** | Portal akses publik untuk membaca berita terbaru, menjelajahi katalog promosi, melihat informasi M-Point, dan mengisi survei kuesioner. |

---

## 🚀 Panduan Menjalankan Aplikasi

### Frontend (Vite + React):
```bash
npm install
npm run dev
```

### Backend (Express + Supabase):
```bash
npm install
npm start
```
