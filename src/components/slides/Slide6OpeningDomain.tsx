import React, { useState } from 'react';
import {
  Clock,
  ArrowRight,
  Gauge,
  TrendingUp,
  Target,
  Sparkles,
  MapPin,
  Users,
} from 'lucide-react';
import { MathFormula } from '../MathFormula';

interface Slide6OpeningDomainProps {
  onNext?: () => void;
}

interface PhysicalCase {
  id: string;
  name: string;
  icon: string;
  variable: string;
  domainStr: string;
  rangeStr: string;
  formula: string;
  absurdExample: string;
  explanation: string;
}

const CASES: PhysicalCase[] = [
  {
    id: 'ojol',
    name: 'Tarif Ojek Online',
    icon: '🛵',
    variable: 'Jarak Tempuh (x km)',
    domainStr: 'D = {x \\mid x \\ge 0, x \\in \\mathbb{R}}',
    rangeStr: 'R = {y \\mid y \\ge 10.000}',
    formula: 'f(x) = 3.000x + 10.000',
    absurdExample: 'Jarak x = -5 km (Mustahil mundur waktu!)',
    explanation: 'Jarak tempuh nyata selalu non-negatif. Ongkos minimal adalah tarif buka pintu Rp 10.000.',
  },
  {
    id: 'lift',
    name: 'Kapasitas Lift Gedung',
    icon: '🛗',
    variable: 'Banyak Penumpang (n orang)',
    domainStr: 'D = \\{0, 1, 2, \\dots, 8\\}',
    rangeStr: 'R = \\{0, 70, 140, \\dots, 560\\} \\text{ kg}',
    formula: 'B(n) = 70n',
    absurdExample: 'Penumpang n = 3,7 orang (Orang tidak bisa pecahan!)',
    explanation: 'Banyak orang wajib berupa bilangan cacah diskrit utuh, dengan batasan batas beban maksimal.',
  },
  {
    id: 'baterai',
    name: 'Baterai Smartphone',
    icon: '🔋',
    variable: 'Waktu Pakai (t jam)',
    domainStr: 'D = [0, 8] \\text{ jam}',
    rangeStr: 'R = [0, 100] \\%',
    formula: 'B(t) = 100 - 12.5t',
    absurdExample: 'Baterai 115% atau -20% (Kapasitas fisik mutlak terbatas!)',
    explanation: 'Persentase baterai tidak pernah melebihi 100% dan tidak pernah jatuh di bawah 0%.',
  },
];

export const Slide6OpeningDomain: React.FC<Slide6OpeningDomainProps> = ({ onNext }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('ojol');
  const currentCase = CASES.find((c) => c.id === selectedCaseId) || CASES[0];

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden">
      {/* Top Session Breadcrumb Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PERTEMUAN 2 · 2 JP (90 MENIT)
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
            06 · BATASAN & LINEAR
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Fase E · Kelas X SMA</span>
        </div>
      </div>

      {/* Main Split Screen 50:50 Content */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6 py-3 items-center">
        {/* SISI KIRI: Visual Konsep "BATASAN NYATA & LINEAR" */}
        <div className="h-full flex flex-col justify-between bg-slate-900/60 rounded-2xl p-4 md:p-5 border border-slate-800 shadow-xl overflow-hidden">
          {/* Header Judul */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 font-mono">
                MATEMATIKA DI DUNIA NYATA
              </span>
              <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                <Gauge className="w-3 h-3 text-emerald-400" />
                <span>Domain & Range Fisik</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl xl:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r dark:from-emerald-300 dark:via-teal-300 dark:to-cyan-300 from-emerald-700 via-teal-700 to-cyan-800 mt-1">
              BATASAN NYATA
            </h1>
          </div>

          {/* Preset Buttons Studi Kasus */}
          <div className="flex items-center gap-2 my-2">
            {CASES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  selectedCaseId === c.id
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          {/* Interactive Visual Card */}
          <div className="w-full bg-slate-950/90 rounded-xl border border-slate-800/80 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentCase.icon}</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{currentCase.name}</div>
                  <div className="text-[11px] text-slate-400">{currentCase.variable}</div>
                </div>
              </div>
              <div className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
                <MathFormula math={currentCase.formula} />
              </div>
            </div>

            {/* Formula Math Box: Domain & Range */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Domain (Input x)</div>
                <div className="text-emerald-300 font-semibold mt-0.5">
                  <MathFormula math={currentCase.domainStr} />
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Range (Output y)</div>
                <div className="text-cyan-300 font-semibold mt-0.5">
                  <MathFormula math={currentCase.rangeStr} />
                </div>
              </div>
            </div>

            {/* Warning Miskonsepsi Fisik */}
            <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 flex items-center justify-between text-xs">
              <span className="text-rose-200 text-[11px] font-medium">
                ⚠️ Nilai Absurd: {currentCase.absurdExample}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[9px] font-bold">
                TIDAK LOGIS
              </span>
            </div>
          </div>

          {/* Status Badge & Bridge ke Slide Selanjutnya */}
          <div className="pt-2 flex flex-col gap-2">
            <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-200">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium text-[11px] md:text-xs">
                  {currentCase.explanation}
                </span>
              </div>
            </div>

            {onNext && (
              <button
                onClick={onNext}
                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all border border-emerald-400/40 group"
              >
                <span>Mulai Eksplorasi: Batasan Nyata</span>
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
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <Target className="w-4 h-4" />
                </div>
                <h2 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white">
                  Target Belajar
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                3 Misi
              </span>
            </div>
          </div>

          {/* 3 Kartu Target Belajar Ultra-Minimalis */}
          <div className="space-y-3 my-auto py-2">
            {/* Target 1 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                  1. Domain & Range Fisik
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
                Batasan Nyata
              </span>
            </div>

            {/* Target 2 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-teal-500/30 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/40 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                  2. Diskrit vs Kontinu
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-500/30 shrink-0">
                Cacah vs Riil
              </span>
            </div>

            {/* Target 3 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                  3. Model Linear
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30 shrink-0">
                f(x) = ax + b
              </span>
            </div>
          </div>

          {/* Footer Card: Metode & Alur Belajar */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-medium text-slate-400">
              Media: <strong className="text-emerald-400">Simulasi Batasan & Grafik</strong>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Slide 6–8
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
