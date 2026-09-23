import React, { useState } from 'react';
import { Scan, CheckCircle2, XCircle, Smartphone } from 'lucide-react';
import { MathFormula } from '../MathFormula';

interface Slide4VerticalLineTestProps {
  onOpenQrModal?: () => void;
}

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
    name: 'Garis Linear',
    formulaLatex: 'y = 0.5x + 1',
    isFunction: true,
    verdict: 'Maksimal 1 titik potong',
    renderPath: () => {
      return 'M 25 187.5 L 375 62.5';
    },
    getIntersections: (x) => [0.5 * x + 1],
  },
  {
    id: 'parabola-v',
    name: 'Parabola Vertikal',
    formulaLatex: 'y = 0.4x^2 - 2',
    isFunction: true,
    verdict: 'Maksimal 1 titik potong',
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
    name: 'Lingkaran',
    formulaLatex: 'x^2 + y^2 = 9',
    isFunction: false,
    verdict: 'Memotong 2 titik sekaligus',
    renderPath: () => {
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
    verdict: 'Memotong 2 titik sekaligus',
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

export const Slide4VerticalLineTest: React.FC<Slide4VerticalLineTestProps> = ({ onOpenQrModal }) => {
  const [selectedGraph, setSelectedGraph] = useState<GraphOption>(GRAPH_OPTIONS[2]); // Default circle for dramatic demo
  const [sliderX, setSliderX] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const intersections = selectedGraph.getIntersections(sliderX);
  const cxLine = 200 + sliderX * 35;

  // Evaluasi status scanner lokal pada nilai x saat ini
  const count = intersections.length;
  const isMultiPoint = count > 1;
  const isZeroPoint = count === 0;

  // Warna scanner garis vertikal
  const scannerColor = isMultiPoint
    ? '#f43f5e' // Merah: Memotong 2 titik (Mendua)
    : isZeroPoint
    ? '#f59e0b' // Amber/Oranye: 0 titik (Jomblo / Di Luar Kurva)
    : selectedGraph.isFunction
    ? '#10b981' // Hijau: 1 titik pada fungsi sah
    : '#f59e0b'; // Amber: Titik singgung pada kurva bukan fungsi

  const handleScan = () => {
    setIsScanning(true);
    let curr = -4;
    const interval = setInterval(() => {
      curr += 0.2;
      if (curr > 4) {
        clearInterval(interval);
        setIsScanning(false);
        // Hentikan di titik yang paling representatif untuk didaktik kelas
        if (!selectedGraph.isFunction) {
          // Berhenti di titik yang memotong 2 titik untuk memperlihatkan pelanggaran
          setSliderX(selectedGraph.id === 'circle' ? 0 : 0.5);
        } else {
          setSliderX(1.0);
        }
      } else {
        setSliderX(Number(curr.toFixed(1)));
      }
    }, 45);
  };

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono font-bold tracking-wider uppercase">
          <Scan className="w-3.5 h-3.5" /> 05 · UJI GRAFIK
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Uji Garis Vertikal (Vertical Line Test)
        </h1>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2 my-1.5">
        {GRAPH_OPTIONS.map((g) => {
          const isSelected = selectedGraph.id === g.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                setSelectedGraph(g);
                setSliderX(g.isFunction ? 1 : 0);
              }}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all border flex items-center gap-2 ${
                isSelected
                  ? 'bg-brand-600 border-brand-400 text-white shadow-lg shadow-brand-600/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span>{g.name}</span>
              <span className="font-mono text-xs opacity-80">
                (<MathFormula math={g.formulaLatex} />)
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                  g.isFunction
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                    : 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                }`}
              >
                {g.isFunction ? 'Fungsi' : 'Bukan'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Graph Canvas & Evaluasi */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-900/90 border border-slate-800 p-3.5 md:p-4 rounded-2xl shadow-xl flex-1 min-h-0 my-1">
        {/* Canvas SVG */}
        <div className="md:col-span-7 flex flex-col justify-center items-center bg-slate-950 p-2 rounded-2xl border border-slate-800/80 relative">
          <svg className="w-full max-w-[390px] h-[230px]" viewBox="0 0 400 300">
            {/* Grid background */}
            <defs>
              <pattern id="grid" width="35" height="25" patternUnits="userSpaceOnUse">
                <path d="M 35 0 L 0 0 0 25" fill="none" stroke="var(--theme-svg-grid, #1e293b)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="400" height="300" fill="var(--theme-svg-bg, #0b1120)" />
            <rect width="400" height="300" fill="url(#grid)" />

            {/* Sumbu X & Y */}
            <line x1="0" y1="150" x2="400" y2="150" stroke="var(--theme-svg-axis, #475569)" strokeWidth="2" />
            <line x1="200" y1="0" x2="200" y2="300" stroke="var(--theme-svg-axis, #475569)" strokeWidth="2" />
            <text x="390" y="142" fill="var(--theme-svg-text, #94a3b8)" fontSize="12" fontWeight="bold">X</text>
            <text x="210" y="15" fill="var(--theme-svg-text, #94a3b8)" fontSize="12" fontWeight="bold">Y</text>

            {/* Kurva Grafik */}
            <path
              d={selectedGraph.renderPath()}
              fill="none"
              stroke="#818cf8"
              strokeWidth="3.5"
              className="transition-all duration-300"
            />

            {/* Garis Vertikal Uji (Merah / Amber / Hijau) */}
            <line
              x1={cxLine}
              y1="0"
              x2={cxLine}
              y2="300"
              stroke={scannerColor}
              strokeWidth={isMultiPoint ? '3.5' : '2.5'}
              strokeDasharray={isZeroPoint ? '5 4' : isMultiPoint ? undefined : '4 3'}
              className="transition-colors duration-150"
            />

            {/* Label Peringatan 0 Titik Potong di atas Garis jika tidak memotong */}
            {isZeroPoint && (
              <g className="animate-fade-in">
                <rect
                  x={cxLine - 38}
                  y="8"
                  width="76"
                  height="18"
                  rx="4"
                  fill="var(--theme-svg-bg, #0b1120)"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  opacity="0.95"
                />
                <text
                  x={cxLine}
                  y="20"
                  textAnchor="middle"
                  fill="#f59e0b"
                  fontSize="10"
                  fontWeight="bold"
                >
                  0 Titik Potong
                </text>
              </g>
            )}

            {/* Titik Potong Nyata */}
            {intersections.map((yVal, i) => {
              const cyPoint = 150 - yVal * 25;
              return (
                <g key={i} className="animate-pulse">
                  <circle
                    cx={cxLine}
                    cy={cyPoint}
                    r={isMultiPoint ? '8' : '6.5'}
                    fill={scannerColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* High contrast label badge */}
                  <rect
                    x={cxLine + 10}
                    y={cyPoint - 10}
                    width="56"
                    height="19"
                    rx="4"
                    fill="var(--theme-svg-bg, #0b1120)"
                    stroke={scannerColor}
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x={cxLine + 14}
                    y={cyPoint + 4}
                    fill="var(--theme-svg-point-text, #ffffff)"
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

          {/* Indikator Slider Aktif */}
          <div className="w-full flex justify-between items-center px-3 pt-1 text-[11px] text-slate-400 font-mono">
            <span>x = -4.0</span>
            <span className="text-brand-300 font-bold">Posisi Scanner: x = {sliderX.toFixed(1)}</span>
            <span>x = +4.0</span>
          </div>
        </div>

        {/* Panel Kontrol & Evaluasi Matematis */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-3">
          {/* Slider & Tombol Scan */}
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-mono text-xs font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: scannerColor }} />
                Garis Uji: <MathFormula math={`x = ${sliderX.toFixed(1)}`} />
              </span>
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
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
              className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* KARTU 1: Status Kurva Global (Apakah kurva ini Fungsi?) */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              selectedGraph.isFunction
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {selectedGraph.isFunction ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <div>
                  <span className="text-sm sm:text-base font-extrabold block">
                    {selectedGraph.isFunction ? 'FUNGSI SAH' : 'BUKAN FUNGSI'}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">
                    Grafik: {selectedGraph.name}
                  </span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  selectedGraph.isFunction
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {selectedGraph.isFunction ? 'Lolos VLT' : 'Gagal VLT'}
              </span>
            </div>

            <p className="text-xs text-slate-300 pt-1 border-t border-slate-800/80 leading-relaxed">
              {selectedGraph.isFunction
                ? 'Setiap garis vertikal yang memotong selalu memiliki tepat 1 titik potong di seluruh rentang grafik.'
                : 'Terdapat daerah di mana garis vertikal memotong 2 titik sekaligus (mendua), dan daerah di luar kurva tanpa pasangan.'}
            </p>
          </div>

          {/* KARTU 2: Status Scanner Real-Time pada x Saat Ini */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Deteksi Scanner di <MathFormula math={`x = ${sliderX.toFixed(1)}`} />:
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  isMultiPoint
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                    : isZeroPoint
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : selectedGraph.isFunction
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {isMultiPoint
                  ? '⚠️ Memotong 2 Titik (Mendua!)'
                  : isZeroPoint
                  ? '⚠️ 0 Titik (Tidak Ada Pasangan)'
                  : selectedGraph.isFunction
                  ? '✓ Tepat 1 Titik Potong'
                  : '⚠️ 1 Titik (Titik Batas)'}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isMultiPoint ? (
                <span>
                  Di <strong className="text-white font-mono">x = {sliderX.toFixed(1)}</strong>, garis memotong kurva di dua nilai output sekaligus (<span className="text-rose-400 font-mono font-bold">y = {intersections[0].toFixed(1)}</span> dan <span className="text-rose-400 font-mono font-bold">y = {intersections[1].toFixed(1)}</span>). Inilah bukti fatal mengapa relasi ini <strong>BUKAN FUNGSI</strong>!
                </span>
              ) : isZeroPoint ? (
                <span>
                  Garis <strong className="text-white font-mono">x = {sliderX.toFixed(1)}</strong> berada di luar batas kurva (0 titik potong). Input ini <strong>tidak memiliki pasangan</strong> output (jomblo). Kurva ini tetap <strong>BUKAN FUNGSI</strong>!
                </span>
              ) : selectedGraph.isFunction ? (
                <span>
                  Di <strong className="text-white font-mono">x = {sliderX.toFixed(1)}</strong>, garis memotong tepat satu kali di <span className="text-emerald-400 font-mono font-bold">y = {intersections[0].toFixed(1)}</span>. Setiap input terpetakan secara tunggal.
                </span>
              ) : (
                <span>
                  Garis hanya menyinggung batas tepi lingkaran di 1 titik (<span className="text-amber-400 font-mono font-bold">y = {intersections[0].toFixed(1)}</span>). Namun kurva secara keseluruhan tetap <strong>BUKAN FUNGSI</strong> karena di area tengah memotong 2 titik!
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-brand-500 px-4 py-2 rounded-r-xl flex flex-wrap items-center justify-between gap-3 mt-1 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold">KUNCI VLT</span>
          <p className="text-slate-200 text-xs md:text-sm font-semibold">
            Maksimal 1 titik potong di setiap daerah terdefinisi = <span className="text-emerald-400 font-bold">Fungsi</span> | Memotong lebih dari 1 titik = <span className="text-rose-400 font-bold">Bukan Fungsi</span>
          </p>
        </div>

        {onOpenQrModal && (
          <button
            onClick={onOpenQrModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/30 transition-all cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-300" />
            <span>Mulai LKPD Digital ➔</span>
          </button>
        )}
      </div>
    </div>
  );
};
