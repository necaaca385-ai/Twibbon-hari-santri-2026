# 🕌 Website Generator Twibbon TPQ (Taman Pendidikan Al-Qur'an)

Website interaktif untuk memasang foto santri/santriwati ke dalam Twibbon TPQ secara langsung di browser tanpa perlu aplikasi editing rumit. Dibangun murni menggunakan **HTML5 Canvas**, **CSS3 (Responsive Mobile-First)**, dan **JavaScript murni (Vanilla JS)** dengan nuansa tema hijau Islami dan emas.

---

## ✨ Fitur Utama

1. **Upload Foto Santri**:
   - Mendukung format JPG, PNG, WebP dari galeri HP maupun laptop/PC.
   - Fitur seret & lepas (Drag and Drop) langsung ke area canvas.
   - Tombol picker kamera/galeri yang ramah pengguna smartphone.

2. **Frame Otomatis TPQ Baitur-Rahman**:
   - Bingkai Hari Santri Nasional 2026 langsung otomatis terpasang dengan lubang transparan di tengah.
   - Posisi foto santri otomatis presisi terpusat ke lubang bingkai saat diunggah.

3. **Drag untuk Menggeser Foto (Touch & Mouse)**:
   - Dukungan gestur sentuh (touchscreen) responsif di HP/tablet tanpa membuat layar scroll sendiri (`touch-action: none`).
   - Drag halus dengan mouse di PC/laptop.

4. **Slider Zoom & Gestur Cubit (Pinch-to-Zoom)**:
   - Slider zoom halus dari 20% hingga 350% dengan indikator persentase real-time.
   - Tombol pintas `+` (perbesar) dan `-` (perkecil).
   - **Pinch-to-zoom (cubit 2 jari)** di layar sentuh smartphone.
   - Scroll mouse (mouse wheel) di atas canvas untuk zoom cepat.

5. **Alat Penyesuaian Foto Tambahan**:
   - **Putar 90°**: Memutar orientasi foto jika terbalik/miring dari kamera HP.
   - **Cermin (Flip Horizontal)**: Sangat berguna untuk foto selfie.
   - **Tengahkan**: Mengembalikan foto tepat ke tengah bingkai.
   - **Reset**: Mengembalikan ukuran, rotasi, dan posisi ke setelan awal.

6. **Download Hasil sebagai PNG**:
   - Menghasilkan file gambar PNG resolusi tinggi **1080 x 1080 pixel** yang jernih untuk WhatsApp Story, Instagram Post, atau dicetak.
   - Penamaan otomatis berbasis waktu (`twibbon-santri-tpq-[tanggal].png`).

7. **Desain Responsif & Estetika Hijau Islami**:
   - Tampilan mobile-first yang nyaman digunakan dengan satu tangan di ponsel.
   - Tata letak rapi, modern, dan bernuansa hijau zamrud (emerald) dipadukan dengan aksen emas.

---

## 🚀 Cara Menjalankan

Cukup **klik dua kali (double-click)** file:
```
buka-twibbon.bat
```
atau buka langsung file `index.html` di browser apa pun (Google Chrome, Microsoft Edge, Safari, Firefox, Opera).

---

## 📁 Struktur Berkas

```
twibbon tpq/
├── index.html           # Struktur antarmuka web
├── style.css            # Desain tampilan responsif & tema hijau TPQ
├── script.js            # Engine Canvas HTML5, drag, slider, zoom, download
├── frame.png            # File frame transparan utama (1080x1080)
├── frame-data.js        # Data pembantu agar download lancar di semua browser
├── generate_frame.ps1   # Skrip pembuat template frame bawaan
├── buka-twibbon.bat     # Pintasan sekali klik untuk membuka website
└── README.md            # Dokumentasi lengkap
```

---

## 💡 Cara Mengganti Frame Bawaan Sendiri

Jika Anda memiliki desain twibbon TPQ sendiri dari Canva, Photoshop, atau CorelDraw:
1. Pastikan ukuran desain Anda adalah **persegi (1080 x 1080 px)** dengan bagian foto berlubang/transparan.
2. Simpan sebagai format **PNG**.
3. Beri nama file `frame.png` dan ganti file `frame.png` yang ada di folder ini, atau klik tombol **"Ganti Frame"** di halaman website.
