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
    name: '1. Jarak Tempuh Ojol',
    context: 'Tarif ojol: Rp 4.000 (buka pintu) + Rp 2.500 per km.',
    variableX: 'Jarak (x dalam km)',
    variableY: 'Total Tarif (y dalam Rupiah)',
    domainLatex: 'D_f = \\{x \\in \\mathbb{R} \\mid x \\ge 0\\}',
    domainText: 'Jarak tidak boleh negatif. Nilai minimal 0 km.',
    rangeLatex: 'R_f = \\{y \\in \\mathbb{R} \\mid y \\ge 4.000\\}',
    rangeText: 'Tarif tidak pernah kurang dari biaya buka pintu (Rp 4.000).',
    testValues: [
      { x: 5, label: 'x = 5 km', isValid: true, reason: 'Valid! Jarak 5 km bernilai positif, tarif = Rp 16.500.' },
      { x: -3, label: 'x = -3 km', isValid: false, reason: 'Mustahil! Dalam dunia nyata, tidak ada jarak tempuh negatif (-3 km).' },
      { x: 0, label: 'x = 0 km', isValid: true, reason: 'Valid! Anda pesan ojol tapi langsung batal di tempat (hanya bayar buka pintu).' },
    ],
  },
  {
    id: 'baterai',
    name: '2. Persentase Baterai HP',
    context: 'Lama pemakaian terhadap sisa baterai smartphone.',
    variableX: 'Waktu bermain game (x dalam jam)',
    variableY: 'Sisa Baterai (y dalam persen %)',
    domainLatex: 'D_f = [0, 8]',
    domainText: 'Waktu dari 0 jam sampai baterai habis total (8 jam).',
    rangeLatex: 'R_f = [0\\%, 100\\%]',
    rangeText: 'Baterai tidak pernah lebih dari 100% dan tidak pernah di bawah 0%.',
    testValues: [
      { x: 3, label: 'x = 3 jam', isValid: true, reason: 'Valid! Dalam rentang waktu baterai aktif.' },
      { x: 12, label: 'x = 12 jam', isValid: false, reason: 'Di luar Domain! HP sudah mati total di jam ke-8.' },
      { x: -1, label: 'x = -1 jam', isValid: false, reason: 'Mustahil! Waktu tidak bisa berjalan mundur.' },
    ],
  },
  {
    id: 'lift',
    name: '3. Kapasitas Muatan Lift',
    context: 'Lift gedung dengan kapasitas beban maksimal 8 orang (600 kg).',
    variableX: 'Jumlah Orang (x orang)',
    variableY: 'Beban Total (y dalam kg)',
    domainLatex: 'D_f = \\{0, 1, 2, 3, 4, 5, 6, 7, 8\\}',
    domainText: 'Domain Diskrit! Jumlah orang harus bilangan bulat cacah (tidak bisa 3.5 orang).',
    rangeLatex: 'R_f = [0, 600] \\text{ kg}',
    rangeText: 'Beban lift antara 0 kg sampai batas maksimal 600 kg.',
    testValues: [
      { x: 5, label: 'x = 5 orang', isValid: true, reason: 'Valid! Lift beroperasi aman.' },
      { x: 3.5, label: 'x = 3.5 orang', isValid: false, reason: 'Mustahil! Manusia tidak bisa pecahan (harus diskrit/utuh).' },
      { x: 12, label: 'x = 12 orang', isValid: false, reason: 'Overload! Melebihi kapasitas maksimal domain lift.' },
    ],
  },
];

export const Slide5DomainRange: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-semibold tracking-wide uppercase">
          <Target className="w-4 h-4" /> Konsep 4 · Batasan Dunia Nyata
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Domain & Range: Bukan Sekadar Angka
        </h1>
        <p className="text-xl text-slate-400 font-medium">
          Di matematika abstrak, <MathFormula math="x" /> bisa berapa saja. Tapi di <span className="text-brand-300 font-semibold">dunia nyata</span>, ada batasan fisik yang masuk akal!
        </p>
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
        <div className="bg-slate-900/90 border-2 border-indigo-500/40 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Daerah Asal (Domain)</span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">Sumbu X</span>
            </div>
            <h3 className="text-2xl font-bold text-white mt-2">{activeScenario.variableX}</h3>
            <div className="my-4 p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <MathFormula math={activeScenario.domainLatex} block className="text-indigo-300 font-bold text-xl" />
            </div>
            <p className="text-slate-300 text-base leading-relaxed">
              💡 <span className="font-semibold text-white">Arti Fisis:</span> {activeScenario.domainText}
            </p>
          </div>

          {/* Test Nilai Interaktif */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Tebak: Apakah nilai ini masuk Domain?
            </span>
            <div className="flex gap-2">
              {activeScenario.testValues.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTest(idx)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all border ${
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
        <div className="bg-slate-900/90 border-2 border-emerald-500/40 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">Daerah Hasil (Range)</span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Sumbu Y</span>
            </div>
            <h3 className="text-2xl font-bold text-white mt-2">{activeScenario.variableY}</h3>
            <div className="my-4 p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <MathFormula math={activeScenario.rangeLatex} block className="text-emerald-300 font-bold text-xl" />
            </div>
            <p className="text-slate-300 text-base leading-relaxed">
              💡 <span className="font-semibold text-white">Arti Fisis:</span> {activeScenario.rangeText}
            </p>
          </div>

          {/* Feedback Uji */}
          <div className="mt-6 pt-4 border-t border-slate-800 min-h-[75px] flex items-center">
            {selectedTest !== null ? (
              <div
                className={`w-full p-3 rounded-xl border flex items-start gap-3 animate-fadeIn ${
                  activeScenario.testValues[selectedTest].isValid
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                }`}
              >
                {activeScenario.testValues[selectedTest].isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <p className="text-xs md:text-sm leading-snug">
                  {activeScenario.testValues[selectedTest].reason}
                </p>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic text-center w-full">
                Klik salah satu tombol tebakan di samping kiri untuk menguji pemahaman kelas.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-brand-500 p-4 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 font-bold">PRINSIP PROYEK</span>
          <p className="text-slate-200 text-lg font-semibold">
            Dalam proyek nanti, siswa <span className="text-brand-300 font-bold">wajib</span> menentukan batasan domain nyata dari kasus yang mereka pilih!
          </p>
        </div>
      </div>
    </div>
  );
};
