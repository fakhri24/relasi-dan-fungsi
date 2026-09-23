# PLAN.md · Project Roadmap & Action Plan

Dokumen perencanaan dan pelacakan progres pengembangan media pembelajaran interaktif **Relasi dan Fungsi**.

---

## 📌 Status Terkini: v1.3.0 (Lembar Kerja Peserta Didik / LKPD Siswa 4 Pertemuan Ditambahkan ✅)
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
