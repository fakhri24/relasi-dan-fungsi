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
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-semibold tracking-wide uppercase">
          <HelpCircle className="w-4 h-4" /> Masalah Nyata · Mengapa Perlu Fungsi Sepenggal?
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Ketika Satu Rumus Lurus Tidak Lagi Cukup
        </h1>
        <p className="text-xl text-slate-400 font-medium">
          Dunia nyata penuh dengan kondisi: <span className="text-amber-300 font-semibold">"Kalau jarak dekat tarifnya X, tapi kalau jarak jauh tarifnya Y."</span>
        </p>
      </div>

      {/* Kontrol Durasi Interaktif */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl my-2">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-brand-400" />
            <span className="text-lg font-bold text-white">Simulasi Durasi Parkir di Mall:</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-brand-300 bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-800">
            {durationHours < 1
              ? `${Math.round(durationHours * 60)} Menit`
              : `${durationHours.toFixed(1)} Jam (${Math.round(durationHours * 60)} Menit)`}
          </div>
        </div>

        {/* Slider Durasi */}
        <div className="my-4">
          <input
            type="range"
            min="0.1"
            max="12"
            step="0.1"
            value={durationHours}
            onChange={(e) => setDurationHours(parseFloat(e.target.value))}
            className="w-full accent-brand-500 cursor-pointer h-2.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-xs font-mono text-slate-500 mt-1">
            <span>6 Menit (Drop-off)</span>
            <span>1 Jam</span>
            <span>3 Jam</span>
            <span>6 Jam</span>
            <span>12 Jam (Seharian)</span>
          </div>
        </div>

        {/* Komparasi 2 Pendekatan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mt-4">
          {/* Pendekatan 1 Rumus Lurus Kaku */}
          <div className="p-6 rounded-2xl bg-rose-950/20 border-2 border-rose-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-xs tracking-wider">
                <AlertOctagon className="w-4 h-4" /> Pendekatan 1 Rumus Linear Kaku
              </div>
              <div className="my-2">
                <MathFormula math="f(x) = 3.000x + 5.000" block className="text-rose-300 font-bold text-lg" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-rose-400 my-2">
                Rp {linearPrice.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-500/30 text-xs text-rose-200 mt-3">
              {durationHours <= 0.25 ? (
                <span>⚠️ <strong className="text-white">Tidak Masuk Akal!</strong> Orang cuma drop-off 6 menit tapi sudah ditagih <strong>Rp {linearPrice.toLocaleString('id-ID')}</strong>! Pelanggan akan protes.</span>
              ) : durationHours >= 8 ? (
                <span>⚠️ <strong className="text-white">Terlalu Mahal!</strong> Parkir lama tidak ada batas maksimal, tagihan membengkak tidak wajar.</span>
              ) : (
                <span>Rumus kaku tidak mampu menyesuaikan kebijakan bisnis yang manusiawi.</span>
              )}
            </div>
          </div>

          {/* Pendekatan Aturan Bercabang (Piecewise) */}
          <div className="p-6 rounded-2xl bg-emerald-950/20 border-2 border-emerald-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs tracking-wider">
                <CheckCircle2 className="w-4 h-4" /> Pendekatan Nyata: Aturan Bercabang
              </div>
              <div className="my-2">
                <span className="text-emerald-300 font-semibold text-sm">
                  {realMall.rule}
                </span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 my-2">
                Rp {realMall.price.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-xs text-emerald-200 mt-3">
              ✅ <strong className="text-white">Adil & Realistis!</strong> Aturan berubah mengikuti rentang waktu (<MathFormula math="x" />). Inilah yang disebut <strong className="text-white underline underline-offset-2">Fungsi Piecewise (Sepenggal)</strong>!
            </div>
          </div>
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-brand-500 p-4 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 font-bold">SOLUSI MATEMATIKA</span>
          <p className="text-slate-200 text-lg font-semibold">
            Untuk aturan yang berganti-ganti, matematikawan menciptakan <span className="text-brand-300 font-bold">Fungsi Sepenggal (Piecewise Function)</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
