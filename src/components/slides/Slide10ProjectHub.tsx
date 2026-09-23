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
    title: 'Tarif Ojol',
    category: 'Transportasi',
    badge: 'Populer',
    story: 'Tarif awal: Rp 10.000 (≤ 4 km) | Tambahan: Rp 3.000/km',
    variableX: 'Jarak (km)',
    variableY: 'Tarif (Rp)',
    domainLatex: 'D_f = \\{x \\in \\mathbb{R} \\mid x \\ge 0\\}',
    rangeLatex: 'R_f = \\{y \\in \\mathbb{R} \\mid y \\ge 10.000\\}',
    formulaLatex: 'f(x) = \\begin{cases} 10.000, & 0 \\le x \\le 4 \\\\ 10.000 + 3.000(x - 4), & x > 4 \\end{cases}',
    defaultInput: 7,
    inputUnit: 'km',
    calc: (x) => {
      if (x <= 4) return { total: 10000, steps: 'Tarif dasar flat = Rp 10.000' };
      const extra = (x - 4) * 3000;
      return {
        total: 10000 + extra,
        steps: `Rp 10.000 + (${(x - 4).toFixed(1)} km × Rp 3.000) = Rp ${(10000 + extra).toLocaleString('id-ID')}`,
      };
    },
  },
  {
    id: 'parkir',
    title: 'Parkir Mall',
    category: 'Fasilitas Publik',
    badge: 'Relevan',
    story: 'Drop-off: Gratis (≤ 15 mnt) | Jam 1: Rp 5.000 | Ekstra: Rp 3.000/jam | Maks: Rp 40.000',
    variableX: 'Durasi (jam)',
    variableY: 'Biaya (Rp)',
    domainLatex: 'D_f = [0, 24] \\text{ jam}',
    rangeLatex: 'R_f = \\{0\\} \\cup [5.000, 40.000]',
    formulaLatex: 'f(x) = \\begin{cases} 0, & 0 \\le x \\le 0.25 \\\\ 5.000, & 0.25 < x \\le 1 \\\\ 5.000 + 3.000(x - 1), & 1 < x \\le 12.6 \\\\ 40.000, & x > 12.6 \\end{cases}',
    defaultInput: 3,
    inputUnit: 'jam',
    calc: (x) => {
      if (x <= 0.25) return { total: 0, steps: 'Gratis drop-off (≤ 15 mnt)' };
      if (x <= 1) return { total: 5000, steps: 'Tarif 1 jam pertama = Rp 5.000' };
      if (x <= 12.6) {
        const cost = 5000 + (x - 1) * 3000;
        return { total: cost, steps: `Rp 5.000 + (${(x - 1).toFixed(1)} jam × Rp 3.000) = Rp ${cost.toLocaleString('id-ID')}` };
      }
      return { total: 40000, steps: 'Batas tarif maksimal flat Rp 40.000' };
    },
  },
  {
    id: 'pajak',
    title: 'Pajak PPh 21',
    category: 'Keuangan',
    badge: 'Tantangan',
    story: 'Lapisan 1: 5% (≤ 60 Jt) | Lapisan 2: 15% (> 60 s.d. 250 Jt)',
    variableX: 'PKP (Juta Rp)',
    variableY: 'Pajak (Juta Rp)',
    domainLatex: 'D_f = [0, 250] \\text{ Juta}',
    rangeLatex: 'R_f = [0, 31.5] \\text{ Juta}',
    formulaLatex: 'f(x) = \\begin{cases} 0.05x, & 0 \\le x \\le 60 \\\\ 3 + 0.15(x - 60), & 60 < x \\le 250 \\end{cases}',
    defaultInput: 100,
    inputUnit: 'Juta Rp',
    calc: (x) => {
      if (x <= 60) return { total: x * 0.05, steps: `5% × Rp ${x} Juta = Rp ${(x * 0.05).toFixed(2)} Jt` };
      const extra = (x - 60) * 0.15;
      return {
        total: 3 + extra,
        steps: `(5% × 60 Jt) + [15% × (${x} - 60 Jt)] = Rp ${(3 + extra).toFixed(2)} Jt`,
      };
    },
  },
  {
    id: 'air',
    title: 'Tarif Air PDAM',
    category: 'Utilitas',
    badge: 'Sosial',
    story: 'Tier 1: Rp 2.000/m³ (≤ 10 m³) | Tier 2: Rp 4.000/m³ (> 10 m³)',
    variableX: 'Volume (m³)',
    variableY: 'Tagihan (Rp)',
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
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
          <Briefcase className="w-3.5 h-3.5" /> 14 · PROYEK
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Katalog Proyek
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all border ${
                activeTab === 'simulator'
                  ? 'bg-brand-600 border-brand-400 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Simulator
            </button>
            <button
              onClick={() => setActiveTab('rubrik')}
              className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all border ${
                activeTab === 'rubrik'
                  ? 'bg-brand-600 border-brand-400 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Rubrik
            </button>
            <button
              onClick={handlePrintWorksheet}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-bold flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Printer className="w-4 h-4" /> Cetak Lembar Kerja
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'simulator' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch my-1 flex-1 min-h-0">
          {/* List Pilihan Studi Kasus */}
          <div className="md:col-span-5 flex flex-col gap-2 justify-between">
            {CASES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCase(c);
                  setTestVal(c.defaultInput);
                }}
                className={`p-2.5 px-3 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  selectedCase.id === c.id
                    ? 'bg-brand-900/40 border-brand-400 shadow-md ring-1 ring-brand-400'
                    : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                    {c.category}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-semibold">
                    {c.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">{c.title}</h4>
                {selectedCase.id === c.id && (
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{c.story}</p>
                )}
              </button>
            ))}
          </div>

          {/* Detail Studi Kasus & Simulator Mini */}
          <div className="md:col-span-7 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">{selectedCase.title}</h3>
                <span className="text-[11px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800">
                  Model Matematika
                </span>
              </div>

              <div className="my-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                  Formula Piecewise:
                </span>
                <MathFormula math={selectedCase.formulaLatex} block className="text-xs md:text-sm text-brand-300" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-semibold text-[10px]">Domain:</span>
                  <MathFormula math={selectedCase.domainLatex} className="text-indigo-300 font-bold" />
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-semibold text-[10px]">Range:</span>
                  <MathFormula math={selectedCase.rangeLatex} className="text-emerald-300 font-bold" />
                </div>
              </div>
            </div>

            {/* Mini Simulator Box */}
            <div className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-1.5">
                <span className="flex items-center gap-1 text-amber-400 text-xs">
                  <Calculator className="w-3.5 h-3.5" /> Uji {selectedCase.variableX}:
                </span>
                <span className="font-mono text-white text-xs font-bold">
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
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="mt-1.5 text-xs text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="text-[11px] truncate">{simResult.steps}</span>
                <span className="font-bold text-emerald-400 text-xs font-mono ml-2 shrink-0">
                  {selectedCase.id === 'pajak' ? `Rp ${simResult.total.toFixed(2)} Jt` : `Rp ${simResult.total.toLocaleString('id-ID')}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab Rubrik Penilaian */
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl my-1 space-y-3 flex-1 min-h-0">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Rubrik Penilaian Proyek
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-amber-400 font-extrabold text-xl">25%</div>
              <h4 className="text-white font-bold text-xs mt-0.5">1. Identifikasi Masalah</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Kesesuaian masalah nyata dan batasan Domain-Range.
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-brand-400 font-extrabold text-xl">35%</div>
              <h4 className="text-white font-bold text-xs mt-0.5">2. Perumusan Fungsi</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ketepatan notasi kurung kurawal & syarat interval.
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-emerald-400 font-extrabold text-xl">25%</div>
              <h4 className="text-white font-bold text-xs mt-0.5">3. Gambar Grafik</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Skala proporsional & ketepatan titik ● vs ○.
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-purple-400 font-extrabold text-xl">15%</div>
              <h4 className="text-white font-bold text-xs mt-0.5">4. Analisis & Kesimpulan</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Interpretasi dunia nyata & relevansi kebijakan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-emerald-500 px-4 py-2.5 rounded-r-xl flex items-center justify-between mt-1 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">KUNCI</span>
          <p className="text-slate-200 text-sm md:text-base font-semibold">
            Modelkan masalah nyata ke dalam fungsi Piecewise, tentukan domain-range fisik, dan gambar grafiknya
          </p>
        </div>
      </div>
    </div>
  );
};
