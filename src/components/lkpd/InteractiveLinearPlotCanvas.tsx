import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Camera, Check, RotateCcw, Download, Sparkles, TrendingUp } from 'lucide-react';
import { LinearPlotPoint } from '../../types/lkpd';

export interface InteractiveLinearPlotCanvasRef {
  exportToBase64: () => Promise<string>;
}

interface Props {
  points: LinearPlotPoint[];
  onChangePoints: (points: LinearPlotPoint[]) => void;
  hasLine: boolean;
  onToggleLine: (hasLine: boolean) => void;
  allowDownload?: boolean;
  savedImage?: string;
  onSaveSnapshot?: (base64: string) => void;
  readOnly?: boolean;
}

// 5 Titik target dari skenario rental kamera f(x) = 10x + 20
export const PRESET_POINTS: { x: number; y: number; label: string }[] = [
  { x: 0, y: 20, label: 'Buka Segel (0 jam, 20k)' },
  { x: 1, y: 30, label: '1 Jam (30k)' },
  { x: 2, y: 40, label: '2 Jam (40k)' },
  { x: 3, y: 50, label: '3 Jam (50k)' },
  { x: 5, y: 70, label: '5 Jam (70k)' },
];

export const InteractiveLinearPlotCanvas = forwardRef<InteractiveLinearPlotCanvasRef, Props>(({
  points,
  onChangePoints,
  hasLine,
  onToggleLine,
  allowDownload = true,
  savedImage,
  onSaveSnapshot,
  readOnly = false
}, ref) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Ukuran kanvas
  const width = 560;
  const height = 320;
  const leftX = 70;
  const rightX = 510;
  const topY = 40;
  const bottomY = 270;

  // Koordinat mapping
  const mapX = (xVal: number) => leftX + (xVal / 6) * (rightX - leftX);
  const mapY = (costRb: number) => bottomY - (costRb / 80) * (bottomY - topY);

  // Cek apakah suatu titik sudah diplot
  const isPointPlotted = (x: number, y: number) => {
    return points.some(p => p.x === x && p.y === y);
  };

  // Toggle titik
  const handleTogglePoint = (x: number, y: number, label?: string) => {
    if (readOnly) return;
    if (isPointPlotted(x, y)) {
      onChangePoints(points.filter(p => !(p.x === x && p.y === y)));
    } else {
      onChangePoints([...points, { x, y, label: label || `(${x}, ${y}k)` }]);
    }
  };

  // Reset semua titik
  const handleReset = () => {
    if (readOnly) return;
    onChangePoints([]);
    onToggleLine(false);
  };

  // Plot semua titik rekomendasi
  const handlePlotAllPresets = () => {
    if (readOnly) return;
    onChangePoints(PRESET_POINTS.map(p => ({ x: p.x, y: p.y, label: p.label })));
  };

  // Export SVG ke Base64 Image (WebP dengan fallback PNG)
  const exportToBase64 = async (): Promise<string> => {
    return new Promise((resolve) => {
      try {
        if (!svgRef.current) {
          resolve('');
          return;
        }

        const svgElement = svgRef.current;
        const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
        svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgClone.setAttribute('width', String(width));
        svgClone.setAttribute('height', String(height));

        const svgString = new XMLSerializer().serializeToString(svgClone);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width * 1.5;
          canvas.height = height * 1.5;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#090d16';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            let dataUrl = canvas.toDataURL('image/webp', 0.85);
            if (!dataUrl.startsWith('data:image/webp')) {
              dataUrl = canvas.toDataURL('image/png');
            }
            URL.revokeObjectURL(blobURL);
            resolve(dataUrl);
          } else {
            resolve('');
          }
        };
        image.onerror = (err) => {
          console.error('Image render error:', err);
          URL.revokeObjectURL(blobURL);
          resolve('');
        };
        image.src = blobURL;
      } catch (err) {
        console.error('Export canvas failed:', err);
        resolve('');
      }
    });
  };

  useImperativeHandle(ref, () => ({
    exportToBase64,
  }));

  const handleManualSave = async () => {
    setIsCapturing(true);
    try {
      const b64 = await exportToBase64();
      if (b64 && onSaveSnapshot) {
        onSaveSnapshot(b64);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2500);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownload = async () => {
    const b64 = await exportToBase64();
    if (!b64) return;
    const a = document.createElement('a');
    a.href = b64;
    a.download = `grafik-linear-kamera-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Nilai grid Sumbu Y & Sumbu X
  const yTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80];
  const xTicks = [0, 1, 2, 3, 4, 5, 6];

  // Garis lurus: f(x) = 10x + 20 -> (0, 20) sampai (6, 80)
  const lineStart = { x: mapX(0), y: mapY(20) };
  const lineEnd = { x: mapX(6), y: mapY(80) };

  return (
    <div className="flex flex-col items-center select-none w-full">
      {/* Toolbar Status & Aksi Cepat */}
      {!readOnly && (
        <div className="w-full flex flex-wrap items-center justify-between gap-2 px-1 mb-2">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all ${
              points.length >= 3 && hasLine
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : points.length >= 2
                ? 'bg-brand-500/15 border-brand-500/40 text-brand-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{points.length} Titik Terplot</span>
              {hasLine && <span className="text-emerald-400 font-mono">• Garis Aktif</span>}
            </span>

            {/* Quick Plot All Chips */}
            {points.length < PRESET_POINTS.length && (
              <button
                type="button"
                onClick={handlePlotAllPresets}
                className="px-2 py-0.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <Sparkles className="w-3 h-3" />
                <span>+ Plot Semua Titik Tabel</span>
              </button>
            )}
          </div>

          {/* Tombol Simpan & Unduh */}
          <div className="flex items-center gap-1.5">
            {allowDownload && (
              <button
                type="button"
                onClick={handleDownload}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
                title="Unduh PNG"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Unduh</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleManualSave}
              disabled={isCapturing || points.length === 0}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                justSaved || savedImage
                  ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-200'
                  : 'bg-brand-600 hover:bg-brand-500 border-brand-400 text-white shadow-md shadow-brand-600/20'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isCapturing ? 'Menyimpan...' : justSaved ? '✓ Tersimpan!' : savedImage ? 'Perbarui Simpanan' : 'Simpan Grafik'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SVG Canvas Area */}
      <div className="relative w-full max-w-[560px] aspect-[560/320] bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          style={{ touchAction: 'none' }}
        >
          <defs>
            {/* Gradien Garis Linear */}
            <linearGradient id="linearLineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="glow-linear" x="0" y="0" width={width} height={height} filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Latar Belakang Kartu */}
          <rect width={width} height={height} fill="var(--theme-svg-bg, #0b1120)" rx="16" />

          {/* Grid Horizontal & Label Sumbu Y */}
          {yTicks.map((val) => {
            const y = mapY(val);
            return (
              <g key={`y-${val}`}>
                <line
                  x1={leftX}
                  y1={y}
                  x2={rightX}
                  y2={y}
                  stroke="var(--theme-svg-grid, #1e293b)"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? undefined : '3 3'}
                />
                <text
                  x={leftX - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--theme-svg-text, #94a3b8)"
                  fontSize="10"
                  fontWeight="bold"
                  className="font-mono"
                >
                  {val === 0 ? '0' : `${val}k`}
                </text>
              </g>
            );
          })}

          {/* Grid Vertikal & Label Sumbu X */}
          {xTicks.map((val) => {
            const x = mapX(val);
            return (
              <g key={`x-${val}`}>
                <line
                  x1={x}
                  y1={topY}
                  x2={x}
                  y2={bottomY}
                  stroke="var(--theme-svg-grid, #1e293b)"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? undefined : '3 3'}
                />
                <text
                  x={x}
                  y={bottomY + 18}
                  textAnchor="middle"
                  fill="var(--theme-svg-text, #94a3b8)"
                  fontSize="10"
                  fontWeight="bold"
                  className="font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Sumbu Utama X & Y */}
          <line x1={leftX} y1={bottomY} x2={rightX + 15} y2={bottomY} stroke="var(--theme-svg-axis, #cbd5e1)" strokeWidth="2" />
          <polygon points={`${rightX + 22},${bottomY} ${rightX + 13},${bottomY - 4} ${rightX + 13},${bottomY + 4}`} fill="var(--theme-svg-axis, #cbd5e1)" />

          <line x1={leftX} y1={bottomY} x2={leftX} y2={topY - 15} stroke="var(--theme-svg-axis, #cbd5e1)" strokeWidth="2" />
          <polygon points={`${leftX},${topY - 22} ${leftX - 4},${topY - 13} ${leftX + 4},${topY - 13}`} fill="var(--theme-svg-axis, #cbd5e1)" />

          {/* Label Nama Sumbu */}
          <text x={rightX + 18} y={bottomY + 16} textAnchor="end" fill="var(--theme-svg-text, #94a3b8)" fontSize="10" fontWeight="bold">
            Durasi (x jam)
          </text>
          <text x={leftX + 8} y={topY - 14} textAnchor="start" fill="var(--theme-svg-text, #94a3b8)" fontSize="10" fontWeight="bold">
            Biaya (y ribu Rp)
          </text>

          {/* Garis Linear Lurus jika hasLine aktif */}
          {hasLine && (
            <g>
              <line
                x1={lineStart.x}
                y1={lineStart.y}
                x2={lineEnd.x}
                y2={lineEnd.y}
                stroke="url(#linearLineGrad)"
                strokeWidth="4"
                filter="url(#glow-linear)"
                className="transition-all duration-300"
              />

              {/* Badge Persamaan Garis di Samping Ujung */}
              <g transform={`translate(${lineEnd.x - 170}, ${lineEnd.y - 12})`}>
                <rect x="0" y="0" width="165" height="22" rx="6" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" />
                <text x="82" y="15" textAnchor="middle" fill="#a5b4fc" fontSize="10" fontWeight="bold" className="font-mono">
                  f(x) = 10.000x + 20.000
                </text>
              </g>
            </g>
          )}

          {/* Proyeksi Garis Putus-putus ke Sumbu untuk Titik yang Terplot */}
          {points.map((p, idx) => {
            const px = mapX(p.x);
            const py = mapY(p.y);
            return (
              <g key={`proj-${idx}`}>
                <line x1={px} y1={bottomY} x2={px} y2={py} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <line x1={leftX} y1={py} x2={px} y2={py} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              </g>
            );
          })}

          {/* Area Interaktif Klik Grid (Titik Snapping Target) */}
          {!readOnly && PRESET_POINTS.map((target) => {
            const tx = mapX(target.x);
            const ty = mapY(target.y);
            const plotted = isPointPlotted(target.x, target.y);
            return (
              <g
                key={`target-${target.x}-${target.y}`}
                onClick={() => handleTogglePoint(target.x, target.y, target.label)}
                className="cursor-pointer group"
              >
                {/* Hit area lebih besar untuk sentuhan tablet/HP */}
                <circle cx={tx} cy={ty} r="18" fill="transparent" />
                {!plotted && (
                  <circle
                    cx={tx}
                    cy={ty}
                    r="8"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    className="opacity-40 group-hover:opacity-100 group-hover:stroke-[2.5px] group-hover:fill-indigo-500/25 group-hover:[stroke-dasharray:none] transition-all"
                  />
                )}
              </g>
            );
          })}

          {/* Titik-titik yang Terplot */}
          {points.map((p, idx) => {
            const px = mapX(p.x);
            const py = mapY(p.y);
            const isIntercept = p.x === 0 && p.y === 20;

            return (
              <g
                key={`point-${idx}`}
                onClick={() => !readOnly && handleTogglePoint(p.x, p.y)}
                className={readOnly ? '' : 'cursor-pointer group'}
              >
                {/* Halo Pijar Titik */}
                <circle
                  cx={px}
                  cy={py}
                  r="10"
                  fill={isIntercept ? '#10b981' : '#f59e0b'}
                  opacity="0.3"
                  className="animate-pulse"
                />
                {/* Titik Solid */}
                <circle
                  cx={px}
                  cy={py}
                  r="6"
                  fill={isIntercept ? '#10b981' : '#f59e0b'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Badge Koordinat */}
                <g transform={`translate(${px + (px > rightX - 60 ? -85 : 8)}, ${py + (py < topY + 30 ? 14 : -10)})`}>
                  <rect
                    x="0"
                    y="0"
                    width={isIntercept ? "105" : "75"}
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    stroke={isIntercept ? '#10b981' : '#f59e0b'}
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x={isIntercept ? "52" : "37"}
                    y="13"
                    textAnchor="middle"
                    fill={isIntercept ? '#6ee7b7' : '#fde68a'}
                    fontSize="9.5"
                    fontWeight="bold"
                    className="font-mono"
                  >
                    {isIntercept ? `b: (0, 20k)` : `(${p.x}, ${p.y}k)`}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Kontrol Interaktif Siswa di Bawah Kanvas */}
      {!readOnly && (
        <div className="w-full max-w-[560px] mt-3 space-y-2">
          {/* Quick Click Chips Titik-titik Tabel */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 p-2 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Pilih Titik untuk Di-plot:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_POINTS.map((target) => {
                const plotted = isPointPlotted(target.x, target.y);
                const isIntercept = target.x === 0 && target.y === 20;

                return (
                  <button
                    key={`btn-${target.x}-${target.y}`}
                    type="button"
                    onClick={() => handleTogglePoint(target.x, target.y, target.label)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
                      plotted
                        ? isIntercept
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                          : 'bg-amber-600 border-amber-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {plotted ? <Check className="w-3.5 h-3.5" /> : <span>+</span>}
                    <span>({target.x}, {target.y}k)</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tombol Tarik Garis Linear & Reset */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleLine(!hasLine)}
              disabled={points.length < 2}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                hasLine
                  ? 'bg-gradient-to-r from-emerald-600 to-indigo-600 border-emerald-400 text-white shadow-lg'
                  : points.length >= 2
                  ? 'bg-brand-600 hover:bg-brand-500 border-brand-400 text-white shadow-md animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{hasLine ? '✓ Garis Linear Terpasang (Klik untuk Batal)' : 'Hubungkan Menjadi Garis Linear ➔'}</span>
            </button>

            {points.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
                title="Reset Titik"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

InteractiveLinearPlotCanvas.displayName = 'InteractiveLinearPlotCanvas';
