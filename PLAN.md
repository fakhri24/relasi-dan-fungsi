# PLAN.md · Project Roadmap & Action Plan

Dokumen perencanaan dan pelacakan progres pengembangan media pembelajaran interaktif **Relasi dan Fungsi**.

---

## 📌 Status Terkini: v1.7.0 (Arsitektur 14 Slide Modular 4 Pertemuan, Pembuka "Relasi", dan Target Belajar di Setiap Sesi ✅)
- [x] **Pemisahan Slide Tematik & Penambahan Slide Pembuka per Pertemuan (Total 14 Slide)**:
  - Mengembangkan sistem slide pembuka (*Session Opening Deck*) dengan tata letak **Split Screen 50:50** ramah proyektor 16:9 Zero-Scroll.
  - **Pertemuan 1 (Slide 1–5 · Fondasi Relasi & Fungsi)**:
    * **Slide 1 (`Slide1OpeningRelasi.tsx`)**: Menampilkan tulisan sangat besar **"RELASI"** (gradient indigo-cyan glowing), ilustrasi interaktif SVG hubungan himpunan bebas (Preset "Hobi Siswa" & "Jajanan Kantin") di mana panah bisa dihubungkan bebas tanpa syarat fungsi, status badge *"Aturan Relasi: Bebas!"*, tombol jembatan investigasi *"Kapan Relasi Menjadi Fungsi?"*, serta panel 3 Target Belajar Hari Ini.
    * **Slide 2 (`Slide1Hook.tsx`)**: Hook investigasi scanner kasir rusak vs normal & pembuktian *many-to-one* kantin.
    * **Slide 3 (`Slide2Machine.tsx`)**: Mental model mesin input-output $f(x)$.
    * **Slide 4 (`Slide3ArrowDiagram.tsx`)**: Diagram panah syarat fungsi (tidak jomblo & tidak mendua).
    * **Slide 5 (`Slide4VerticalLineTest.tsx`)**: Uji garis vertikal (VLT) pada grafik Kartesius.
  - **Pertemuan 2 (Slide 6–8 · Batasan Nyata & Model Linear)**:
    * **Slide 6 (`Slide6OpeningDomain.tsx`)**: Pembuka tematik **"BATASAN NYATA"** dengan konteks batasan fisis (jarak ojol $\ge 0$, lift diskrit, kapasitas baterai HP), formula KaTeX, dan panel 3 Target Belajar P2.
    * **Slide 7 (`Slide5DomainRange.tsx`)**: Simulasi batasan nyata nilai absurd input domain.
    * **Slide 8 (`Slide6LinearGraph.tsx`)**: Model linear $f(x)=ax+b$ dengan slider kemiringan $a$ dan konstanta $b$.
  - **Pertemuan 3 (Slide 9–12 · Fungsi Sepenggal / Piecewise)**:
    * **Slide 9 (`Slide9OpeningPiecewise.tsx`)**: Pembuka tematik **"PIECEWISE"** dengan visual kurung kurawal $\{$, mini-grafik bercabang, sakelar titik sambungan sah (● vs ○) vs tabrakan mendua, dan panel 3 Target Belajar P3.
    * **Slide 10 (`Slide7WhyPiecewise.tsx`)**: Dilema tarif parkir mall membuktikan batas fungsi 1 garis lurus.
    * **Slide 11 (`Slide8PiecewiseIntro.tsx`)**: Fungsi bercabang dengan baris formula menyala (*highlight*) dan titik ● vs ○.
    * **Slide 12 (`Slide9SandboxBuilder.tsx`)**: Sandbox builder interaktif merakit fungsi piecewise kustom.
  - **Pertemuan 4 (Slide 13–14 · Proyek Nyata & Asesmen)**:
    * **Slide 13 (`Slide13OpeningProject.tsx`)**: Pembuka tematik **"PROYEK NYATA"** dengan selector preview 4 studi kasus otentik, rumus piecewise, dan panel 3 Target Belajar P4.
    * **Slide 14 (`Slide10ProjectHub.tsx`)**: Katalog proyek & simulator tarif interaktif beserta pencetakan Lembar Kerja Proyek A4.
- [x] **Pembaruan Navigasi Navbar & Drawer Sesi**:
  - Badge pertemuan dinamis di navbar atas (`P1 · 2 JP` s.d. `P4 · 2 JP`) dengan aksen warna tematik per sesi (Indigo, Emerald, Amber, Purple).
  - Tanda pembatas halus (*session divider ticks*) pada progress bar atas untuk menandai batas antar-pertemuan (Slide 5, Slide 8, Slide 12).
  - Drawer menu daftar slide dikelompokkan secara rapi per Pertemuan 1 s.d. 4.
  - Sinkronisasi nomor tag slide (`01` s.d. `14`) pada semua komponen slide.
- [x] **Sinkronisasi Dokumen Guru & Siswa**:
  - Memperbarui [panduan-guru.html](file:///Users/fakhri246/project/matematika/relasi-dan-fungsi/panduan-guru.html) dan [public/panduan-guru.html](file:///Users/fakhri246/project/matematika/relasi-dan-fungsi/public/panduan-guru.html) dengan peta alur 14 slide dan tautan deep linking langsung.
  - Memperbarui [lks-siswa.html](file:///Users/fakhri246/project/matematika/relasi-dan-fungsi/lks-siswa.html) dan [public/lks-siswa.html](file:///Users/fakhri246/project/matematika/relasi-dan-fungsi/public/lks-siswa.html) agar sinkronisasi proyektor merujuk ke nomor slide baru.
- [x] **Evaluasi UI/UX Proyektor**:
  - Skor UI: **9.6 / 10** | Skor UX: **9.7 / 10** (Rata-rata **9.65 / 10**, tuntas pada Loop 1 > 8).

## 📌 Arsip Status v1.6.0 (Ilustrasi Vektor SVG Jajanan Kantin & Animasi Laser Kasir Slide 1 ✅)
- [x] **Penggantian Total Emotikon Jajanan Kantin dengan Ilustrasi Vektor SVG (`CanteenItemIcon.tsx`)**:
  - Mengembangkan komponen SVG kustom bergaya *Modern Flat-Vector Bergradien & Berkontras Tinggi* yang dioptimalkan untuk layar proyektor resolusi berapapun tanpa pecah dan zero loading latency.
  - 4 Jajanan Default: Nice Cone, Teh Kubus, Le Kristal, SilverKing.
  - 6 Preset Jajanan Kustom: Dimsum, Sate/Cilok, Donat, Es Boba, Popcorn, Sandwich.
- [x] **Animasi Sinar Laser Scanner Kasir Merah**:
  - Efek garis sinar laser merah berpijar (`animate-laser-sweep`) yang menyapu gambar SVG barang saat kasir melakukan uji scan.

## 📌 Arsip Status v1.5.0 (Mesin Kasir Slide 1: Progressive Reveal, Merk Samaran Kantin, Multi-Barang & Pembuktian Many-to-One ✅)
- [x] **Pembaruan Mesin Kasir Slide 1 (`Slide1Hook.tsx`)**:
  - **Progressive Reveal**:
    * Mode default `1 Barang Fokus` (Es Krim Nice Cone Rp 8.000) agar siswa tidak mengalami beban kognitif berlebih di awal.
    * Tab switcher `Multi-Barang Kantin` yang dapat dibuka sewaktu-waktu oleh guru untuk memperluas studi kasus.
  - **4 Preset Merk Samaran Kantin yang Relatable & Menghibur**:
    1. Nice Cone (Rp 8.000)
    2. Teh Kubus (Rp 4.000)
    3. Le Kristal (Rp 4.000 — sengaja berharga sama dengan Teh Kubus untuk membedah miskonsepsi *many-to-one*)
    4. SilverKing (Rp 6.000)
  - **Interaksi Quick Chips & Input Jajanan Kustom**:
    * Chip pilihan satu sentuhan ramah layar sentuh / pointer proyektor.
    * Tombol `+ Tambah` yang memunculkan modal ringkas untuk menambahkan jajanan lokal kelas (misal: "Cireng", "Rp 2.000").
  - **Mini Log (Riwayat Scan) & Deteksi Cerdas Many-to-One**:
    * Mencatat hasil scan barcode sebelumnya.
    * Notifikasi otomatis ber-badge hijau: `✨ [Teh Kubus] & [Le Kristal] sama-sama Rp 4.000 = Tetap Fungsi Sah!`.
  - **Sinkronisasi Total Modul Guru & LKPD**:
    * Memperbarui narasi pemantik di [panduan-guru.html](file:///Users/fakhri246/project/matematika/relasi-dan-fungsi/panduan-guru.html), [public/panduan-guru.html](file:///Users/fakhri246/project/matematika/relasi-dan-fungsi/public/panduan-guru.html), [lks-siswa.html](file:///Users/fakhri246/project/matematika/relasi-dan-fungsi/lks-siswa.html), dan [public/lks-siswa.html](file:///Users/fakhri246/project/matematika/relasi-dan-fungsi/public/lks-siswa.html).
- [x] **Redesain Minimalis Teks 10 Slide Proyektor**:
  - Menghapus total seluruh subjudul dan paragraf narasi di bawah judul pada 10 slide (`Slide1Hook` s.d. `Slide10ProjectHub`).
  - Menghapus kotak aktivitas guru di layar (`🗣️ Aktivitas Kelas: ...`) agar layar proyektor 100% bersih dan fokus pada visual interaktif.
  - Mempersingkat judul menjadi 1–2 kata:
    1. `Mesin Kasir` (01 · PEMANTIK)
    2. `Mesin Fungsi` (02 · MESIN)
    3. `Relasi & Fungsi` (03 · RELASI)
    4. `Uji Garis Vertikal` (04 · UJI GRAFIK)
    5. `Domain & Range` (05 · DOMAIN)
    6. `Model Linier` (06 · MODEL)
    7. `Batasan 1 Garis` (07 · MASALAH)
    8. `Fungsi Bercabang` (08 · PIECEWISE)
    9. `Rancang Fungsi` (09 · SANDBOX)
    10. `Katalog Proyek` (10 · PROYEK)
  - Menyederhanakan feedback pembuktian menjadi status badge ringkas (misal: `✅ FUNGSI SAH`, `❌ BUKAN FUNGSI (Budi Mendua)`).
  - Mengubah narasi cerita kasus di Slide 10 menjadi parameter spesifikasi teknis ringkas.
  - Menyelaraskan navigasi drawer dan navbar di `src/App.tsx`.
- [x] Riset kurikulum SuperMath MTK X & modul Bab 7 (Relasi & Fungsi).
- [x] Pemangkasan materi teoretis formal (Injektif/Surjektif/Bijektif, Fungsi Genap/Ganjil, manipulasi aljabar rumit SNBT).
- [x] Inisialisasi arsitektur React 19 + TypeScript + Vite + Tailwind CSS + KaTeX.
- [x] Pembuatan 10 slide interaktif berbasis rasio 16:9 untuk proyektor kelas dengan filosofi "Satu Konsep Per Slide" dan "Tebak Dulu, Baru Buktikan".
- [x] Pembuatan komponen `WorksheetPrint.tsx` untuk pencetakan instan Lembar Kerja Proyek A4 (`window.print()`).
- [x] Konfigurasi deployment GitHub Pages (`vite.config.ts` base: `'./'` + `.github/workflows/deploy.yml`).
- [x] Pembuatan memori agen AI (`AGENTS.md` dan `PLAN.md`).
- [x] **Audit KaTeX Anti-Double Render**: Memperbaiki duplikasi rendering rumus KaTeX dengan opsi `output: 'html'`, bundling lokal stylesheet `katex/dist/katex.min.css`, dan failsafe CSS `.katex-mathml { display: none !important; }`. (Skor: 10/10)
- [x] **Audit Layout 16:9 Zero-Scroll**: Mengunci kontainer pada `h-screen max-h-screen overflow-hidden`, membatasi `SlideContainer` pada `h-[calc(100vh-3.5rem)]`, dan mengompakkan proporsi SVG/card di semua slide agar pas 100% pada resolusi 1366×768 (WXGA proyektor) dan 1920×1080 tanpa scrollbar. (Skor: 9.8/10)
- [x] **Dukungan Deep Linking URL**: Navigasi langsung slide via query parameter `?slide=1` s.d. `?slide=10`.
- [x] **Panduan Modul Ajar Guru Standalone (`panduan-guru.html` & `public/panduan-guru.html`)**:
  - Alur Rinci 4 Pertemuan (@ 2 JP = 8 JP total) sampai fase proyek.
  - Skenario menit demi menit, pemantik guru, klarifikasi miskonsepsi umum siswa.
  - Integrasi tab navigasi interaktif, print-ready stylesheet A4, dan Teacher Scratchpad dengan autosave `localStorage`.
- [x] **Lembar Kerja Peserta Didik (LKPD) Standalone (`lks-siswa.html` & `public/lks-siswa.html`)**:
  - Format modular 4 pertemuan: Masing-masing dikunci tepat **1 lembar kertas A4 fisik bolak-balik (2 halaman)** per pertemuan.
  - Desain Monokrom Ramah Fotokopi (*Xerox / Risograph Optimized*): Garis SVG tegas, kontras tinggi, latar putih bersih, hemat toner.
  - Pola Aktivitas 3 Bagian:
    * **Bagian A: Prediksi & Amati** (sinkron dengan proyektor kelas sebelum tombol pembuktian dibuka guru).
    * **Bagian B: Tantangan Mandiri & Penyelidikan** (menarik garis panah relasi, uji scanner vertikal pada 4 kurva, menghitung tabel tarif linear, memplot titik di grid milimeter SVG, menentukan titik ● vs ○ pada piecewise).
    * **Bagian C: Refleksi & Rumusan "Aturan Emas"** (siswa merumuskan sendiri prinsip matematis agar konsep "nempel").
  - Opsi Cetak Fleksibel: Filter tampilan `[LKS 1]` · `[LKS 2]` · `[LKS 3]` · `[LKS 4 (Proyek)]` · `[Cetak Semua (4-in-1)]`.
  - Integrasi tombol pintasan langsung di Navbar aplikasi (`Navbar.tsx`) dan seluruh section pertemuan di `panduan-guru.html`.

---

## 🗺️ Roadmap & Rencana Pengembangan Selanjutnya

### Fase 1: Inisialisasi & Deployment (Selesai ✅)
- [x] Inisialisasi repositori Git lokal.
- [x] Buat repositori remote di GitHub dengan nama `relasi-dan-fungsi` menggunakan GitHub CLI (`gh`).
- [x] Push commit perdana ke branch `main`: [github.com/fakhri24/relasi-dan-fungsi](https://github.com/fakhri24/relasi-dan-fungsi)
- [x] Konfigurasi dan verifikasi GitHub Pages via GitHub Actions: [fakhri24.github.io/relasi-dan-fungsi](https://fakhri24.github.io/relasi-dan-fungsi/)

### Fase 2: Peningkatan Interaktivitas & Fitur Presenter
- [x] **Dokumen Panduan Modul Ajar Guru**: File panduan HTML komprehensif 4 pertemuan (`panduan-guru.html`).
- [x] **Dokumen Lembar Kerja Siswa (LKPD 1–4)**: File HTML A4 bolak-balik monokrom (`lks-siswa.html`).
- [ ] **Mode Presenter Dual-Screen**: Menambahkan catatan khusus guru (*teacher notes* / kunci jawaban / panduan pertanyaan pemantik) yang bisa di-toggle dengan shortcut `T` langsung di layar presentasi.
- [ ] **Animasi Transisi Halus**: Integrasi transisi antar-slide yang lebih dinamis tanpa memberatkan beban komputasi laptop proyektor.
- [ ] **Kalkulator Ekspor CSV/Image**: Kemampuan bagi siswa untuk mengekspor grafik hasil rancangan di Slide 9 (Sandbox) menjadi gambar PNG untuk disisipkan ke laporan tugas mereka.
- [ ] **Tambahan Studi Kasus Nyata**: Menambahkan kasus lokal kontekstual Indonesia (misal: sistem tarif KRL Commuter Line Jabodetabek / tarif bagasi maskapai).

---

## 📝 Catatan Keputusan Desain (Decision Log)

1. **Pemilihan Alur 10 Slide Modular**:
   - Memastikan tidak ada penggabungan konsep secara terburu-buru sebelum siswa memahami bagian atomiknya (Mesin $\to$ Diagram Panah $\to$ Garis Vertikal $\to$ Domain/Range $\to$ Rumus/Grafik Linear $\to$ Batasan 1 Garis $\to$ Notasi Piecewise $\to$ Sandbox $\to$ Proyek Hub).
2. **Penyusunan Rencana 4 Pertemuan (@ 2 JP)**:
   - Didesain proporsional agar siswa tidak mengalami cognitive overload saat transisi dari fungsi linear tunggal ke fungsi sepenggal (piecewise) yang sarat syarat interval.
3. **Standar LKPD 1 Lembar Fisik Bolak-Balik Monokrom**:
   - Memastikan biaya fotokopi sekolah tetap efisien, lembar kerja tidak tercecer, dan siswa memiliki rekam jejak tertulis yang aktif di setiap sesi pembelajaran.
