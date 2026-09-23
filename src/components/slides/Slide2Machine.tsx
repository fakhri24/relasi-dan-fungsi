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
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono font-bold tracking-wider uppercase">
          <Cpu className="w-3.5 h-3.5" /> 02 · MESIN
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Mesin Fungsi
        </h1>
      </div>

      {/* Interactive Machine Showcase */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl my-3 flex flex-col justify-between">
        {/* Kontrol */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aturan:</span>
            <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => { setSelectedRule('linear'); setRevealed(false); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  selectedRule === 'linear'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MathFormula math="f(x) = 2x + 3" />
              </button>
              <button
                onClick={() => { setSelectedRule('kuadrat'); setRevealed(false); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  selectedRule === 'kuadrat'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MathFormula math="f(x) = x^2" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Input <MathFormula math="x" />:</span>
            <div className="flex items-center gap-1.5">
              {[-2, -1, 0, 2, 3, 5, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => { setInputVal(num); setRevealed(false); }}
                  className={`w-9 h-9 rounded-lg font-mono font-bold text-sm transition-all border ${
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center my-6 py-2">
          {/* Box Input */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/80 border-2 border-dashed border-slate-700 rounded-2xl text-center">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Input</span>
            <div className="text-5xl font-extrabold font-mono text-brand-400 my-2">{inputVal}</div>
            <span className="text-xs text-slate-400 font-mono">Nilai x</span>
          </div>

          {/* Mesin Proses */}
          <div className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-brand-900/40 to-slate-900 border-2 border-brand-500/50 rounded-2xl text-center glow-brand">
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider">
              Mesin f(x)
            </div>
            <Cpu className={`w-10 h-10 text-brand-400 my-2 ${isProcessing ? 'animate-spin' : ''}`} />
            <div className="text-xl font-bold text-white my-1">
              <MathFormula math={currentCalc.formulaLatex} />
            </div>
            <button
              onClick={handleRun}
              disabled={isProcessing}
              className="mt-3 w-full py-2.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {revealed ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {revealed ? 'Hitung Nilai Lain' : 'Proses Mesin'}
            </button>
          </div>

          {/* Box Output */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/80 border-2 border-dashed border-slate-700 rounded-2xl text-center min-h-[160px]">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Output</span>
            {revealed ? (
              <div className="animate-fadeIn">
                <div className="text-5xl font-extrabold font-mono text-emerald-400 my-2">
                  {currentCalc.res}
                </div>
                <div className="text-xs text-emerald-300 font-mono">
                  <MathFormula math={currentCalc.substLatex + ` = ${currentCalc.res}`} />
                </div>
              </div>
            ) : (
              <div className="my-auto text-slate-600 font-mono text-4xl font-extrabold">
                ?
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-emerald-500 px-4 py-3 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">KUNCI</span>
          <p className="text-slate-200 text-base font-semibold">
            Input <MathFormula math="x" /> diproses oleh aturan <MathFormula math="f" /> menghasilkan output <MathFormula math="f(x)" />
          </p>
        </div>
      </div>
    </div>
  );
};
