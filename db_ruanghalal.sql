-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 20 Jun 2026 pada 16.49
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_ruanghalal`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int(11) NOT NULL,
  `nama_kategori` varchar(100) NOT NULL,
  `kelompok` varchar(100) DEFAULT 'Lainnya'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id_pembayaran` int(11) NOT NULL,
  `id_umkm` varchar(20) DEFAULT NULL,
  `jumlah_bayar` decimal(10,2) DEFAULT NULL,
  `bukti_transfer` varchar(255) DEFAULT NULL,
  `tgl_bayar` date DEFAULT NULL,
  `status_pembayaran` enum('Menunggu','Valid','Tolak') DEFAULT 'Menunggu'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pembayaran`
--

INSERT INTO `pembayaran` (`id_pembayaran`, `id_umkm`, `jumlah_bayar`, `bukti_transfer`, `tgl_bayar`, `status_pembayaran`) VALUES
(17, 'UMKM-002', 300000.00, 'dummy_bukti_2.jpg', '2026-06-09', 'Tolak'),
(18, 'UMKM-004', 300000.00, 'dummy_bukti_4.jpg', '2026-06-09', 'Tolak'),
(19, 'UMKM-006', 300000.00, 'dummy_bukti_6.jpg', '2026-06-09', 'Valid'),
(20, 'UMKM-008', 300000.00, 'dummy_bukti_8.jpg', '2026-06-09', 'Tolak'),
(21, 'UMKM-010', 300000.00, 'dummy_bukti_10.jpg', '2026-06-09', 'Tolak'),
(22, 'UMKM-012', 300000.00, 'dummy_bukti_12.jpg', '2026-06-09', 'Valid'),
(23, 'UMKM-014', 300000.00, 'dummy_bukti_14.jpg', '2026-06-09', 'Valid'),
(24, 'UMKM-016', 300000.00, 'dummy_bukti_16.jpg', '2026-06-09', 'Tolak'),
(25, 'UMKM-018', 300000.00, 'dummy_bukti_18.jpg', '2026-06-09', 'Valid'),
(26, 'UMKM-020', 300000.00, 'dummy_bukti_20.jpg', '2026-06-09', 'Tolak'),
(27, 'UMKM-021', -1.00, '1781925060902-Diagram Tanpa Judul.drawio (17).png', '2026-06-20', 'Valid'),
(30, 'UMKM-024', 300000.00, '1781965262177-Bukti Transfer.png', '2026-06-20', 'Valid');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengajuan_sertifikasi`
--

CREATE TABLE `pengajuan_sertifikasi` (
  `id_pengajuan` int(11) NOT NULL,
  `id_umkm` varchar(20) DEFAULT NULL,
  `nomor_registrasi` varchar(50) DEFAULT NULL,
  `status_pengajuan` varchar(50) DEFAULT NULL,
  `tgl_pengajuan` date DEFAULT NULL,
  `update_terakhir` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `umkm`
--

CREATE TABLE `umkm` (
  `id_umkm` varchar(20) NOT NULL,
  `nama_pemilik` varchar(100) DEFAULT NULL,
  `nama_usaha` varchar(100) DEFAULT NULL,
  `nib` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `kategori` varchar(50) DEFAULT NULL,
  `catatan_verifikasi` text DEFAULT NULL,
  `status_sertifikasi` varchar(50) DEFAULT 'Proses',
  `status_dokumen` varchar(20) DEFAULT 'Menunggu',
  `file_nib` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status_nib` varchar(20) DEFAULT 'Pending',
  `status_sjph` varchar(20) DEFAULT 'Pending',
  `status_manual_mutu` varchar(20) DEFAULT 'Pending',
  `file_sjph` varchar(255) DEFAULT NULL,
  `file_manual` varchar(255) DEFAULT NULL,
  `file_sertifikat` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `umkm`
--

INSERT INTO `umkm` (`id_umkm`, `nama_pemilik`, `nama_usaha`, `nib`, `email`, `no_hp`, `alamat`, `kategori`, `catatan_verifikasi`, `status_sertifikasi`, `status_dokumen`, `file_nib`, `updated_at`, `status_nib`, `status_sjph`, `status_manual_mutu`, `file_sjph`, `file_manual`, `file_sertifikat`) VALUES
('UMKM-001', NULL, 'Usaha Halal 1', '12345678901', 'umkm1@gmail.com', '081234567801', 'Jalan Halal No. 1, Jakarta', 'Minuman', NULL, 'Pendaftaran', 'Menunggu', NULL, '2026-06-09 03:34:32', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL),
('UMKM-002', NULL, 'Usaha Halal 2', '12345678902', 'umkm2@gmail.com', '081234567802', 'Jalan Halal No. 2, Jakarta', 'Bahan Baku', NULL, 'Pendaftaran', 'Menunggu', 'dummy_nib_2.pdf', '2026-06-09 03:34:32', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL),
('UMKM-003', NULL, 'Usaha Halal 3', '12345678903', 'umkm3@gmail.com', '081234567803', 'Jalan Halal No. 3, Jakarta', 'Kosmetik', NULL, 'Pendaftaran', 'Menunggu', NULL, '2026-06-09 03:34:32', 'Pending', 'Pending', 'Pending', 'dummy_sjph_3.pdf', 'dummy_manual_3.pdf', NULL),
('UMKM-004', NULL, 'Usaha Halal 4', '12345678904', 'umkm4@gmail.com', '081234567804', 'Jalan Halal No. 4, Jakarta', 'Obat & Suplemen', NULL, 'Terverifikasi', 'Lengkap', 'dummy_nib_4.pdf', '2026-06-09 03:34:32', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL),
('UMKM-005', NULL, 'Usaha Halal 5', '12345678905', 'umkm5@gmail.com', '081234567805', 'Jalan Halal No. 5, Jakarta', 'Makanan', NULL, 'Pendaftaran', 'Revisi', NULL, '2026-06-09 03:34:32', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL),
('UMKM-006', NULL, 'Usaha Halal 6', '12345678906', 'umkm6@gmail.com', '081234567806', 'Jalan Halal No. 6, Jakarta', 'Minuman', NULL, 'Pendaftaran', 'Menunggu', 'dummy_nib_6.pdf', '2026-06-09 03:34:32', 'Pending', 'Pending', 'Pending', 'dummy_sjph_6.pdf', 'dummy_manual_6.pdf', NULL),
('UMKM-007', NULL, 'Usaha Halal 7', '12345678907', 'umkm7@gmail.com', '081234567807', 'Jalan Halal No. 7, Jakarta', 'Bahan Baku', NULL, 'Pendaftaran', 'Menunggu', NULL, '2026-06-09 03:34:32', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL),
('UMKM-008', NULL, 'Usaha Halal 8', '12345678908', 'umkm8@gmail.com', '081234567808', 'Jalan Halal No. 8, Jakarta', 'Kosmetik', NULL, 'Sertifikat Terbit', 'Lengkap', 'dummy_nib_8.pdf', '2026-06-09 03:34:32', 'Pending', 'Pending', 'Pending', NULL, NULL, 'dummy_sertifikat_8.pdf'),
('UMKM-009', NULL, 'Usaha Halal 9', '12345678909', 'umkm9@gmail.com', '081234567809', 'Jalan Halal No. 9, Jakarta', 'Obat & Suplemen', NULL, 'Pendaftaran', 'Menunggu', NULL, '2026-06-09 03:34:32', 'Pending', 'Pending', 'Pending', 'dummy_sjph_9.pdf', 'dummy_manual_9.pdf', NULL),
('UMKM-010', NULL, 'Usaha Halal 10', '123456789010', 'umkm10@gmail.com', '081234567810', 'Jalan Halal No. 10, Jakarta', 'Makanan', NULL, 'Pendaftaran', 'Revisi', 'dummy_nib_10.pdf', '2026-06-09 03:34:32', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL),
('UMKM-011', NULL, 'Usaha Halal 11', '123456789011', 'umkm11@gmail.com', '081234567811', 'Jalan Halal No. 11, Jakarta', 'Minuman', NULL, 'Pendaftaran', 'Menunggu', NULL, '2026-06-09 03:34:32', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL),
('UMKM-012', NULL, 'Usaha Halal 12', '123456789012', 'umkm12@gmail.com', '081234567812', 'Jalan Halal No. 12, Jakarta', 'Bahan Baku', NULL, 'Sertifikat Terbit', 'Lengkap', 'dummy_nib_12.pdf', '2026-06-19 13:11:45', 'Pending', 'Pending', 'Pending', 'dummy_sjph_12.pdf', 'dummy_manual_12.pdf', '1781874705886-Sertifikat Halal.pdf'),
('UMKM-013', NULL, 'Usaha Halal 13', '123456789013', 'umkm13@gmail.com', '081234567813', 'Jalan Halal No. 13, Jakarta', 'Kosmetik', NULL, 'Pendaftaran', 'Menunggu', NULL, '2026-06-09 03:34:33', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL),
('UMKM-014', NULL, 'Usaha Halal 14', '123456789014', 'umkm14@gmail.com', '081234567814', 'Jalan Halal No. 14, Jakarta', 'Obat & Suplemen', NULL, 'Pendaftaran', 'Menunggu', 'dummy_nib_14.pdf', '2026-06-09 03:34:33', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL),
('UMKM-015', NULL, 'Usaha Halal 15', '123456789015', 'umkm15@gmail.com', '081234567815', 'Jalan Halal No. 15, Jakarta', 'Makanan', NULL, 'Pendaftaran', 'Revisi', NULL, '2026-06-09 03:34:33', 'Pending', 'Pending', 'Pending', 'dummy_sjph_15.pdf', 'dummy_manual_15.pdf', NULL),
('UMKM-016', NULL, 'Usaha Halal 16', '123456789016', 'umkm16@gmail.com', '081234567816', 'Jalan Halal No. 16, Jakarta', 'Minuman', NULL, 'Sertifikat Terbit', 'Lengkap', 'dummy_nib_16.pdf', '2026-06-09 03:34:33', 'Pending', 'Pending', 'Pending', NULL, NULL, 'dummy_sertifikat_16.pdf'),
('UMKM-017', NULL, 'Usaha Halal 17', '123456789017', 'umkm17@gmail.com', '081234567817', 'Jalan Halal No. 17, Jakarta', 'Bahan Baku', NULL, 'Pendaftaran', 'Menunggu', NULL, '2026-06-09 03:34:33', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL),
('UMKM-018', NULL, 'Usaha Halal 18', '123456789018', 'umkm18@gmail.com', '081234567818', 'Jalan Halal No. 18, Jakarta', 'Kosmetik', NULL, 'Pendaftaran', 'Menunggu', 'dummy_nib_18.pdf', '2026-06-09 03:34:33', 'Pending', 'Pending', 'Pending', 'dummy_sjph_18.pdf', 'dummy_manual_18.pdf', NULL),
('UMKM-019', NULL, 'Usaha Halal 19', '123456789019', 'umkm19@gmail.com', '081234567819', 'Jalan Halal No. 19, Jakarta', 'Obat & Suplemen', NULL, 'Pendaftaran', 'Menunggu', NULL, '2026-06-09 03:34:33', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL),
('UMKM-020', NULL, 'Usaha Halal 20', '123456789020', 'umkm20@gmail.com', '081234567820', 'Jalan Halal No. 20, Jakarta', 'Makanan', NULL, 'Sertifikat Terbit', 'Lengkap', 'dummy_nib_20.pdf', '2026-06-09 03:37:37', 'Pending', 'Pending', 'Pending', NULL, NULL, '1780976257463-TUGAS FINAL DASHBOARD PENGUKURAN DAN MONITORING - 544456 Erfasya Virdya Rizkiaira (1).pdf'),
('UMKM-021', NULL, 'Roti Bakar Budi', '12345', 'umkm@gmail.com', '08123456789', 'Yogyakarta', 'Makanan', '', 'Sertifikat Terbit', 'Lengkap', '1781874215387-NIB.pdf', '2026-06-19 13:10:47', 'Pending', 'Pending', 'Pending', '1781874215390-SPJH.pdf', '1781874215394-Manual Mutu.pdf', NULL),
('UMKM-024', NULL, 'Roti Bakar Enak', '123456789', 'umkm1@mail.com', '0811111234', 'Surabaya', 'Makanan', '', 'Sertifikat Terbit', 'Lengkap', '1781965195977-NIB.pdf', '2026-06-20 14:22:07', 'Pending', 'Pending', 'Pending', '1781965195978-SPJH.pdf', '1781965195980-Manual Mutu.pdf', '1781965327838-Sertifikat Halal.pdf');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Operasional') DEFAULT 'Operasional'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id_user`, `nama_lengkap`, `email`, `password`, `role`) VALUES
(17, 'Usaha Halal 1', 'umkm1@gmail.com', 'umkm123', ''),
(18, 'Usaha Halal 2', 'umkm2@gmail.com', 'umkm123', ''),
(19, 'Usaha Halal 3', 'umkm3@gmail.com', 'umkm123', ''),
(20, 'Usaha Halal 4', 'umkm4@gmail.com', 'umkm123', ''),
(21, 'Usaha Halal 5', 'umkm5@gmail.com', 'umkm123', ''),
(22, 'Usaha Halal 6', 'umkm6@gmail.com', 'umkm123', ''),
(23, 'Usaha Halal 7', 'umkm7@gmail.com', 'umkm123', ''),
(24, 'Usaha Halal 8', 'umkm8@gmail.com', 'umkm123', ''),
(25, 'Usaha Halal 9', 'umkm9@gmail.com', 'umkm123', ''),
(26, 'Usaha Halal 10', 'umkm10@gmail.com', 'umkm123', ''),
(27, 'Usaha Halal 11', 'umkm11@gmail.com', 'umkm123', ''),
(28, 'Usaha Halal 12', 'umkm12@gmail.com', 'umkm123', ''),
(29, 'Usaha Halal 13', 'umkm13@gmail.com', 'umkm123', ''),
(30, 'Usaha Halal 14', 'umkm14@gmail.com', 'umkm123', ''),
(31, 'Usaha Halal 15', 'umkm15@gmail.com', 'umkm123', ''),
(32, 'Usaha Halal 16', 'umkm16@gmail.com', 'umkm123', ''),
(33, 'Usaha Halal 17', 'umkm17@gmail.com', 'umkm123', ''),
(34, 'Usaha Halal 18', 'umkm18@gmail.com', 'umkm123', ''),
(35, 'Usaha Halal 19', 'umkm19@gmail.com', 'umkm123', ''),
(36, 'Usaha Halal 20', 'umkm20@gmail.com', 'umkm123', ''),
(39, 'UMKM', 'umkm@gmail.com', '123', ''),
(40, 'Admin', 'admin@gmail.com', '123', 'Admin'),
(41, 'UMKM 1', 'umkm1@mail.com', '123', '');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indeks untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id_pembayaran`),
  ADD KEY `id_umkm` (`id_umkm`);

--
-- Indeks untuk tabel `pengajuan_sertifikasi`
--
ALTER TABLE `pengajuan_sertifikasi`
  ADD PRIMARY KEY (`id_pengajuan`),
  ADD KEY `id_umkm` (`id_umkm`);

--
-- Indeks untuk tabel `umkm`
--
ALTER TABLE `umkm`
  ADD PRIMARY KEY (`id_umkm`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id_pembayaran` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT untuk tabel `pengajuan_sertifikasi`
--
ALTER TABLE `pengajuan_sertifikasi`
  MODIFY `id_pengajuan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`id_umkm`) REFERENCES `umkm` (`id_umkm`);

--
-- Ketidakleluasaan untuk tabel `pengajuan_sertifikasi`
--
ALTER TABLE `pengajuan_sertifikasi`
  ADD CONSTRAINT `pengajuan_sertifikasi_ibfk_1` FOREIGN KEY (`id_umkm`) REFERENCES `umkm` (`id_umkm`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
