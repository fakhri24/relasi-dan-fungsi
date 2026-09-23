import React, { useState } from 'react';
import { HelpCircle, Sparkles, CheckCircle2, ShieldAlert, Scan, RefreshCw } from 'lucide-react';
import { MathFormula } from '../MathFormula';

export const Slide1Hook: React.FC = () => {
  const [testState, setTestState] = useState<'idle' | 'chaotic' | 'deterministic'>('idle');
  const [scanCount, setScanCount] = useState<number>(0);

  const chaoticOutputs = ['Rp 45.000', 'Rp 500', 'Sabun Colek', 'Rp 120.000'];
  const currentChaotic = chaoticOutputs[scanCount % chaoticOutputs.length];

  const handleScan = (mode: 'chaotic' | 'deterministic') => {
    setTestState(mode);
    setScanCount((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto">
      {/* Header Slide */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" /> 01 · PEMANTIK
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Mesin Kasir
        </h1>
      </div>

      {/* Visual Interaktif: Eksperimen Mesin Kasir */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-3 items-center">
        {/* Panel Interaksi & Objek Input */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between h-[340px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Input Kasir</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-brand-300">Barcode: 899-CORNETTO-01</span>
            </div>
            
            {/* Kartu Barang */}
            <div className="mt-4 p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl">
                🍦
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Es Krim Cornetto</h4>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                  <Scan className="w-3.5 h-3.5" /> 1 Input Barcode
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex gap-3">
              <button
                onClick={() => handleScan('chaotic')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
                  testState === 'chaotic'
                    ? 'bg-rose-600/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/50'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-rose-500/40'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                {testState === 'chaotic' ? 'Scan Ulang' : 'Uji Kasir Rusak'}
              </button>
              <button
                onClick={() => handleScan('deterministic')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
                  testState === 'deterministic'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/50'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {testState === 'deterministic' ? 'Scan Ulang' : 'Uji Kasir Normal'}
              </button>
            </div>
          </div>
        </div>

        {/* Panel Animasi Layar Kasir */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center h-[340px] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent opacity-50 animate-pulse" />

          {testState === 'idle' && (
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-brand-400">
                <HelpCircle className="w-8 h-8 animate-pulse" />
              </div>
              <h4 className="text-xl font-bold text-slate-300">Layar Kasir Siap</h4>
              <span className="text-xs font-mono text-slate-500">Pilih mode uji di sebelah kiri</span>
            </div>
          )}

          {testState === 'chaotic' && (
            <div className="space-y-4 animate-fadeIn w-full max-w-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-rose-400 font-bold bg-rose-950/60 border border-rose-800/60 px-3 py-1 rounded-full">
                  ❌ BUKAN FUNGSI (Harga Berubah)
                </span>
                <div className="text-4xl font-extrabold text-rose-300 font-mono mt-3 tracking-tight">
                  {currentChaotic}
                </div>
              </div>
              <div className="text-xs text-rose-400 font-medium flex items-center justify-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> 1 Barcode menghasilkan banyak kemungkinan harga
              </div>
            </div>
          )}

          {testState === 'deterministic' && (
            <div className="space-y-4 animate-fadeIn w-full max-w-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
                  ✅ FUNGSI SAH (Tepat 1 Harga)
                </span>
                <div className="text-4xl font-extrabold text-emerald-300 font-mono mt-3 tracking-tight">
                  Rp 8.000
                </div>
              </div>
              <div className="text-xs text-emerald-400 font-medium">
                1 Barcode $\to$ Tepat 1 Harga Pasti
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-brand-500 px-4 py-3 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 font-bold">KUNCI</span>
          <p className="text-slate-200 text-base font-semibold">
            1 Input Harus Menghasilkan Tepat 1 Output Pasti
          </p>
        </div>
        <div className="hidden sm:block text-brand-300 text-sm font-mono">
          <MathFormula math="f(\text{Cornetto}) = 8000" />
        </div>
      </div>
    </div>
  );
};
