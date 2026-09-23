import React, { useState } from 'react';
import { HelpCircle, Sparkles, CheckCircle2, ShieldAlert, Scan, RefreshCw } from 'lucide-react';
import { MathFormula } from '../MathFormula';

export const Slide1Hook: React.FC = () => {
  const [testState, setTestState] = useState<'idle' | 'chaotic' | 'deterministic'>('idle');
  const [scanCount, setScanCount] = useState<number>(0);

  // Daftar harga kacau untuk mode rusak
  const chaoticOutputs = [
    { price: 'Rp 45.000', note: 'Harga Steak Sapi?! Siswa melotot, dompet jebol!', status: 'Kacau' },
    { price: 'Rp 500', note: 'Harga Permen Karet?! Ibu kantin rugi bandar!', status: 'Kacau' },
    { price: 'Sabun Colek', note: 'Barcode sama tapi keluar nama barang lain?!', status: 'Kacau Parah' },
    { price: 'Rp 120.000', note: 'Hah?! Masa harga es krim seharga jaket hoodie?!', status: 'Kacau' }
  ];

  const currentChaotic = chaoticOutputs[scanCount % chaoticOutputs.length];

  const handleScan = (mode: 'chaotic' | 'deterministic') => {
    setTestState(mode);
    setScanCount((prev) => prev + 1);
  };

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
          Saat istirahat panas terik, kamu beli es krim favorit di kantin. Tapi mesin kasirnya ngaco...
        </p>
      </div>

      {/* Visual Interaktif: Eksperimen Mesin Kasir Kantin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-4 items-center">
        {/* Panel Interaksi & Objek Belanja */}
        <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-2xl shadow-xl flex flex-col justify-between h-[370px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Objek Input di Kasir Kantin</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-brand-300">Barcode: 899-CORNETTO-01</span>
            </div>
            
            {/* Kartu Barang: Es Krim Cone */}
            <div className="mt-3 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl">
                🍦
              </div>
              <div>
                <h4 className="text-lg font-bold text-white leading-snug">Es Krim Cornetto Cokelat</h4>
                <p className="text-xs text-slate-400">Jajanan wajib jam istirahat siang di kantin sekolah</p>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                  <Scan className="w-3.5 h-3.5" /> 1 Input yang Diberikan: Barcode Kemasan
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-slate-400 text-sm mb-3 font-medium">
              Uji coba scanner kasir. Pilih mode di bawah untuk membuktikan:
            </p>
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
                {testState === 'chaotic' ? 'Scan Ulang (Acak)' : 'Uji Kasir Rusak'}
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
                {testState === 'deterministic' ? 'Scan Ulang (Pasti)' : 'Uji Kasir Normal'}
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 bg-slate-950/60 py-2.5 rounded-lg border border-slate-800/80 flex items-center justify-center gap-2">
            <span>🗣️ <strong>Aktivitas Kelas:</strong> Tanyakan ke siswa: <em>"Boleh nggak 1 es krim pas di-scan punya 2 harga berbeda?"</em></span>
          </div>
        </div>

        {/* Panel Animasi Layar Kasir / Struk */}
        <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[370px] text-center relative overflow-hidden">
          {/* Garis Laser Barcode saat scanning */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent opacity-50 animate-pulse" />

          {testState === 'idle' && (
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-brand-400">
                <HelpCircle className="w-10 h-10 animate-pulse" />
              </div>
              <h4 className="text-2xl font-bold text-slate-300">Layar Kasir Siap...</h4>
              <p className="text-slate-400 max-w-sm text-sm">
                Arahkan scanner ke barcode Es Krim Cornetto. Klik tombol di sebelah kiri untuk melihat respon mesin kasir.
              </p>
            </div>
          )}

          {testState === 'chaotic' && (
            <div className="space-y-4 animate-fadeIn w-full max-w-md">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-rose-400 font-bold bg-rose-950/60 border border-rose-800/60 px-2.5 py-1 rounded-full">
                  Kekacauan Kasir · Bukan Fungsi!
                </span>
                <div className="text-4xl font-extrabold text-rose-300 font-mono mt-3 tracking-tight">
                  {currentChaotic.price}
                </div>
              </div>
              <p className="text-slate-300 text-sm bg-rose-950/30 border border-rose-900/50 p-3 rounded-xl text-center">
                {currentChaotic.note}
              </p>
              <div className="text-xs text-rose-400 font-medium flex items-center justify-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Coba klik 'Scan Ulang' berkali-kali: harganya berubah-ubah tanpa kepastian!
              </div>
            </div>
          )}

          {testState === 'deterministic' && (
            <div className="space-y-4 animate-fadeIn w-full max-w-md">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                  Pasti & Tunggal · Sah Sebagai Fungsi!
                </span>
                <div className="text-4xl font-extrabold text-emerald-300 font-mono mt-3 tracking-tight">
                  Rp 8.000
                </div>
              </div>
              <p className="text-slate-300 text-sm bg-emerald-950/30 border border-emerald-900/50 p-3 rounded-xl text-center">
                Berapa kali pun barcode Cornetto di-scan, kasir memberikan <strong>tepat satu harga pasti</strong>. Transaksi tenang, pembeli dan kasir senang!
              </p>
              <div className="text-xs text-emerald-400 font-medium">
                ✨ 1 Input Barcode $\to$ Tepat 1 Output Harga Pasti
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-brand-500 p-4 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 font-bold">INTUISI KUNCI</span>
          <p className="text-slate-200 text-lg font-semibold">
            Fungsi adalah hubungan kepastian: <span className="text-brand-300 underline underline-offset-4">1 Input Harus Menghasilkan Tepat 1 Output Pasti</span>.
          </p>
        </div>
        <div className="hidden lg:block text-slate-400 text-sm font-mono">
          <MathFormula math="f(\text{Cornetto}) = 8000" />
        </div>
      </div>
    </div>
  );
};
