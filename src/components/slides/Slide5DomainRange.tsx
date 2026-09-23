import React, { useState } from 'react';
import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';
import { MathFormula } from '../MathFormula';

interface Scenario {
  id: string;
  name: string;
  context: string;
  variableX: string;
  variableY: string;
  domainLatex: string;
  domainText: string;
  rangeLatex: string;
  rangeText: string;
  testValues: { x: number; label: string; isValid: boolean; reason: string }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'ojol',
    name: '1. Jarak Ojol',
    context: 'Tarif ojol per km',
    variableX: 'Jarak (km)',
    variableY: 'Total Tarif (Rp)',
    domainLatex: 'D_f = \\{x \\in \\mathbb{R} \\mid x \\ge 0\\}',
    domainText: 'Jarak tidak boleh negatif (minimal 0 km).',
    rangeLatex: 'R_f = \\{y \\in \\mathbb{R} \\mid y \\ge 4.000\\}',
    rangeText: 'Tarif minimal biaya buka pintu (Rp 4.000).',
    testValues: [
      { x: 5, label: 'x = 5 km', isValid: true, reason: 'Valid (x ≥ 0)' },
      { x: -3, label: 'x = -3 km', isValid: false, reason: 'Invalid: Tidak ada jarak negatif' },
      { x: 0, label: 'x = 0 km', isValid: true, reason: 'Valid: Buka pintu (0 km)' },
    ],
  },
  {
    id: 'baterai',
    name: '2. Baterai HP',
    context: 'Pemakaian baterai',
    variableX: 'Waktu Pakai (jam)',
    variableY: 'Sisa Baterai (%)',
    domainLatex: 'D_f = [0, 8]',
    domainText: 'Waktu 0 sampai habis total (8 jam).',
    rangeLatex: 'R_f = [0\\%, 100\\%]',
    rangeText: 'Baterai berada pada rentang 0% sampai 100%.',
    testValues: [
      { x: 3, label: 'x = 3 jam', isValid: true, reason: 'Valid (0 ≤ x ≤ 8)' },
      { x: 12, label: 'x = 12 jam', isValid: false, reason: 'Invalid: Melebihi kapasitas (maks 8 jam)' },
      { x: -1, label: 'x = -1 jam', isValid: false, reason: 'Invalid: Waktu tidak bisa mundur' },
    ],
  },
  {
    id: 'lift',
    name: '3. Muatan Lift',
    context: 'Kapasitas lift',
    variableX: 'Jumlah Orang',
    variableY: 'Beban Total (kg)',
    domainLatex: 'D_f = \\{0, 1, 2, \\dots, 8\\}',
    domainText: 'Diskrit: bilangan bulat utuh (maksimal 8 orang).',
    rangeLatex: 'R_f = [0, 600] \\text{ kg}',
    rangeText: 'Beban total antara 0 kg sampai 600 kg.',
    testValues: [
      { x: 5, label: 'x = 5 orang', isValid: true, reason: 'Valid: Kapasitas aman' },
      { x: 3.5, label: 'x = 3.5 orang', isValid: false, reason: 'Invalid: Manusia harus bilangan bulat' },
      { x: 12, label: 'x = 12 orang', isValid: false, reason: 'Invalid: Overload (maks 8 orang)' },
    ],
  },
];

export const Slide5DomainRange: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono font-bold tracking-wider uppercase">
          <Target className="w-3.5 h-3.5" /> 05 · DOMAIN
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Domain & Range
        </h1>
      </div>

      {/* Selector Skenario */}
      <div className="flex flex-wrap gap-2 my-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveScenario(s);
              setSelectedTest(null);
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
              activeScenario.id === s.id
                ? 'bg-brand-600 border-brand-400 text-white shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Visual Domain vs Range Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch my-2">
        {/* Domain Card */}
        <div className="bg-slate-900/90 border-2 border-indigo-500/40 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Daerah Asal (Domain)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">Sumbu X</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">{activeScenario.variableX}</h3>
            <div className="my-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <MathFormula math={activeScenario.domainLatex} block className="text-indigo-300 font-bold text-xl" />
            </div>
            <p className="text-slate-300 text-sm">
              {activeScenario.domainText}
            </p>
          </div>

          {/* Test Nilai Interaktif */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Uji Nilai x:
            </span>
            <div className="flex gap-2">
              {activeScenario.testValues.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTest(idx)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all border ${
                    selectedTest === idx
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Range Card */}
        <div className="bg-slate-900/90 border-2 border-emerald-500/40 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">Daerah Hasil (Range)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Sumbu Y</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">{activeScenario.variableY}</h3>
            <div className="my-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <MathFormula math={activeScenario.rangeLatex} block className="text-emerald-300 font-bold text-xl" />
            </div>
            <p className="text-slate-300 text-sm">
              {activeScenario.rangeText}
            </p>
          </div>

          {/* Feedback Uji */}
          <div className="mt-4 pt-3 border-t border-slate-800 min-h-[60px] flex items-center">
            {selectedTest !== null ? (
              <div
                className={`w-full p-2.5 rounded-xl border flex items-center gap-2.5 animate-fadeIn ${
                  activeScenario.testValues[selectedTest].isValid
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                }`}
              >
                {activeScenario.testValues[selectedTest].isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span className="text-xs md:text-sm font-semibold">
                  {activeScenario.testValues[selectedTest].reason}
                </span>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-mono text-center w-full">
                Pilih nilai x untuk menguji batasan
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-brand-500 px-4 py-2.5 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold">KUNCI</span>
          <p className="text-slate-200 text-sm md:text-base font-semibold">
            Domain (<MathFormula math="x" />) dan Range (<MathFormula math="y" />) dibatasi oleh logika dunia nyata
          </p>
        </div>
      </div>
    </div>
  );
};
