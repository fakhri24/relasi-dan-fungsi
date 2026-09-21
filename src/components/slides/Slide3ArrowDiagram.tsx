import React, { useState } from 'react';
import { GitFork, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { MathFormula } from '../MathFormula';

interface Preset {
  id: string;
  name: string;
  arrows: [number, number][]; // [A_index, B_index]
  isFunction: boolean;
  verdict: string;
  reason: string;
}

const SET_A = ['Ali', 'Budi', 'Citra', 'Dewi'];
const SET_B = ['Bakso', 'Mie Ayam', 'Soto'];

const PRESETS: Preset[] = [
  {
    id: 'valid-1',
    name: 'Kasus 1: Pesan Makanan Normal',
    arrows: [[0, 0], [1, 1], [2, 0], [3, 2]],
    isFunction: true,
    verdict: 'FUNGSI SAH',
    reason: 'Setiap anak di himpunan A memesan tepat 1 porsi makanan. Meskipun Bakso dipesan 2 orang, ini tetap SAH fungsi!',
  },
  {
    id: 'invalid-jomblo',
    name: 'Kasus 2: Ada yang Tidak Memesan',
    arrows: [[0, 0], [1, 1], [3, 2]], // Citra (index 2) jomblo
    isFunction: false,
    verdict: 'BUKAN FUNGSI (Ada yang Jomblo)',
    reason: 'Citra (di himpunan A) tidak punya pasangan panah! Syarat fungsi: SEMUA anggota daerah asal harus punya pasangan.',
  },
  {
    id: 'invalid-mendua',
    name: 'Kasus 3: Memesan 2 Makanan Sekaligus',
    arrows: [[0, 0], [1, 1], [1, 2], [2, 0], [3, 2]], // Budi (index 1) punya 2 panah
    isFunction: false,
    verdict: 'BUKAN FUNGSI (Ada yang Mendua)',
    reason: 'Budi punya 2 panah (ke Mie Ayam dan Soto)! Syarat fungsi: anggota asal TIDAK BOLEH bercabang/memilih lebih dari satu.',
  },
  {
    id: 'valid-konstan',
    name: 'Kasus 4: Semua Pesan Bakso',
    arrows: [[0, 0], [1, 0], [2, 0], [3, 0]],
    isFunction: true,
    verdict: 'FUNGSI SAH (Fungsi Konstan)',
    reason: 'Semua anak memilih Bakso. Ini sah sebagai fungsi karena setiap anak tetap hanya punya 1 pesanan.',
  },
];

export const Slide3ArrowDiagram: React.FC = () => {
  const [activePreset, setActivePreset] = useState<Preset>(PRESETS[0]);
  const [revealed, setRevealed] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-semibold tracking-wide uppercase">
          <GitFork className="w-4 h-4" /> Konsep 2 · Syarat Sah Pemetaan
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Relasi vs Fungsi (Diagram Panah)
        </h1>
        <p className="text-xl text-slate-400 font-medium">
          Dua syarat mutlak bagi Daerah Asal (<MathFormula math="A" />): <span className="text-emerald-400 font-semibold">Semua Harus Berpasangan</span> & <span className="text-emerald-400 font-semibold">Tidak Boleh Mendua</span>.
        </p>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap gap-2 my-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setActivePreset(p);
              setRevealed(false);
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
              activePreset.id === p.id
                ? 'bg-brand-600 border-brand-400 text-white shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Visual Diagram Panah */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-slate-900/90 border border-slate-800 p-4 md:p-5 rounded-2xl shadow-xl my-1 flex-1 min-h-0">
        {/* SVG Diagram Canvas */}
        <div className="md:col-span-7 flex justify-center items-center bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
          <svg className="w-full max-w-[420px] h-[220px]" viewBox="0 0 460 260">
            <defs>
              <marker
                id="arrowhead-brand"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#818cf8" />
              </marker>
            </defs>

            {/* Ellipse Himpunan A */}
            <ellipse cx="90" cy="130" rx="65" ry="110" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="4 2" />
            <text x="90" y="36" textAnchor="middle" fill="#c7d2fe" fontWeight="bold" fontSize="14">
              Domain (A)
            </text>

            {/* Ellipse Himpunan B */}
            <ellipse cx="370" cy="130" rx="65" ry="110" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 2" />
            <text x="370" y="36" textAnchor="middle" fill="#a7f3d0" fontWeight="bold" fontSize="14">
              Kodomain (B)
            </text>

            {/* Garis Panah Relasi */}
            {activePreset.arrows.map(([aIdx, bIdx], i) => {
              const startX = 135;
              const startY = 65 + aIdx * 45;
              const endX = 325;
              const endY = 80 + bIdx * 55;
              return (
                <line
                  key={i}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#818cf8"
                  strokeWidth="2.5"
                  markerEnd="url(#arrowhead-brand)"
                  className="transition-all duration-500"
                />
              );
            })}

            {/* Titik & Label Himpunan A */}
            {SET_A.map((nama, idx) => {
              const cy = 65 + idx * 45;
              return (
                <g key={nama}>
                  <circle cx="130" cy={cy} r="5" fill="#a5b4fc" />
                  <text x="115" y={cy + 4} textAnchor="end" fill="#ffffff" fontSize="13" fontWeight="600">
                    {nama}
                  </text>
                </g>
              );
            })}

            {/* Titik & Label Himpunan B */}
            {SET_B.map((makanan, idx) => {
              const cy = 80 + idx * 55;
              return (
                <g key={makanan}>
                  <circle cx="330" cy={cy} r="5" fill="#6ee7b7" />
                  <text x="345" y={cy + 4} textAnchor="start" fill="#ffffff" fontSize="13" fontWeight="600">
                    {makanan}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Panel Uji Guru & Penjelasan */}
        <div className="md:col-span-5 flex flex-col justify-between h-full space-y-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Pertanyaan untuk Kelas:</span>
            <h3 className="text-2xl font-bold text-white mt-1">Apakah hubungan panah ini sebuah FUNGSI?</h3>
            <p className="text-slate-400 text-sm mt-1">
              Amati setiap anggota di himpunan asal (Ali, Budi, Citra, Dewi). Apakah semuanya memenuhi 2 syarat mutlak?
            </p>
          </div>

          {revealed ? (
            <div
              className={`p-3.5 rounded-xl border transition-all animate-fadeIn ${
                activePreset.isFunction
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {activePreset.isFunction ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
                <span className="text-base font-extrabold tracking-wide">
                  {activePreset.verdict}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                {activePreset.reason}
              </p>
            </div>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="py-2.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Buktikan Jawaban Kelas!
            </button>
          )}

          <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            📌 Rumus ingatan cepat: <span className="text-brand-300 font-bold">Daerah Asal tidak boleh Jomblo & tidak boleh Selingkuh!</span>
          </div>
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-brand-500 p-2.5 px-4 rounded-r-xl flex items-center justify-between mt-1 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold">ATURAN EMAS</span>
          <p className="text-slate-200 text-sm md:text-base font-semibold">
            Semua fungsi adalah relasi, tetapi tidak semua relasi adalah fungsi.
          </p>
        </div>
      </div>
    </div>
  );
};
