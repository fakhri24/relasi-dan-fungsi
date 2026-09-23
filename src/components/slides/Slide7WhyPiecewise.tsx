import React, { useState } from 'react';
import { HelpCircle, AlertOctagon, CheckCircle2, Clock } from 'lucide-react';
import { MathFormula } from '../MathFormula';

export const Slide7WhyPiecewise: React.FC = () => {
  const [durationHours, setDurationHours] = useState<number>(0.1); // default 6 menit (0.1 jam)

  // Rumus Linear Kaku: y = 3000x + 5000
  const linearPrice = Math.round(3000 * durationHours + 5000);

  // Aturan Nyata Mall (Piecewise)
  const getRealMallPrice = (h: number) => {
    if (h <= 0.25) return { price: 0, rule: 'Gratis Drop-off (≤ 15 Menit)', tier: 1 };
    if (h <= 1.0) return { price: 5000, rule: 'Tarif Jam Pertama (15 Menit - 1 Jam)', tier: 2 };
    if (h <= 8.0) {
      const additionalHours = Math.ceil(h - 1);
      return { price: 5000 + additionalHours * 3000, rule: 'Jam Berikutnya (+Rp 3.000/jam)', tier: 3 };
    }
    return { price: 30000, rule: 'Tarif Maksimal Harian (Flat Rp 30.000)', tier: 4 };
  };

  const realMall = getRealMallPrice(durationHours);

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono font-bold tracking-wider uppercase">
          <HelpCircle className="w-3.5 h-3.5" /> 10 · MASALAH
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Batasan 1 Garis
        </h1>
      </div>

      {/* Kontrol Durasi Interaktif */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl my-2">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-brand-400" />
            <span className="text-base font-bold text-white">Durasi Parkir:</span>
          </div>
          <div className="text-xl font-extrabold font-mono text-brand-300 bg-slate-950 px-3.5 py-1 rounded-xl border border-slate-800">
            {durationHours < 1
              ? `${Math.round(durationHours * 60)} Menit`
              : `${durationHours.toFixed(1)} Jam`}
          </div>
        </div>

        {/* Slider Durasi */}
        <div className="my-3">
          <input
            type="range"
            min="0.1"
            max="12"
            step="0.1"
            value={durationHours}
            onChange={(e) => setDurationHours(parseFloat(e.target.value))}
            className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-xs font-mono text-slate-500 mt-1">
            <span>6 Mnt (Drop-off)</span>
            <span>1 Jam</span>
            <span>3 Jam</span>
            <span>6 Jam</span>
            <span>12 Jam</span>
          </div>
        </div>

        {/* Komparasi 2 Pendekatan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch mt-3">
          {/* Pendekatan 1 Rumus Lurus Kaku */}
          <div className="p-5 rounded-2xl bg-rose-950/20 border-2 border-rose-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase text-xs tracking-wider">
                <AlertOctagon className="w-4 h-4" /> 1 Garis Lurus (Kaku)
              </div>
              <div className="my-1.5">
                <MathFormula math="f(x) = 3.000x + 5.000" block className="text-rose-300 font-bold text-lg" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-rose-400 my-1">
                Rp {linearPrice.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="p-2.5 bg-rose-950/40 rounded-xl border border-rose-500/30 text-xs text-rose-200 mt-2">
              {durationHours <= 0.25 ? (
                <span>⚠️ Drop-off 6 menit tetap bayar <strong>Rp {linearPrice.toLocaleString('id-ID')}</strong> (tidak adil)</span>
              ) : durationHours >= 8 ? (
                <span>⚠️ Tidak ada batas tarif maksimal (terlalu mahal)</span>
              ) : (
                <span>Rumus tunggal tidak bisa menampung kondisi bertingkat</span>
              )}
            </div>
          </div>

          {/* Pendekatan Aturan Bercabang (Piecewise) */}
          <div className="p-5 rounded-2xl bg-emerald-950/20 border-2 border-emerald-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-xs tracking-wider">
                <CheckCircle2 className="w-4 h-4" /> Aturan Bercabang (Piecewise)
              </div>
              <div className="my-1.5">
                <span className="text-emerald-300 font-semibold text-sm">
                  {realMall.rule}
                </span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 my-1">
                Rp {realMall.price.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="p-2.5 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-xs text-emerald-200 mt-2">
              ✅ Tarif berubah sesuai rentang waktu <MathFormula math="x" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-brand-500 px-4 py-2.5 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold">KUNCI</span>
          <p className="text-slate-200 text-sm md:text-base font-semibold">
            Kondisi bertingkat di dunia nyata membutuhkan <span className="text-brand-300 font-bold">Fungsi Bercabang (Piecewise)</span>
          </p>
        </div>
      </div>
    </div>
  );
};
