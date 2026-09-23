import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { MathFormula } from '../MathFormula';

export const Slide8PiecewiseIntro: React.FC = () => {
  const [activeX, setActiveX] = useState<number>(2.5);

  // Menentukan cabang aktif
  // Cabang 1: 0 <= x <= 1 -> f(x) = 4
  // Cabang 2: 1 < x <= 4 -> f(x) = 2x + 2
  // Cabang 3: x > 4 -> f(x) = 10
  const getBranch = (x: number) => {
    if (x <= 1) return { branch: 1, val: 4, formula: 'f(x) = 4' };
    if (x <= 4) return { branch: 2, val: 2 * x + 2, formula: `f(x) = 2(${x.toFixed(1)}) + 2 = ${(2 * x + 2).toFixed(1)}` };
    return { branch: 3, val: 10, formula: 'f(x) = 10' };
  };

  const currentBranch = getBranch(activeX);

  // SVG Mapping (x: 0 to 6 -> px: 50 to 380, y: 0 to 14 -> py: 240 to 30)
  const mapX = (x: number) => 50 + (x / 6) * 330;
  const mapY = (y: number) => 240 - (y / 14) * 200;

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono font-bold tracking-wider uppercase">
          <Layers className="w-3.5 h-3.5" /> 11 · PIECEWISE
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Fungsi Bercabang
        </h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-slate-900/90 border border-slate-800 p-4 md:p-5 rounded-2xl shadow-xl my-1 flex-1 min-h-0">
        {/* Kolom Kiri: Notasi KaTeX Bercabang dengan Highlight */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-3">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-[11px] uppercase font-bold tracking-widest text-slate-500 block mb-2">
              Notasi Piecewise
            </span>

            {/* Render 3 Baris Cabang */}
            <div className="space-y-2 font-mono text-sm">
              <div
                className={`p-2.5 px-3 rounded-xl border transition-all ${
                  currentBranch.branch === 1
                    ? 'bg-brand-600/30 border-brand-400 text-white shadow-lg ring-1 ring-brand-400'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base">
                    <MathFormula math="f(x) = 4" />
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    jika <MathFormula math="0 \le x \le 1" />
                  </span>
                </div>
              </div>

              <div
                className={`p-2.5 px-3 rounded-xl border transition-all ${
                  currentBranch.branch === 2
                    ? 'bg-brand-600/30 border-brand-400 text-white shadow-lg ring-1 ring-brand-400'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base">
                    <MathFormula math="f(x) = 2x + 2" />
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    jika <MathFormula math="1 < x \le 4" />
                  </span>
                </div>
              </div>

              <div
                className={`p-2.5 px-3 rounded-xl border transition-all ${
                  currentBranch.branch === 3
                    ? 'bg-brand-600/30 border-brand-400 text-white shadow-lg ring-1 ring-brand-400'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base">
                    <MathFormula math="f(x) = 10" />
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    jika <MathFormula math="x > 4" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Arti Titik Penuh vs Berlubang */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-brand-400 border-2 border-white flex items-center justify-center shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Titik Penuh (●)</div>
                <div className="text-[11px] text-slate-400">Ikut masuk (<MathFormula math="\le" /> atau <MathFormula math="\ge" />)</div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-slate-950 border-2 border-brand-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Titik Terbuka (○)</div>
                <div className="text-[11px] text-slate-400">Tidak ikut (<MathFormula math="<" /> atau <MathFormula math=">" />)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: SVG Grafik Piecewise & Slider x */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-3">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
            <svg className="w-full h-[190px]" viewBox="0 0 420 260">
              {/* Sumbu X & Y */}
              <line x1="50" y1="240" x2="400" y2="240" stroke="#64748b" strokeWidth="2" />
              <line x1="50" y1="20" x2="50" y2="240" stroke="#64748b" strokeWidth="2" />

              {/* Grid Label Sumbu X */}
              {[0, 1, 2, 3, 4, 5, 6].map((x) => (
                <g key={x}>
                  <line x1={mapX(x)} y1="236" x2={mapX(x)} y2="244" stroke="#94a3b8" />
                  <text x={mapX(x)} y="255" textAnchor="middle" fill="#94a3b8" fontSize="11" className="font-mono">
                    {x}
                  </text>
                </g>
              ))}

              {/* Cabang 1: 0 <= x <= 1, y = 4 */}
              <line
                x1={mapX(0)}
                y1={mapY(4)}
                x2={mapX(1)}
                y2={mapY(4)}
                stroke={currentBranch.branch === 1 ? '#818cf8' : '#475569'}
                strokeWidth={currentBranch.branch === 1 ? '5' : '3'}
              />
              <circle cx={mapX(0)} cy={mapY(4)} r="4" fill="#818cf8" stroke="#fff" />
              <circle cx={mapX(1)} cy={mapY(4)} r="4" fill="#818cf8" stroke="#fff" />

              {/* Cabang 2: 1 < x <= 4, y = 2x + 2 */}
              <line
                x1={mapX(1)}
                y1={mapY(4)}
                x2={mapX(4)}
                y2={mapY(10)}
                stroke={currentBranch.branch === 2 ? '#818cf8' : '#475569'}
                strokeWidth={currentBranch.branch === 2 ? '5' : '3'}
              />
              <circle cx={mapX(1)} cy={mapY(4)} r="4" fill="#020617" stroke="#818cf8" strokeWidth="2" />
              <circle cx={mapX(4)} cy={mapY(10)} r="4" fill="#818cf8" stroke="#fff" />

              {/* Cabang 3: x > 4, y = 10 */}
              <line
                x1={mapX(4)}
                y1={mapY(10)}
                x2={mapX(6)}
                y2={mapY(10)}
                stroke={currentBranch.branch === 3 ? '#818cf8' : '#475569'}
                strokeWidth={currentBranch.branch === 3 ? '5' : '3'}
              />
              <circle cx={mapX(4)} cy={mapY(10)} r="4" fill="#020617" stroke="#818cf8" strokeWidth="2" />

              {/* Titik Tracker Aktif */}
              <circle
                cx={mapX(activeX)}
                cy={mapY(currentBranch.val)}
                r="7"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="2.5"
                className="animate-pulse"
              />
              <line
                x1={mapX(activeX)}
                y1="240"
                x2={mapX(activeX)}
                y2={mapY(currentBranch.val)}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </svg>
          </div>

          {/* Slider Kontrol Tracker x */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-1.5">
              <span>Input <MathFormula math="x" />:</span>
              <span className="text-brand-300 font-mono text-xs font-bold">
                x = {activeX.toFixed(1)} <MathFormula math="\to" /> y = {currentBranch.val.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="0.1"
              value={activeX}
              onChange={(e) => setActiveX(parseFloat(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-brand-500 px-4 py-2.5 rounded-r-xl flex items-center justify-between mt-1 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold">KUNCI</span>
          <p className="text-slate-200 text-sm md:text-base font-semibold">
            Cek syarat interval <MathFormula math="x" /> terlebih dahulu, lalu hitung menggunakan rumus cabang terkait
          </p>
        </div>
      </div>
    </div>
  );
};
