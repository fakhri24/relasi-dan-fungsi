# SuperMath MTK X · Media Pembelajaran Interaktif: Relasi dan Fungsi

Aplikasi presentasi interaktif materi **Relasi dan Fungsi** untuk kelas X SMA (Fase E, Kurikulum Merdeka) yang berorientasi pada **Proyek Katalog Fungsi Dunia Nyata**.

Dikembangkan dengan prinsip:
1. **Fokus Materi Inti**: Memangkas materi teoretis abstrak (seperti injektif/surjektif/bijektif dan drill aljabar rumit SNBT) untuk menghemat alokasi waktu mengajar, langsung fokus pada pemodelan matematika dunia nyata.
2. **Satu Konsep Per Slide**: Mencegah beban kognitif berlebih bagi siswa pemula atau yang relatif lambat memahami konsep.
3. **Didaktik "Tebak Dulu, Baru Buktikan"**: Setiap slide memuat pemicu rasa ingin tahu untuk didiskusikan kelas sebelum guru mengklik tombol pembuktian visual / animasi.
4. **Optimasi Proyektor Kelas**: Teks berukuran besar, kontras tinggi, formula matematika tajam bertenaga **KaTeX**, dan bebas distraksi scroll panjang.
5. **Siap Pakai untuk Proyek**: Dilengkapi simulator 4 studi kasus nyata, rubrik penilaian, serta lembar kerja proyek (Worksheet PDF) yang siap dicetak langsung (`Ctrl+P` / `Cmd+P`).

---

## 🎯 Susunan 10 Slide

| Slide | Topik | Fokus Konsep | Interaktivitas |
|---|---|---|---|
| **1** | **Pemantik (Hook)** | Mengapa Dunia Butuh Kepastian? | Simulator tombol beli susu: Mode Mesin Rusak vs Mode Mesin Normal |
| **2** | **Model Mental** | Mesin Fungsi: Input, Aturan, Output | Memilih aturan $f(x)=2x+3$ atau $x^2$, animasi hopper masuk dan kalkulasi instan |
| **3** | **Syarat Pemetaan** | Relasi vs Fungsi (Diagram Panah) | Uji 4 skenario: Tidak boleh jomblo di daerah asal & tidak boleh mendua |
| **4** | **Uji Visual** | Uji Garis Vertikal (*Vertical Line Test*) | Pemindai garis vertikal bergerak untuk mendeteksi $\le 1$ vs $> 1$ titik potong |
| **5** | **Batasan Nyata** | Domain & Range Kontekstual | Skenario Ojol, Baterai HP, dan Lift: menguji nilai masuk akal vs mustahil |
| **6** | **Representasi** | Kata $\to$ Rumus $\to$ Grafik ($f(x)=ax+b$) | Slider tarif per km ($a$) dan buka pintu ($b$) terhadap kemiringan garis |
| **7** | **Masalah Nyata** | Mengapa 1 Rumus Lurus Gagal? | Komparasi kegagalan rumus linear kaku vs keadilan fungsi bercabang di Mall |
| **8** | **Notasi Piecewise** | Membaca Kurung Kurawal & Titik $(\bullet, \circ)$ | Tracker nilai $x$ menyorot baris rumus dan segmen grafik yang aktif |
| **9** | **Lab Kreatif** | Sandbox Builder Fungsi Sepenggal | Guru & siswa merakit batas waktu dan tarif bertingkat sendiri secara dinamis |
| **10**| **Proyek Akhir** | Katalog Fungsi Dunia Nyata & Rubrik | 4 Studi Kasus (Ojol, Parkir, PPh 21, PDAM) + Simulator + Cetak Worksheet A4 |

---

## 🚀 Cara Menjalankan Lokal

```bash
# 1. Masuk ke direktori
cd /Users/fakhri246/project/matematika/relasi-dan-fungsi

# 2. Jalankan server pengembangan
npm run dev
```

Buka URL lokal yang muncul (biasanya `http://localhost:5173`) di browser.

---

## ⌨️ Pintasan Keyboard Presenter

- `→` atau `Spasi`: Pindah ke slide berikutnya.
- `←`: Pindah ke slide sebelumnya.
- `F`: Masuk/keluar mode layar penuh (*Fullscreen*).
- `Tombol Menu (Kiri Atas)`: Membuka laci navigasi untuk loncat langsung ke slide mana saja.

---

## 🖨️ Mencetak Lembar Kerja Siswa

Di Slide 10, klik tombol **"Cetak Lembar Kerja"** (atau tekan `Ctrl+P` / `Cmd+P`). Browser akan otomatis beralih ke tata letak khusus kertas A4 yang memuat kop sekolah, identitas kelompok, kotak perumusan fungsi piecewise, area grafik, dan rubrik penilaian.

---

## 🌐 Deploy ke GitHub Pages

Proyek ini telah dikonfigurasi dengan:
1. `base: './'` pada `vite.config.ts` untuk kompatibilitas path relatif GitHub Pages.
2. File workflow otomatis di `.github/workflows/deploy.yml`.

Cukup lakukan push ke repositori GitHub:
```bash
git init
git add .
git commit -m "feat: inisialisasi media pembelajaran interaktif relasi dan fungsi"
git branch -M main
git remote add origin <URL_REPO_GITHUB_ANDA>
git push -u origin main
```
Lalu aktifkan GitHub Pages di menu **Settings $\to$ Pages $\to$ Source: GitHub Actions**.
