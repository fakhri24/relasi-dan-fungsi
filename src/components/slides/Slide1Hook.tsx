import React, { useState } from 'react';
import { HelpCircle, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { MathFormula } from '../MathFormula';

export const Slide1Hook: React.FC = () => {
  const [testState, setTestState] = useState<'idle' | 'chaotic' | 'deterministic'>('idle');

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto">
      {/* Header Slide */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-semibold tracking-wide uppercase">
          <Sparkles className="w-4 h-4" /> Pemantik Konsep · Mengapa Belajar Fungsi?
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Bayangkan Dunia Tanpa Kepastian...
        </h1>
        <p className="text-xl text-slate-400 font-medium">
          Apa jadinya jika satu tindakan yang sama memberikan hasil yang berbeda-beda?
        </p>
      </div>

      {/* Visual Interaktif: Eksperimen Mesin Kasir / Tombol Uji */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-4 items-center">
        {/* Panel Interaksi */}
        <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col justify-between h-[360px]">
          <div>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Simulator Eksperimen</span>
            <h3 className="text-2xl font-bold text-white mt-1">Uji Tombol "Beli Susu Kotak"</h3>
            <p className="text-slate-400 mt-2 text-base">
              Pilih mode mesin di bawah untuk melihat apa yang terjadi di mesin kasir otomatis:
            </p>
          </div>

          <div className="flex flex-wrap gap-4 my-4">
            <button
              onClick={() => setTestState('chaotic')}
              className={`flex-1 py-4 px-5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 border ${
                testState === 'chaotic'
                  ? 'bg-rose-600/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/50'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-5 h-5" /> Mode Mesin Rusak
            </button>
            <button
              onClick={() => setTestState('deterministic')}
              className={`flex-1 py-4 px-5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 border ${
                testState === 'deterministic'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/50'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" /> Mode Mesin Normal
            </button>
          </div>

          <div className="text-center text-sm text-slate-400 bg-slate-950/60 py-3 rounded-lg border border-slate-800/80">
            Guru: Ajukan pertanyaan ke siswa sebelum menekan tombol mode di atas!
          </div>
        </div>

        {/* Panel Animasi & Hasil */}
        <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[360px] text-center">
          {testState === 'idle' && (
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-brand-400">
                <HelpCircle className="w-10 h-10 animate-pulse" />
              </div>
              <h4 className="text-2xl font-bold text-slate-300">Menunggu Uji Coba...</h4>
              <p className="text-slate-400 max-w-sm text-base">
                Diskusikan di kelas: Kenapa barcode barang di minimarket tidak boleh menghasilkan 2 harga berbeda?
              </p>
            </div>
          )}

          {testState === 'chaotic' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-10 h-10 animate-bounce" />
              </div>
              <div className="text-2xl font-extrabold text-rose-400">Kekacauan! (Bukan Fungsi)</div>
              <p className="text-slate-300 text-base max-w-md">
                Tekan tombol 'Susu': Kadang keluar <span className="text-rose-400 font-bold">Rp 6.000</span>, kadang <span className="text-rose-400 font-bold">Rp 25.000</span>, kadang keluar sabun cuci! Pembeli komplain, sistem gagal.
              </p>
            </div>
          )}

          {testState === 'deterministic' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-400">Pasti & Konsisten! (Fungsi)</div>
              <p className="text-slate-300 text-base max-w-md">
                Setiap kali tombol 'Susu' ditekan, outputnya <span className="text-emerald-400 font-bold">pasti dan tunggal</span>: Susu seharga Rp 6.000. Inilah aturan dasar sebuah fungsi!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-brand-500 p-4 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 font-bold">INTUISI KUNCI</span>
          <p className="text-slate-200 text-lg font-semibold">
            Fungsi adalah hubungan sebab-akibat: <span className="text-brand-300 underline underline-offset-4">1 Input Harus Menghasilkan Tepat 1 Output Pasti</span>.
          </p>
        </div>
        <div className="hidden lg:block text-slate-400 text-sm font-mono">
          <MathFormula math="f : x \mapsto y" />
        </div>
      </div>
    </div>
  );
};
