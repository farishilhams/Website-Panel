-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 31, 2025 at 06:32 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dump-panel`
--

-- --------------------------------------------------------

--
-- Table structure for table `interaksi`
--

CREATE TABLE `interaksi` (
  `id_interaksi` int NOT NULL,
  `id_reseller` int NOT NULL,
  `id_reference` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interaksi`
--

INSERT INTO `interaksi` (`id_interaksi`, `id_reseller`, `id_reference`, `created_at`, `updated_at`) VALUES
(1, 4, 5, '2025-07-22 15:35:48', '2025-07-22 16:00:09');

-- --------------------------------------------------------

--
-- Table structure for table `intro`
--

CREATE TABLE `intro` (
  `id` int NOT NULL,
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `isActive` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'N',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `intro`
--

INSERT INTO `intro` (`id`, `title`, `image`, `description`, `isActive`, `created_at`, `updated_at`) VALUES
(8, 'Selamat Datang Di MPStore', 'https://i.ibb.co/XZXJNY4Z/a147ba1a7cdf.jpg', 'Intro Pembuka Aplikasi', 'Y', '2025-07-24 15:43:14', '2025-07-25 10:59:47');

-- --------------------------------------------------------

--
-- Table structure for table `kuesioner`
--

CREATE TABLE `kuesioner` (
  `id` int UNSIGNED NOT NULL,
  `id_users` int NOT NULL,
  `role` enum('super_admin','content_admin','marketing','reseller','viewer') NOT NULL,
  `pesan` text NOT NULL,
  `parent_id` int DEFAULT NULL,
  `is_admin_reply` tinyint(1) DEFAULT '0',
  `status` enum('unanswered','answered') DEFAULT 'unanswered',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `kuesioner`
--

INSERT INTO `kuesioner` (`id`, `id_users`, `role`, `pesan`, `parent_id`, `is_admin_reply`, `status`, `created_at`) VALUES
(15, 5, 'viewer', 'Bagaimana cara mendapatkan reward?', NULL, 0, 'answered', '2025-07-24 12:15:21'),
(18, 1, 'super_admin', 'Silakan tukarkan poin Anda melalui halaman Reward Center.', 15, 1, 'unanswered', '2025-07-24 12:17:45');

-- --------------------------------------------------------

--
-- Table structure for table `mpoint`
--

CREATE TABLE `mpoint` (
  `idreseller` varchar(16) NOT NULL DEFAULT '',
  `nama_toko` varchar(50) NOT NULL DEFAULT '',
  `alamat` varchar(100) NOT NULL DEFAULT '',
  `status` int DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `telp` varchar(100) DEFAULT NULL,
  `tipe_toko` varchar(100) DEFAULT NULL,
  `jam_buka` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `mpoint`
--

INSERT INTO `mpoint` (`idreseller`, `nama_toko`, `alamat`, `status`, `latitude`, `longitude`, `created_at`, `created_by`, `updated_at`, `updated_by`, `telp`, `tipe_toko`, `jam_buka`) VALUES
('RS001', 'Toko Sukses Abadi', 'Jl. Merdeka No. 1, Bangkalan', 1, '-7.0372', '113.8526', '2025-07-24 22:04:52', 1, '2025-07-24 22:04:52', 1, '081234567001', 'Kios Pulsa', '08:00 - 21:00'),
('RS002', 'Warung Makmur', 'Ds. Manggisan, Burneh', 1, '-7.0381', '113.8543', '2025-07-24 22:04:52', 1, '2025-07-24 22:04:52', 1, '081234567002', 'Warung', '07:00 - 20:00'),
('RS003', 'Kios Andalan', 'Jl. Raya Kamal No. 22', 1, '-7.0375', '113.8511', '2025-07-24 22:04:52', 1, '2025-07-24 22:04:52', 1, '081234567003', 'Kios Grosir', '09:00 - 22:00'),
('RS004', 'Toko Laris Manis', 'Jl. Trunojoyo No. 5', 1, '-7.0386', '113.8534', '2025-07-24 22:04:52', 1, '2025-07-24 22:04:52', 1, '081234567004', 'Mini Market', '08:00 - 21:00'),
('RS005', 'MP Corner Bangkalan', 'Jl. Pendidikan No. 77', 1, '-7.0366', '113.8550', '2025-07-24 22:04:52', 1, '2025-07-24 22:04:52', 1, '081234567005', 'Outlet MPStore', '08:00 - 20:00'),
('RS006', 'Grosir Maju Jaya', 'Kompleks Pasar Kamal', 1, '-7.0390', '113.8562', '2025-07-24 22:04:52', 1, '2025-07-24 22:04:52', 1, '081234567006', 'Grosir', '06:00 - 18:00'),
('RS007', 'Toko Barokah', 'Jl. KH. Moh. Kholil', 1, '-7.0400', '113.8570', '2025-07-24 22:04:52', 1, '2025-07-24 22:04:52', 1, '081234567007', 'Warung Digital', '08:00 - 20:00'),
('RS008', 'Pojok PPOB', 'Perum Graha Kamal Indah', 1, '-7.0412', '113.8584', '2025-07-24 22:04:52', 1, '2025-07-24 22:04:52', 1, '081234567008', 'PPOB Agent', '08:00 - 22:00'),
('RS009', 'Konter Pulsa Alif', 'Jl. Banyuajuh No. 12', 1, '-7.0420', '113.8591', '2025-07-24 22:04:52', 1, '2025-07-24 22:04:52', 1, '081234567009', 'Konter Pulsa', '09:00 - 21:00'),
('RS010', 'MP Toserba', 'Jl. Raya Burneh No. 101', 0, '-7.0433', '113.8600', '2025-07-24 22:04:52', 1, '2025-07-24 22:04:52', 1, '081234567010', 'Toserba', '07:00 - 22:00'),
('RS011', 'Toko Indah Berkah', 'Jl. Melati No. 10', 1, NULL, NULL, '2025-07-25 11:08:28', 1, '2025-07-25 13:45:28', NULL, '08123456780', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text,
  `status` enum('1','0') NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `category_id` varchar(10) DEFAULT NULL,
  `link` varchar(100) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `image`, `description`, `status`, `created_at`, `updated_at`, `category_id`, `link`, `type`) VALUES
(168, 'QRIS Gratis Kini Tersedia', 'qris.jpg', 'QRIS bisa langsung digunakan', '1', '2025-07-18 09:43:16', '2025-07-18 09:43:16', '003', 'https://mpstore.co.id/news/3', 'berita'),
(170, 'Tips Jualan Online', 'tips.jpg', 'Naikkan omzet dengan strategi ini', '1', '2025-07-18 09:43:16', '2025-07-18 09:43:16', '005', 'https://mpstore.co.id/news/5', 'tips'),
(171, 'Mitra Meningkat 2x Lipat', 'mitra.jpg', 'Bukti kepercayaan terhadap MPStore', '1', '2025-07-18 09:43:16', '2025-07-18 09:43:16', '006', 'https://mpstore.co.id/news/6', 'berita'),
(172, 'MPPoint Jadi Favorit', 'mpoint.jpg', 'Banyak mitra menukar point', '1', '2025-07-18 09:43:16', '2025-07-18 09:43:16', '007', 'https://mpstore.co.id/news/7', 'berita'),
(173, 'KUR UMKM Resmi Hadir', 'kur.jpg', 'Bersama bank mitra terpercaya', '1', '2025-07-18 09:43:16', '2025-07-18 09:43:16', '008', 'https://mpstore.co.id/news/8', 'berita'),
(174, 'Update Aplikasi Versi Baru', 'update.jpg', 'Lebih ringan & cepat', '1', '2025-07-18 09:43:16', '2025-07-18 09:43:16', '009', 'https://mpstore.co.id/news/9', 'info'),
(175, 'E-Grocery Luncur Resmi', 'grocery.jpg', 'Belanja stok tanpa keluar rumah', '1', '2025-07-18 09:43:16', '2025-07-18 09:43:16', '010', 'https://mpstore.co.id/news/10', 'promo'),
(188, 'promo baju', 'https://i.ibb.co/DPtTNyyM/4fdc83c9bf50.png', 'diskon hingga 50%', '1', '2025-07-19 15:37:34', '2025-07-21 11:40:36', '011', 'https://promo.bajustore.com', 'promo'),
(189, 'promo akhir tahun', 'https://i.ibb.co/p64yD1vV/517b93410838.jpg', 'diskon besar 100%', '1', '2025-07-21 09:28:03', '2025-07-21 09:28:03', '012', 'https://promo.akhir.com', 'promo'),
(190, 'promo baju', 'https://i.ibb.co/27jfn0LC/405bbdbe5195.png', 'diskon hingga 50%', '1', '2025-07-22 10:04:43', '2025-07-23 09:25:18', 'diskon', 'https://promo.bajustore.com', 'promo'),
(191, 'promo akhir tahun', 'https://i.ibb.co/CKfPXvPv/c8a8c49787f1.jpg', 'diskon besar 100%', '1', '2025-07-23 09:22:58', '2025-07-23 09:22:58', '001', 'https://promo.akhir.com', 'promo');

-- --------------------------------------------------------

--
-- Table structure for table `news_reports`
--

CREATE TABLE `news_reports` (
  `id` int UNSIGNED NOT NULL,
  `id_users` int NOT NULL,
  `id_berita` int UNSIGNED NOT NULL,
  `jumlah` int DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `news_reports`
--

INSERT INTO `news_reports` (`id`, `id_users`, `id_berita`, `jumlah`, `created_at`) VALUES
(1, 6, 168, 2, '2025-07-23 12:37:42'),
(2, 2, 168, 1, '2025-07-30 13:56:39');

-- --------------------------------------------------------

--
-- Table structure for table `pengumuman`
--

CREATE TABLE `pengumuman` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `status` enum('1','0') NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `pengumuman`
--

INSERT INTO `pengumuman` (`id`, `title`, `description`, `status`, `created_at`, `updated_at`) VALUES
(98, 'Maintenance Sistem', 'Akan dilakukan maintenance sistem pada 20 Juli 2025', '1', '2025-07-17 20:18:20', '2025-07-17 20:18:20'),
(99, 'Pemeliharaan Server Pada Cafe', 'Akan ada pemeliharaan sistem tanggal 18 Juli', '1', '2025-07-17 20:18:20', '2025-07-19 13:37:24'),
(101, 'Update Aplikasi', 'Versi terbaru MPStore kini tersedia.', '1', '2025-07-17 20:18:20', '2025-07-17 20:18:20'),
(102, 'Perubahan Jam Operasional', 'Jam operasional kantor berubah menjadi 08.00-16.00', '1', '2025-07-17 20:18:20', '2025-07-17 20:18:20'),
(103, 'Perawatan Server', 'Server akan dirawat setiap hari Minggu', '1', '2025-07-17 20:18:20', '2025-07-18 16:45:09'),
(104, 'Fitur Baru', 'Fitur toko grosir digital kini tersedia!', '1', '2025-07-17 20:18:20', '2025-07-17 20:18:20'),
(105, 'Pemberitahuan Libur', 'Tanggal 17 Agustus libur nasional', '1', '2025-07-17 20:18:20', '2025-07-17 20:18:20'),
(106, 'Bantuan Dana UMKM', 'Akses bantuan dana dari pemerintah kini tersedia', '1', '2025-07-17 20:18:20', '2025-07-17 20:18:20'),
(107, 'Penyesuaian Tarif', 'Tarif PPOB akan disesuaikan mulai bulan depan', '1', '2025-07-17 20:18:20', '2025-07-17 20:18:20');

-- --------------------------------------------------------

--
-- Table structure for table `popup`
--

CREATE TABLE `popup` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('1','0') NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `link` text,
  `type` varchar(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'T',
  `display_day` enum('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `popup`
--

INSERT INTO `popup` (`id`, `title`, `deskripsi`, `image`, `status`, `created_at`, `updated_at`, `link`, `type`, `display_day`) VALUES
(171, 'Selamat Datang di Mpstore', 'Gabung Mitra Kami', 'https://i.ibb.co/mV5zr0s5/ec9bf021e7cd.jpg', '1', '2025-07-25 15:32:22', '2025-07-26 14:27:25', 'https://mpstore.co.id/', 'T', 'Tuesday'),
(172, 'Promo Cashback', 'Dapatkan cashback 10% hari ini!', 'popup2.jpg', '0', '2025-07-25 15:32:22', '2025-07-31 10:31:21', 'https://mpstore.co.id/promo', 'T', 'Tuesday'),
(173, 'QRIS Gratis', 'Daftar QRIS tanpa biaya!', 'popup3.jpg', '1', '2025-07-25 15:32:22', '2025-07-25 15:32:22', 'https://mpstore.co.id/qris', 'T', 'Wednesday'),
(174, 'Event Spesial', 'Ikuti webinar bisnis gratis', 'popup4.jpg', '1', '2025-07-25 15:32:22', '2025-07-25 15:32:22', 'https://mpstore.co.id/event', 'T', 'Thursday'),
(175, 'Pendaftaran Mitra', 'Gabung dan dapatkan bonus awal', 'popup5.jpg', '1', '2025-07-25 15:32:22', '2025-07-25 15:32:22', 'https://mpstore.co.id/mitra', 'T', 'Friday'),
(176, 'Tukar Point MP', 'Tukar MPPoint dengan hadiah menarik', 'popup6.jpg', '1', '2025-07-25 15:32:22', '2025-07-25 15:32:22', 'https://mpstore.co.id/rewards', 'T', 'Saturday'),
(177, 'Tips Sukses Jualan', 'Strategi meningkatkan penjualan', 'popup7.jpg', '1', '2025-07-25 15:32:22', '2025-07-25 15:32:22', 'https://mpstore.co.id/tips', 'T', 'Sunday'),
(178, 'Fitur Baru Rilis!', 'Coba fitur kasir terbaru MPStore', 'popup8.jpg', '1', '2025-07-25 15:32:22', '2025-07-25 15:32:22', 'https://mpstore.co.id/fitur', 'T', 'Monday'),
(179, 'Token PLN Hemat', 'Beli token PLN dengan harga promo', 'popup9.jpg', '1', '2025-07-25 15:32:22', '2025-07-25 15:32:22', 'https://mpstore.co.id/token', 'T', 'Tuesday'),
(180, 'Voucher Belanja', 'Dapatkan voucher belanja gratis', 'popup10.jpg', '1', '2025-07-25 15:32:22', '2025-07-25 15:32:22', 'https://mpstore.co.id/voucher', 'T', 'Wednesday');

-- --------------------------------------------------------

--
-- Table structure for table `promotion`
--

CREATE TABLE `promotion` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `image` text,
  `pdf` text,
  `status` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `promotion`
--

INSERT INTO `promotion` (`id`, `title`, `image`, `pdf`, `status`, `created_at`) VALUES
(9, 'Cashback Akhir Bulan', 'cashback.jpg', 'https://mpstore.co.id/promo/cashback2025.pdf', 1, '2025-07-19 21:16:15'),
(10, 'Bonus Member Baru', 'bonus_member.jpg', 'https://mpstore.co.id/promo/member2025.pdf', 1, '2025-07-19 21:16:15'),
(11, 'Diskon Produk Grosir', 'grosir.jpg', 'https://mpstore.co.id/promo/diskon2025.pdf', 1, '2025-07-19 21:16:15'),
(12, 'Promo Tiket Murah', 'tiket.jpg', 'https://mpstore.co.id/promo/tiket2025.pdf', 1, '2025-07-19 21:16:15'),
(13, 'Promo Token PLN', 'token.jpg', 'https://mpstore.co.id/promo/token2025.pdf', 1, '2025-07-19 21:16:15'),
(14, 'Paket Kombo Data', 'data.jpg', 'https://mpstore.co.id/promo/paket2025.pdf', 1, '2025-07-19 21:16:15'),
(15, 'QRIS Cashback', 'qris.jpg', 'https://mpstore.co.id/promo/qris2025.pdf', 1, '2025-07-19 21:16:15'),
(16, 'MPStore Week', 'week.jpg', 'https://mpstore.co.id/promo/week2025.pdf', 1, '2025-07-19 21:16:15'),
(17, 'Gratis Ongkir', 'ongkir.jpg', 'https://mpstore.co.id/promo/ongkir2025.pdf', 1, '2025-07-19 21:16:15');

-- --------------------------------------------------------

--
-- Table structure for table `rewards`
--

CREATE TABLE `rewards` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('1','0') NOT NULL DEFAULT '0',
  `point` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `idhadiah` varchar(255) DEFAULT NULL,
  `category` enum('F','D') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `rewards`
--

INSERT INTO `rewards` (`id`, `title`, `image`, `status`, `point`, `description`, `created_at`, `updated_at`, `idhadiah`, `category`) VALUES
(34, 'Voucher Pulsa 10k', 'voucher10k.png', '1', '100', 'Voucher pulsa senilai 10rb', '2025-07-19 01:00:42', '2025-07-19 01:00:42', 'H1001', 'F'),
(35, 'Voucher Pulsa 25k', 'voucher25k.png', '1', '200', 'Voucher pulsa senilai 25rb', '2025-07-19 01:00:42', '2025-07-19 01:00:42', 'H1002', 'F'),
(36, 'Tumbler MPStore', 'tumbler.png', '1', '300', 'Tumbler eksklusif', '2025-07-19 01:00:42', '2025-07-19 01:00:42', 'H1003', 'D'),
(37, 'Kaos MPStore', 'kaos.png', '1', '500', 'Kaos official MPStore', '2025-07-19 01:00:42', '2025-07-19 01:00:42', 'H1004', 'D'),
(38, 'Voucher Belanja', 'voucher.png', '1', '250', 'Voucher belanja di toko grosir', '2025-07-19 01:00:42', '2025-07-19 01:00:42', 'H1005', 'F'),
(39, 'Powerbank 5000mAh', 'powerbank.png', '1', '800', 'Powerbank untuk partner aktif', '2025-07-19 01:00:42', '2025-07-19 01:00:42', 'H1006', 'D'),
(40, 'Tas MPStore', 'tas.png', '1', '400', 'Tas keren MPStore', '2025-07-19 01:00:42', '2025-07-19 01:00:42', 'H1007', 'D'),
(41, 'Pulpen Eksklusif', 'pulpen.png', '1', '50', 'Pulpen edisi terbatas', '2025-07-19 01:00:42', '2025-07-19 01:00:42', 'H1008', 'D'),
(42, 'Voucher PLN', 'token.png', '1', '150', 'Token listrik 20.000', '2025-07-19 01:00:42', '2025-07-19 01:00:42', 'H1009', 'F'),
(43, 'Flashdisk 16GB', 'flashdisk.png', '1', '350', 'Flashdisk MPStore', '2025-07-19 01:00:42', '2025-07-19 01:00:42', 'H1010', 'D'),
(44, 'Diskon Natalan', 'https://i.ibb.co/rGpCX7ys/f8ce767cf714.jpg', '1', '100', 'Reward spesial akhir tahun', '2025-07-19 15:39:17', '2025-07-19 15:48:02', 'HD001', 'F'),
(45, 'Diskon Tahun Baru', 'https://i.ibb.co/60Z3pPjK/5f9f4f14a942.png', '1', '100', 'Reward spesial akhir tahun', '2025-07-23 10:37:47', '2025-07-23 10:37:47', 'HD001', 'F');

-- --------------------------------------------------------

--
-- Table structure for table `runnings`
--

CREATE TABLE `runnings` (
  `id` int UNSIGNED NOT NULL,
  `text` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `runnings`
--

INSERT INTO `runnings` (`id`, `text`, `created_at`, `updated_at`) VALUES
(11, 'Aplikasi UMKM terbaik', '2025-07-25 13:41:59', '2025-07-25 13:41:59'),
(12, 'Transaksi lebih aman dan cepat', '2025-07-25 13:41:59', '2025-07-28 14:03:34'),
(13, 'Nikmati fitur kasir gratis!', '2025-07-25 13:41:59', '2025-07-25 13:41:59'),
(14, 'Daftar QRIS tanpa biaya', '2025-07-25 13:41:59', '2025-07-25 13:41:59'),
(15, 'Dapatkan modal usaha sekarang', '2025-07-25 13:41:59', '2025-07-25 13:41:59'),
(16, 'Promo cashback hingga 10%', '2025-07-25 13:41:59', '2025-07-25 13:41:59'),
(17, 'Tersedia kulakan grosir digital', '2025-07-25 13:41:59', '2025-07-25 13:41:59'),
(18, 'MPPoint bisa ditukar hadiah', '2025-07-25 13:41:59', '2025-07-25 13:41:59'),
(19, 'Support 24/7 untuk Mitra MPStore', '2025-07-25 13:41:59', '2025-07-25 13:41:59'),
(20, 'Promo Diskon hingga 50% bulan ini!', '2025-07-28 11:49:22', '2025-07-28 11:49:22'),
(21, 'Nikmati fitur-fitur di kami', '2025-07-28 14:08:57', '2025-07-28 14:08:57');

-- --------------------------------------------------------

--
-- Table structure for table `sliders`
--

CREATE TABLE `sliders` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('1','0') NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `jenis` varchar(3) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `sliders`
--

INSERT INTO `sliders` (`id`, `title`, `link`, `image`, `status`, `created_at`, `updated_at`, `jenis`) VALUES
(55, 'Pemberitahuan QRIS', 'https://mpstore.co.id/qris/info', 'qris_slider.jpg', '1', '2025-07-21 12:29:52', '2025-07-21 12:29:52', 'QR'),
(56, 'Event Webinar UMKM', 'https://mpstore.co.id/event', 'webinar.jpg', '1', '2025-07-21 12:29:52', '2025-07-21 12:29:52', 'EVT'),
(57, 'Info Maintenance', 'https://mpstore.co.id/info/maintenance', 'maintenance.jpg', '1', '2025-07-21 12:29:52', '2025-07-21 12:29:52', 'INF'),
(58, 'Selamat datang di Mpstore', 'https://mpstore.co.id/', 'https://i.ibb.co/1Ydm5Rv4/1bcf2f686d19.jpg', '1', '2025-07-22 13:45:07', '2025-07-22 13:45:07', 'web');

-- --------------------------------------------------------

--
-- Table structure for table `tips`
--

CREATE TABLE `tips` (
  `id` int UNSIGNED NOT NULL,
  `image` text,
  `title` varchar(200) DEFAULT '',
  `youtube` text,
  `description` text,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `tips`
--

INSERT INTO `tips` (`id`, `image`, `title`, `youtube`, `description`, `created_at`) VALUES
(3, 'https://i.ibb.co/Q3QH9wcL/bdb2dd8fe62a.jpg', 'Tips Bisnis Online', 'https://youtu.be/vLK-ezCyJ0E?si=VCkefKg72kRgx_yM', 'Penjelasan detail tips', '2025-07-25 10:34:15'),
(4, 'tips1.jpg', 'Cara Menjadi Mitra MPStore', 'https://youtu.be/vid001', 'Panduan langkah awal menjadi mitra', '2025-07-25 10:35:30'),
(5, 'tips2.jpg', 'Tips Jualan Laris', 'https://youtu.be/vid002', 'Strategi jualan yang efektif', '2025-07-25 10:35:30'),
(6, 'tips3.jpg', 'Menggunakan Fitur Kasir', 'https://youtu.be/vid003', 'Tutorial fitur kasir gratis', '2025-07-25 10:35:30'),
(7, 'tips4.jpg', 'Daftar QRIS Gratis', 'https://youtu.be/vid004', 'Tutorial daftar QRIS dengan mudah', '2025-07-25 10:35:30'),
(8, 'tips5.jpg', 'Tukar MPPoint', 'https://youtu.be/vid005', 'Cara menukar point dengan reward', '2025-07-25 10:35:30'),
(9, 'tips6.jpg', 'Upload Produk di Aplikasi', 'https://youtu.be/vid006', 'Cara upload produk di MPStore', '2025-07-25 10:35:30'),
(10, 'tips7.jpg', 'Manfaatkan E-Grocery', 'https://youtu.be/vid007', 'Belanja stok tanpa ribet', '2025-07-25 10:35:30'),
(11, 'tips8.jpg', 'Cetak Struk Transaksi', 'https://youtu.be/vid008', 'Cetak struk dari aplikasi', '2025-07-25 10:35:30'),
(12, 'tips9.jpg', 'Pencatatan Keuangan Otomatis', 'https://youtu.be/vid009', 'Fitur laporan keuangan MPStore', '2025-07-25 10:35:30'),
(13, 'tips10.jpg', 'Mitra Sukses MPStore', 'https://youtu.be/vid010', 'Kisah inspiratif dari mitra sukses', '2025-07-25 10:35:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_users` int NOT NULL,
  `username_users` varchar(255) DEFAULT NULL,
  `password_users` varchar(255) DEFAULT NULL,
  `email_users` varchar(255) DEFAULT NULL,
  `telpon_users` varchar(255) DEFAULT NULL,
  `address_users` varchar(255) DEFAULT NULL,
  `role` enum('super_admin','content_admin','marketing','reseller','viewer') DEFAULT 'viewer',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_users`, `username_users`, `password_users`, `email_users`, `telpon_users`, `address_users`, `role`, `created_at`, `updated_at`) VALUES
(1, 'super-admin', '$2b$10$p/IxL1d8LuwdLPMsgH3dEeGn7tk7lQGhw.ro0H7SA9nauQoK3nVzu', 'super_admin@domain.com', '087850678458', 'Jl. Perjuangan No. 45', 'super_admin', '2025-07-15 10:53:35', '2025-07-22 08:58:02'),
(2, 'content-admin', '$2b$10$PkNuRICpPKntZAQbkUJan.TS57MyXMRxo7gJDNNJsnCawRpiMIDxC', 'content_admin@domain.com', '087850678453', 'Jl. Perjuangan No. 46', 'content_admin', '2025-07-22 07:05:04', '2025-07-22 08:57:11'),
(3, 'marketing', '$2b$10$wnQvViZBqDd0RZIvKbqCEOL0HrGk1Vnn7CyC4xDaNB/I6..IhP866', 'marketing@domain.com', '086666777888', 'jl. Perjuangan 47', 'marketing', '2025-07-22 09:25:08', '2025-07-22 09:25:08'),
(4, 'reseller', '$2b$10$3v0k.qDEde..vPGxUQLOLOt7K2P5ly6/ezW6uCYDMPAF98DzhQI1C', 'reseller@domain.com', '086666777654', 'jl. Perjuangan 48', 'reseller', '2025-07-22 09:26:17', '2025-07-22 09:26:17'),
(5, 'viewer', '$2b$10$x/svOh9kOuSyYampfny7iupBUzLKMFBYet3LACLqF7feGtQe3rAtG', 'viewer@domain.com', '086666777654', 'jl. Perjuangan 48', 'viewer', '2025-07-23 11:36:58', '2025-07-23 11:36:58'),
(6, 'farish', '$2b$10$VWskvAdU1lNKRqJKfboyS.yyT3gfzR1QayTYZmp8yEEOzqu.phFOW', 'farish@domain.com', '086666777654', 'jl. Perjuangan 49', 'viewer', '2025-07-23 11:39:41', '2025-07-23 11:39:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `interaksi`
--
ALTER TABLE `interaksi`
  ADD PRIMARY KEY (`id_interaksi`);

--
-- Indexes for table `intro`
--
ALTER TABLE `intro`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kuesioner`
--
ALTER TABLE `kuesioner`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_users` (`id_users`);

--
-- Indexes for table `mpoint`
--
ALTER TABLE `mpoint`
  ADD PRIMARY KEY (`idreseller`),
  ADD KEY `idreseller` (`idreseller`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news_reports`
--
ALTER TABLE `news_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_users` (`id_users`),
  ADD KEY `id_berita` (`id_berita`);

--
-- Indexes for table `pengumuman`
--
ALTER TABLE `pengumuman`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `popup`
--
ALTER TABLE `popup`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promotion`
--
ALTER TABLE `promotion`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `runnings`
--
ALTER TABLE `runnings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sliders`
--
ALTER TABLE `sliders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tips`
--
ALTER TABLE `tips`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_users`),
  ADD UNIQUE KEY `unique_username` (`username_users`),
  ADD UNIQUE KEY `email_users` (`email_users`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `interaksi`
--
ALTER TABLE `interaksi`
  MODIFY `id_interaksi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `intro`
--
ALTER TABLE `intro`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `kuesioner`
--
ALTER TABLE `kuesioner`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=192;

--
-- AUTO_INCREMENT for table `news_reports`
--
ALTER TABLE `news_reports`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pengumuman`
--
ALTER TABLE `pengumuman`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT for table `popup`
--
ALTER TABLE `popup`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=182;

--
-- AUTO_INCREMENT for table `promotion`
--
ALTER TABLE `promotion`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `rewards`
--
ALTER TABLE `rewards`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `runnings`
--
ALTER TABLE `runnings`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `sliders`
--
ALTER TABLE `sliders`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `tips`
--
ALTER TABLE `tips`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_users` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kuesioner`
--
ALTER TABLE `kuesioner`
  ADD CONSTRAINT `kuesioner_ibfk_1` FOREIGN KEY (`id_users`) REFERENCES `users` (`id_users`) ON DELETE CASCADE;

--
-- Constraints for table `news_reports`
--
ALTER TABLE `news_reports`
  ADD CONSTRAINT `news_reports_ibfk_1` FOREIGN KEY (`id_users`) REFERENCES `users` (`id_users`) ON DELETE CASCADE,
  ADD CONSTRAINT `news_reports_ibfk_2` FOREIGN KEY (`id_berita`) REFERENCES `news` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
