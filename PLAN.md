# PLAN.md · Project Roadmap & Action Plan

Dokumen perencanaan dan pelacakan progres pengembangan media pembelajaran interaktif **Relasi dan Fungsi**.

---

## 📌 Status Terkini: v1.1.0 (Audit KaTeX & 16:9 Zero-Scroll Selesai ✅)
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

---

## 🗺️ Roadmap & Rencana Pengembangan Selanjutnya

### Fase 1: Inisialisasi & Deployment (Selesai ✅)
- [x] Inisialisasi repositori Git lokal.
- [x] Buat repositori remote di GitHub dengan nama `relasi-dan-fungsi` menggunakan GitHub CLI (`gh`).
- [x] Push commit perdana ke branch `main`: [github.com/fakhri24/relasi-dan-fungsi](https://github.com/fakhri24/relasi-dan-fungsi)
- [x] Konfigurasi dan verifikasi GitHub Pages via GitHub Actions: [fakhri24.github.io/relasi-dan-fungsi](https://fakhri24.github.io/relasi-dan-fungsi/)

### Fase 2: Peningkatan Interaktivitas & Fitur Presenter (Next Steps)
- [ ] **Mode Presenter Dual-Screen**: Menambahkan catatan khusus guru (*teacher notes* / kunci jawaban / panduan pertanyaan pemantik) yang bisa dibuka di layar kedua atau di-toggle dengan shortcut `T`.
- [ ] **Animasi Transisi Halus**: Integrasi transisi antar-slide yang lebih dinamis tanpa memberatkan beban komputasi laptop proyektor.
- [ ] **Kalkulator Ekspor CSV/Image**: Kemampuan bagi siswa untuk mengekspor grafik hasil rancangan di Slide 9 (Sandbox) menjadi gambar PNG untuk disisipkan ke laporan tugas mereka.
- [ ] **Tambahan Studi Kasus Nyata**: Menambahkan kasus lokal kontekstual Indonesia (misal: sistem tarif KRL Commuter Line Jabodetabek / tarif bagasi maskapai).

---

## 📝 Catatan Keputusan Desain (Decision Log)

1. **Pemilihan Alur 10 Slide Modular**:
   - Memastikan tidak ada penggabungan konsep secara terburu-buru sebelum siswa memahami bagian atomiknya (Mesin $\to$ Diagram Panah $\to$ Garis Vertikal $\to$ Domain/Range $\to$ Rumus/Grafik Linear $\to$ Batasan 1 Garis $\to$ Notasi Piecewise $\to$ Sandbox $\to$ Proyek Hub).
2. **Penggunaan KaTeX**:
   - Dipilih dibanding MathJax karena kecepatan rendering instan, footprint memori yang ringan, dan ketajaman font di layar proyektor beresolusi tinggi.
3. **Format Slide Layar Penuh vs Scroll**:
   - Disepakati format Slide Deck Layar Penuh (16:9) dengan kontrol keyboard (`←`, `→`, `Spasi`, `F`) agar guru memiliki kendali penuh atas tempo kelas tanpa gangguan scrolling.
