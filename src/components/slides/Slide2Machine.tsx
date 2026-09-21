import React, { useState } from 'react';
import { Cpu, Play, RotateCcw } from 'lucide-react';
import { MathFormula } from '../MathFormula';

export const Slide2Machine: React.FC = () => {
  const [inputVal, setInputVal] = useState<number>(3);
  const [selectedRule, setSelectedRule] = useState<'linear' | 'kuadrat'>('linear');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean>(false);

  const calculateOutput = (x: number, rule: 'linear' | 'kuadrat') => {
    if (rule === 'linear') {
      return {
        formulaLatex: 'f(x) = 2x + 3',
        substLatex: `f(${x}) = 2(${x}) + 3`,
        res: 2 * x + 3,
      };
    } else {
      return {
        formulaLatex: 'f(x) = x^2',
        substLatex: `f(${x}) = (${x})^2`,
        res: x * x,
      };
    }
  };

  const currentCalc = calculateOutput(inputVal, selectedRule);

  const handleRun = () => {
    setIsProcessing(true);
    setRevealed(false);
    setTimeout(() => {
      setIsProcessing(false);
      setRevealed(true);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-semibold tracking-wide uppercase">
          <Cpu className="w-4 h-4" /> Konsep 1 · Model Mental Fungsi
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Fungsi Sebagai "Mesin Hitung"
        </h1>
        <p className="text-xl text-slate-400 font-medium">
          Setiap nilai input <MathFormula math="x" /> yang dimasukkan akan diolah oleh aturan mesin menjadi output <MathFormula math="f(x)" />.
        </p>
      </div>

      {/* Interactive Machine Showcase */}
      <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-xl my-4 flex flex-col justify-between">
        {/* Kontrol Guru */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pilih Aturan Mesin:</span>
            <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => { setSelectedRule('linear'); setRevealed(false); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  selectedRule === 'linear'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MathFormula math="f(x) = 2x + 3" />
              </button>
              <button
                onClick={() => { setSelectedRule('kuadrat'); setRevealed(false); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  selectedRule === 'kuadrat'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MathFormula math="f(x) = x^2" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Input (<MathFormula math="x" />):</span>
            <div className="flex items-center gap-1.5">
              {[-2, -1, 0, 2, 3, 5, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => { setInputVal(num); setRevealed(false); }}
                  className={`w-10 h-10 rounded-lg font-mono font-bold text-base transition-all border ${
                    inputVal === num
                      ? 'bg-brand-500 border-brand-400 text-white ring-2 ring-brand-400/40'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visualisasi Mesin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center my-6 py-4">
          {/* Box Input */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/80 border-2 border-dashed border-slate-700 rounded-2xl text-center">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Bahan Baku (Input)</span>
            <div className="text-6xl font-extrabold font-mono text-brand-400 my-2">{inputVal}</div>
            <span className="text-sm text-slate-400 font-mono">Nilai x</span>
          </div>

          {/* Mesin Proses */}
          <div className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-b from-brand-900/40 to-slate-900 border-2 border-brand-500/50 rounded-2xl text-center glow-brand">
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider">
              Mesin f(x)
            </div>
            <Cpu className={`w-12 h-12 text-brand-400 my-2 ${isProcessing ? 'animate-spin' : ''}`} />
            <div className="text-2xl font-bold text-white my-1">
              <MathFormula math={currentCalc.formulaLatex} />
            </div>
            <button
              onClick={handleRun}
              disabled={isProcessing}
              className="mt-4 w-full py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {revealed ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {revealed ? 'Hitung Nilai Lain' : 'Proses Mesin!'}
            </button>
          </div>

          {/* Box Output */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/80 border-2 border-dashed border-slate-700 rounded-2xl text-center min-h-[170px]">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Hasil Olahan (Output)</span>
            {revealed ? (
              <div className="animate-fadeIn">
                <div className="text-6xl font-extrabold font-mono text-emerald-400 my-2">
                  {currentCalc.res}
                </div>
                <div className="text-sm text-emerald-300 font-mono">
                  <MathFormula math={currentCalc.substLatex + ` = ${currentCalc.res}`} />
                </div>
              </div>
            ) : (
              <div className="my-auto text-slate-600 font-mono text-lg italic">
                ? (Tebak dulu bersama kelas)
              </div>
            )}
          </div>
        </div>

        {/* Prompt Guru */}
        <div className="text-center text-sm text-slate-400 bg-slate-950/50 py-2.5 rounded-lg border border-slate-800">
          💡 Tips Guru: Minta seorang siswa menghitung manual <MathFormula math={currentCalc.substLatex} /> di kepalanya sebelum menekan tombol "Proses Mesin".
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-emerald-500 p-4 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">KESIMPULAN</span>
          <p className="text-slate-200 text-lg font-semibold">
            Nama fungsi adalah <MathFormula math="f" />, bahan bakunya <MathFormula math="x" />, dan hasil olahannya dinamakan <MathFormula math="f(x)" /> (atau <MathFormula math="y" />).
          </p>
        </div>
      </div>
    </div>
  );
};
