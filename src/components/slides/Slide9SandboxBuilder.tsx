import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import { MathFormula } from '../MathFormula';

export const Slide9SandboxBuilder: React.FC = () => {
  // Parameter Sandbox:
  // Tier 1: 0 <= x <= t1 (misal 2 jam) -> Flat tarif1 (misal Rp 10.000)
  // Tier 2: t1 < x <= t2 (misal 6 jam) -> tarif1 + rate * (x - t1)
  // Tier 3: x > t2 -> Max cap tarifMax (misal Rp 35.000)
  const [t1, setT1] = useState<number>(2);
  const [rate, setRate] = useState<number>(5000);
  const [testInput, setTestInput] = useState<number>(4);

  const flatT1 = 10000;
  const t2 = 6;
  const maxCap = flatT1 + rate * (t2 - t1);

  // Kalkulasi output uji
  const calculateCost = (x: number) => {
    if (x <= t1) return { cost: flatT1, tier: 1, text: `Tarif Dasar Flat (0 - ${t1} jam)` };
    if (x <= t2) {
      const added = rate * (x - t1);
      return {
        cost: flatT1 + added,
        tier: 2,
        text: `Dasar Rp ${flatT1.toLocaleString()} + (${(x - t1).toFixed(1)} jam × Rp ${rate.toLocaleString()})`,
      };
    }
    return { cost: maxCap, tier: 3, text: `Batas Maksimal Harian (Flat Rp ${maxCap.toLocaleString()})` };
  };

  const currentResult = calculateCost(testInput);

  // SVG Mapping (x: 0 to 8 jam -> cx: 50 to 380, y: 0 to 45 rb -> cy: 230 to 30)
  const mapX = (x: number) => 50 + (x / 8) * 330;
  const mapY = (y: number) => 230 - (y / 45000) * 200;

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono font-bold tracking-wider uppercase">
          <Wrench className="w-3.5 h-3.5" /> 12 · SANDBOX
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Rancang Fungsi
        </h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl my-2">
        {/* SVG Dynamic Graph */}
        <div className="md:col-span-7 flex flex-col justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
          <svg className="w-full h-[250px]" viewBox="0 0 420 260">
            <rect width="420" height="260" fill="var(--theme-svg-bg, #0b1120)" rx="16" />
            {/* Grid Sumbu Y */}
            {[0, 15000, 30000, 45000].map((val) => {
              const y = mapY(val);
              return (
                <g key={val}>
                  <line x1="50" y1={y} x2="390" y2={y} stroke="var(--theme-svg-grid, #1e293b)" strokeDasharray="3 3" />
                  <text x="42" y={y + 4} textAnchor="end" fill="var(--theme-svg-text, #64748b)" fontSize="10" className="font-mono">
                    {val / 1000}k
                  </text>
                </g>
              );
            })}

            {/* Grid Sumbu X */}
            {[0, 2, 4, 6, 8].map((x) => (
              <g key={x}>
                <line x1={mapX(x)} y1="30" x2={mapX(x)} y2="230" stroke="var(--theme-svg-grid, #1e293b)" strokeDasharray="3 3" />
                <text x={mapX(x)} y="248" textAnchor="middle" fill="var(--theme-svg-text, #64748b)" fontSize="10" className="font-mono">
                  {x} jam
                </text>
              </g>
            ))}

            {/* Sumbu X & Y */}
            <line x1="50" y1="230" x2="400" y2="230" stroke="var(--theme-svg-axis, #64748b)" strokeWidth="2" />
            <line x1="50" y1="20" x2="50" y2="230" stroke="var(--theme-svg-axis, #64748b)" strokeWidth="2" />

            {/* Segmen 1: 0 <= x <= t1, y = flatT1 */}
            <line
              x1={mapX(0)}
              y1={mapY(flatT1)}
              x2={mapX(t1)}
              y2={mapY(flatT1)}
              stroke="#818cf8"
              strokeWidth="4"
            />
            <circle cx={mapX(0)} cy={mapY(flatT1)} r="4" fill="#818cf8" stroke="#fff" />
            <circle cx={mapX(t1)} cy={mapY(flatT1)} r="4" fill="#818cf8" stroke="#fff" />

            {/* Segmen 2: t1 < x <= t2, y = flatT1 + rate * (x - t1) */}
            <line
              x1={mapX(t1)}
              y1={mapY(flatT1)}
              x2={mapX(t2)}
              y2={mapY(maxCap)}
              stroke="#10b981"
              strokeWidth="4"
            />
            <circle cx={mapX(t2)} cy={mapY(maxCap)} r="4" fill="#10b981" stroke="#fff" />

            {/* Segmen 3: x > t2, y = maxCap */}
            <line
              x1={mapX(t2)}
              y1={mapY(maxCap)}
              x2={mapX(8)}
              y2={mapY(maxCap)}
              stroke="#f59e0b"
              strokeWidth="4"
            />

            {/* Tracker Titik Uji */}
            <circle
              cx={mapX(testInput)}
              cy={mapY(currentResult.cost)}
              r="7"
              fill="#ec4899"
              stroke="#ffffff"
              strokeWidth="2.5"
              className="animate-pulse"
            />
            <line
              x1={mapX(testInput)}
              y1="230"
              x2={mapX(testInput)}
              y2={mapY(currentResult.cost)}
              stroke="#ec4899"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          </svg>

          {/* KaTeX Live Expression */}
          <div className="mt-2 pt-2 border-t border-slate-800 text-center">
            <MathFormula
              math={`f(x) = \\begin{cases} ${flatT1.toLocaleString('id-ID')}, & 0 \\le x \\le ${t1} \\\\ ${flatT1.toLocaleString('id-ID')} + ${rate.toLocaleString('id-ID')}(x - ${t1}), & ${t1} < x \\le ${t2} \\\\ ${maxCap.toLocaleString('id-ID')}, & x > ${t2} \\end{cases}`}
              block
              className="text-xs md:text-sm text-slate-200"
            />
          </div>
        </div>

        {/* Panel Kontrol Slider Sandbox */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                <span className="text-indigo-400">Batas Flat <MathFormula math="t_1" />:</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold">{t1} Jam</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={t1}
                onChange={(e) => setT1(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                <span className="text-emerald-400">Tarif Tambahan:</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold">Rp {rate.toLocaleString('id-ID')}/jam</span>
              </div>
              <input
                type="range"
                min="2000"
                max="8000"
                step="1000"
                value={rate}
                onChange={(e) => setRate(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                <span className="text-pink-400">Uji <MathFormula math="x" />:</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold">{testInput} Jam</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8"
                step="0.5"
                value={testInput}
                onChange={(e) => setTestInput(parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Hasil Kalkulator Uji */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">Total Tagihan</span>
              <span className="text-xs px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono font-bold">
                Tier {currentResult.tier}
              </span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
              Rp {currentResult.cost.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {currentResult.text}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-brand-500 px-4 py-2.5 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold">KUNCI</span>
          <p className="text-slate-200 text-sm md:text-base font-semibold">
            Rancang batasan interval dan formula tarif untuk memodelkan fungsi sepenggal
          </p>
        </div>
      </div>
    </div>
  );
};
