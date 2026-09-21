import React, { useState } from 'react';
import { Scan, CheckCircle2, XCircle } from 'lucide-react';
import { MathFormula } from '../MathFormula';

interface GraphOption {
  id: string;
  name: string;
  formulaLatex: string;
  isFunction: boolean;
  verdict: string;
  renderPath: () => string;
  getIntersections: (xVal: number) => number[];
}

const GRAPH_OPTIONS: GraphOption[] = [
  {
    id: 'linear',
    name: 'Grafik Linear',
    formulaLatex: 'y = 0.5x + 1',
    isFunction: true,
    verdict: 'FUNGSI (Setiap x hanya punya 1 nilai y)',
    renderPath: () => {
      // mapping: canvas range x: -5 to 5, y: -5 to 5 -> canvas width 400, height 300
      // x0 = -5 -> y = -1.5, x1 = 5 -> y = 3.5
      // toCanvas: cx = 200 + x * 35, cy = 150 - y * 25
      return 'M 25 187.5 L 375 62.5';
    },
    getIntersections: (x) => [0.5 * x + 1],
  },
  {
    id: 'parabola-v',
    name: 'Parabola Vertikal',
    formulaLatex: 'y = 0.4x^2 - 2',
    isFunction: true,
    verdict: 'FUNGSI (Garis tegak memotong maksimal di 1 titik)',
    renderPath: () => {
      let d = '';
      for (let x = -4; x <= 4; x += 0.2) {
        const y = 0.4 * x * x - 2;
        const cx = 200 + x * 35;
        const cy = 150 - y * 25;
        if (d === '') d += `M ${cx} ${cy}`;
        else d += ` L ${cx} ${cy}`;
      }
      return d;
    },
    getIntersections: (x) => [0.4 * x * x - 2],
  },
  {
    id: 'circle',
    name: 'Kurva Lingkaran',
    formulaLatex: 'x^2 + y^2 = 9',
    isFunction: false,
    verdict: 'BUKAN FUNGSI (Garis tegak memotong di 2 titik sekaligus!)',
    renderPath: () => {
      // r = 3 units -> rx = 3 * 35 = 105, ry = 3 * 25 = 75
      return 'M 200 75 A 105 75 0 1 0 200 225 A 105 75 0 1 0 200 75';
    },
    getIntersections: (x) => {
      if (Math.abs(x) > 3) return [];
      const yVal = Math.sqrt(Math.max(0, 9 - x * x));
      if (yVal < 0.05) return [0];
      return [yVal, -yVal];
    },
  },
  {
    id: 'parabola-h',
    name: 'Parabola Horizontal',
    formulaLatex: 'x = 0.5y^2 - 2',
    isFunction: false,
    verdict: 'BUKAN FUNGSI (Untuk 1 nilai x, terdapat 2 nilai y)',
    renderPath: () => {
      let d = '';
      for (let y = -3.5; y <= 3.5; y += 0.2) {
        const x = 0.5 * y * y - 2;
        const cx = 200 + x * 35;
        const cy = 150 - y * 25;
        if (d === '') d += `M ${cx} ${cy}`;
        else d += ` L ${cx} ${cy}`;
      }
      return d;
    },
    getIntersections: (x) => {
      if (x < -2) return [];
      const yVal = Math.sqrt(2 * (x + 2));
      if (yVal < 0.05) return [0];
      return [yVal, -yVal];
    },
  },
];

export const Slide4VerticalLineTest: React.FC = () => {
  const [selectedGraph, setSelectedGraph] = useState<GraphOption>(GRAPH_OPTIONS[2]); // Default circle for dramatic demo
  const [sliderX, setSliderX] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const intersections = selectedGraph.getIntersections(sliderX);
  const cxLine = 200 + sliderX * 35;

  const handleScan = () => {
    setIsScanning(true);
    let curr = -4;
    const interval = setInterval(() => {
      curr += 0.2;
      if (curr > 4) {
        clearInterval(interval);
        setIsScanning(false);
        setSliderX(1.5);
      } else {
        setSliderX(Number(curr.toFixed(1)));
      }
    }, 50);
  };

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-semibold tracking-wide uppercase">
          <Scan className="w-4 h-4" /> Konsep 3 · Uji Visual Grafik
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Uji Garis Vertikal (Vertical Line Test)
        </h1>
        <p className="text-xl text-slate-400 font-medium">
          Tarik garis tegak vertikal dari atas ke bawah. Jika garis memotong kurva <span className="text-rose-400 font-semibold">lebih dari satu titik</span>, maka kurva itu <span className="text-rose-400 font-semibold">BUKAN fungsi</span>!
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2 my-2">
        {GRAPH_OPTIONS.map((g) => (
          <button
            key={g.id}
            onClick={() => {
              setSelectedGraph(g);
              setSliderX(0);
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all border flex items-center gap-2 ${
              selectedGraph.id === g.id
                ? 'bg-brand-600 border-brand-400 text-white shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <span>{g.name}</span>
            <span className="font-mono text-xs opacity-75">
              (<MathFormula math={g.formulaLatex} />)
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Graph Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-slate-900/90 border border-slate-800 p-4 md:p-5 rounded-2xl shadow-xl flex-1 min-h-0 my-1">
        {/* Canvas */}
        <div className="md:col-span-7 flex justify-center items-center bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80">
          <svg className="w-full max-w-[380px] h-[230px]" viewBox="0 0 400 300">
            {/* Grid background */}
            <defs>
              <pattern id="grid" width="35" height="25" patternUnits="userSpaceOnUse">
                <path d="M 35 0 L 0 0 0 25" fill="none" stroke="#1e293b" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="400" height="300" fill="url(#grid)" />

            {/* Sumbu X & Y */}
            <line x1="0" y1="150" x2="400" y2="150" stroke="#475569" strokeWidth="2" />
            <line x1="200" y1="0" x2="200" y2="300" stroke="#475569" strokeWidth="2" />
            <text x="390" y="142" fill="#94a3b8" fontSize="12" fontWeight="bold">X</text>
            <text x="210" y="15" fill="#94a3b8" fontSize="12" fontWeight="bold">Y</text>

            {/* Kurva Grafik */}
            <path
              d={selectedGraph.renderPath()}
              fill="none"
              stroke="#818cf8"
              strokeWidth="3.5"
              className="transition-all duration-300"
            />

            {/* Garis Vertikal Uji (Merah / Hijau) */}
            <line
              x1={cxLine}
              y1="0"
              x2={cxLine}
              y2="300"
              stroke={intersections.length > 1 ? '#f43f5e' : '#10b981'}
              strokeWidth="3"
              strokeDasharray="4 3"
            />

            {/* Titik Potong */}
            {intersections.map((yVal, i) => {
              const cyPoint = 150 - yVal * 25;
              return (
                <g key={i} className="animate-pulse">
                  <circle
                    cx={cxLine}
                    cy={cyPoint}
                    r="7"
                    fill={intersections.length > 1 ? '#f43f5e' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={cxLine + 12}
                    y={cyPoint + 4}
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    className="font-mono"
                  >
                    y = {yVal.toFixed(1)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Panel Kontrol Guru */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Kontrol Pemindai Garis:</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-slate-300 font-mono text-sm">Posisi Garis: <MathFormula math={`x = ${sliderX.toFixed(1)}`} /></span>
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
              >
                <Scan className="w-3.5 h-3.5 text-brand-400" />
                {isScanning ? 'Memindai...' : 'Pindai Otomatis'}
              </button>
            </div>

            <input
              type="range"
              min="-4"
              max="4"
              step="0.1"
              value={sliderX}
              onChange={(e) => setSliderX(parseFloat(e.target.value))}
              className="w-full mt-3 accent-brand-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Status Hasil Potong */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              intersections.length > 1
                ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-1">
              {intersections.length > 1 ? (
                <XCircle className="w-5 h-5 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
              <span className="text-base font-extrabold">
                {intersections.length} Titik Potong Terdeteksi
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              {selectedGraph.verdict}
            </p>
          </div>

          <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            💬 Ajukan ke siswa: "Kenapa lingkaran tidak bisa disebut fungsi <MathFormula math="y = f(x)" />? Berapa nilai <MathFormula math="y" /> saat <MathFormula math="x = 0" />?"
          </div>
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-brand-500 p-2.5 px-4 rounded-r-xl flex items-center justify-between mt-1 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold">RUMUS CEPAT</span>
          <p className="text-slate-200 text-sm md:text-base font-semibold">
            1 Garis Vertikal <MathFormula math="\to" /> Maksimal 1 Titik Potong = <span className="text-emerald-400">FUNGSI</span>. Lebih dari 1 Titik = <span className="text-rose-400">BUKAN FUNGSI</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
