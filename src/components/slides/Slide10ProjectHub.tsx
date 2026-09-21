import React, { useState } from 'react';
import { Briefcase, Printer, Award, Calculator } from 'lucide-react';
import { MathFormula } from '../MathFormula';

interface ProjectCase {
  id: string;
  title: string;
  category: string;
  badge: string;
  story: string;
  variableX: string;
  variableY: string;
  domainLatex: string;
  rangeLatex: string;
  formulaLatex: string;
  defaultInput: number;
  inputUnit: string;
  calc: (x: number) => { total: number; steps: string };
}

const CASES: ProjectCase[] = [
  {
    id: 'ojol',
    title: 'Tarif Ojek Online Bertingkat',
    category: 'Transportasi',
    badge: 'Populer',
    story: 'Sebuah aplikasi ojol menerapkan tarif buka pintu Rp 10.000 untuk 4 km pertama. Setelah 4 km, dikenakan biaya tambahan Rp 3.000 setiap km.',
    variableX: 'Jarak perjalanan (x dalam km)',
    variableY: 'Total tarif penumpang (y dalam Rupiah)',
    domainLatex: 'D_f = \\{x \\in \\mathbb{R} \\mid x \\ge 0\\}',
    rangeLatex: 'R_f = \\{y \\in \\mathbb{R} \\mid y \\ge 10.000\\}',
    formulaLatex: 'f(x) = \\begin{cases} 10.000, & 0 \\le x \\le 4 \\\\ 10.000 + 3.000(x - 4), & x > 4 \\end{cases}',
    defaultInput: 7,
    inputUnit: 'km',
    calc: (x) => {
      if (x <= 4) return { total: 10000, steps: 'Masuk tarif dasar flat 4 km pertama = Rp 10.000' };
      const extra = (x - 4) * 3000;
      return {
        total: 10000 + extra,
        steps: `Rp 10.000 + (${(x - 4).toFixed(1)} km × Rp 3.000) = Rp ${(10000 + extra).toLocaleString('id-ID')}`,
      };
    },
  },
  {
    id: 'parkir',
    title: 'Parkir Mall Progresif',
    category: 'Fasilitas Publik',
    badge: 'Relevan',
    story: 'Mall memberlakukan drop-off 15 menit gratis (0.25 jam). Jam pertama Rp 5.000, jam berikutnya Rp 3.000/jam, dengan batas maksimal Rp 40.000 per hari.',
    variableX: 'Durasi parkir (x dalam jam)',
    variableY: 'Biaya parkir (y dalam Rupiah)',
    domainLatex: 'D_f = [0, 24] \\text{ jam}',
    rangeLatex: 'R_f = \\{0\\} \\cup [5.000, 40.000]',
    formulaLatex: 'f(x) = \\begin{cases} 0, & 0 \\le x \\le 0.25 \\\\ 5.000, & 0.25 < x \\le 1 \\\\ 5.000 + 3.000(x - 1), & 1 < x \\le 12.6 \\\\ 40.000, & x > 12.6 \\end{cases}',
    defaultInput: 3,
    inputUnit: 'jam',
    calc: (x) => {
      if (x <= 0.25) return { total: 0, steps: 'Gratis drop-off (≤ 15 menit)' };
      if (x <= 1) return { total: 5000, steps: 'Tarif flat 1 jam pertama = Rp 5.000' };
      if (x <= 12.6) {
        const cost = 5000 + (x - 1) * 3000;
        return { total: cost, steps: `Rp 5.000 + (${(x - 1).toFixed(1)} jam × Rp 3.000) = Rp ${cost.toLocaleString('id-ID')}` };
      }
      return { total: 40000, steps: 'Mencapai batas tarif maksimal harian flat Rp 40.000' };
    },
  },
  {
    id: 'pajak',
    title: 'Pajak Penghasilan (PPh 21)',
    category: 'Keuangan Negara',
    badge: 'Tantangan',
    story: 'UU Perpajakan Indonesia memungut pajak progresif: 5% untuk 60 juta pertama, dan 15% untuk penghasilan kena pajak antara 60 juta hingga 250 juta.',
    variableX: 'Penghasilan Kena Pajak (x dalam Juta Rp)',
    variableY: 'Pajak terutang (y dalam Juta Rp)',
    domainLatex: 'D_f = [0, 250] \\text{ Juta}',
    rangeLatex: 'R_f = [0, 31.5] \\text{ Juta}',
    formulaLatex: 'f(x) = \\begin{cases} 0.05x, & 0 \\le x \\le 60 \\\\ 3 + 0.15(x - 60), & 60 < x \\le 250 \\end{cases}',
    defaultInput: 100,
    inputUnit: 'Juta Rp',
    calc: (x) => {
      if (x <= 60) return { total: x * 0.05, steps: `5% × Rp ${x} Juta = Rp ${(x * 0.05).toFixed(2)} Juta` };
      const extra = (x - 60) * 0.15;
      return {
        total: 3 + extra,
        steps: `(5% × 60 Jt) + [15% × (${x} - 60 Jt)] = Rp ${(3 + extra).toFixed(2)} Juta`,
      };
    },
  },
  {
    id: 'air',
    title: 'Tarif Air Minum PDAM',
    category: 'Utilitas & Lingkungan',
    badge: 'Sosial',
    story: 'PDAM mensubsidi 10 m³ pertama seharga Rp 2.000/m³. Pemakaian di atas 10 m³ hingga 20 m³ dikenakan Rp 4.000/m³ untuk mencegah pemborosan air.',
    variableX: 'Volume air (x dalam m³)',
    variableY: 'Tagihan air (y dalam Rupiah)',
    domainLatex: 'D_f = [0, \\infty) \\text{ m}^3',
    rangeLatex: 'R_f = [0, \\infty)',
    formulaLatex: 'f(x) = \\begin{cases} 2.000x, & 0 \\le x \\le 10 \\\\ 20.000 + 4.000(x - 10), & x > 10 \\end{cases}',
    defaultInput: 15,
    inputUnit: 'm³',
    calc: (x) => {
      if (x <= 10) return { total: x * 2000, steps: `${x} m³ × Rp 2.000 = Rp ${(x * 2000).toLocaleString('id-ID')}` };
      const extra = (x - 10) * 4000;
      return {
        total: 20000 + extra,
        steps: `(10 m³ × Rp 2.000) + [${(x - 10).toFixed(1)} m³ × Rp 4.000] = Rp ${(20000 + extra).toLocaleString('id-ID')}`,
      };
    },
  },
];

export const Slide10ProjectHub: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<ProjectCase>(CASES[0]);
  const [testVal, setTestVal] = useState<number>(CASES[0].defaultInput);
  const [activeTab, setActiveTab] = useState<'simulator' | 'rubrik'>('simulator');

  const simResult = selectedCase.calc(testVal);

  const handlePrintWorksheet = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold tracking-wide uppercase">
          <Briefcase className="w-4 h-4" /> Asesmen Akhir · Proyek Kolaboratif
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Katalog Fungsi Dunia Nyata
            </h1>
            <p className="text-xl text-slate-400 font-medium">
              Pilih 1 masalah nyata di sekitarmu, tentukan domain-rangenya, rumuskan fungsinya, dan gambarkan grafiknya!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                activeTab === 'simulator'
                  ? 'bg-brand-600 border-brand-400 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Studi Kasus & Simulator
            </button>
            <button
              onClick={() => setActiveTab('rubrik')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                activeTab === 'rubrik'
                  ? 'bg-brand-600 border-brand-400 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Rubrik Penilaian
            </button>
            <button
              onClick={handlePrintWorksheet}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <Printer className="w-4 h-4" /> Cetak Lembar Kerja
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'simulator' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch my-2">
          {/* List Pilihan Studi Kasus */}
          <div className="md:col-span-5 flex flex-col gap-2.5">
            {CASES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCase(c);
                  setTestVal(c.defaultInput);
                }}
                className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  selectedCase.id === c.id
                    ? 'bg-brand-900/40 border-brand-400 shadow-md ring-1 ring-brand-400'
                    : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                    {c.category}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                    {c.badge}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-1">{c.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{c.story}</p>
              </button>
            ))}
          </div>

          {/* Detail Studi Kasus & Simulator Mini */}
          <div className="md:col-span-7 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white">{selectedCase.title}</h3>
                <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
                  Model Matematika
                </span>
              </div>

              <div className="my-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] uppercase font-bold text-slate-500 block mb-1">
                  Formula Sepenggal (Piecewise):
                </span>
                <MathFormula math={selectedCase.formulaLatex} block className="text-sm md:text-base text-brand-300" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-semibold">Domain Fisik:</span>
                  <MathFormula math={selectedCase.domainLatex} className="text-indigo-300 font-bold" />
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-semibold">Range Fisik:</span>
                  <MathFormula math={selectedCase.rangeLatex} className="text-emerald-300 font-bold" />
                </div>
              </div>
            </div>

            {/* Mini Simulator Box */}
            <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                <span className="flex items-center gap-1 text-amber-400">
                  <Calculator className="w-3.5 h-3.5" /> Uji Input ({selectedCase.variableX}):
                </span>
                <span className="font-mono text-white text-sm">
                  {testVal} {selectedCase.inputUnit}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={selectedCase.id === 'pajak' ? 250 : selectedCase.id === 'parkir' ? 24 : 20}
                step={selectedCase.id === 'pajak' ? 5 : 0.5}
                value={testVal}
                onChange={(e) => setTestVal(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="mt-2 text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                <span>{simResult.steps}</span>
                <span className="font-bold text-emerald-400 text-sm font-mono ml-2 shrink-0">
                  {selectedCase.id === 'pajak' ? `Rp ${simResult.total.toFixed(2)} Jt` : `Rp ${simResult.total.toLocaleString('id-ID')}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab Rubrik Penilaian */
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl my-2 space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Rubrik Penilaian Proyek "Katalog Fungsi Dunia Nyata"
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-amber-400 font-extrabold text-2xl">25%</div>
              <h4 className="text-white font-bold text-sm mt-1">1. Identifikasi Masalah</h4>
              <p className="text-xs text-slate-400 mt-1">
                Kesesuaian topik dunia nyata serta penetapan batasan Domain dan Range yang masuk akal secara fisik.
              </p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-brand-400 font-extrabold text-2xl">35%</div>
              <h4 className="text-white font-bold text-sm mt-1">2. Perumusan Fungsi</h4>
              <p className="text-xs text-slate-400 mt-1">
                Ketepatan notasi kurung kurawal, penentuan syarat interval cabang, dan formula aljabar tiap segmen.
              </p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-emerald-400 font-extrabold text-2xl">25%</div>
              <h4 className="text-white font-bold text-sm mt-1">3. Gambar Grafik</h4>
              <p className="text-xs text-slate-400 mt-1">
                Kerapian grafik pada kertas milimeter/aplikasi, skala sumbu yang proporsional, serta ketepatan titik terbuka/tertutup.
              </p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-purple-400 font-extrabold text-2xl">15%</div>
              <h4 className="text-white font-bold text-sm mt-1">4. Analisis & Kesimpulan</h4>
              <p className="text-xs text-slate-400 mt-1">
                Kemampuan menjelaskan mengapa fungsi tersebut adil/relevan bagi masyarakat dan saran perbaikan kebijakan.
              </p>
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
            📌 Output Siswa: Poster Digital / Lembar Presentasi 1 Lembar yang memuat Judul Masalah, Aturan Cerita, Rumus Piecewise KaTeX, Grafik, dan 3 Contoh Perhitungan Nyata.
          </div>
        </div>
      )}

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-emerald-500 p-4 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">GOAL AKHIR</span>
          <p className="text-slate-200 text-lg font-semibold">
            Matematika bukan sekadar hafalan rumus di kertas, melainkan <span className="text-emerald-300 font-bold">alat untuk memodelkan dan memahami dunia nyata</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
