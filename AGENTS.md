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
2. **Minimalisir Teks Panjang di Layar**:
   - Website dirancang sebagai media tayang guru di proyektor kelas, bukan e-book bacaan mandiri.
   - Teks di layar hanya berupa judul besar pemantik, formula KaTeX tajam, dan visualisasi interaktif. Penjelasan narasi diserahkan kepada guru.
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
- **Styling**: Tailwind CSS (tema gelap kontras tinggi `slate-950` dengan aksen `brand-500` dan glow proyektor).
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
├── public/
│   └── panduan-guru.html          # Dokumen panduan guru (ter-bundle ke dist/ oleh Vite)
├── package.json                   # Dependensi proyek
├── vite.config.ts                 # Konfigurasi Vite (base: './')
├── tailwind.config.js             # Konfigurasi token warna & font
├── src/
│   ├── App.tsx                    # Orkes 10 slide dan print worksheet
│   ├── main.tsx                   # Entry point React
│   ├── index.css                  # Tailwind imports & utility glow proyektor
│   ├── types/slides.ts            # Tipe TypeScript data slide dan topik proyek
│   └── components/
│       ├── MathFormula.tsx        # Komponen wrapper KaTeX yang aman
│       ├── Navbar.tsx             # Navigasi atas, progress bar, fullscreen, drawer & link panduan guru
│       ├── SlideContainer.tsx     # Frame slide 16:9 + event listener keyboard (←, →, Spasi)
│       ├── WorksheetPrint.tsx     # Lembar kerja siswa A4 print-only (Ctrl+P)
│       └── slides/
│           ├── Slide1Hook.tsx             # Slide 1: Pemantik & Vending Machine Rusak
│           ├── Slide2Machine.tsx          # Slide 2: Mesin Fungsi Input-Aturan-Output
│           ├── Slide3ArrowDiagram.tsx     # Slide 3: Relasi vs Fungsi (Diagram Panah)
│           ├── Slide4VerticalLineTest.tsx # Slide 4: Vertical Line Test & Scanner
│           ├── Slide5DomainRange.tsx      # Slide 5: Domain & Range Batasan Fisik
│           ├── Slide6LinearGraph.tsx      # Slide 6: Representasi f(x) = ax + b
│           ├── Slide7WhyPiecewise.tsx     # Slide 7: Masalah Nyata (Mengapa 1 Garis Gagal)
│           ├── Slide8PiecewiseIntro.tsx   # Slide 8: Notasi Piecewise & Titik (●, ○)
│           ├── Slide9SandboxBuilder.tsx   # Slide 9: Sandbox Rancang Aturan Sendiri
│           └── Slide10ProjectHub.tsx      # Slide 10: Katalog Kasus, Simulator & Rubrik
```
