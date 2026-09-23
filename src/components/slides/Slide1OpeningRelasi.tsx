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
  const getItemY = (index: number) => {
    const coords = [64, 102, 140, 178];
    return coords[index] ?? 64 + index * 38;
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

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r dark:from-indigo-300 dark:via-brand-300 dark:to-cyan-300 from-indigo-700 via-brand-700 to-cyan-800 mt-1">
              RELASI
            </h1>
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

          {/* Interactive Venn Diagram Relation Canvas */}
          <div className="relative w-full h-[220px] md:h-[240px] bg-slate-950/90 rounded-2xl border border-slate-800/80 p-1.5 overflow-hidden flex items-center justify-center">
            <svg
              className="w-full h-full select-none"
              viewBox="0 0 520 230"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Gradients */}
                <linearGradient id="gradOvalA" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#0f172a" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.75" />
                </linearGradient>

                <linearGradient id="gradOvalB" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#042f2e" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#0f172a" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#042f2e" stopOpacity="0.75" />
                </linearGradient>

                <linearGradient id="relasiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>

                {/* Arrowhead Marker */}
                <marker
                  id="relasiArrow"
                  viewBox="0 0 10 8"
                  refX="8"
                  refY="4"
                  markerWidth="8"
                  markerHeight="6"
                  orient="auto"
                >
                  <polygon points="0 1, 8 4, 0 7, 2 4" fill="#38bdf8" />
                </marker>

                {/* Glow Filter */}
                <filter id="arrowGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#38bdf8" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* ===== HIMPUNAN A (DOMAIN) VENN OVAL ===== */}
              <rect
                x="14"
                y="10"
                width="144"
                height="206"
                rx="38"
                fill="url(#gradOvalA)"
                stroke="#6366f1"
                strokeWidth="2.5"
                className="transition-all"
              />
              <rect
                x="36"
                y="18"
                width="100"
                height="22"
                rx="11"
                fill="#1e1b4b"
                stroke="#818cf8"
                strokeWidth="1.2"
              />
              <text
                x="86"
                y="33"
                textAnchor="middle"
                fill="#c7d2fe"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
                letterSpacing="0.8"
              >
                HIMPUNAN A
              </text>

              {/* ===== HIMPUNAN B (KODOMAIN) VENN OVAL ===== */}
              <rect
                x="362"
                y="10"
                width="144"
                height="206"
                rx="38"
                fill="url(#gradOvalB)"
                stroke="#06b6d4"
                strokeWidth="2.5"
                className="transition-all"
              />
              <rect
                x="384"
                y="18"
                width="100"
                height="22"
                rx="11"
                fill="#042f2e"
                stroke="#22d3ee"
                strokeWidth="1.2"
              />
              <text
                x="434"
                y="33"
                textAnchor="middle"
                fill="#a5f3fc"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
                letterSpacing="0.8"
              >
                HIMPUNAN B
              </text>

              {/* ===== CENTER STAGE LABELS & HELPER ===== */}
              <text
                x="260"
                y="24"
                textAnchor="middle"
                fill="#64748b"
                fontSize="10.5"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="1"
              >
                RELASI: A → B
              </text>
              {selectedSource ? (
                <g>
                  <rect
                    x="180"
                    y="34"
                    width="160"
                    height="20"
                    rx="10"
                    fill="#082f49"
                    stroke="#38bdf8"
                    strokeWidth="1"
                  />
                  <text
                    x="260"
                    y="47"
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="9.5"
                    fontWeight="bold"
                  >
                    Pilih target di B ➔
                  </text>
                </g>
              ) : (
                <text
                  x="260"
                  y="46"
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="9"
                  fontStyle="italic"
                >
                  Klik anggota A untuk pasangkan
                </text>
              )}

              {/* ===== DIRECTIONAL BEZIER ARROWS ===== */}
              {activeConnections.map(([fromId, toId], idx) => {
                const fromIdx = currentPreset.setA.findIndex((item) => item.id === fromId);
                const toIdx = currentPreset.setB.findIndex((item) => item.id === toId);
                if (fromIdx === -1 || toIdx === -1) return null;

                const y1 = getItemY(fromIdx);
                const y2 = getItemY(toIdx);

                // Start from Noktah A (146) to edge of Noktah B (368)
                return (
                  <path
                    key={`arrow-${fromId}-${toId}-${idx}`}
                    d={`M 146 ${y1} C 230 ${y1}, 290 ${y2}, 368 ${y2}`}
                    fill="none"
                    stroke="url(#relasiGrad)"
                    strokeWidth="2.5"
                    markerEnd="url(#relasiArrow)"
                    filter="url(#arrowGlow)"
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* ===== ITEMS IN HIMPUNAN A ===== */}
              {currentPreset.setA.map((item, idx) => {
                const y = getItemY(idx);
                const isSelected = selectedSource === item.id;
                const connectionCount = activeConnections.filter(([from]) => from === item.id).length;

                return (
                  <g
                    key={item.id}
                    onClick={() => {
                      setSelectedSource(selectedSource === item.id ? null : item.id);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Item capsule */}
                    <rect
                      x="22"
                      y={y - 15}
                      width="118"
                      height="30"
                      rx="8"
                      fill={isSelected ? '#4338ca' : connectionCount > 1 ? '#1e1b4b' : '#0f172a'}
                      stroke={
                        isSelected
                          ? '#a5b4fc'
                          : connectionCount > 1
                          ? '#f59e0b'
                          : '#334155'
                      }
                      strokeWidth={isSelected ? 2 : 1.2}
                      className="transition-all duration-200 group-hover:stroke-indigo-400"
                    />

                    {/* Emoji */}
                    <text
                      x="36"
                      y={y + 5}
                      fontSize="14"
                      textAnchor="middle"
                      className="select-none pointer-events-none"
                    >
                      {item.icon}
                    </text>

                    {/* Name */}
                    <text
                      x="50"
                      y={y + 4}
                      fontSize="11.5"
                      fontWeight="bold"
                      fill={isSelected ? '#ffffff' : '#f1f5f9'}
                      className="select-none pointer-events-none"
                    >
                      {item.label}
                    </text>

                    {/* Connection Count Badge */}
                    {connectionCount > 1 && (
                      <g>
                        <rect
                          x="116"
                          y={y - 8}
                          width="18"
                          height="16"
                          rx="6"
                          fill="#78350f"
                          stroke="#f59e0b"
                          strokeWidth="1"
                        />
                        <text
                          x="125"
                          y={y + 4}
                          textAnchor="middle"
                          fill="#fde68a"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {connectionCount}
                        </text>
                      </g>
                    )}
                    {connectionCount === 0 && (
                      <g>
                        <rect
                          x="116"
                          y={y - 8}
                          width="18"
                          height="16"
                          rx="6"
                          fill="#1e293b"
                          stroke="#475569"
                          strokeWidth="1"
                        />
                        <text
                          x="125"
                          y={y + 4}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          0
                        </text>
                      </g>
                    )}

                    {/* Noktah Anchor Dot A */}
                    {isSelected && (
                      <circle
                        cx="146"
                        cy={y}
                        r="8"
                        fill="#818cf8"
                        opacity="0.3"
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx="146"
                      cy={y}
                      r={isSelected ? 5.5 : 4.5}
                      fill={isSelected ? '#ffffff' : connectionCount > 0 ? '#818cf8' : '#475569'}
                      stroke={isSelected ? '#818cf8' : '#ffffff'}
                      strokeWidth={isSelected ? 2 : 1}
                      className="transition-all duration-200"
                    />
                  </g>
                );
              })}

              {/* ===== ITEMS IN HIMPUNAN B ===== */}
              {currentPreset.setB.map((item, idx) => {
                const y = getItemY(idx);
                const isConnectedToSource = selectedSource
                  ? activeConnections.some(([from, to]) => from === selectedSource && to === item.id)
                  : false;
                const isConnectedAny = activeConnections.some(([, to]) => to === item.id);

                return (
                  <g
                    key={item.id}
                    onClick={() => {
                      if (selectedSource) {
                        handleToggleConnection(selectedSource, item.id);
                      }
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Noktah Anchor Dot B */}
                    {selectedSource && (
                      <circle
                        cx="374"
                        cy={y}
                        r="7"
                        fill="#38bdf8"
                        opacity="0.25"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx="374"
                      cy={y}
                      r={isConnectedToSource ? 5.5 : 4.5}
                      fill={isConnectedToSource ? '#38bdf8' : isConnectedAny ? '#06b6d4' : '#475569'}
                      stroke={isConnectedToSource ? '#ffffff' : '#ffffff'}
                      strokeWidth={isConnectedToSource ? 2 : 1}
                      className="transition-all duration-200"
                    />

                    {/* Item capsule */}
                    <rect
                      x="382"
                      y={y - 15}
                      width="118"
                      height="30"
                      rx="8"
                      fill={isConnectedToSource ? '#0e7490' : '#0f172a'}
                      stroke={isConnectedToSource ? '#67e8f9' : '#334155'}
                      strokeWidth={isConnectedToSource ? 2 : 1.2}
                      className="transition-all duration-200 group-hover:stroke-cyan-400"
                    />

                    {/* Emoji */}
                    <text
                      x="396"
                      y={y + 5}
                      fontSize="14"
                      textAnchor="middle"
                      className="select-none pointer-events-none"
                    >
                      {item.icon}
                    </text>

                    {/* Name */}
                    <text
                      x="410"
                      y={y + 4}
                      fontSize="11.5"
                      fontWeight="bold"
                      fill={isConnectedToSource ? '#ffffff' : '#f1f5f9'}
                      className="select-none pointer-events-none"
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>
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
                <span>Investigasi: Relasi → <strong>Fungsi</strong></span>
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
                <h2 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white">
                  Target Belajar
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-brand-700 dark:text-brand-400">
                3 Misi
              </span>
            </div>
          </div>

          {/* 3 Kartu Target Belajar Ultra-Minimalis */}
          <div className="space-y-3 my-auto py-2">
            {/* Target 1 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/30 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <GitFork className="w-4 h-4" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                  1. Hubungan Bebas
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-500/30 shrink-0">
                Bebas Aturan
              </span>
            </div>

            {/* Target 2 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                  2. Syarat Fungsi
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
                Wajib 1 Pasangan
              </span>
            </div>

            {/* Target 3 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0">
                  <ScanLine className="w-4 h-4" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                  3. Uji Garis Vertikal
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30 shrink-0">
                Maks. 1 Titik Potong
              </span>
            </div>
          </div>

          {/* Footer Card: Metode & Alur Belajar */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-medium text-slate-400">
              Prinsip: <strong className="text-emerald-400">Tebak Dulu, Baru Buktikan</strong>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Slide 1–5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
