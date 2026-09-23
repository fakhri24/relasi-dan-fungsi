# Architectural Decisions & Incident Memory

## [2026-09-24] Resolusi Bug SVG Clipping & Kurva Bezier Adaptif Multi-Panah (v2.1.1)

### 1. Root Cause Analysis (SVG Filter Clipping)
- **Problem**: Pada diagram panah relasi (Slide 1, Slide 3, dan LKPD Canvas), ketika anggota domain $A$ memilih anggota kodomain $B$ pada baris horizontal yang sama ($y_1 = y_2$, contoh: Budi $\to$ Game di $y=64$), garis panah tidak muncul sama sekali di layar.
- **Root Cause**: Garis lurus horizontal memiliki geometri height $0\text{ px}$. Elemen filter SVG (`<filter id="arrowGlow">`) secara default menggunakan `filterUnits="objectBoundingBox"`. Akibatnya, browser modern (WebKit/Blink) memotong (*clipping*) area rendering elemen hingga nol piksel, sehingga garis diabaikan oleh engine grafis.

### 2. Solusi & Standar Teknis
1. **SVG Filter Units**:
   - Seluruh filter SVG pada garis/panah wajib menyertakan `filterUnits="userSpaceOnUse"` dengan bounding box absolut penuh kanvas (misal: `x="0" y="0" width="520" height="230"`).
2. **Kurva Bezier Adaptif (Busur & Multi-Source Spread)**:
   - Garis horizontal sejajar ($y_1 = y_2$) kini menggunakan busur lengkung ke atas dengan titik kontrol $y_{\text{arc}} = y_1 - 14\text{ px}$.
   - Anggota domain yang memiliki multi-relasi (misal Budi $\to$ Game & Musik) menggunakan offset titik kontrol awal ($\pm 6\text{ px}$) agar garis memencar harmonis dan keduanya terlihat jelas tanpa tumpang-tindih.
3. **Komponen Terdampak**:
   - `src/components/slides/Slide1OpeningRelasi.tsx`
   - `src/components/slides/Slide3ArrowDiagram.tsx`
   - `src/components/lkpd/InteractiveArrowCanvas.tsx`
4. **Verifikasi**:
   - `npm run build` lolos tanpa error.
   - Commit `68fcdbd` di-push ke branch `main`.
   - Workflow GitHub Actions (`Deploy to GitHub Pages` run `35933515751`) selesai berstatus **SUCCESS**.
