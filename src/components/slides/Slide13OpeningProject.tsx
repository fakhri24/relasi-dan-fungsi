import React, { useState } from 'react';
import {
  Clock,
  ArrowRight,
  Briefcase,
  Target,
  Calculator,
  FileSpreadsheet,
  Award,
} from 'lucide-react';
import { MathFormula } from '../MathFormula';

interface Slide13OpeningProjectProps {
  onNext?: () => void;
}

interface CasePreview {
  id: string;
  name: string;
  icon: string;
  field: string;
  shortFormula: string;
  highlights: string;
}

const PROJECT_CASES: CasePreview[] = [
  {
    id: 'parkir',
    name: 'Tarif Parkir Mall Progresif',
    icon: '🅿️',
    field: 'Transportasi & Kota',
    shortFormula: 'f(t) = \\begin{cases} 5.000, & 0 < t \\le 1 \\\\ 5.000 + 3.000(t-1), & 1 < t \\le 7 \\\\ 25.000, & t > 7 \\end{cases}',
    highlights: 'Jam pertama tetap, jam berikutnya linier naik, batas atas tarif maksimal.',
  },
  {
    id: 'krl',
    name: 'Tarif KRL Commuter Line',
    icon: '🚆',
    field: 'Layanan Publik Kereta',
    shortFormula: 'f(s) = \\begin{cases} 3.000, & 0 < s \\le 25 \\\\ 3.000 + 1.000 \\lceil \\frac{s-25}{10} \\rceil, & s > 25 \\end{cases}',
    highlights: 'Jarak 25 km awal flat Rp 3.000, tiap kelipatan 10 km berikutnya tambah Rp 1.000.',
  },
  {
    id: 'listrik',
    name: 'Tarif Listrik Daya 1300 VA',
    icon: '⚡',
    field: 'Energi Rumah Tangga',
    shortFormula: 'f(k) = \\begin{cases} 1.444,70 \\cdot k, & 0 \\le k \\le 100 \\\\ 144.470 + 1.699,53(k-100), & k > 100 \\end{cases}',
    highlights: 'Pemakaian hemat blok 1 standar, pemakaian tinggi blok 2 tarif progresif.',
  },
  {
    id: 'bagasi',
    name: 'Kelebihan Bagasi Pesawat',
    icon: '✈️',
    field: 'Penerbangan Domestik',
    shortFormula: 'f(w) = \\begin{cases} 0, & 0 \\le w \\le 20 \\\\ 35.000(w-20), & w > 20 \\end{cases}',
    highlights: 'Gratis jatah kabin 20 kg pertama, kelebihan berat dikenakan denda per kg.',
  },
];

export const Slide13OpeningProject: React.FC<Slide13OpeningProjectProps> = ({ onNext }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('parkir');
  const activeCase = PROJECT_CASES.find((c) => c.id === selectedCaseId) || PROJECT_CASES[0];

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden">
      {/* Top Session Breadcrumb Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            PERTEMUAN 4 · 2 JP (90 MENIT)
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
            13 · PROYEK PEMODELAN NYATA
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span>Fase E · Asesmen Otentik</span>
        </div>
      </div>

      {/* Main Split Screen 50:50 Content */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6 py-3 items-center">
        {/* SISI KIRI: Visual Konsep "PROYEK NYATA" */}
        <div className="h-full flex flex-col justify-between bg-slate-900/60 rounded-2xl p-4 md:p-5 border border-slate-800 shadow-xl overflow-hidden">
          {/* Header Judul */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400 font-mono">
                STUDI KASUS OTENTIK
              </span>
              <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                <Briefcase className="w-3 h-3 text-purple-400" />
                <span>Konsultan Matematika</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl xl:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 mt-1">
              PROYEK NYATA
            </h1>
          </div>

          {/* Quick Case Chips */}
          <div className="grid grid-cols-2 gap-2 my-2">
            {PROJECT_CASES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`p-2 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 border ${
                  selectedCaseId === c.id
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span className="text-base shrink-0">{c.icon}</span>
                <span className="truncate">{c.name}</span>
              </button>
            ))}
          </div>

          {/* Case Preview Card */}
          <div className="w-full bg-slate-950/90 rounded-xl border border-slate-800/80 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeCase.icon}</span>
                <div>
                  <div className="text-xs font-bold text-white">{activeCase.name}</div>
                  <div className="text-[10px] text-purple-400 font-mono">{activeCase.field}</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                Model Piecewise
              </span>
            </div>

            {/* Formula Preview Box */}
            <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-center text-xs overflow-x-auto py-1.5 text-purple-200">
              <MathFormula math={activeCase.shortFormula} />
            </div>

            <p className="text-[11px] text-slate-300 italic">
              💡 {activeCase.highlights}
            </p>
          </div>

          {/* Bridge Button ke Slide 14 (Katalog Proyek) */}
          <div className="pt-2">
            {onNext && (
              <button
                onClick={onNext}
                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all border border-purple-400/40 group"
              >
                <span>Buka Katalog Proyek & Simulator Tarif</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* SISI KANAN: Panel Target Belajar Hari Ini */}
        <div className="h-full flex flex-col justify-between bg-slate-900/60 rounded-2xl p-4 md:p-5 border border-slate-800 shadow-xl overflow-hidden">
          {/* Header Panel Target */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Target className="w-4 h-4" />
                </div>
                <h2 className="text-base md:text-lg font-extrabold text-white">
                  Target Belajar
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-purple-400">
                3 Misi
              </span>
            </div>
          </div>

          {/* 3 Kartu Target Belajar Ultra-Minimalis */}
          <div className="space-y-3 my-auto py-2">
            {/* Target 1 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-white">
                  1. Analisis Kasus
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                Ekstraksi Syarat
              </span>
            </div>

            {/* Target 2 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-fuchsia-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-white">
                  2. Rancang Piecewise
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 shrink-0">
                Rumus & Interval
              </span>
            </div>

            {/* Target 3 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-white">
                  3. Lembar Kerja Proyek
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                Katalog & LKPD 4
              </span>
            </div>
          </div>

          {/* Footer Card: Metode & Alur Belajar */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-medium text-slate-400">
              Luaran: <strong className="text-purple-400">Laporan Proyek A4 & Presentasi</strong>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Slide 13–14
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
