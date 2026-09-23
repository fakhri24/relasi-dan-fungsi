# AGENTS.md · AI Agent Memory & Operational Rules

Dokumen ini adalah memori inti dan panduan kerja agen AI (AGY, DeepSeek, GPT) yang mengelola dan mengembangkan repositori **`relasi-dan-fungsi`**.

---

## 🚨 PROTOKOL WAJIB (MUTLAK DIIKUTI SETIAP PERUBAHAN)

Setiap kali ada perubahan, penambahan fitur, atau perbaikan kode:
1. **Perbarui `PLAN.md`**: Catat progres terbaru, status fitur, dan keputusan teknis yang baru diambil.
2. **Perbarui `AGENTS.md`**: Jika ada konvensi, arsitektur, atau aturan baru yang disepakati.
3. **Build Verification**: Pastikan `npm run build` selalu lolos tanpa error TypeScript/Vite (`tsc -b && vite build`).
4. **Commit & Push ke GitHub**: Lakukan commit dengan pesan deskriptif dan push ke remote `main` / `master`.
5. **Verifikasi Deployment GitHub Pages**: Pastikan workflow GitHub Actions berjalan dan halaman GitHub Pages menyajikan versi terkini.

---

## 👥 Pembagian Peran Multi-Agent Swarm

- **AGY (Lead Orchestrator & Frontend Engineer)**:
  - Antarmuka utama dengan user / guru.
  - Perancangan UI/UX slide interaktif, transisi, animasi SVG/Canvas, dan tata letak responsif 16:9 untuk proyektor.
- **DeepSeek (Workhorse Coder & Logic Specialist)**:
  - Implementasi perhitungan matematika presisi, fungsi piecewise dinamis, validator syarat fungsi, dan parsing formula KaTeX.
- **GPT (Architect, Memory Keeper, & QA Gate)**:
  - Penjaga arsitektur kurikulum, validasi pedagogi (didaktik "Tebak Dulu, Baru Buktikan"), audit keamanan, dan pemeliharaan memori proyek (`AGENTS.md` & `PLAN.md`).

---

## 🎯 Prinsip Pedagogi & Desain Media Pembelajaran

1. **Satu Konsep Terpisah Per Slide**:
   - Jangan menggabungkan multi-konsep dalam satu tampilan awal.
   - Pecah menjadi langkah-langkah atomik agar siswa pemula dan siswa yang lambat pemahamannya dapat mencerna tanpa beban kognitif berlebih.
2. **Minimalisir Teks di Layar (Ekstrem Minimalis Proyektor)**:
   - Website dirancang sebagai media visual proyektor kelas, bukan e-book bacaan mandiri.
   - Nol paragraf narasi di bawah judul, judul super ringkas (1–2 kata), kotak aktivitas kelas di layar dihapus, dan hasil pembuktian berupa status badge padat. Penjelasan narasi 100% disuarakan oleh guru di depan kelas.
   - **Termasuk pada slide pembuka pertemuan & panel Target Belajar**: Dilarang mencantumkan paragraf deskripsi/penjelasan kurikulum. Format target belajar wajib berupa judul misi ringkas (2–3 kata) + 1 pill badge kata kunci / rumus KaTeX singkat tanpa paragraf narasi tambahan.
3. **Didaktik "Tebak Dulu, Baru Buktikan" (Interactive Reveal)**:
   - Setiap slide wajib memiliki skenario tebakan untuk kelas sebelum tombol pembuktian/animasi diaktifkan.
   - Umpan balik visual jelas: Hijau/Emerald (Lolos/Fungsi Sah) vs Merah/Rose (Gagal/Bukan Fungsi).
4. **Fokus Materi Inti & Pemodelan Dunia Nyata**:
   - Materi inti: Analogi Mesin, Relasi vs Fungsi, Vertical Line Test, Domain-Range Fisik, Representasi $f(x)=ax+b$, Kebutuhan Aturan Bercabang, Fungsi Piecewise, dan Proyek Katalog Fungsi.
   - Materi skip (SNBT / Teoretis Abstrak): Injektif, Surjektif, Bijektif, Fungsi Genap/Ganjil, dan drill aljabar rumit.
5. **Kesiapan Eksekusi Proyek**:
   - Slide terakhir wajib menyediakan simulator studi kasus nyata, rubrik penilaian, dan lembar kerja proyek (Worksheet A4) yang siap cetak (`window.print()`).

---

## 🛠️ Standar Teknis & Arsitektur Kode

- **Framework**: React 19 + TypeScript + Vite.
- **Styling & Arsitektur Tema Ganda (Mode Gelap & Mode Cerah)**:
  - Menggunakan Tailwind CSS dengan `darkMode: 'class'` dan pemetaan palet `slate` dinamis berbasis CSS Variables (`rgb(var(--color-slate-*) / <alpha-value>)`).
  - **Mode Gelap (Default Proyektor)**: Latar `slate-950` (#0b1120), kartu `slate-900`, aksen `brand-500`, dan glow neon proyektor.
  - **Mode Cerah (Ruang Kelas Terang)**: Latar `slate-100` (#f1f5f9), kartu putih bersih `white` (#ffffff), border `slate-200`, dan tipografi kontras tinggi `slate-900` (#0f172a).
  - **Persistensi & Anti-FOUC**: Preferensi tersimpan di `localStorage` (`supermath_theme`), disinkronkan langsung via inline script di `<head>` `index.html` dan `<meta name="color-scheme">`.
  - **Kontrol Guru**: Tombol toggle di Navbar (ikon `Sun`/`Moon`), di Drawer Menu 4 Pertemuan, dan pintasan keyboard instan tombol `T`.
- **Aturan KaTeX Anti-Double Render**:
  - Wajib mengimpor stylesheet lokal `import 'katex/dist/katex.min.css';` di `src/main.tsx` (ter-bundle langsung oleh Vite, hindari CDN eksternal dengan hash integrity yang rentan gagal).
  - Wajib menetapkan `output: 'html'` pada opsi `katex.renderToString` di `MathFormula.tsx` agar tidak merender elemen MathML secara ganda.
  - Failsafe `.katex-mathml { display: none !important; }` di `src/index.css`.
- **Standar Tampilan 16:9 Proyektor (Zero-Scroll)**:
  - Kontainer aplikasi wajib `h-screen max-h-screen overflow-hidden`.
  - `SlideContainer` dibatasi tepat pada `h-[calc(100vh-3.5rem)]` dengan `overflow-hidden`.
  - Setiap slide wajib memanfaatkan `flex-1 min-h-0` dan batas tinggi komponen (misal SVG $\le$ 230px) agar seluruh konten dan footer terlihat 100% pada resolusi 1366×768 (WXGA proyektor) tanpa memicu scrollbar vertikal.
- **Ikonografi**: Lucide React.
- **Deployment**: GitHub Pages melalui GitHub Actions (`.github/workflows/deploy.yml`) dengan `base: './'` di `vite.config.ts`.

### Struktur File Utama
```
relasi-dan-fungsi/
├── .github/workflows/deploy.yml   # Workflow otomatisasi deployment GitHub Pages
├── AGENTS.md                      # Memori dan protokol agen (file ini)
├── PLAN.md                        # Roadmap, status task, dan catatan keputusan
├── README.md                      # Dokumentasi umum & panduan penggunaan
├── index.html                     # Entry HTML slide, memuat stylesheet KaTeX & font
├── panduan-guru.html              # Dokumen panduan modul ajar guru (root fallback)
├── lks-siswa.html                 # Lembar Kerja Siswa A4 bolak-balik monokrom (root fallback)
├── public/
│   ├── panduan-guru.html          # Dokumen panduan guru (ter-bundle ke dist/ oleh Vite)
│   └── lks-siswa.html             # Lembar Kerja Siswa A4 bolak-balik (ter-bundle ke dist/ oleh Vite)
├── package.json                   # Dependensi proyek
├── vite.config.ts                 # Konfigurasi Vite (base: './')
├── tailwind.config.js             # Konfigurasi token warna & font
├── src/
│   ├── App.tsx                    # Orkes 14 slide terbagi 4 pertemuan dan print worksheet
│   ├── main.tsx                   # Entry point React
│   ├── index.css                  # Tailwind imports & utility glow proyektor
│   ├── types/
│   │   ├── slides.ts              # Tipe TypeScript data slide dan topik proyek
│   │   └── lkpd.ts                # Tipe TypeScript data pengerjaan LKPD siswa & Firestore model
│   ├── lib/
│   │   └── firebase.ts            # Konfigurasi client Firebase (Auth, Firestore, Whitelist fkhr2nd@gmail.com)
│   └── components/
│       ├── MathFormula.tsx        # Komponen wrapper KaTeX yang aman
│       ├── CanteenItemIcon.tsx    # Ilustrasi SVG vektor jajanan kantin proyektor
│       ├── Navbar.tsx             # Navigasi atas, progress bar dengan penanda sesi, drawer & link panduan guru / LKPD
│       ├── SlideContainer.tsx     # Frame slide 16:9 + event listener keyboard (←, →, Spasi)
│       ├── WorksheetPrint.tsx     # Lembar kerja siswa A4 print-only (Ctrl+P)
│       ├── admin/
│       │   └── TeacherDashboard.tsx # Panel evaluasi guru: live feed, scoring, ekspor CSV, showcase & roster
│       ├── lkpd/
│       │   ├── InteractiveArrowCanvas.tsx # Kanvas diagram panah interaktif dengan export Base64
│       │   ├── LkpdDigitalModal.tsx       # Modal pengerjaan LKPD digital siswa (6 stepper terhubung Firestore)
│       │   └── ProjectorQrModal.tsx       # Modal QR Code proyektor untuk akses siswa serentak di kelas
│       └── slides/
│           ├── Slide1OpeningRelasi.tsx    # Slide 1: Pembuka P1 (Konsep Besar "RELASI" & 3 Target Belajar)
│           ├── Slide1Hook.tsx             # Slide 2: Mesin Kasir (Scanner Kasir Kantin & Multi-Barang Many-to-One)
│           ├── Slide2Machine.tsx          # Slide 3: Mesin Fungsi (Model Mental Mesin f(x))
│           ├── Slide3ArrowDiagram.tsx     # Slide 4: Diagram Panah (Syarat Emas Relasi vs Fungsi)
│           ├── Slide4VerticalLineTest.tsx # Slide 5: Uji Garis Vertikal & Tombol Buka LKPD Digital Siswa
│           ├── Slide6OpeningDomain.tsx    # Slide 6: Pembuka P2 (Konsep "BATASAN NYATA" & 3 Target Belajar)
│           ├── Slide5DomainRange.tsx      # Slide 7: Domain & Range (Batasan Fisik)
│           ├── Slide6LinearGraph.tsx      # Slide 8: Model Linier (f(x) = ax + b)
│           ├── Slide9OpeningPiecewise.tsx # Slide 9: Pembuka P3 (Konsep "PIECEWISE" & 3 Target Belajar)
│           ├── Slide7WhyPiecewise.tsx     # Slide 10: Batasan 1 Garis (Dilema Tarif)
│           ├── Slide8PiecewiseIntro.tsx   # Slide 11: Fungsi Bercabang (Piecewise & Titik ●, ○)
│           ├── Slide9SandboxBuilder.tsx   # Slide 12: Rancang Fungsi (Sandbox Builder)
│           ├── Slide13OpeningProject.tsx  # Slide 13: Pembuka P4 (Konsep "PROYEK NYATA" & 3 Target Belajar)
│           └── Slide10ProjectHub.tsx      # Slide 14: Katalog Proyek (Kasus & Simulator)
```
