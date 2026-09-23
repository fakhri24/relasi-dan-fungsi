import React, { useState } from 'react';
import {
  Clock,
  ArrowRight,
  GitBranch,
  Split,
  Target,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { MathFormula } from '../MathFormula';

interface Slide9OpeningPiecewiseProps {
  onNext?: () => void;
}

export const Slide9OpeningPiecewise: React.FC<Slide9OpeningPiecewiseProps> = ({ onNext }) => {
  const [boundaryState, setBoundaryState] = useState<'valid' | 'conflict'>('valid');

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden">
      {/* Top Session Breadcrumb Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            PERTEMUAN 3 · 2 JP (90 MENIT)
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
            09 · FUNGSI SEPENGCAL
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Fase E · Kelas X SMA</span>
        </div>
      </div>

      {/* Main Split Screen 50:50 Content */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6 py-3 items-center">
        {/* SISI KIRI: Visual Konsep "PIECEWISE" */}
        <div className="h-full flex flex-col justify-between bg-slate-900/60 rounded-2xl p-4 md:p-5 border border-slate-800 shadow-xl overflow-hidden">
          {/* Header Judul */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 font-mono">
                ATURAN FUNGSI MULTI-KONDISI
              </span>
              <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                <GitBranch className="w-3 h-3 text-amber-400" />
                <span>Piecewise Function</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r dark:from-amber-300 dark:via-orange-300 dark:to-rose-300 from-amber-700 via-orange-700 to-rose-700 mt-1">
              PIECEWISE
            </h1>
          </div>

          {/* Interactive SVG: Visual Kurung Kurawal & Titik ● vs ○ */}
          <div className="w-full bg-slate-950/90 rounded-xl border border-slate-800/80 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[11px] font-mono text-slate-400">
                Notasi Matematika & Titik Kritis Sambungan:
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setBoundaryState('valid')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                    boundaryState === 'valid'
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Sah (● & ○)
                </button>
                <button
                  onClick={() => setBoundaryState('conflict')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                    boundaryState === 'conflict'
                      ? 'bg-rose-600 text-white border-rose-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Tabrakan (● & ●)
                </button>
              </div>
            </div>

            {/* Formula KaTeX Representation */}
            <div className="py-2 flex items-center justify-center">
              <div className="bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-amber-200 text-xs md:text-sm">
                <MathFormula
                  math={`f(x) = \\begin{cases} 2x, & x \\le 3 \\\\ 10, & x ${
                    boundaryState === 'valid' ? '>' : '\\ge'
                  } 3 \\end{cases}`}
                />
              </div>
            </div>

            {/* Mini SVG Graph Illustration of Branching & Points */}
            <div className="relative h-24 w-full bg-slate-900/50 rounded-lg border border-slate-800/60 p-2 overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 320 80">
                {/* Sumbu Koordinat */}
                <line x1="30" y1="70" x2="300" y2="70" stroke="#334155" strokeWidth="1" />
                <line x1="160" y1="10" x2="160" y2="75" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                <text x="160" y="78" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">x = 3</text>

                {/* Garis Cabang 1: 2x (x <= 3) */}
                <line x1="40" y1="65" x2="160" y2="35" stroke="#f59e0b" strokeWidth="3" />
                {/* Titik Penuh di Cabang 1 */}
                <circle cx="160" cy="35" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <text x="100" y="45" fill="#f59e0b" fontSize="9" fontWeight="bold">2x</text>

                {/* Garis Cabang 2: y = 10 */}
                <line x1="160" y1="18" x2="280" y2="18" stroke="#38bdf8" strokeWidth="3" />
                {/* Titik di Cabang 2 (Valid = Kosong, Conflict = Penuh) */}
                {boundaryState === 'valid' ? (
                  <circle cx="160" cy="18" r="4.5" fill="var(--theme-svg-bg, #0f172a)" stroke="#38bdf8" strokeWidth="2" />
                ) : (
                  <circle cx="160" cy="18" r="4.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                )}
                <text x="220" y="14" fill="#38bdf8" fontSize="9" fontWeight="bold">10</text>
              </svg>
            </div>

            {/* Boundary Validation Note */}
            <div
              className={`mt-2 p-2 rounded-lg border text-xs flex items-center justify-between ${
                boundaryState === 'valid'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px]">
                {boundaryState === 'valid' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                )}
                <span>
                  {boundaryState === 'valid'
                    ? 'Saat x = 3 hanya ikut cabang atas (●). Lolos Uji Fungsi!'
                    : 'Saat x = 3 ikut kedua cabang (● & ●). Gagal Uji Fungsi (Mendua)!'}
                </span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold ${
                  boundaryState === 'valid'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {boundaryState === 'valid' ? 'FUNGSI SAH' : 'BUKAN FUNGSI'}
              </span>
            </div>
          </div>

          {/* Bridge Button ke Slide 10 */}
          <div className="pt-2">
            {onNext && (
              <button
                onClick={onNext}
                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all border border-amber-400/40 group"
              >
                <span>Uji Kasus: Mengapa 1 Garis Tidak Cukup?</span>
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
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <Target className="w-4 h-4" />
                </div>
                <h2 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white">
                  Target Belajar
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                3 Misi
              </span>
            </div>
          </div>

          {/* 3 Kartu Target Belajar Ultra-Minimalis */}
          <div className="space-y-3 my-auto py-2">
            {/* Target 1 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                  1. Kebutuhan Cabang
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 shrink-0">
                Dilema 1 Garis
              </span>
            </div>

            {/* Target 2 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-orange-500/30 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/40 flex items-center justify-center shrink-0">
                  <Split className="w-4 h-4" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                  2. Notasi Kurawal
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-800 dark:text-orange-300 border border-orange-500/30 shrink-0">
                f(x) = &#123; ... &#125;
              </span>
            </div>

            {/* Target 3 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/30 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                  3. Titik Sambungan
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/30 shrink-0">
                Solid ● vs Lubang ○
              </span>
            </div>
          </div>

          {/* Footer Card: Metode & Alur Belajar */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-medium text-slate-400">
              Media: <strong className="text-amber-400">Sandbox Perancang Fungsi</strong>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Slide 9–12
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
