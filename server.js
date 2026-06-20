const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const app = express();

// --- 1. MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static('views'));
app.use('/uploads', express.static('uploads'));

// --- MIDDLEWARE SESSION ---
app.use(session({
    secret: 'halal-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// --- 2. KONEKSI DATABASE ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_ruanghalal'
});

db.connect(err => {
    if (err) {
        console.error('Database mati!', err);
    } else {
        console.log('Database Ruang Halal Terhubung!');
        
        const createTableUser = `
            CREATE TABLE IF NOT EXISTS user (
                id_user INT AUTO_INCREMENT PRIMARY KEY,
                nama_lengkap VARCHAR(100),
                email VARCHAR(100),
                password VARCHAR(100),
                role VARCHAR(20)
            )
        `;
        db.query(createTableUser);

        const createTableKategori = `
            CREATE TABLE IF NOT EXISTS kategori (
                id_kategori INT AUTO_INCREMENT PRIMARY KEY,
                nama_kategori VARCHAR(100) NOT NULL,
                kelompok VARCHAR(100) DEFAULT 'Lainnya'
            )
        `;
        db.query(createTableKategori);

        const createTableUMKM = `
            CREATE TABLE IF NOT EXISTS umkm (
                id_umkm VARCHAR(20) PRIMARY KEY,
                nama_usaha VARCHAR(100),
                nib VARCHAR(50),
                kategori VARCHAR(100),
                email VARCHAR(100),
                no_hp VARCHAR(20),
                alamat TEXT,
                file_nib VARCHAR(255),
                file_sjph VARCHAR(255),
                file_manual VARCHAR(255),
                status_dokumen VARCHAR(50) DEFAULT 'Menunggu',
                catatan_verifikasi TEXT,
                status_sertifikasi VARCHAR(50) DEFAULT 'Pendaftaran',
                file_sertifikat VARCHAR(255),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        db.query(createTableUMKM);

        const createTablePembayaran = `
            CREATE TABLE IF NOT EXISTS pembayaran (
                id_pembayaran INT AUTO_INCREMENT PRIMARY KEY,
                id_umkm VARCHAR(20),
                jumlah_bayar INT,
                bukti_transfer VARCHAR(255),
                tgl_bayar DATE,
                status_pembayaran VARCHAR(50) DEFAULT 'Menunggu'
            )
        `;
        db.query(createTablePembayaran, (err) => {
            if (!err) seedDummyData();
        });
    }
});

function seedDummyData() {
    db.query("SELECT COUNT(*) AS total FROM umkm", (err, results) => {
        if (!err && results[0].total === 0) {
            console.log('Menambahkan 20 data dummy UMKM...');
            const kategori = ['Makanan', 'Minuman', 'Bahan Baku', 'Kosmetik', 'Obat & Suplemen'];
            
            // Buat admin
            db.query("SELECT * FROM user WHERE email = 'admin@ruanghalal.id'", (err, res) => {
                if (!err && res.length === 0) {
                    db.query("INSERT INTO user (nama_lengkap, email, password, role) VALUES ('Admin Erfa', 'admin@ruanghalal.id', 'admin123', 'Admin')");
                }
            });

            // Insert data Kategori dummy jika kosong
            db.query("SELECT COUNT(*) AS totalKat FROM kategori", (err, resKat) => {
                if (!err && resKat[0].totalKat === 0) {
                    kategori.forEach(k => {
                        db.query("INSERT INTO kategori (nama_kategori, kelompok) VALUES (?, 'Lainnya')", [k]);
                    });
                }
            });

            for (let i = 1; i <= 20; i++) {
                const id_umkm = `UMKM-${String(i).padStart(3, '0')}`;
                const nama_usaha = `Usaha Halal ${i}`;
                const nib = `1234567890${i}`;
                const kat = kategori[i % 5];
                const email = `umkm${i}@gmail.com`;
                const no_hp = `0812345678${String(i).padStart(2, '0')}`;
                const alamat = `Jalan Halal No. ${i}, Jakarta`;
                
                let file_nib = i % 2 === 0 ? `dummy_nib_${i}.pdf` : null;
                let file_sjph = i % 3 === 0 ? `dummy_sjph_${i}.pdf` : null;
                let file_manual = i % 3 === 0 ? `dummy_manual_${i}.pdf` : null;
                let status_dokumen = i % 4 === 0 ? 'Lengkap' : (i % 5 === 0 ? 'Revisi' : 'Menunggu');
                let status_sertifikasi = 'Pendaftaran';
                let file_sertifikat = null;

                if (status_dokumen === 'Lengkap') {
                    if (i % 8 === 0) {
                        status_sertifikasi = 'Sertifikat Terbit';
                        file_sertifikat = `dummy_sertifikat_${i}.pdf`;
                    } else if (i % 6 === 0) {
                        status_sertifikasi = 'Audit Lapangan';
                    } else {
                        status_sertifikasi = 'Verifikasi Dokumen';
                    }
                }

                db.query("SELECT * FROM user WHERE email = ?", [email], (err, resUser) => {
                    if (!err && resUser.length === 0) {
                        db.query("INSERT INTO user (nama_lengkap, email, password, role) VALUES (?, ?, 'umkm123', 'UMKM')", [nama_usaha, email]);
                    }
                });

                const sqlUMKM = `INSERT INTO umkm (id_umkm, nama_usaha, nib, kategori, email, no_hp, alamat, file_nib, file_sjph, file_manual, status_dokumen, status_sertifikasi, file_sertifikat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                db.query(sqlUMKM, [id_umkm, nama_usaha, nib, kat, email, no_hp, alamat, file_nib, file_sjph, file_manual, status_dokumen, status_sertifikasi, file_sertifikat]);

                if (file_nib) {
                    let status_pembayaran = i % 3 === 0 ? 'Valid' : (i % 4 === 0 ? 'Tolak' : 'Menunggu');
                    const sqlBayar = `INSERT INTO pembayaran (id_umkm, jumlah_bayar, bukti_transfer, tgl_bayar, status_pembayaran) VALUES (?, ?, ?, CURDATE(), ?)`;
                    db.query(sqlBayar, [id_umkm, 300000, `dummy_bukti_${i}.jpg`, status_pembayaran]);
                }
            }
        }
    });
}

// --- 3. KONFIGURASI MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

// --- API UNTUK FORCE GENERATE DATA DUMMY ---
app.get('/api/reset-dummy', (req, res) => {
    db.query("DELETE FROM pembayaran", () => {
        db.query("DELETE FROM umkm", () => {
            db.query("DELETE FROM user WHERE role = 'UMKM'", () => {
                const kategori = ['Makanan', 'Minuman', 'Bahan Baku', 'Kosmetik', 'Obat & Suplemen'];
                for (let i = 1; i <= 20; i++) {
                    const id_umkm = `UMKM-${String(i).padStart(3, '0')}`;
                    const nama_usaha = `Usaha Halal ${i}`;
                    const nib = `1234567890${i}`;
                    const kat = kategori[i % 5];
                    const email = `umkm${i}@gmail.com`;
                    const no_hp = `0812345678${String(i).padStart(2, '0')}`;
                    const alamat = `Jalan Halal No. ${i}, Jakarta`;
                    
                    let file_nib = i % 2 === 0 ? `dummy_nib_${i}.pdf` : null;
                    let file_sjph = i % 3 === 0 ? `dummy_sjph_${i}.pdf` : null;
                    let file_manual = i % 3 === 0 ? `dummy_manual_${i}.pdf` : null;
                    let status_dokumen = i % 4 === 0 ? 'Lengkap' : (i % 5 === 0 ? 'Revisi' : 'Menunggu');
                    let status_sertifikasi = 'Pendaftaran';
                    let file_sertifikat = null;

                    if (status_dokumen === 'Lengkap') {
                        if (i % 8 === 0) {
                            status_sertifikasi = 'Sertifikat Terbit';
                            file_sertifikat = `dummy_sertifikat_${i}.pdf`;
                        } else if (i % 6 === 0) {
                            status_sertifikasi = 'Audit Lapangan';
                        } else {
                            status_sertifikasi = 'Verifikasi Dokumen';
                        }
                    }

                    db.query("INSERT INTO user (nama_lengkap, email, password, role) VALUES (?, ?, 'umkm123', 'UMKM')", [nama_usaha, email]);

                    const sqlUMKM = `INSERT INTO umkm (id_umkm, nama_usaha, nib, kategori, email, no_hp, alamat, file_nib, file_sjph, file_manual, status_dokumen, status_sertifikasi, file_sertifikat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    db.query(sqlUMKM, [id_umkm, nama_usaha, nib, kat, email, no_hp, alamat, file_nib, file_sjph, file_manual, status_dokumen, status_sertifikasi, file_sertifikat]);

                    if (file_nib) {
                        let status_pembayaran = i % 3 === 0 ? 'Valid' : (i % 4 === 0 ? 'Tolak' : 'Menunggu');
                        const sqlBayar = `INSERT INTO pembayaran (id_umkm, jumlah_bayar, bukti_transfer, tgl_bayar, status_pembayaran) VALUES (?, ?, ?, CURDATE(), ?)`;
                        db.query(sqlBayar, [id_umkm, 300000, `dummy_bukti_${i}.jpg`, status_pembayaran]);
                    }
                }
                res.send("<h1 style='font-family:sans-serif; color: green;'>Berhasil! 20 Data Dummy UMKM telah di-reset dan di-generate ulang.</h1><br><a href='/dashboard' style='font-family:sans-serif;'>Kembali ke Dashboard Admin</a>");
            });
        });
    });
});

// --- 4. API UMKM ---
app.get('/api/umkm', (req, res) => {
    db.query('SELECT * FROM umkm', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.get('/api/umkm/:id', (req, res) => {
    db.query('SELECT * FROM umkm WHERE id_umkm = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results[0]);
    });
});

app.post('/api/simpan', upload.single('file_nib'), (req, res) => {
    const { id, usaha, nib, kategori, email, hp, alamat } = req.body;
    const namaFile = req.file ? req.file.filename : null;
    const sql = "INSERT INTO umkm (id_umkm, nama_usaha, nib, kategori, email, no_hp, alamat, file_nib) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [id, usaha, nib, kategori, email, hp, alamat, namaFile], (err, result) => {
        if (err) return res.status(500).json({ status: "gagal", pesan: err.sqlMessage });
        res.json({ status: "sukses" });
    });
});

app.post('/api/update', (req, res) => {
    const { id, usaha, nib, kategori, email, hp, alamat } = req.body;
    const sql = "UPDATE umkm SET nama_usaha=?, nib=?, kategori=?, email=?, no_hp=?, alamat=? WHERE id_umkm=?";
    db.query(sql, [usaha, nib, kategori, email, hp, alamat, id], (err, result) => {
        if (err) return res.status(500).json({ status: "gagal", pesan: err.sqlMessage });
        res.json({ status: "sukses" });
    });
});

app.delete('/api/hapus/:id', (req, res) => {
    db.query('DELETE FROM pembayaran WHERE id_umkm = ?', [req.params.id], (err1, result1) => {
        if (err1) return res.status(500).json({ status: "gagal", pesan: err1.sqlMessage });
        db.query('DELETE FROM umkm WHERE id_umkm = ?', [req.params.id], (err, result) => {
            if (err) return res.status(500).json({ status: "gagal", pesan: err.sqlMessage });
            res.json({ status: "sukses" });
        });
    });
});

app.post('/api/umkm/upload-dokumen', upload.fields([
    { name: 'file_nib', maxCount: 1 },
    { name: 'file_sjph', maxCount: 1 },
    { name: 'file_manual', maxCount: 1 }
    ]), (req, res) => {
    const { id_umkm } = req.body;
    const file_nib = req.files && req.files['file_nib'] ? req.files['file_nib'][0].filename : null;
    const file_sjph = req.files && req.files['file_sjph'] ? req.files['file_sjph'][0].filename : null;
    const file_manual = req.files && req.files['file_manual'] ? req.files['file_manual'][0].filename : null;

    if (!file_nib || !file_sjph || !file_manual) {
        return res.status(400).json({ status: "gagal", pesan: "Semua dokumen (NIB, SJPH, Manual Mutu) wajib diunggah!" });
    }

    const sql = "UPDATE umkm SET file_nib = ?, file_sjph = ?, file_manual = ?, status_dokumen = 'Menunggu', status_sertifikasi = 'Verifikasi Dokumen' WHERE id_umkm = ?";
    db.query(sql, [file_nib, file_sjph, file_manual, id_umkm], (err, result) => {
        if (err) return res.status(500).json({ status: "gagal", pesan: err.sqlMessage });
        res.json({ status: "sukses" });
    });
});

// --- 5. API PEMBAYARAN ---
app.get('/api/pembayaran', (req, res) => {
    const sql = "SELECT p.*, u.nama_usaha FROM pembayaran p JOIN umkm u ON p.id_umkm = u.id_umkm";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/pembayaran/input', upload.single('bukti'), (req, res) => {
    const { id_umkm, jumlah, tgl } = req.body;
    const namaFile = req.file ? req.file.filename : null;
    if (!namaFile) return res.status(400).json({ status: "gagal", pesan: "File gambar wajib diupload!" });

    db.query("SELECT * FROM pembayaran WHERE id_umkm = ?", [id_umkm], (err, rows) => {
        if (err) return res.status(500).json({ status: "gagal", pesan: err.sqlMessage });
        
        // Begitu kirim bukti bayar, update status sertifikasi di UMKM jadi 'Verifikasi Bayar'
        const updateSertifTahap = "UPDATE umkm SET status_sertifikasi = 'Verifikasi Bayar' WHERE id_umkm = ?";
        db.query(updateSertifTahap, [id_umkm]);

        if (rows.length > 0) {
            const sqlUpdate = "UPDATE pembayaran SET jumlah_bayar = ?, bukti_transfer = ?, tgl_bayar = ?, status_pembayaran = 'Menunggu' WHERE id_umkm = ?";
            db.query(sqlUpdate, [jumlah, namaFile, tgl, id_umkm], (err, resUpdate) => res.json({ status: "sukses" }));
        } else {
            const sqlInsert = "INSERT INTO pembayaran (id_umkm, jumlah_bayar, bukti_transfer, tgl_bayar, status_pembayaran) VALUES (?, ?, ?, ?, 'Menunggu')";
            db.query(sqlInsert, [id_umkm, jumlah, namaFile, tgl], (err, resInsert) => res.json({ status: "sukses" }));
        }
    });
});

// FIXED LOGIC: UPDATE STATUS BAYAR VALID -> OTOMATIS STATUS JADI PROGRES (AUDIT LAPANGAN)
app.post('/api/pembayaran/update-status', (req, res) => {
    const { id, status } = req.body; // id di sini adalah id_pembayaran
    
    const sql = "UPDATE pembayaran SET status_pembayaran = ? WHERE id_pembayaran = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ status: "gagal", pesan: err.sqlMessage });
        
        if (status !== 'Valid') {
            return res.json({ status: "sukses" });
        }
        
        // JIKA STATUS BAYAR VALID, CARI ID_UMKM-NYA LALU SEGERA UPDATE STATUS SERTIFIKASI JADI 'AUDIT LAPANGAN'
        const sqlAudit = `
            UPDATE umkm u 
            JOIN pembayaran p ON u.id_umkm = p.id_umkm 
            SET u.status_sertifikasi = 'Audit Lapangan' 
            WHERE p.id_pembayaran = ? AND u.status_dokumen = 'Lengkap'
        `;
        db.query(sqlAudit, [id], (errAudit) => {
            if (errAudit) return res.status(500).json({ status: "gagal", pesan: errAudit.sqlMessage });
            res.json({ status: "sukses" });
        });
    });
});

// --- 6. API VERIFIKASI ---
app.get('/api/verifikasi-list', (req, res) => {
    const sql = "SELECT id_umkm, nama_usaha, nib, kategori, status_dokumen FROM umkm WHERE file_nib IS NOT NULL";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/verifikasi/simpan', (req, res) => {
    const { id, status_dokumen, catatan, status_sertifikasi } = req.body;
    const sql = `
        UPDATE umkm u 
        LEFT JOIN pembayaran p ON u.id_umkm = p.id_umkm 
        SET u.status_dokumen = ?, u.catatan_verifikasi = ?, 
            u.status_sertifikasi = CASE WHEN ? = 'Lengkap' AND p.status_pembayaran = 'Valid' THEN 'Audit Lapangan' ELSE ? END 
        WHERE u.id_umkm = ?
    `;
    db.query(sql, [status_dokumen, catatan, status_dokumen, status_sertifikasi, id], (err, result) => {
        if (err) return res.status(500).json({ status: "gagal", pesan: err.sqlMessage });
        res.json({ status: "sukses" });
    });
});

// --- 7. MIDDLEWARE PROTEKSI ROLE ---
const proteksiRole = (rolesWajib) => {
    return (req, res, next) => {
        if (!req.session.user) {
            console.log("Akses Ditolak: User belum login!");
            return res.redirect('/');
        }
        if (rolesWajib) {
            const allowedRoles = Array.isArray(rolesWajib) ? rolesWajib : [rolesWajib];
            let userRole = (req.session.user.role || '').trim().toLowerCase();
            if (userRole === '') userRole = 'umkm';
            const allowedRolesLower = allowedRoles.map(r => r.toLowerCase());
            if (!allowedRolesLower.includes(userRole)) {
                return res.status(403).send(`Akses Ditolak: Halaman ini khusus role ${req.session.user.role}.`);
            }
        }
        next();
    };
};

// --- 8. NAVIGASI ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views', 'register.html')));
app.get('/dashboard', proteksiRole('Admin'), (req, res) => res.sendFile(path.join(__dirname, 'views', 'mockup.html')));
app.get('/umkm', proteksiRole('UMKM'), (req, res) => res.sendFile(path.join(__dirname, 'views', 'umkm.html')));
app.get('/dashboard-umkm', proteksiRole('UMKM'), (req, res) => res.redirect('/umkm'));
app.get('/daftar-umkm', proteksiRole('Admin'), (req, res) => res.sendFile(path.join(__dirname, 'views', 'DaftarUMKM.HTML')));
app.get('/validasi-pembayaran', proteksiRole('Admin'), (req, res) => res.sendFile(path.join(__dirname, 'views', 'pembayaran.html')));
app.get('/verifikasi-dokumen', proteksiRole('Admin'), (req, res) => res.sendFile(path.join(__dirname, 'views', 'verifikasi.html')));
app.get('/upload-sertifikat', proteksiRole('Admin'), (req, res) => res.sendFile(path.join(__dirname, 'views', 'upload-sertifikat.html')));
app.get('/status-sertifikasi', proteksiRole('Admin'), (req, res) => res.sendFile(path.join(__dirname, 'views', 'status sertifikasi.html')));
app.get('/laporan', proteksiRole('Admin'), (req, res) => res.sendFile(path.join(__dirname, 'views', 'hal laporan yae.html')));
app.get('/users', proteksiRole('Admin'), (req, res) => res.sendFile(path.join(__dirname, 'views', 'users.html')));

// API PROGRES SERTIFIKASI (SINKRON 100% SAMA UI TIMELINE)
app.get('/api/progres-sertifikasi', (req, res) => {
    const sql = `
        SELECT u.id_umkm, u.nama_usaha, u.file_nib, u.status_dokumen, u.status_sertifikasi, u.updated_at, p.status_pembayaran 
        FROM umkm u 
        LEFT JOIN pembayaran p ON u.id_umkm = p.id_umkm
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        
        const dataProgres = results.map(item => {
            let persen = 20; 
            let tahap = "Pendaftaran Baru";

            if (item.file_nib) {
                persen = 40;
                tahap = "Verifikasi Dokumen";
            }
            if (item.status_dokumen === 'Lengkap') {
                persen = 60;
                tahap = "Verifikasi Bayar";
            }
            if (item.status_pembayaran === 'Valid' || item.status_sertifikasi === 'Audit Lapangan') {
                persen = 80;
                tahap = "Audit Lapangan (Progres)";
            }
            if (item.status_sertifikasi === 'Sertifikat Terbit') {
                persen = 100;
                tahap = "Sertifikat Terbit";
            }
            return { ...item, persen, tahap };
        });
        res.json(dataProgres);
    });
});

app.post('/api/sertifikasi/update-tahap', (req, res) => {
    const { id, tahap } = req.body;
    const sql = "UPDATE umkm SET status_sertifikasi = ? WHERE id_umkm = ?";
    db.query(sql, [tahap, id], (err, result) => {
        if (err) return res.status(500).json({ status: "gagal", pesan: err.sqlMessage });
        res.json({ status: "sukses" });
    });
});

app.get('/api/sertifikasi/list-upload', (req, res) => {
    const sql = `
        SELECT id_umkm, nama_usaha, status_sertifikasi, file_sertifikat 
        FROM umkm 
        WHERE status_sertifikasi IN ('Terverifikasi', 'Audit Lapangan', 'Sertifikat Terbit', 'Selesai')
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/sertifikasi/upload-sertifikat', upload.single('file_sertifikat'), (req, res) => {
    const { id } = req.body;
    const namaFile = req.file ? req.file.filename : null;
    if (!namaFile) return res.status(400).json({ status: "gagal", pesan: "File sertifikat wajib diupload!" });

    const sql = "UPDATE umkm SET status_sertifikasi = 'Sertifikat Terbit', file_sertifikat = ? WHERE id_umkm = ?";
    db.query(sql, [namaFile, id], (err, result) => {
        if (err) return res.status(500).json({ status: "gagal", pesan: err.sqlMessage });
        res.json({ status: "sukses" });
    });
});

function pdfText(value) { 
    return String(value || '-').replace(/[\\()]/g, '\\$&'); 
}

function buildSertifikatPdf(data) {
    const lines = [
        'SERTIFIKAT HALAL',
        'RUANGHALAL.ID',
        '',
        `Nomor Dokumen Resmi: ${data.id_umkm}`,
        `Nama Usaha: ${data.nama_usaha}`,
        `NIB: ${data.nib || '-'}`,
        `Kategori: ${data.kategori || '-'}`,
        '',
        'Status: SERTIFIKAT HALAL TERBIT',
        'Masa Berlaku: Berlaku Selamanya',
        'Sesuai Regulasi UU JPH Terbaru'
    ];
    
    const content = [
        'BT', '/F1 22 Tf', '72 730 Td', `(${pdfText(lines[0])}) Tj`,
        '/F1 13 Tf', '0 -28 Td', `(${pdfText(lines[1])}) Tj`, '/F1 11 Tf'
    ];
    
    lines.slice(2).forEach((line) => {
        content.push('0 -24 Td');
        content.push(`(${pdfText(line)}) Tj`);
    });
    content.push('ET');
    
    const stream = content.join('\n');
    const objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
        `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`
    ];
    
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((obj, index) => {
        offsets.push(Buffer.byteLength(pdf));
        pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
    });
    
    const xrefStart = Buffer.byteLength(pdf);
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
        pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
    return Buffer.from(pdf, 'binary');
}

app.get('/api/sertifikat/download/:id', (req, res) => {
    if (!req.session.user) return res.status(401).send('Belum login');
    const sql = "SELECT * FROM umkm WHERE id_umkm = ?";
    db.query(sql, [req.params.id], (err, rows) => {
        if (err) return res.status(500).send(err.sqlMessage);
        if (!rows.length) return res.status(404).send('Data UMKM tidak ditemukan');
        const data = rows[0];
        const role = (req.session.user.role || '').toLowerCase();
        
        if (role !== 'admin' && data.email !== req.session.user.email) {
            return res.status(403).send('Akses ditolak');
        }
        if (data.file_sertifikat) {
            return res.download(path.join(__dirname, 'uploads', data.file_sertifikat));
        }
        return res.status(404).send('File sertifikat belum diupload admin');
    });
});

app.get('/api/laporan/list-lengkap', (req, res) => {
    const { start, end } = req.query;
    let sql = `
        SELECT u.*, p.jumlah_bayar, p.tgl_bayar, p.status_pembayaran 
        FROM umkm u 
        LEFT JOIN pembayaran p ON u.id_umkm = p.id_umkm
    `;
    if (start && end) {
        sql += ` WHERE u.updated_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;
    }
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.get('/api/dashboard/summary', (req, res) => {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM umkm) as total_umkm, 
            (SELECT COUNT(*) FROM pembayaran WHERE status_pembayaran = 'Menunggu') as bayar_pending, 
            (SELECT COUNT(*) FROM umkm WHERE status_dokumen = 'Menunggu') as verif_pending, 
            (SELECT COUNT(*) FROM umkm WHERE status_sertifikasi = 'Sertifikat Terbit') as lulus
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results[0]);
    });
});

app.get('/api/dashboard/recent', (req, res) => {
    db.query('SELECT * FROM umkm ORDER BY updated_at DESC LIMIT 5', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.get('/api/my-umkm', (req, res) => {
    if (!req.session.user) return res.status(401).json({ pesan: "Belum login" });
    const email = req.session.user.email;
    const sql = `
        SELECT u.*, p.id_pembayaran, p.status_pembayaran, p.bukti_transfer 
        FROM umkm u 
        LEFT JOIN pembayaran p ON u.id_umkm = p.id_umkm 
        WHERE u.email = ?
    `;
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM user WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            req.session.user = results[0];
            req.session.save((err) => {
                res.json({ status: "sukses", role: results[0].role });
            });
        } else {
            res.status(401).json({ status: "gagal", pesan: "Email atau Password Salah!" });
        }
    });
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/api/user-aktif', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ status: "gagal", pesan: "Tidak ada sesi aktif. Silakan login." });
    }
});

app.post('/api/users/add', (req, res) => {
    const { nama, email, password, role } = req.body;
    const sql = "INSERT INTO user (nama_lengkap, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [nama, email, password, role], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ status: "sukses" });
    });
});

app.delete('/api/users/:id', (req, res) => {
    db.query("DELETE FROM user WHERE id_user = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ status: "sukses" });
    });
});

app.post('/api/register', (req, res) => {
    const { nama, email, password, role } = req.body;
    const sql = "INSERT INTO user (nama_lengkap, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [nama, email, password, role || 'UMKM'], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ status: "gagal", pesan: "Email udah kedaftar tuh!" });
        }
        res.json({ status: "sukses", pesan: "Akun berhasil dibuat, silakan login!" });
    });
});

app.get('/api/kategori', (req, res) => {
    db.query('SELECT * FROM kategori ORDER BY kelompok, nama_kategori', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/kategori/tambah', (req, res) => {
    const { nama_kategori, kelompok } = req.body;
    const sql = "INSERT INTO kategori (nama_kategori, kelompok) VALUES (?, ?)";
    db.query(sql, [nama_kategori, kelompok || 'Lainnya'], (err, result) => {
        if (err) return res.status(500).json({ status: "gagal", pesan: err.sqlMessage });
        res.json({ status: "sukses" });
    });
});

app.delete('/api/kategori/:id', (req, res) => {
    db.query('DELETE FROM kategori WHERE id_kategori = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ status: "gagal", pesan: err.sqlMessage });
        res.json({ status: "sukses" });
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`));
