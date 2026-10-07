import { useState, useEffect, useRef } from 'react';
import { 
  X, CheckCircle, ChevronRight, ChevronLeft, Send, Sparkles, 
  User, Check, AlertCircle, TrendingUp, Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { uploadDiagramSnapshot } from '../../lib/uploadDiagram';
import { InteractiveLinearPlotCanvas, InteractiveLinearPlotCanvasRef } from './InteractiveLinearPlotCanvas';
import { ClassRoster, LinearPlotPoint, Lkpd2Submission } from '../../types/lkpd';
import { MathFormula } from '../MathFormula';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface MathChoiceOption {
  val: string;
  latex: string;
}

/** Kartu pilihan notasi ber-KaTeX (pengganti <select> yang tidak bisa merender KaTeX). Tanpa teks petunjuk. */
const MathChoiceGroup: React.FC<{
  options: MathChoiceOption[];
  value: string;
  onChange: (val: string) => void;
  columns?: 1 | 2 | 3 | 4;
}> = ({ options, value, onChange, columns = 1 }) => {
  const gridCols = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4' }[columns];
  return (
    <div className={`grid ${gridCols} gap-1.5`}>
      {options.map((opt) => {
        const active = value === opt.val;
        return (
          <button
            key={opt.val}
            type="button"
            onClick={() => onChange(opt.val)}
            className={`w-full px-3 py-2 rounded-xl border text-sm transition-all flex items-center justify-between gap-2 ${
              active
                ? 'bg-indigo-600/30 border-indigo-400 text-slate-900 dark:text-white'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            <MathFormula math={opt.latex} />
            {active ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <span className="w-4 h-4 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
};

// Data awal kelas fallback jika Firestore belum diisi oleh guru
const DEFAULT_CLASSES: ClassRoster[] = [
  {
    id: 'kelas-x-1',
    name: 'X-1 (Fase E)',
    createdAt: new Date().toISOString(),
    students: [
      'Ahmad Fauzi', 'Anisa Rahmawati', 'Bagus Pratama', 'Budi Santoso', 
      'Citra Kirana', 'Dewi Lestari', 'Dimas Anggara', 'Fajar Ramadhan',
      'Fitri Handayani', 'Gilang Perkasa', 'Hana Safitri', 'Indah Permata',
      'Joko Susilo', 'Kevin Sanjaya', 'Lestari Ayu', 'Muhammad Rizky',
      'Nabila Putri', 'Putra Mahendra', 'Rina Anggraini', 'Satria Wicaksono'
    ]
  },
  {
    id: 'kelas-x-2',
    name: 'X-2 (Fase E)',
    createdAt: new Date().toISOString(),
    students: [
      'Aditya Pratama', 'Bella Cantika', 'Candra Wijaya', 'Dinda Salsabila',
      'Eko Prasetyo', 'Farhan Maulana', 'Gita Gutawa', 'Hadi Wijaya',
      'Intan Nuraini', 'Kurniawan Dwi', 'Lia Amelia', 'Mahendra Putra',
      'Nurul Hidayah', 'Panji Gumilang', 'Rafi Ahmad', 'Siti Maryam'
    ]
  }
];

export const LkpdDigitalModalP2: React.FC<Props> = ({ isOpen, onClose }) => {
  // Stepper state:
  // 0: Identitas, 1: Batasan Fisik, 2: Notasi Himpunan, 3: Pemodelan Linear, 4: Plot Kartesius, 5: Refleksi & Kirim, 6: Selesai
  const [currentStep, setCurrentStep] = useState(0);

  // Roster state
  const [classes, setClasses] = useState<ClassRoster[]>(DEFAULT_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState<string>('kelas-x-1');
  const [selectedStudentName, setSelectedStudentName] = useState<string>('');

  // Canvas Ref untuk export Base64
  const plotCanvasRef = useRef<InteractiveLinearPlotCanvasRef>(null);

  // State Langkah 1: Batasan Fisik (Ojol, Baterai, Lift)
  const [ojolAnswer, setOjolAnswer] = useState<'Valid' | 'Mustahil' | ''>('');
  const [ojolReason, setOjolReason] = useState('');
  const [ojolDomain, setOjolDomain] = useState('');

  const [bateraiAnswer, setBateraiAnswer] = useState<'Valid' | 'Mustahil' | ''>('');
  const [bateraiReason, setBateraiReason] = useState('');
  const [bateraiRange, setBateraiRange] = useState('');

  const [liftAnswer, setLiftAnswer] = useState<'Valid' | 'Mustahil' | ''>('');
  const [liftDataType, setLiftDataType] = useState<'Diskrit' | 'Kontinu' | ''>('');
  const [liftReason, setLiftReason] = useState('');

  // State Langkah 2: Notasi Himpunan & Selang
  const [q1Bracket, setQ1Bracket] = useState<string>('');
  const [q2Inequality, setQ2Inequality] = useState<string>('');
  const [q3Interval, setQ3Interval] = useState<string>('');

  // State Langkah 3: Pemodelan Linear (Kamera)
  const [varX] = useState('Durasi sewa (jam)');
  const [varY] = useState('Total biaya sewa (Rp)');
  const [paramA] = useState<string>('10000');
  const [paramB] = useState<string>('20000');
  const [row1Cost, setRow1Cost] = useState<string>('');
  const [row2Cost, setRow2Cost] = useState<string>('');
  const [row3Cost, setRow3Cost] = useState<string>('');
  const [row5Cost, setRow5Cost] = useState<string>('');

  // State Langkah 4: Kanvas Plot Kartesius
  const [plotPoints, setPlotPoints] = useState<LinearPlotPoint[]>([]);
  const [hasLine, setHasLine] = useState(false);
  const [plotImage, setPlotImage] = useState<string>('');

  // State Langkah 5: Refleksi Aturan Emas
  const [meaningOfB, setMeaningOfB] = useState('');
  const [meaningOfA, setMeaningOfA] = useState('');

  // State Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSubmissionId, setSubmittedSubmissionId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validasi Langkah-langkah
  const canProceedStep0 = !!selectedStudentName.trim();
  const canProceedStep1 = 
    ojolAnswer !== '' && ojolReason.trim().length >= 4 && ojolDomain !== '' &&
    bateraiAnswer !== '' && bateraiReason.trim().length >= 4 && bateraiRange !== '' &&
    liftAnswer !== '' && liftDataType !== '' && liftReason.trim().length >= 4;
  const canProceedStep2 = q1Bracket !== '' && q2Inequality !== '' && q3Interval !== '';
  const canProceedStep3 = 
    row1Cost.trim() !== '' && row2Cost.trim() !== '' && 
    row3Cost.trim() !== '' && row5Cost.trim() !== '';
  const canProceedStep4 = plotPoints.length >= 2 && hasLine;
  const canProceedStep5 = meaningOfB.trim().length >= 5 && meaningOfA.trim().length >= 5;

  // Auto-capture canvas saat transisi
  const capturePlotCanvasIfActive = async () => {
    if (currentStep === 4 && plotCanvasRef.current) {
      try {
        const b64 = await plotCanvasRef.current.exportToBase64();
        if (b64) setPlotImage(b64);
      } catch (err) {
        console.warn('Capture plot canvas failed:', err);
      }
    }
  };

  const handleStepClick = async (targetStep: number) => {
    if (targetStep > currentStep) return;
    await capturePlotCanvasIfActive();
    setCurrentStep(targetStep);
  };

  const handleProceedToStep5 = async () => {
    if (plotCanvasRef.current) {
      try {
        const b64 = await plotCanvasRef.current.exportToBase64();
        if (b64) setPlotImage(b64);
      } catch (err) {
        console.warn('Capture plot canvas failed:', err);
      }
    }
    setCurrentStep(5);
  };

  // Load daftar kelas dari Firestore jika ada
  useEffect(() => {
    if (!isOpen) return;

    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'classes'));
        if (!querySnapshot.empty) {
          const loadedClasses: ClassRoster[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            loadedClasses.push({
              id: doc.id,
              name: data.name || doc.id,
              students: data.students || [],
              createdAt: data.createdAt || new Date().toISOString()
            });
          });
          setClasses(loadedClasses);
          if (loadedClasses.length > 0) {
            setSelectedClassId(loadedClasses[0].id);
          }
        }
      } catch (err) {
        console.warn('Gagal memuat kelas dari Firestore, memakai fallback lokal:', err);
      }
    };

    fetchClasses();
  }, [isOpen]);

  if (!isOpen) return null;

  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];

  // Kirim Jawaban ke Firebase
  const handleSubmitLkpd = async () => {
    if (!selectedStudentName) {
      alert('Silakan pilih Nama Siswa Anda terlebih dahulu di Langkah 0!');
      setCurrentStep(0);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Pastikan gambar grafik terambil
      let img = plotImage;
      if (!img && plotCanvasRef.current) {
        img = await plotCanvasRef.current.exportToBase64();
      }

      // Triple Failsafe: Upload ke Storage -> fallback Base64
      let uploadedUrl: string | null = null;
      if (img) {
        uploadedUrl = await uploadDiagramSnapshot(img, 'p2-linear-plot');
      }

      const numA = Number(paramA) || 10000;
      const numB = Number(paramB) || 20000;

      const submissionPayload: Lkpd2Submission = {
        meeting: 2,
        classId: selectedClassId,
        className: currentClass.name,
        studentName: selectedStudentName,
        submittedAt: new Date().toISOString(),
        physicalLimits: {
          ojol: {
            answer: ojolAnswer,
            reason: ojolReason,
            domainNotation: ojolDomain
          },
          baterai: {
            answer: bateraiAnswer,
            reason: bateraiReason,
            rangeNotation: bateraiRange
          },
          lift: {
            answer: liftAnswer,
            dataType: liftDataType,
            reason: liftReason
          }
        },
        setNotations: {
          q1Bracket,
          q2Inequality,
          q3Interval
        },
        linearModel: {
          varX,
          varY,
          paramA: numA,
          paramB: numB,
          formulaText: `f(x) = ${numA.toLocaleString('id-ID')}x + ${numB.toLocaleString('id-ID')}`,
          tableRows: [
            { x: 0, cost: 20000, pointStr: '(0, 20k)' },
            { x: 1, cost: Number(row1Cost) || 30000, pointStr: `(1, ${(Number(row1Cost) || 30000)/1000}k)` },
            { x: 2, cost: Number(row2Cost) || 40000, pointStr: `(2, ${(Number(row2Cost) || 40000)/1000}k)` },
            { x: 3, cost: Number(row3Cost) || 50000, pointStr: `(3, ${(Number(row3Cost) || 50000)/1000}k)` },
            { x: 5, cost: Number(row5Cost) || 70000, pointStr: `(5, ${(Number(row5Cost) || 70000)/1000}k)` }
          ]
        },
        plotData: {
          points: plotPoints,
          hasLine,
          imageUrl: uploadedUrl || '',
          imageBase64: uploadedUrl ? '' : (img || '')
        },
        goldenRule: {
          meaningOfB,
          meaningOfA
        }
      };

      const docRef = await addDoc(collection(db, 'submissions'), submissionPayload);
      setSubmittedSubmissionId(docRef.id);
      setCurrentStep(6);

      // Konfeti Selebrasi
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    } catch (err: unknown) {
      console.error('Error saat menyimpan ke Firestore:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setSubmitError(`Gagal mengirim lembar kerja: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 0, title: 'Identitas', short: '0. Profil' },
    { id: 1, title: 'Batasan Fisik', short: '1. Batasan' },
    { id: 2, title: 'Notasi Interval', short: '2. Notasi' },
    { id: 3, title: 'Tabel Hitung', short: '3. Model' },
    { id: 4, title: 'Plot Kartesius', short: '4. Grafik' },
    { id: 5, title: 'Refleksi & Kirim', short: '5. Refleksi' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-sm sm:text-base">
                  LKPD 2: Batasan Fisik Domain-Range & Model Linear
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                  P2 · 2 JP
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lembar Kerja Peserta Didik Digital · Matematika Fase E (Kelas X)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
            title="Tutup LKPD"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Tabs Bar */}
        {currentStep < 6 && (
          <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 min-w-max">
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isLocked = step.id > currentStep;

                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    disabled={isLocked}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : isCompleted
                        ? 'bg-slate-800 hover:bg-slate-750 text-slate-300 cursor-pointer'
                        : 'bg-slate-900/60 text-slate-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-extrabold bg-black/30">
                      {isCompleted ? <Check className="w-3 h-3 text-emerald-400" /> : step.id}
                    </span>
                    <span>{step.short}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Konten Langkah-Langkah (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* ============================================================ */}
          {/* LANGKAH 0: IDENTITAS SISWA */}
          {/* ============================================================ */}
          {currentStep === 0 && (
            <div className="max-w-md mx-auto py-4 space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                  <User className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Identitas Peserta Didik</h4>
                <p className="text-xs text-slate-400">
                  Pilih kelas dan nama lengkapmu sesuai presensi untuk memulai lembar kerja.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Pilih Kelas:
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => {
                      setSelectedClassId(e.target.value);
                      setSelectedStudentName('');
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Pilih Nama Kamu:
                  </label>
                  <select
                    value={selectedStudentName}
                    onChange={(e) => setSelectedStudentName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Pilih Nama Siswa --</option>
                    {currentClass.students.map((student, idx) => (
                      <option key={idx} value={student}>
                        {student}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={!canProceedStep0}
                    onClick={() => setCurrentStep(1)}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      canProceedStep0
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span>Mulai Menyelidiki Kasus ➔</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LANGKAH 1: INVESTIGASI BATASAN FISIK DUNIA NYATA */}
          {/* ============================================================ */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block mb-0.5">
                  Bagian A · Menalar Batasan Fisik Realita (Sinkron Slide 6 & 7)
                </span>
                <p className="text-xs text-slate-300">
                  Di matematika murni, variabel <MathFormula math="x" /> bebas bernilai apa saja. Namun di dunia nyata, hukum fisika dan logika kehidupan membatasi nilai input (Domain) dan hasil (Range). Uji 3 kasus berikut:
                </p>
              </div>

              {/* 3 Kartu Kasus Batasan Fisik */}
              <div className="space-y-3">
                {/* Kasus 1: Jarak Ojol */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-white text-sm">1. Jarak Tempuh Ojek Online (Variabel <MathFormula math="x" />: km)</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400">Apakah <MathFormula math="x = -4" /> km masuk akal?</span>
                      <button
                        type="button"
                        onClick={() => setOjolAnswer('Valid')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                          ojolAnswer === 'Valid' ? 'bg-amber-600 border-amber-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        Masuk Akal
                      </button>
                      <button
                        type="button"
                        onClick={() => setOjolAnswer('Mustahil')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                          ojolAnswer === 'Mustahil' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        Mustahil
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Alasan Logis:</label>
                      <input
                        type="text"
                        value={ojolReason}
                        onChange={(e) => setOjolReason(e.target.value)}
                        placeholder="Tulis alasanmu..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Notasi Domain Fisik:</label>
                      <MathChoiceGroup
                        columns={3}
                        value={ojolDomain}
                        onChange={setOjolDomain}
                        options={[
                          { val: 'x >= 0', latex: 'x \\ge 0' },
                          { val: 'x > 0', latex: 'x > 0' },
                          { val: 'x in R', latex: 'x \\in \\mathbb{R}' },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Kasus 2: Baterai HP */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-white text-sm">2. Persentase Baterai HP (Variabel <MathFormula math="y" />: %)</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400">Apakah <MathFormula math="y = 120\%" /> mungkin terjadi?</span>
                      <button
                        type="button"
                        onClick={() => setBateraiAnswer('Valid')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                          bateraiAnswer === 'Valid' ? 'bg-amber-600 border-amber-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        Mungkin
                      </button>
                      <button
                        type="button"
                        onClick={() => setBateraiAnswer('Mustahil')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                          bateraiAnswer === 'Mustahil' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        Mustahil
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Alasan Logis:</label>
                      <input
                        type="text"
                        value={bateraiReason}
                        onChange={(e) => setBateraiReason(e.target.value)}
                        placeholder="Tulis alasanmu..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Rentang Range Fisik:</label>
                      <MathChoiceGroup
                        columns={3}
                        value={bateraiRange}
                        onChange={setBateraiRange}
                        options={[
                          { val: '[0%, 100%]', latex: '[0\\%, 100\\%]' },
                          { val: '[0%, tak terhingga)', latex: '[0\\%, \\infty)' },
                          { val: 'Semua Real', latex: '\\mathbb{R}' },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Kasus 3: Muatan Lift Gedung */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-white text-sm">3. Kapasitas Lift (Maksimal 8 Orang)</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400">Apakah penumpang <MathFormula math="x = 3{,}5" /> orang mungkin?</span>
                      <button
                        type="button"
                        onClick={() => setLiftAnswer('Valid')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                          liftAnswer === 'Valid' ? 'bg-amber-600 border-amber-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        Mungkin
                      </button>
                      <button
                        type="button"
                        onClick={() => setLiftAnswer('Mustahil')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                          liftAnswer === 'Mustahil' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        Mustahil
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Sifat Data Penumpang:</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setLiftDataType('Diskrit')}
                          className={`flex-1 py-1.5 rounded-lg border font-bold text-xs ${
                            liftDataType === 'Diskrit' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          Diskrit (Bulat)
                        </button>
                        <button
                          type="button"
                          onClick={() => setLiftDataType('Kontinu')}
                          className={`flex-1 py-1.5 rounded-lg border font-bold text-xs ${
                            liftDataType === 'Kontinu' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          Kontinu (Pecahan)
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Alasan Logis:</label>
                      <input
                        type="text"
                        value={liftReason}
                        onChange={(e) => setLiftReason(e.target.value)}
                        placeholder="Tulis alasanmu..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigasi Stepper */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali ke Profil
                </button>

                <div className="flex items-center gap-3">
                  {!canProceedStep1 && (
                    <span className="text-[11px] text-amber-400 hidden sm:inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Jawab ke-3 kasus & tulis alasannya
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!canProceedStep1}
                    onClick={() => setCurrentStep(2)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      canProceedStep1
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span>Lanjut ke Notasi Interval</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LANGKAH 2: MENULIS NOTASI FORMAL INTERVAL */}
          {/* ============================================================ */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block mb-0.5">
                  Bagian B1 · Memahami Notasi Interval Matematika (Sinkron Slide 8)
                </span>
                <p className="text-xs text-slate-300">
                  Kurung siku <MathFormula math="[a, b]" /> menyatakan batas ujung <strong>ikut serta (titik penuh ●)</strong>, sedangkan kurung biasa <MathFormula math="(a, b)" /> menyatakan batas ujung <strong>tidak ikut (titik kosong ○)</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Soal 1 */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h5 className="font-bold text-white text-xs">
                    1. Nilai <MathFormula math="x" /> mulai dari 0 hingga 10 (kedua batas ikut serta):
                  </h5>
                  <MathChoiceGroup
                    value={q1Bracket}
                    onChange={setQ1Bracket}
                    options={[
                      { val: '[0, 10]', latex: '[0, 10]' },
                      { val: '(0, 10)', latex: '(0, 10)' },
                      { val: '[0, 10)', latex: '[0, 10)' },
                    ]}
                  />
                </div>

                {/* Soal 2 */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h5 className="font-bold text-white text-xs">
                    2. Nilai jarak <MathFormula math="x" /> tidak boleh negatif (boleh mulai dari 0 ke atas tanpa batas):
                  </h5>
                  <MathChoiceGroup
                    value={q2Inequality}
                    onChange={setQ2Inequality}
                    options={[
                      { val: 'x >= 0', latex: 'D_f = \\{x \\in \\mathbb{R} \\mid x \\ge 0\\}' },
                      { val: 'x > 0', latex: 'D_f = \\{x \\in \\mathbb{R} \\mid x > 0\\}' },
                      { val: 'x <= 0', latex: 'D_f = \\{x \\in \\mathbb{R} \\mid x \\le 0\\}' },
                    ]}
                  />
                </div>

                {/* Soal 3: Selang Terbuka / Setengah Terbuka */}
                <div className="md:col-span-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h5 className="font-bold text-white text-xs">
                    3. Suhu air <MathFormula math="x" /> (°C) saat berwujud cair, antara 0°C dan 100°C (kedua batas tidak termasuk):
                  </h5>
                  <MathChoiceGroup
                    columns={4}
                    value={q3Interval}
                    onChange={setQ3Interval}
                    options={[
                      { val: '[0, 100]', latex: '[0, 100]' },
                      { val: '(0, 100]', latex: '(0, 100]' },
                      { val: '(0, 100)', latex: '(0, 100)' },
                      { val: '[0, 100)', latex: '[0, 100)' },
                    ]}
                  />
                </div>
              </div>

              {/* Navigasi Stepper */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali ke Batasan Fisik
                </button>

                <div className="flex items-center gap-3">
                  {!canProceedStep2 && (
                    <span className="text-[11px] text-amber-400 hidden sm:inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Pilih jawaban ketiga notasi di atas
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!canProceedStep2}
                    onClick={() => setCurrentStep(3)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      canProceedStep2
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span>Lanjut ke Pemodelan Linear</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LANGKAH 3: PEMODELAN LINEAR & TABEL HITUNG */}
          {/* ============================================================ */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    Skenario Kasus Dunia Nyata: Jasa Sewa Kamera Mirrorless
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">
                    <MathFormula math="f(x) = ax + b" />
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Rental kamera menetapkan <strong>biaya dasar buka segel sebesar Rp 20.000</strong>, ditambah <strong>biaya pemakaian Rp 10.000 per jam</strong>.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Input x:</span>
                    <strong className="text-white">{varX}</strong>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Output y:</span>
                    <strong className="text-white">{varY}</strong>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-emerald-400 block">Biaya Awal (b):</span>
                    <strong className="text-emerald-300">Rp 20.000</strong>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-indigo-400 block">Tarif/Jam (a):</span>
                    <strong className="text-indigo-300">Rp 10.000</strong>
                  </div>
                </div>
              </div>

              {/* Tabel Perhitungan Nilai */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                <h5 className="font-bold text-white text-xs flex items-center justify-between">
                  <span>Lengkapi Tabel Perhitungan Nilai Biaya:</span>
                  <span className="text-[10px] font-normal text-slate-400">Rumus: 10.000 × jam + 20.000</span>
                </h5>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-center border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <th className="p-2">Durasi (x jam)</th>
                        <th className="p-2">Perhitungan Matematika</th>
                        <th className="p-2">Total Biaya (Rp)</th>
                        <th className="p-2">Titik Koordinat (x, y)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      <tr>
                        <td className="p-2 font-mono font-bold text-slate-300">0 jam</td>
                        <td className="p-2 text-slate-400">10.000 × 0 + 20.000</td>
                        <td className="p-2 font-mono text-emerald-400 font-bold">Rp 20.000</td>
                        <td className="p-2 font-mono text-indigo-400 font-bold">(0, 20k)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-bold text-slate-300">1 jam</td>
                        <td className="p-2 text-slate-400">10.000 × 1 + 20.000</td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={row1Cost}
                            onChange={(e) => setRow1Cost(e.target.value)}
                            placeholder="Ketik total..."
                            className="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono text-white focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                        <td className="p-2 font-mono text-slate-400">
                          {row1Cost ? `(1, ${Number(row1Cost)/1000}k)` : '(1, ...)'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-bold text-slate-300">2 jam</td>
                        <td className="p-2 text-slate-400">10.000 × 2 + 20.000</td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={row2Cost}
                            onChange={(e) => setRow2Cost(e.target.value)}
                            placeholder="Ketik total..."
                            className="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono text-white focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                        <td className="p-2 font-mono text-slate-400">
                          {row2Cost ? `(2, ${Number(row2Cost)/1000}k)` : '(2, ...)'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-bold text-slate-300">3 jam</td>
                        <td className="p-2 text-slate-400">10.000 × 3 + 20.000</td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={row3Cost}
                            onChange={(e) => setRow3Cost(e.target.value)}
                            placeholder="Ketik total..."
                            className="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono text-white focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                        <td className="p-2 font-mono text-slate-400">
                          {row3Cost ? `(3, ${Number(row3Cost)/1000}k)` : '(3, ...)'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-bold text-slate-300">5 jam</td>
                        <td className="p-2 text-slate-400">10.000 × 5 + 20.000</td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={row5Cost}
                            onChange={(e) => setRow5Cost(e.target.value)}
                            placeholder="Ketik total..."
                            className="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono text-white focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                        <td className="p-2 font-mono text-slate-400">
                          {row5Cost ? `(5, ${Number(row5Cost)/1000}k)` : '(5, ...)'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Navigasi Stepper */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali ke Notasi
                </button>

                <div className="flex items-center gap-3">
                  {!canProceedStep3 && (
                    <span className="text-[11px] text-amber-400 hidden sm:inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Lengkapi nilai biaya untuk 1, 2, 3, dan 5 jam
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!canProceedStep3}
                    onClick={() => setCurrentStep(4)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      canProceedStep3
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span>Lanjut ke Plot Kartesius</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LANGKAH 4: KANVAS PLOT KARTESIUS INTERAKTIF */}
          {/* ============================================================ */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-400" />
                  Plot Titik <MathFormula math="(x, y)" /> dan Hubungkan Menjadi Garis Lurus
                </h4>
                <p className="text-xs text-slate-400">
                  Sentuh titik grid pada kanvas atau gunakan tombol chip di bawah untuk mem-plot titik: (0, 20rb), (1, 30rb), (2, 40rb), (3, 50rb), (5, 70rb). Kemudian aktifkan <strong>&quot;Hubungkan Menjadi Garis Linear&quot;</strong>.
                </p>
              </div>

              {/* Kanvas Plot Kartesius */}
              <div className="flex justify-center">
                <InteractiveLinearPlotCanvas
                  ref={plotCanvasRef}
                  points={plotPoints}
                  onChangePoints={setPlotPoints}
                  hasLine={hasLine}
                  onToggleLine={setHasLine}
                  savedImage={plotImage}
                  onSaveSnapshot={(b64) => setPlotImage(b64)}
                />
              </div>

              {/* Navigasi Stepper */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali ke Tabel
                </button>

                <div className="flex items-center gap-3">
                  {!canProceedStep4 && (
                    <span className="text-[11px] text-amber-400 hidden sm:inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Plot minimal 2 titik dan aktifkan Garis Linear
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!canProceedStep4}
                    onClick={handleProceedToStep5}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      canProceedStep4
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span>Lanjut ke Refleksi & Kirim</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LANGKAH 5: REFLEKSI ATURAN EMAS & PENGIRIMAN */}
          {/* ============================================================ */}
          {currentStep === 5 && (
            <div className="space-y-4">
              {/* Bagian Refleksi */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Bagian C · Refleksi & Rumusan Aturan Emas Model Linear
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      1. Pada rumus <MathFormula math="f(x) = ax + b" />, nilai <MathFormula math="b" /> disebut titik potong sumbu-Y (<em>intercept</em>). Di dunia nyata, nilai <MathFormula math="b" /> ini merepresentasikan:
                    </label>
                    <input
                      type="text"
                      value={meaningOfB}
                      onChange={(e) => setMeaningOfB(e.target.value)}
                      placeholder="Tulis jawabanmu..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      2. Nilai <MathFormula math="a" /> disebut kemiringan garis (<em>gradien</em>). Jika tarif per jam semakin mahal, bagaimana pengaruhnya terhadap bentuk garis grafik? Apakah garis semakin curam/tegak atau semakin landai?
                    </label>
                    <input
                      type="text"
                      value={meaningOfA}
                      onChange={(e) => setMeaningOfA(e.target.value)}
                      placeholder="Tulis jawabanmu..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pratinjau Grafik yang Siap Dikirim */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Grafik Koordinat Kartesius yang Akan Dikirim:
                  </h5>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {plotPoints.length} Titik Terpasang
                  </span>
                </div>

                <div className="max-w-md mx-auto p-2 bg-slate-900 rounded-xl border border-slate-800">
                  {plotImage ? (
                    <img src={plotImage} alt="Grafik Linear" className="w-full rounded-lg" />
                  ) : (
                    <div className="h-28 flex items-center justify-center text-slate-500 text-xs">
                      Grafik akan di-capture otomatis saat tombol kirim ditekan.
                    </div>
                  )}
                </div>
              </div>

              {/* Navigasi Stepper */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali ke Kanvas Grafik
                </button>

                <div className="flex items-center gap-3">
                  {!canProceedStep5 && (
                    <span className="text-[11px] text-amber-400 hidden sm:inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Lengkapi kedua pertanyaan refleksi
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!canProceedStep5 || isSubmitting}
                    onClick={handleSubmitLkpd}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      canProceedStep5 && !isSubmitting
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Mengirim ke Guru...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim Jawaban ke Guru 🚀</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* LANGKAH 6: TANDA TERIMA DIGITAL */}
          {/* ============================================================ */}
          {currentStep === 6 && (
            <div className="max-w-md mx-auto py-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Jawaban P2 Terkirim! 🎉</h3>
                <p className="text-xs text-slate-400">
                  Luar biasa, <strong>{selectedStudentName}</strong>! Pemodelan fungsi linearmu dan grafik koordinat Kartesius telah mendarat di Dashboard Guru.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 text-left">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Nama Siswa:</span>
                  <span className="font-bold text-white">{selectedStudentName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Kelas:</span>
                  <span className="font-bold text-indigo-400">{currentClass.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Sesi:</span>
                  <span className="font-bold text-white">Pertemuan 2 (Batasan & Linear)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ID Pengumpulan:</span>
                  <span className="font-mono text-emerald-400 font-bold">{submittedSubmissionId || 'TERKIRIM'}</span>
                </div>
              </div>

              {plotImage && (
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <img src={plotImage} alt="Grafik Terkirim" className="w-full rounded-lg" />
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
              >
                Tutup Lembar Kerja
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
