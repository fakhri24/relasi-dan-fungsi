import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  GitFork,
  CheckCircle2,
  ScanLine,
  Target,
  RefreshCw,
  Clock,
  Layers,
} from 'lucide-react';

interface Slide1OpeningRelasiProps {
  onNext?: () => void;
}

interface RelationPreset {
  id: string;
  name: string;
  setAName: string;
  setBName: string;
  setA: { id: string; label: string; icon: string }[];
  setB: { id: string; label: string; icon: string }[];
  connections: [string, string][]; // [fromId, toId]
  insight: string;
}

const PRESETS: RelationPreset[] = [
  {
    id: 'hobi',
    name: 'Hobi Siswa',
    setAName: 'Siswa (Himpunan A)',
    setBName: 'Hobi (Himpunan B)',
    setA: [
      { id: 'a1', label: 'Budi', icon: '👦' },
      { id: 'a2', label: 'Citra', icon: '👧' },
      { id: 'a3', label: 'Dodi', icon: '🧑' },
      { id: 'a4', label: 'Eka', icon: '👩' },
    ],
    setB: [
      { id: 'b1', label: 'Game', icon: '🎮' },
      { id: 'b2', label: 'Musik', icon: '🎵' },
      { id: 'b3', label: 'Futsal', icon: '⚽' },
      { id: 'b4', label: 'Coding', icon: '💻' },
    ],
    connections: [
      ['a1', 'b1'],
      ['a1', 'b2'], // Budi mendua: Game & Musik (sah di relasi!)
      ['a2', 'b3'],
      // Dodi jomblo (tidak punya hobi di daftar ini - sah di relasi!)
      ['a4', 'b1'], // Eka hobi game (sama dengan Budi)
    ],
    insight: 'Budi hobi Game & Musik (mendua), Dodi tidak memilih (jomblo). Sah dalam relasi!',
  },
  {
    id: 'kantin',
    name: 'Jajanan Kantin',
    setAName: 'Siswa (Himpunan A)',
    setBName: 'Pesanan (Himpunan B)',
    setA: [
      { id: 'a1', label: 'Budi', icon: '👦' },
      { id: 'a2', label: 'Citra', icon: '👧' },
      { id: 'a3', label: 'Dodi', icon: '🧑' },
      { id: 'a4', label: 'Eka', icon: '👩' },
    ],
    setB: [
      { id: 'b1', label: 'Es Krim', icon: '🍦' },
      { id: 'b2', label: 'Teh Kubus', icon: '🧃' },
      { id: 'b3', label: 'Dimsum', icon: '🥟' },
      { id: 'b4', label: 'Donat', icon: '🍩' },
    ],
    connections: [
      ['a1', 'b1'],
      ['a2', 'b2'],
      ['a3', 'b1'], // Budi & Dodi sama-sama beli Es Krim
      ['a3', 'b4'], // Dodi juga beli Donat (beli 2 macam)
      // Eka jomblo: lagi kenyang / tidak beli apa-apa
    ],
    insight: 'Dodi beli Es Krim & Donat, Eka tidak jajan sama sekali. Hubungan bebas tanpa aturan!',
  },
];

export const Slide1OpeningRelasi: React.FC<Slide1OpeningRelasiProps> = ({ onNext }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('hobi');
  const [customConnections, setCustomConnections] = useState<[string, string][] | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const currentPreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];
  const activeConnections = customConnections !== null ? customConnections : currentPreset.connections;

  const handleToggleConnection = (fromId: string, toId: string) => {
    const exists = activeConnections.some(([from, to]) => from === fromId && to === toId);
    let updated: [string, string][];
    if (exists) {
      updated = activeConnections.filter(([from, to]) => !(from === fromId && to === toId));
    } else {
      updated = [...activeConnections, [fromId, toId]];
    }
    setCustomConnections(updated);
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setCustomConnections(null);
    setSelectedSource(null);
  };

  // Helper coordinate calculation for SVG relation lines
  const getItemY = (index: number, total: number) => {
    const startY = 32;
    const endY = 168;
    if (total <= 1) return (startY + endY) / 2;
    return startY + (index * (endY - startY)) / (total - 1);
  };

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden">
      {/* Top Session Breadcrumb Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            PERTEMUAN 1 · 2 JP (90 MENIT)
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
            01 · FONDASI RELASI
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Fase E · Kelas X SMA</span>
        </div>
      </div>

      {/* Main Split Screen 50:50 Content */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6 py-3 items-center">
        {/* SISI KIRI: Visual Konsep Besar "RELASI" */}
        <div className="h-full flex flex-col justify-between bg-slate-900/60 rounded-2xl p-4 md:p-5 border border-slate-800 shadow-xl overflow-hidden">
          {/* Header Judul Besar Relasi */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 font-mono">
                KONSEP MATEMATIKA DASAR
              </span>
              <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                <Layers className="w-3 h-3 text-indigo-400" />
                <span>Aturan: Bebas (Tanpa Syarat)</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-brand-300 to-cyan-300 mt-1">
              RELASI
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Hubungan / pemasangan sembarang antara dua himpunan di kehidupan nyata.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 my-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  selectedPresetId === p.id && customConnections === null
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{p.name}</span>
              </button>
            ))}
            <button
              onClick={() => {
                setCustomConnections([]);
                setSelectedSource(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                customConnections !== null
                  ? 'bg-brand-600 text-white border-brand-400'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Klik elemen di A lalu klik elemen di B untuk membuat panah"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Coba Bebas</span>
            </button>
          </div>

          {/* Interactive SVG Relation Canvas */}
          <div className="relative w-full h-[190px] md:h-[210px] bg-slate-950/90 rounded-xl border border-slate-800/80 p-2 overflow-hidden flex items-center justify-between">
            {/* SVG Lines Overlay */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="relasiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.85" />
                </linearGradient>
                <marker
                  id="relasiArrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                </marker>
              </defs>

              {activeConnections.map(([fromId, toId], idx) => {
                const fromIdx = currentPreset.setA.findIndex((item) => item.id === fromId);
                const toIdx = currentPreset.setB.findIndex((item) => item.id === toId);
                if (fromIdx === -1 || toIdx === -1) return null;

                const y1 = getItemY(fromIdx, currentPreset.setA.length);
                const y2 = getItemY(toIdx, currentPreset.setB.length);

                return (
                  <path
                    key={`line-${idx}`}
                    d={`M 95 ${y1} C 170 ${y1}, 230 ${y2}, 305 ${y2}`}
                    fill="none"
                    stroke="url(#relasiGrad)"
                    strokeWidth="2.5"
                    markerEnd="url(#relasiArrow)"
                    strokeDasharray="4 2"
                    className="animate-pulse"
                  />
                );
              })}
            </svg>

            {/* Kolom Himpunan A */}
            <div className="z-10 flex flex-col justify-around h-full w-28">
              <span className="text-[10px] font-mono font-bold text-indigo-400 text-center uppercase tracking-wider pb-1">
                Himpunan A
              </span>
              {currentPreset.setA.map((item) => {
                const isSelected = selectedSource === item.id;
                const connectionCount = activeConnections.filter(([from]) => from === item.id).length;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedSource(selectedSource === item.id ? null : item.id);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400/50 shadow-lg'
                        : connectionCount > 1
                        ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                        : connectionCount === 0
                        ? 'bg-slate-900 text-slate-400 border-slate-800'
                        : 'bg-slate-900 text-slate-200 border-slate-700/80 hover:border-slate-500'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                    {connectionCount > 1 && (
                      <span className="ml-auto text-[9px] px-1 rounded bg-amber-500/30 text-amber-300 font-mono">
                        {connectionCount}
                      </span>
                    )}
                    {connectionCount === 0 && (
                      <span className="ml-auto text-[9px] px-1 rounded bg-slate-800 text-slate-400 font-mono">
                        0
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Kolom Himpunan B */}
            <div className="z-10 flex flex-col justify-around h-full w-28">
              <span className="text-[10px] font-mono font-bold text-cyan-400 text-center uppercase tracking-wider pb-1">
                Himpunan B
              </span>
              {currentPreset.setB.map((item) => {
                const isConnectedToSource = selectedSource
                  ? activeConnections.some(([from, to]) => from === selectedSource && to === item.id)
                  : false;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (selectedSource) {
                        handleToggleConnection(selectedSource, item.id);
                      }
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      isConnectedToSource
                        ? 'bg-cyan-600/30 text-cyan-200 border-cyan-400 ring-1 ring-cyan-400'
                        : 'bg-slate-900 text-slate-200 border-slate-700/80 hover:border-slate-500'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Badge & Bridge ke Fungsi */}
          <div className="pt-2 flex flex-col gap-2">
            <div className="p-2 rounded-xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-200">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-medium text-[11px] md:text-xs">
                  {currentPreset.insight}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px] shrink-0 border border-emerald-500/30">
                RELASI SAH
              </span>
            </div>

            {/* Bridge Button ke Slide 2 (Fungsi) */}
            {onNext && (
              <button
                onClick={onNext}
                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all border border-brand-400/40 group"
              >
                <span>Kapan Relasi Menjadi <strong>FUNGSI</strong>? Investigasi Sekarang</span>
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
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-300">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-extrabold text-white">
                    Target Belajar Hari Ini
                  </h2>
                  <span className="text-[11px] text-slate-400">
                    Capaian kompetensi yang dituntaskan dalam pertemuan ini
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-brand-400">
                3 Misi Inti
              </span>
            </div>
          </div>

          {/* 3 Kartu Target Belajar Kompak & Kontras Tinggi */}
          <div className="space-y-2.5 my-auto py-2">
            {/* Target 1 */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/30 hover:border-indigo-500/50 transition-all flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <GitFork className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs md:text-sm font-bold text-white">
                    1. Kenali Hubungan Bebas (Relasi)
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Fondasi
                  </span>
                </div>
                <p className="text-[11px] md:text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Menemukan relasi sebagai hubungan sembarang dua himpunan (hobi, pesanan kantin) tanpa larangan mendua atau jomblo.
                </p>
              </div>
            </div>

            {/* Target 2 */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs md:text-sm font-bold text-white">
                    2. Uji Kepastian Mutlak (Fungsi)
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Syarat Emas
                  </span>
                </div>
                <p className="text-[11px] md:text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Menyelidiki analogi kasir & diagram panah: anggota daerah asal <strong>wajib berpasangan</strong> dan <strong>tidak boleh mendua</strong>.
                </p>
              </div>
            </div>

            {/* Target 3 */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 hover:border-cyan-500/50 transition-all flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <ScanLine className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs md:text-sm font-bold text-white">
                    3. Deteksi Grafik (Vertical Line Test)
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    Uji Garis
                  </span>
                </div>
                <p className="text-[11px] md:text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Memvalidasi grafik fungsi Kartesius secara instan menggunakan scanner garis vertikal (maksimal memotong 1 titik).
                </p>
              </div>
            </div>
          </div>

          {/* Footer Card: Metode & Alur Belajar */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px]">Prinsip: <strong>Tebak Dulu, Baru Buktikan</strong></span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Slide 1 s.d. 5 · Pertemuan 1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
