import React, { useState } from 'react';
import { TrendingUp, DollarSign, MapPin } from 'lucide-react';
import { MathFormula } from '../MathFormula';

export const Slide6LinearGraph: React.FC = () => {
  // a = tarif per km (ribuan), b = buka pintu (ribuan)
  const [a, setA] = useState<number>(3); // 3 rb/km
  const [b, setB] = useState<number>(8); // 8 rb dasar
  const [testKm, setTestKm] = useState<number>(4);

  // Perhitungan tarif
  const totalCost = a * testKm + b;

  // SVG Coordinates mapping:
  // x: 0 to 10 km -> canvas x: 50 to 380 (width ~ 400)
  // y: 0 to 45 rb -> canvas y: 250 to 30 (height ~ 280)
  const mapX = (km: number) => 50 + (km / 10) * 330;
  const mapY = (costRb: number) => 250 - (costRb / 45) * 220;

  const y0 = mapY(b);
  const y10 = mapY(a * 10 + b);
  const pointX = mapX(testKm);
  const pointY = mapY(totalCost);

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-semibold tracking-wide uppercase">
          <TrendingUp className="w-4 h-4" /> Konsep 5 · Representasi Visual
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Kata-kata <MathFormula math="\to" /> Rumus <MathFormula math="\to" /> Grafik
        </h1>
        <p className="text-xl text-slate-400 font-medium">
          Setiap fungsi linear <MathFormula math="f(x) = ax + b" /> punya 2 komponen: <span className="text-brand-300 font-semibold">Tarif Variabel (<MathFormula math="a" />)</span> dan <span className="text-emerald-300 font-semibold">Biaya Tetap (<MathFormula math="b" />)</span>.
        </p>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl my-2">
        {/* SVG Graphic */}
        <div className="md:col-span-7 flex justify-center items-center bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
          <svg className="w-full max-w-[440px] h-[280px]" viewBox="0 0 420 280">
            {/* Grid horizontal */}
            {[0, 10, 20, 30, 40].map((val) => {
              const y = mapY(val);
              return (
                <g key={val}>
                  <line x1="50" y1={y} x2="390" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="42" y={y + 4} textAnchor="end" fill="#64748b" fontSize="10" className="font-mono">
                    {val}k
                  </text>
                </g>
              );
            })}

            {/* Grid vertikal */}
            {[0, 2, 4, 6, 8, 10].map((val) => {
              const x = mapX(val);
              return (
                <g key={val}>
                  <line x1={x} y1="30" x2={x} y2="250" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                  <text x={x} y="265" textAnchor="middle" fill="#64748b" fontSize="10" className="font-mono">
                    {val} km
                  </text>
                </g>
              );
            })}

            {/* Sumbu X & Y */}
            <line x1="50" y1="250" x2="400" y2="250" stroke="#94a3b8" strokeWidth="2" />
            <line x1="50" y1="20" x2="50" y2="250" stroke="#94a3b8" strokeWidth="2" />

            {/* Garis Fungsi Linear */}
            <line
              x1={mapX(0)}
              y1={y0}
              x2={mapX(10)}
              y2={y10}
              stroke="#818cf8"
              strokeWidth="4"
              className="transition-all duration-300"
            />

            {/* Titik Intercept b (0, b) */}
            <circle cx={mapX(0)} cy={y0} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            <text x={mapX(0) + 10} y={y0 - 8} fill="#a7f3d0" fontSize="11" fontWeight="bold" className="font-mono">
              Buka Pintu (b={b}k)
            </text>

            {/* Titik Uji x (testKm, totalCost) */}
            <line x1={pointX} y1="250" x2={pointX} y2={pointY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="50" y1={pointY} x2={pointX} y2={pointY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx={pointX} cy={pointY} r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            <text x={pointX + 10} y={pointY - 6} fill="#fde68a" fontSize="12" fontWeight="bold" className="font-mono">
              ({testKm} km, Rp {totalCost * 1000})
            </text>
          </svg>
        </div>

        {/* Panel Kontrol Slider Guru */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Persamaan Matematika</span>
            <div className="my-1">
              <MathFormula
                math={`f(x) = ${a.toLocaleString('id-ID')}.000x + ${b.toLocaleString('id-ID')}.000`}
                block
                className="text-brand-300 font-extrabold text-xl"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                <span className="flex items-center gap-1 text-indigo-400">
                  <TrendingUp className="w-3.5 h-3.5" /> Kemiringan / Tarif per km (a):
                </span>
                <span className="text-white font-mono">Rp {a * 1000}/km</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="0.5"
                value={a}
                onChange={(e) => setA(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                <span className="flex items-center gap-1 text-emerald-400">
                  <DollarSign className="w-3.5 h-3.5" /> Biaya Tetap / Buka Pintu (b):
                </span>
                <span className="text-white font-mono">Rp {b * 1000}</span>
              </div>
              <input
                type="range"
                min="2"
                max="15"
                step="1"
                value={b}
                onChange={(e) => setB(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                <span className="flex items-center gap-1 text-amber-400">
                  <MapPin className="w-3.5 h-3.5" /> Jarak Tempuh Pelanggan (x):
                </span>
                <span className="text-white font-mono">{testKm} km</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={testKm}
                onChange={(e) => setTestKm(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl text-xs text-amber-200">
            📊 Total Tagihan: <span className="font-bold text-white">Rp {totalCost * 1000}</span>
            <div className="text-slate-400 mt-0.5">
              Rincian: Buka pintu Rp {b * 1000} + ({testKm} km × Rp {a * 1000})
            </div>
          </div>
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-brand-500 p-4 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 font-bold">PEMAHAMAN GRAFIK</span>
          <p className="text-slate-200 text-lg font-semibold">
            Semakin mahal tarif per km (<MathFormula math="a" />), semakin <span className="text-indigo-400 font-bold">curam/tegak</span> garisnya. Biaya buka pintu (<MathFormula math="b" />) menentukan <span className="text-emerald-400 font-bold">titik awal</span> di sumbu tegak.
          </p>
        </div>
      </div>
    </div>
  );
};
