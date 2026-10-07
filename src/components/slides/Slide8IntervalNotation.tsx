import React, { useState, useEffect, useCallback } from 'react';
import { Bookmark, Eye, EyeOff, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { MathFormula } from '../MathFormula';

type EndpointType = 'included' | 'excluded' | 'infinity' | 'neg_infinity';
type NumberType = 'real' | 'integer';

interface Preset {
  id: string;
  name: string;
  badge: string;
  numberType: NumberType;
  minVal: number;
  maxVal: number;
  leftType: EndpointType;
  rightType: EndpointType;
  rosterText: string;
  inequalityLatex: string;
  setBuilderLatex: string;
  intervalLatex: string;
  explanation: string;
}

const PRESETS: Preset[] = [
  {
    id: 'baterai',
    name: '1. Baterai HP Nyala',
    badge: '(0, 100]',
    numberType: 'real',
    minVal: 0,
    maxVal: 100,
    leftType: 'excluded',
    rightType: 'included',
    rosterText: '✗ Tidak berlaku (bilangan riil kontinu)',
    inequalityLatex: '0 < x \\le 100',
    setBuilderLatex: '\\{x \\in \\mathbb{R} \\mid 0 < x \\le 100\\}',
    intervalLatex: '(0, 100]',
    explanation: '0% HP padam/mati (tidak ikut), 100% baterai penuh (ikut serta).'
  },
  {
    id: 'air',
    name: '2. Suhu Air Cair',
    badge: '(0, 100)',
    numberType: 'real',
    minVal: 0,
    maxVal: 100,
    leftType: 'excluded',
    rightType: 'excluded',
    rosterText: '✗ Tidak berlaku (bilangan riil kontinu)',
    inequalityLatex: '0 < x < 100',
    setBuilderLatex: '\\{x \\in \\mathbb{R} \\mid 0 < x < 100\\}',
    intervalLatex: '(0, 100)',
    explanation: '0°C air mulai membeku, 100°C air mulai mendidih (kedua batas titik perubahan).'
  },
  {
    id: 'nilai',
    name: '3. Nilai Ujian',
    badge: '[0, 100]',
    numberType: 'real',
    minVal: 0,
    maxVal: 100,
    leftType: 'included',
    rightType: 'included',
    rosterText: '✗ Tidak berlaku (ada nilai koma 85,5)',
    inequalityLatex: '0 \\le x \\le 100',
    setBuilderLatex: '\\{x \\in \\mathbb{R} \\mid 0 \\le x \\le 100\\}',
    intervalLatex: '[0, 100]',
    explanation: 'Nilai 0 terendah dan nilai 100 tertinggi, keduanya bisa diperoleh siswa.'
  },
  {
    id: 'ojol',
    name: '4. Jarak Tempuh Ojol',
    badge: '[0, ∞)',
    numberType: 'real',
    minVal: 0,
    maxVal: 100,
    leftType: 'included',
    rightType: 'infinity',
    rosterText: '✗ Tidak berlaku (jarak berskala kontinu)',
    inequalityLatex: 'x \\ge 0',
    setBuilderLatex: '\\{x \\in \\mathbb{R} \\mid x \\ge 0\\}',
    intervalLatex: '[0, \\infty)',
    explanation: 'Mulai dari 0 km (buka pintu) ke atas tanpa batas tertentu.'
  },
  {
    id: 'lift',
    name: '5. Muatan Lift',
    badge: '{0, 1, .., 8}',
    numberType: 'integer',
    minVal: 0,
    maxVal: 8,
    leftType: 'included',
    rightType: 'included',
    rosterText: '{0, 1, 2, 3, 4, 5, 6, 7, 8}',
    inequalityLatex: '0 \\le x \\le 8',
    setBuilderLatex: '\\{x \\in \\mathbb{Z} \\mid 0 \\le x \\le 8\\}',
    intervalLatex: '✗ Tidak berlaku (data diskrit, bukan selang kontinu)',
    explanation: 'Jumlah manusia bernilai bilangan bulat utuh, tidak ada pecahan.'
  }
];

export const Slide8IntervalNotation: React.FC = () => {
  const [activePresetId, setActivePresetId] = useState<string>('baterai');
  const [numberType, setNumberType] = useState<NumberType>('real');
  const [leftType, setLeftType] = useState<EndpointType>('excluded');
  const [rightType, setRightType] = useState<EndpointType>('included');
  const [minVal, setMinVal] = useState<number>(0);
  const [maxVal, setMaxVal] = useState<number>(100);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  // Memuat preset
  const loadPreset = useCallback((preset: Preset) => {
    setActivePresetId(preset.id);
    setNumberType(preset.numberType);
    setLeftType(preset.leftType);
    setRightType(preset.rightType);
    setMinVal(preset.minVal);
    setMaxVal(preset.maxVal);
    setIsRevealed(false);
  }, []);

  // Shortcut keyboard B untuk reveal dan 1-5 untuk preset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'b' || e.key === 'B') {
        setIsRevealed((prev) => !prev);
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (PRESETS[idx]) loadPreset(PRESETS[idx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loadPreset]);

  // Rotasi titik kiri: excluded -> included -> excluded
  const cycleLeft = () => {
    setLeftType((prev) => (prev === 'excluded' ? 'included' : 'excluded'));
    setActivePresetId('custom');
  };

  // Rotasi titik kanan: included -> excluded -> infinity -> included
  const cycleRight = () => {
    if (numberType === 'integer') {
      setRightType((prev) => (prev === 'included' ? 'excluded' : 'included'));
    } else {
      setRightType((prev) => {
        if (prev === 'included') return 'excluded';
        if (prev === 'excluded') return 'infinity';
        return 'included';
      });
    }
    setActivePresetId('custom');
  };

  // Rumus dinamis saat eksplorasi kustom
  const currentPreset = PRESETS.find((p) => p.id === activePresetId);

  // Formulasi dinamis untuk pertidaksamaan
  const getDynamicInequality = (): string => {
    if (rightType === 'infinity') {
      return leftType === 'included' ? `x \\ge ${minVal}` : `x > ${minVal}`;
    }
    const leftOp = leftType === 'included' ? '\\le' : '<';
    const rightOp = rightType === 'included' ? '\\le' : '<';
    return `${minVal} ${leftOp} x ${rightOp} ${maxVal}`;
  };

  // Formulasi notasi pembentuk himpunan
  const getDynamicSetBuilder = (): string => {
    const setSymbol = numberType === 'real' ? '\\mathbb{R}' : '\\mathbb{Z}';
    return `\\{x \\in ${setSymbol} \\mid ${getDynamicInequality()}\\}`;
  };

  // Formulasi notasi selang
  const getDynamicInterval = (): { isAllowed: boolean; latex: string } => {
    if (numberType === 'integer') {
      return { isAllowed: false, latex: '\\text{✗ Tidak berlaku (diskrit)}' };
    }
    const leftBracket = leftType === 'included' ? '[' : '(';
    const rightBracket = rightType === 'included' ? ']' : ')';
    const rightVal = rightType === 'infinity' ? '\\infty' : `${maxVal}`;
    return { isAllowed: true, latex: `${leftBracket}${minVal}, ${rightVal}${rightBracket}` };
  };

  const getDynamicRoster = (): { isAllowed: boolean; text: string } => {
    if (numberType === 'real') {
      return { isAllowed: false, text: '✗ Tidak berlaku (bilangan kontinu tak terhingga)' };
    }
    const list: number[] = [];
    const start = leftType === 'included' ? minVal : minVal + 1;
    const end = rightType === 'included' ? maxVal : maxVal - 1;
    for (let i = start; i <= end; i++) {
      list.push(i);
    }
    return { isAllowed: true, text: `{${list.join(', ')}}` };
  };

  const dynInequality = currentPreset ? currentPreset.inequalityLatex : getDynamicInequality();
  const dynSetBuilder = currentPreset ? currentPreset.setBuilderLatex : getDynamicSetBuilder();
  const dynInterval = currentPreset
    ? { isAllowed: currentPreset.intervalLatex.indexOf('✗') === -1, latex: currentPreset.intervalLatex }
    : getDynamicInterval();
  const dynRoster = currentPreset
    ? { isAllowed: currentPreset.rosterText.indexOf('✗') === -1, text: currentPreset.rosterText }
    : getDynamicRoster();

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Bookmark className="w-3.5 h-3.5" /> 08 · NOTASI
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Notasi Selang & Interval
          </h1>
        </div>

        {/* Switcher Real vs Diskrit */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => {
              setNumberType('real');
              if (activePresetId === 'lift') setActivePresetId('custom');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              numberType === 'real'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bilangan Real ℝ (Kontinu)
          </button>
          <button
            type="button"
            onClick={() => {
              setNumberType('integer');
              if (rightType === 'infinity') setRightType('included');
              if (activePresetId !== 'lift') setActivePresetId('custom');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              numberType === 'integer'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bilangan Bulat ℤ (Diskrit)
          </button>
        </div>
      </div>

      {/* Preset Kasus Dunia Nyata */}
      <div className="flex flex-wrap items-center gap-1.5 my-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
          Kasus Nyata:
        </span>
        {PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => loadPreset(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-brand-600 border-brand-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{preset.name}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {preset.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Garis Bilangan Interaktif SVG */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 shadow-inner flex flex-col items-center justify-center my-1 relative">
        <div className="w-full flex items-center justify-between text-[11px] text-slate-400 px-4 mb-1">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <strong>● / [ ]</strong> = Ikut Serta
          </span>
          <span className="text-slate-400 text-xs italic">
            Klik bulatan ujung untuk mengubah ● / ○ / ∞
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full border border-rose-400 bg-slate-950" />
            <strong>○ / ( )</strong> = Tidak Ikut
          </span>
        </div>

        <svg className="w-full max-w-[720px] h-[100px]" viewBox="0 0 720 100">
          <defs>
            {/* Glow neon */}
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.6" />
            </filter>
            {/* Marker Panah */}
            <marker id="arrow-axis-r" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--theme-svg-axis, #475569)" />
            </marker>
            <marker id="arrow-axis-l" viewBox="0 0 10 10" refX="4" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 8 1 L 0 5 L 8 9 z" fill="var(--theme-svg-axis, #475569)" />
            </marker>
            <marker id="arrow-ray" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* Sumbu garis utama */}
          <line
            x1="50"
            y1="50"
            x2="670"
            y2="50"
            stroke="var(--theme-svg-axis, #475569)"
            strokeWidth="2.5"
            markerEnd="url(#arrow-axis-r)"
            markerStart="url(#arrow-axis-l)"
          />

          {/* Rangkaian Garis Nilai Kontinu vs Titik Diskrit */}
          {numberType === 'real' ? (
            <>
              {/* Garis Segmen Tebal Aktif */}
              <line
                x1="180"
                y1="50"
                x2={rightType === 'infinity' ? '660' : '540'}
                y2="50"
                stroke="#6366f1"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#neon-glow)"
                markerEnd={rightType === 'infinity' ? 'url(#arrow-ray)' : undefined}
              />

              {/* Titik Ujung Kiri */}
              <g onClick={cycleLeft} className="cursor-pointer group">
                <circle cx="180" cy="50" r="18" fill="transparent" />
                <circle
                  cx="180"
                  cy="50"
                  r="8.5"
                  fill={leftType === 'included' ? '#10b981' : '#020617'}
                  stroke={leftType === 'included' ? '#10b981' : '#f43f5e'}
                  strokeWidth="3.5"
                  className="transition-all group-hover:scale-110"
                />
                <text x="180" y="80" textAnchor="middle" fill="var(--theme-svg-coord-text, #e2e8f0)" fontSize="13" fontWeight="bold" className="font-mono">
                  {minVal}
                </text>
                <text x="180" y="26" textAnchor="middle" fill={leftType === 'included' ? '#34d399' : '#fb7185'} fontSize="11" fontWeight="bold">
                  {leftType === 'included' ? '● [ Ikut' : '○ ( Tidak'}
                </text>
              </g>

              {/* Titik Ujung Kanan (atau Panah Infinity) */}
              {rightType !== 'infinity' ? (
                <g onClick={cycleRight} className="cursor-pointer group">
                  <circle cx="540" cy="50" r="18" fill="transparent" />
                  <circle
                    cx="540"
                    cy="50"
                    r="8.5"
                    fill={rightType === 'included' ? '#10b981' : '#020617'}
                    stroke={rightType === 'included' ? '#10b981' : '#f43f5e'}
                    strokeWidth="3.5"
                    className="transition-all group-hover:scale-110"
                  />
                  <text x="540" y="80" textAnchor="middle" fill="var(--theme-svg-coord-text, #e2e8f0)" fontSize="13" fontWeight="bold" className="font-mono">
                    {maxVal}
                  </text>
                  <text x="540" y="26" textAnchor="middle" fill={rightType === 'included' ? '#34d399' : '#fb7185'} fontSize="11" fontWeight="bold">
                    {rightType === 'included' ? '● ] Ikut' : '○ ) Tidak'}
                  </text>
                </g>
              ) : (
                <g onClick={cycleRight} className="cursor-pointer group">
                  <rect x="610" y="16" width="60" height="24" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="640" y="32" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                    +∞ (Bebas)
                  </text>
                </g>
              )}
            </>
          ) : (
            /* Mode Diskrit (Bilangan Bulat) */
            <>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((val) => {
                const cx = 150 + val * 52;
                return (
                  <g key={val} className="group">
                    <circle cx={cx} cy="50" r="14" fill="transparent" />
                    <circle
                      cx={cx}
                      cy="50"
                      r="6.5"
                      fill="#6366f1"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text x={cx} y="76" textAnchor="middle" fill="var(--theme-svg-coord-text, #e2e8f0)" fontSize="11" fontWeight="bold" className="font-mono">
                      {val}
                    </text>
                  </g>
                );
              })}
              <text x="360" y="24" textAnchor="middle" fill="#a5b4fc" fontSize="11" fontWeight="bold">
                ● Titik-titik lepas terpisah (bilangan bulat utuh tanpa garis penghubung)
              </text>
            </>
          )}
        </svg>

        {currentPreset && (
          <p className="text-xs text-slate-300 text-center mt-1">
            <span className="text-amber-400 font-semibold">Logika Nyata: </span>
            {currentPreset.explanation}
          </p>
        )}
      </div>

      {/* 4 Baris Notasi Matematika (Didaktik Tebak Dulu, Baru Buktikan) */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 md:p-4 rounded-2xl shadow-xl space-y-2 my-1 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-400" />
            4 Cara Menuliskan Domain / Range
          </span>
          <button
            type="button"
            onClick={() => setIsRevealed((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isRevealed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-brand-600 hover:bg-brand-500 text-white animate-pulse'
            }`}
          >
            {isRevealed ? (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Sembunyikan (Tebak Lagi)
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> Buktikan Notasi (B)
              </>
            )}
          </button>
        </div>

        {/* Grid 4 Notasi */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 transition-all ${
          !isRevealed ? 'filter blur-[5px] opacity-40 pointer-events-none select-none' : 'opacity-100'
        }`}>
          {/* 1. Himpunan Terdaftar */}
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              1. Himpunan Terdaftar:
            </span>
            <div className="my-1 min-h-[32px] flex items-center">
              {dynRoster.isAllowed ? (
                <span className="text-xs font-mono font-bold text-indigo-300 break-all">
                  {dynRoster.text}
                </span>
              ) : (
                <span className="text-[11px] text-rose-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 shrink-0" /> {dynRoster.text}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">Cocok untuk data diskrit bulat</span>
          </div>

          {/* 2. Pertidaksamaan */}
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
              2. Pertidaksamaan:
            </span>
            <div className="my-1 min-h-[32px] flex items-center">
              <MathFormula math={dynInequality} className="text-amber-300 font-bold text-sm" />
            </div>
            <span className="text-[10px] text-slate-400">Menggunakan tanda &lt;, &gt;, ≤, ≥</span>
          </div>

          {/* 3. Pembentuk Himpunan */}
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">
              3. Pembentuk Himpunan:
            </span>
            <div className="my-1 min-h-[32px] flex items-center">
              <MathFormula math={dynSetBuilder} className="text-indigo-300 font-bold text-xs" />
            </div>
            <span className="text-[10px] text-slate-400">Notasi formal {'{x ∈ ... | ...}'}</span>
          </div>

          {/* 4. Notasi Selang (Interval) */}
          <div className="p-2.5 bg-slate-950 rounded-xl border border-emerald-500/30 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
              4. Notasi Selang:
            </span>
            <div className="my-1 min-h-[32px] flex items-center">
              {dynInterval.isAllowed ? (
                <MathFormula math={dynInterval.latex} className="text-emerald-300 font-bold text-lg" />
              ) : (
                <span className="text-[11px] text-rose-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 shrink-0" /> {dynInterval.latex}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">Kurung siku [ ] vs biasa ( )</span>
          </div>
        </div>

        {/* Overlay saat tersembunyi */}
        {!isRevealed && (
          <div className="absolute inset-x-0 bottom-3 top-10 flex flex-col items-center justify-center bg-slate-950/60 rounded-xl backdrop-blur-xs">
            <span className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Tebak Terlebih Dahulu Bersama Kelas!
            </span>
            <span className="text-[11px] text-slate-400">
              Apakah kurung siku atau kurung biasa? Tekan tombol <strong>&quot;Buktikan Notasi&quot;</strong> atau pintasan <strong>(B)</strong>.
            </span>
          </div>
        )}
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-emerald-500 px-4 py-2 rounded-r-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
            ATURAN EMAS
          </span>
          <p className="text-slate-200 font-semibold">
            Kurung Siku <code className="text-emerald-300 font-bold">[a, b]</code> = batas ikut (● ≤). Kurung Biasa <code className="text-rose-300 font-bold">(a, b)</code> = batas tidak ikut (○ &lt;).
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Selang hanya berlaku pada data kontinu ℝ</span>
        </div>
      </div>
    </div>
  );
};
