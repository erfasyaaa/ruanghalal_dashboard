async function cekOtoritas() {
    try {
        const res = await fetch('/api/user-aktif');
        
        if (res.status === 401) {
            window.location.href = '/'; // Tendang ke login kalau belum login
            return;
        }

        const user = await res.json();
        
        // Tampilkan nama di elemen dengan id 'namaAdmin'
        const labelNama = document.getElementById('namaAdmin');
        if(labelNama) labelNama.innerText = user.nama_lengkap;

        // Proteksi Menu: Kalau bukan Admin, hapus menu Manajemen User
        if (user.role !== 'Admin') {
            const menuUser = document.getElementById('menuManajemenUser');
            if(menuUser) menuUser.remove();
        }
    } catch (err) {
        console.error("Gagal verifikasi role.");
    }
}

// Jalankan otomatis
cekOtoritas();