import React, { useState, useEffect, useRef } from 'react';
import { 
  X, CheckCircle, ChevronRight, ChevronLeft, Send, Sparkles, 
  User, Award, Check, AlertCircle, FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { InteractiveArrowCanvas, InteractiveArrowCanvasRef } from './InteractiveArrowCanvas';
import { ClassRoster, ArrowRelation } from '../../types/lkpd';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

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

export const LkpdDigitalModal: React.FC<Props> = ({ isOpen, onClose }) => {
  // Stepper state (0: Identitas, 1: Kasus 1, 2: Kasus 2, 3: Kasus 3, 4: VLT & Refleksi, 5: Selesai)
  const [currentStep, setCurrentStep] = useState(0);

  // Roster state
  const [classes, setClasses] = useState<ClassRoster[]>(DEFAULT_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState<string>('kelas-x-1');
  const [selectedStudentName, setSelectedStudentName] = useState<string>('');
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Canvas Refs untuk meng-capture gambar Base64
  const case1Ref = useRef<InteractiveArrowCanvasRef>(null);
  const case2Ref = useRef<InteractiveArrowCanvasRef>(null);
  const case3Ref = useRef<InteractiveArrowCanvasRef>(null);

  // State Jawaban Kasus 1 (Pesanan Kantin Many-to-One) - Bersih / Kosong
  const [case1Arrows, setCase1Arrows] = useState<ArrowRelation[]>([]);
  const [case1Status, setCase1Status] = useState<'Fungsi' | 'Bukan' | ''>('');
  const [case1Reason, setCase1Reason] = useState('');
  const [case1Image, setCase1Image] = useState<string>('');

  // State Jawaban Kasus 2 (Uji Pelanggaran) - Bersih / Kosong
  const [case2Arrows, setCase2Arrows] = useState<ArrowRelation[]>([]);
  const [case2Status, setCase2Status] = useState<'Fungsi' | 'Bukan' | ''>('');
  const [case2Violator, setCase2Violator] = useState('');
  const [case2Reason, setCase2Reason] = useState('');
  const [case2Image, setCase2Image] = useState<string>('');

  // State Jawaban Kasus 3 (Kreasi Mandiri Siswa) - Bersih / Kosong
  const [case3SetAName, setCase3SetAName] = useState('');
  const [case3SetBName, setCase3SetBName] = useState('');
  const [case3ItemsA, setCase3ItemsA] = useState<string[]>(['Teman 1', 'Teman 2', 'Teman 3']);
  const [case3ItemsB, setCase3ItemsB] = useState<string[]>(['Pilihan A', 'Pilihan B', 'Pilihan C']);
  const [case3Arrows, setCase3Arrows] = useState<ArrowRelation[]>([]);
  const [case3Status, setCase3Status] = useState<'Fungsi' | 'Bukan' | ''>('');
  const [case3Reason, setCase3Reason] = useState('');
  const [case3Image, setCase3Image] = useState<string>('');

  // State Uji Garis Vertikal (VLT) - Bersih / Kosong
  const [vlt1, setVlt1] = useState<'Fungsi' | 'Bukan' | ''>('');
  const [vlt2, setVlt2] = useState<'Fungsi' | 'Bukan' | ''>('');
  const [vlt3, setVlt3] = useState<'Fungsi' | 'Bukan' | ''>('');
  const [vlt4, setVlt4] = useState<'Fungsi' | 'Bukan' | ''>('');

  // State Refleksi Aturan Emas - Bersih / Kosong
  const [goldenSingle, setGoldenSingle] = useState('');
  const [goldenAffair, setGoldenAffair] = useState('');

  // State Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSubmissionId, setSubmittedSubmissionId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validasi Ketat untuk setiap langkah
  const canProceedStep0 = !!selectedStudentName.trim();
  const canProceedStep1 = case1Arrows.length >= 1 && case1Status !== '' && case1Reason.trim().length >= 5;
  const canProceedStep2 = case2Arrows.length >= 1 && case2Status !== '' && case2Violator.trim().length >= 3 && case2Reason.trim().length >= 5;
  const canProceedStep3 = case3SetAName.trim().length > 0 && case3SetBName.trim().length > 0 && case3Arrows.length >= 1 && case3Status !== '' && case3Reason.trim().length >= 5;
  const canProceedStep4 = vlt1 !== '' && vlt2 !== '' && vlt3 !== '' && vlt4 !== '' && goldenSingle.trim().length >= 5 && goldenAffair.trim().length >= 5;

  // Auto-capture sebelum pindah step jika kanvas sedang aktif
  const captureCurrentCanvasIfActive = async () => {
    if (currentStep === 1 && case1Ref.current) {
      try {
        const b64 = await case1Ref.current.exportToBase64();
        if (b64) setCase1Image(b64);
      } catch (err) {
        console.warn('Capture case1 failed:', err);
      }
    } else if (currentStep === 2 && case2Ref.current) {
      try {
        const b64 = await case2Ref.current.exportToBase64();
        if (b64) setCase2Image(b64);
      } catch (err) {
        console.warn('Capture case2 failed:', err);
      }
    } else if (currentStep === 3 && case3Ref.current) {
      try {
        const b64 = await case3Ref.current.exportToBase64();
        if (b64) setCase3Image(b64);
      } catch (err) {
        console.warn('Capture case3 failed:', err);
      }
    }
  };

  const handleStepClick = async (targetStep: number) => {
    if (targetStep > currentStep) return;
    await captureCurrentCanvasIfActive();
    setCurrentStep(targetStep);
  };

  // Navigasi aman step 1 -> step 2
  const handleProceedToStep2 = async () => {
    if (case1Ref.current) {
      try {
        const b64 = await case1Ref.current.exportToBase64();
        if (b64) setCase1Image(b64);
      } catch (err) {
        console.warn('Capture case1 failed:', err);
      }
    }
    setCurrentStep(2);
  };

  // Navigasi aman step 2 -> step 3
  const handleProceedToStep3 = async () => {
    if (case2Ref.current) {
      try {
        const b64 = await case2Ref.current.exportToBase64();
        if (b64) setCase2Image(b64);
      } catch (err) {
        console.warn('Capture case2 failed:', err);
      }
    }
    setCurrentStep(3);
  };

  // Navigasi aman step 3 -> step 4
  const handleProceedToStep4 = async () => {
    if (case3Ref.current) {
      try {
        const b64 = await case3Ref.current.exportToBase64();
        if (b64) setCase3Image(b64);
      } catch (err) {
        console.warn('Capture case3 failed:', err);
      }
    }
    setCurrentStep(4);
  };

  // Load daftar kelas dari Firestore jika ada
  useEffect(() => {
    if (!isOpen) return;

    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const colRef = collection(db, 'classes');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          const list: ClassRoster[] = snap.docs.map(d => ({
            id: d.id,
            ...(d.data() as Omit<ClassRoster, 'id'>)
          }));
          setClasses(list);
          if (list.length > 0) {
            setSelectedClassId(list[0].id);
          }
        }
      } catch (err) {
        console.warn('Menggunakan default classes karena offline atau aturan belum aktif:', err);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [isOpen]);

  if (!isOpen) return null;

  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];

  // Kirim Jawaban ke Firebase (Menyimpan seluruh teks, panah, dan 3 gambar diagram Base64)
  const handleSubmitLkpd = async () => {
    if (!selectedStudentName) {
      alert('Silakan pilih Nama Siswa Anda terlebih dahulu di Langkah 1!');
      setCurrentStep(0);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Pastikan seluruh 3 gambar diagram terambil secara sempurna
      let img1 = case1Image;
      if (!img1 && case1Ref.current) {
        img1 = await case1Ref.current.exportToBase64();
      }

      let img2 = case2Image;
      if (!img2 && case2Ref.current) {
        img2 = await case2Ref.current.exportToBase64();
      }

      let img3 = case3Image;
      if (!img3 && case3Ref.current) {
        img3 = await case3Ref.current.exportToBase64();
      }

      const submissionPayload = {
        classId: selectedClassId,
        className: currentClass.name,
        studentName: selectedStudentName,
        submittedAt: new Date().toISOString(),
        case1: {
          status: case1Status,
          reason: case1Reason,
          arrows: case1Arrows,
          imageBase64: img1 || ''
        },
        case2: {
          status: case2Status,
          violator: case2Violator,
          reason: case2Reason,
          arrows: case2Arrows,
          imageBase64: img2 || ''
        },
        case3: {
          setAName: case3SetAName,
          setBName: case3SetBName,
          elementsA: case3ItemsA,
          elementsB: case3ItemsB,
          arrows: case3Arrows,
          status: case3Status,
          reason: case3Reason,
          imageBase64: img3 || ''
        },
        vlt: {
          q1: vlt1,
          q2: vlt2,
          q3: vlt3,
          q4: vlt4
        },
        goldenRule: {
          noSingle: goldenSingle,
          noAffair: goldenAffair
        },
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'submissions'), submissionPayload);
      setSubmittedSubmissionId(docRef.id);
      setCurrentStep(5); // Pindah ke layar sukses

      // Efek konfeti selebrasi
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err: unknown) {
      console.error('Gagal mengirim pengerjaan:', err);
      const errMsg = err instanceof Error ? err.message : 'Terjadi kendala saat mengirim';
      setSubmitError(`Gagal mengirim ke server: ${errMsg}. Silakan coba klik tombol kirim sekali lagi.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto text-white">
        {/* Header Modal */}
        <div className="px-4 py-3 sm:px-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600/30 border border-brand-500/50 flex items-center justify-center text-brand-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                LKPD Digital: Relasi & Syarat Sah Fungsi
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-brand-950 border border-brand-800 text-brand-300">
                  Pertemuan 1
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Format Interaktif Tablet / Laptop · Terhubung Langsung ke Guru
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

        {/* Stepper Progress Bar */}
        <div className="bg-slate-950/50 px-4 py-2 border-b border-slate-800/80">
          <div className="flex items-center justify-between max-w-2xl mx-auto overflow-x-auto gap-1 text-[11px] font-semibold">
            {[
              { id: 0, label: '1. Identitas' },
              { id: 1, label: '2. Kasus 1' },
              { id: 2, label: '3. Kasus 2' },
              { id: 3, label: '4. Kasus 3 (Kreasi)' },
              { id: 4, label: '5. VLT & Refleksi' },
              { id: 5, label: '6. Kirim' },
            ].map(step => {
              const isLocked = step.id > currentStep;
              const isCurrent = step.id === currentStep;
              const isPassed = step.id < currentStep;

              return (
                <button
                  key={step.id}
                  type="button"
                  disabled={isLocked || (!!submittedSubmissionId && step.id !== 5)}
                  onClick={() => {
                    if (!isLocked) {
                      handleStepClick(step.id);
                    }
                  }}
                  title={isLocked ? 'Selesaikan langkah saat ini untuk membuka' : `Buka ${step.label}`}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-brand-600 text-white font-bold shadow-md shadow-brand-600/30'
                      : isPassed
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/60 cursor-pointer'
                      : 'text-slate-600 border border-slate-800/40 opacity-40 cursor-not-allowed'
                  }`}
                >
                  {isPassed && <Check className="w-3 h-3 text-emerald-400" />}
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Body Konten LKPD Stepper */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* ============================================================ */}
          {/* LANGKAH 0: IDENTITAS SISWA */}
          {/* ============================================================ */}
          {currentStep === 0 && (
            <div className="max-w-lg mx-auto py-6 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <User className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">Selamat Datang di LKPD Digital!</h3>
                <p className="text-xs text-slate-400">
                  Pilih kelas dan namamu dari daftar untuk memulai pengerjaan interaktif ini.
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl space-y-4">
                {/* Selector Kelas */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Pilih Kelas: {loadingClasses && <span className="text-[10px] text-brand-400 font-normal">(memuat data...)</span>}
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={e => {
                      setSelectedClassId(e.target.value);
                      setSelectedStudentName('');
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.students?.length || 0} Siswa)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selector Nama Siswa */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Pilih Nama Kamu:</label>
                  <select
                    value={selectedStudentName}
                    onChange={e => setSelectedStudentName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="">-- Pilih Nama Kamu --</option>
                    {currentClass.students?.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Input Manual Fallback jika nama tidak ada */}
                <div className="pt-2 border-t border-slate-800/80">
                  <p className="text-[11px] text-slate-500 mb-1">Nama kamu belum ada di daftar?</p>
                  <input
                    type="text"
                    value={selectedStudentName}
                    onChange={e => setSelectedStudentName(e.target.value)}
                    placeholder="Atau ketik nama lengkapmu di sini..."
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!canProceedStep0}
                  onClick={() => setCurrentStep(1)}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    canProceedStep0
                      ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  }`}
                >
                  <span>Mulai Kerjakan Kasus 1</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LANGKAH 1: KASUS 1 (TANTANGAN KANTIN: MANY-TO-ONE) */}
          {/* ============================================================ */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Kartu Narasi Cerita Kasus 1 */}
              <div className="bg-slate-950/90 border border-brand-500/30 rounded-2xl p-3.5 sm:p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs shrink-0">
                    #1
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      Skenario Kasir Kantin: Pesanan Standar (Many-to-One)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Baca skenario pesanan di bawah ini, lalu tarik garis panah penghubung pada diagram!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-1.5">
                    <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider block">
                      📋 Daftar Pesanan Siswa:
                    </span>
                    <ul className="space-y-1 text-slate-200 text-[11px]">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                        <span><strong>Ali</strong> memesan <strong>Bakso</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                        <span><strong>Budi</strong> memesan <strong>Mie</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                        <span><strong>Citra</strong> memesan <strong>Bakso</strong> (sama seperti Ali)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                        <span><strong>Dewi</strong> memesan <strong>Soto</strong></span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider block">
                        🔍 Fokus Penyelidikan:
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Ali dan Citra memesan makanan yang sama (Bakso). Panah dari Himpunan A bertemu di satu tujuan di Himpunan B.
                      </p>
                    </div>
                    <p className="text-brand-300 font-semibold text-[11px] pt-1 border-t border-slate-800/80">
                      Tugasmu: Tarik panah sesuai pesanan di atas, lalu tentukan apakah relasi kasir ini sah sebagai FUNGSI!
                    </p>
                  </div>
                </div>
              </div>

              {/* Kanvas Interaktif Kasus 1 */}
              <InteractiveArrowCanvas
                ref={case1Ref}
                title="Diagram Relasi: Siswa ke Menu Makanan"
                subtitle="Klik 1 nama pemesan di kiri, lalu klik menu makanannya di kanan untuk menarik panah!"
                setAName="Siswa Pemesan"
                setBName="Menu Makanan"
                itemsA={['Ali', 'Budi', 'Citra', 'Dewi']}
                itemsB={['Bakso', 'Mie', 'Soto']}
                arrows={case1Arrows}
                onChangeArrows={setCase1Arrows}
                savedImage={case1Image}
                onSaveSnapshot={setCase1Image}
              />

              {/* Form Analisis Kasus 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">
                    1. Apakah relasi ini merupakan FUNGSI?
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCase1Status('Fungsi')}
                      className={`flex-1 py-1.5 px-3 rounded-lg font-bold border transition-all ${
                        case1Status === 'Fungsi'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      ✓ FUNGSI SAH
                    </button>
                    <button
                      type="button"
                      onClick={() => setCase1Status('Bukan')}
                      className={`flex-1 py-1.5 px-3 rounded-lg font-bold border transition-all ${
                        case1Status === 'Bukan'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      ✗ BUKAN FUNGSI
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold text-slate-300 block mb-1.5">
                    2. Berikan alasan matematis kamu:
                  </label>
                  <textarea
                    rows={2}
                    value={case1Reason}
                    onChange={e => setCase1Reason(e.target.value)}
                    placeholder="Tuliskan analisismu dengan bahasamu sendiri (apakah semua siswa memesan? apakah ada yang memesan ganda?)..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Navigasi Stepper */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali
                </button>

                <div className="flex items-center gap-3">
                  {!canProceedStep1 && (
                    <span className="text-[11px] text-amber-400/90 hidden sm:inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Tarik panah relasi, pilih status Fungsi/Bukan, & isi alasan
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!canProceedStep1}
                    onClick={handleProceedToStep2}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      canProceedStep1
                        ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/30 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span>Lanjut ke Kasus 2</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LANGKAH 2: KASUS 2 (UJI PELANGGARAN) */}
          {/* ============================================================ */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Kartu Narasi Cerita Kasus 2 */}
              <div className="bg-slate-950/90 border border-rose-500/30 rounded-2xl p-3.5 sm:p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                    #2
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      Skenario Kasir Kantin: Kekacauan Pesanan (Uji Pelanggaran)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Keesokan harinya terjadi kejadian kacau di meja kasir. Hubungkan panah sesuai skenario berikut!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-1.5">
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider block">
                      ⚠️ Catatan Kejadian di Kasir:
                    </span>
                    <ul className="space-y-1 text-slate-200 text-[11px]">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                        <span><strong>Ali</strong> memesan <strong>Bakso</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse shrink-0" />
                        <span><strong>Budi</strong> memesan <strong>2 menu</strong> (<strong>Mie</strong> DAN <strong>Soto</strong>)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                        <span><strong>Citra</strong> memesan <strong>Bakso</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span><strong>Dewi</strong> hanya berdiri antre & <strong>TIDAK memesan apa pun</strong></span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider block">
                        🔍 Fokus Penyelidikan:
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Perhatikan cabang panah dari <strong>Budi</strong> (memesan 2) dan titik pada <strong>Dewi</strong> (tidak memesan makanan).
                      </p>
                    </div>
                    <p className="text-rose-300 font-semibold text-[11px] pt-1 border-t border-slate-800/80">
                      Tugasmu: Tarik panah kekacauan ini, lalu identifikasi siapa yang melanggar aturan fungsi dan mengapa!
                    </p>
                  </div>
                </div>
              </div>

              {/* Kanvas Interaktif Kasus 2 */}
              <InteractiveArrowCanvas
                ref={case2Ref}
                title="Diagram Relasi: Uji Pelanggaran Aturan Fungsi"
                subtitle="Tarik 2 panah dari Budi (Mie & Soto), panah Ali ke Bakso, Citra ke Bakso, dan biarkan Dewi tanpa panah!"
                setAName="Siswa Pemesan"
                setBName="Menu Makanan"
                itemsA={['Ali', 'Budi', 'Citra', 'Dewi']}
                itemsB={['Bakso', 'Mie', 'Soto']}
                arrows={case2Arrows}
                onChangeArrows={setCase2Arrows}
                savedImage={case2Image}
                onSaveSnapshot={setCase2Image}
              />

              {/* Form Analisis Kasus 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">
                    1. Apakah relasi ini FUNGSI?
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCase2Status('Fungsi')}
                      className={`flex-1 py-1.5 px-3 rounded-lg font-bold border transition-all ${
                        case2Status === 'Fungsi'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      ✓ FUNGSI SAH
                    </button>
                    <button
                      type="button"
                      onClick={() => setCase2Status('Bukan')}
                      className={`flex-1 py-1.5 px-3 rounded-lg font-bold border transition-all ${
                        case2Status === 'Bukan'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      ✗ BUKAN FUNGSI
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">
                    2. Siapa yang melanggar aturan?:
                  </label>
                  <input
                    type="text"
                    value={case2Violator}
                    onChange={e => setCase2Violator(e.target.value)}
                    placeholder="Sebutkan nama siswa yang membuat aturan terlanggar..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">
                    3. Alasan pelanggaran:
                  </label>
                  <input
                    type="text"
                    value={case2Reason}
                    onChange={e => setCase2Reason(e.target.value)}
                    placeholder="Jelaskan jenis pelanggarannya (mendua / jomblo)..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Navigasi Stepper */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali ke Kasus 1
                </button>

                <div className="flex items-center gap-3">
                  {!canProceedStep2 && (
                    <span className="text-[11px] text-amber-400/90 hidden sm:inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Tarik panah pelanggaran, pilih status, dan isi siapa & alasan
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!canProceedStep2}
                    onClick={handleProceedToStep3}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      canProceedStep2
                        ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/30 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span>Lanjut ke Kasus 3 (Kreasi)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LANGKAH 3: KASUS 3 ("THE CREATOR MISSION" - KREASI BEBAS) */}
          {/* ============================================================ */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Kartu Narasi Kasus 3 */}
              <div className="bg-slate-950/90 border border-brand-500/30 rounded-2xl p-3.5 sm:p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs shrink-0">
                    #3
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      Misi Kreator Mandiri: Rancang Studi Kasus Dunia Nyata Buatanmu
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Tentukan 2 himpunan dari kehidupan sehari-hari di sekitarmu, buat anggotanya, lalu tarik relasinya!
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 space-y-1">
                  <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider block">
                    💡 Ide Inspirasi Kasus Nyata:
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Contoh: <strong>Siswa ➔ Ukuran Sepatu</strong> (Fungsi), <strong>Siswa ➔ Makanan Favorit</strong> (Bisa bukan fungsi jika suka &gt; 1 menu), <strong>Negara ➔ Ibu Kota</strong>, dll.
                  </p>
                </div>
              </div>

              <InteractiveArrowCanvas
                ref={case3Ref}
                title="Kasus 3: Kreasi Mandiri (Studi Kasus Dunia Nyata Buatanmu)"
                subtitle="Kamu bebas memberi nama himpunan, menambah anggota, dan merangkai relasi sesukamu!"
                isEditableSets={true}
                setAName={case3SetAName}
                setBName={case3SetBName}
                itemsA={case3ItemsA}
                itemsB={case3ItemsB}
                arrows={case3Arrows}
                onChangeArrows={setCase3Arrows}
                onUpdateSetAName={setCase3SetAName}
                onUpdateSetBName={setCase3SetBName}
                onUpdateItemsA={setCase3ItemsA}
                onUpdateItemsB={setCase3ItemsB}
                savedImage={case3Image}
                onSaveSnapshot={setCase3Image}
              />

              {/* Form Analisis Kasus 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">
                    1. Apakah relasi buatanmu ini FUNGSI?
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCase3Status('Fungsi')}
                      className={`flex-1 py-1.5 px-3 rounded-lg font-bold border transition-all ${
                        case3Status === 'Fungsi'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      ✓ FUNGSI SAH
                    </button>
                    <button
                      type="button"
                      onClick={() => setCase3Status('Bukan')}
                      className={`flex-1 py-1.5 px-3 rounded-lg font-bold border transition-all ${
                        case3Status === 'Bukan'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      ✗ BUKAN FUNGSI
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold text-slate-300 block mb-1.5">
                    2. Mengapa relasi buatanmu itu {case3Status === 'Fungsi' ? 'Fungsi Sah' : 'Bukan Fungsi'}? Jelaskan konteks logikanya:
                  </label>
                  <textarea
                    rows={2}
                    value={case3Reason}
                    onChange={e => setCase3Reason(e.target.value)}
                    placeholder="Tuliskan analisismu secara mandiri (misal: apakah setiap anggota asal berpasangan tepat satu?)..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Navigasi Stepper */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali ke Kasus 2
                </button>

                <div className="flex items-center gap-3">
                  {!canProceedStep3 && (
                    <span className="text-[11px] text-amber-400/90 hidden sm:inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Beri nama kedua himpunan, tarik panah relasi, pilih status, & tulis alasan
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!canProceedStep3}
                    onClick={handleProceedToStep4}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      canProceedStep3
                        ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/30 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span>Lanjut ke VLT & Refleksi</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LANGKAH 4: VLT & REFLEKSI ATURAN EMAS */}
          {/* ============================================================ */}
          {currentStep === 4 && (
            <div className="space-y-5">
              {/* Bagian Uji Garis Vertikal */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-400" />
                  Bagian 4A · Uji Garis Vertikal (Vertical Line Test)
                </h4>
                <p className="text-xs text-slate-400">
                  Bayangkan garis scanner tegak memotong kurva berikut. Tentukan apakah kurva ini merupakan Fungsi atau Bukan Fungsi!
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Kurva 1 */}
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-300 block">Kurva 1: Garis Miring</span>
                    <svg viewBox="0 0 100 60" className="w-full h-16 stroke-slate-500 fill-none">
                      <line x1="10" y1="30" x2="90" y2="30" strokeWidth="0.8" strokeDasharray="2 2" />
                      <line x1="50" y1="5" x2="50" y2="55" strokeWidth="0.8" strokeDasharray="2 2" />
                      <line x1="15" y1="50" x2="85" y2="10" stroke="#38bdf8" strokeWidth="2" />
                    </svg>
                    <div className="flex gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setVlt1('Fungsi')}
                        className={`flex-1 py-1 rounded font-bold transition-all ${vlt1 === 'Fungsi' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                      >
                        Fungsi
                      </button>
                      <button
                        type="button"
                        onClick={() => setVlt1('Bukan')}
                        className={`flex-1 py-1 rounded font-bold transition-all ${vlt1 === 'Bukan' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                      >
                        Bukan
                      </button>
                    </div>
                  </div>

                  {/* Kurva 2 */}
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-300 block">Kurva 2: Parabola Rebah</span>
                    <svg viewBox="0 0 100 60" className="w-full h-16 stroke-slate-500 fill-none">
                      <line x1="10" y1="30" x2="90" y2="30" strokeWidth="0.8" strokeDasharray="2 2" />
                      <line x1="50" y1="5" x2="50" y2="55" strokeWidth="0.8" strokeDasharray="2 2" />
                      <path d="M 85,10 Q 30,30 85,50" stroke="#f43f5e" strokeWidth="2" />
                    </svg>
                    <div className="flex gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setVlt2('Fungsi')}
                        className={`flex-1 py-1 rounded font-bold transition-all ${vlt2 === 'Fungsi' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                      >
                        Fungsi
                      </button>
                      <button
                        type="button"
                        onClick={() => setVlt2('Bukan')}
                        className={`flex-1 py-1 rounded font-bold transition-all ${vlt2 === 'Bukan' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                      >
                        Bukan
                      </button>
                    </div>
                  </div>

                  {/* Kurva 3 */}
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-300 block">Kurva 3: Lingkaran</span>
                    <svg viewBox="0 0 100 60" className="w-full h-16 stroke-slate-500 fill-none">
                      <line x1="10" y1="30" x2="90" y2="30" strokeWidth="0.8" strokeDasharray="2 2" />
                      <line x1="50" y1="5" x2="50" y2="55" strokeWidth="0.8" strokeDasharray="2 2" />
                      <circle cx="50" cy="30" r="22" stroke="#f43f5e" strokeWidth="2" />
                    </svg>
                    <div className="flex gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setVlt3('Fungsi')}
                        className={`flex-1 py-1 rounded font-bold transition-all ${vlt3 === 'Fungsi' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                      >
                        Fungsi
                      </button>
                      <button
                        type="button"
                        onClick={() => setVlt3('Bukan')}
                        className={`flex-1 py-1 rounded font-bold transition-all ${vlt3 === 'Bukan' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                      >
                        Bukan
                      </button>
                    </div>
                  </div>

                  {/* Kurva 4 */}
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-300 block">Kurva 4: Parabola Tegak</span>
                    <svg viewBox="0 0 100 60" className="w-full h-16 stroke-slate-500 fill-none">
                      <line x1="10" y1="30" x2="90" y2="30" strokeWidth="0.8" strokeDasharray="2 2" />
                      <line x1="50" y1="5" x2="50" y2="55" strokeWidth="0.8" strokeDasharray="2 2" />
                      <path d="M 20,10 Q 50,55 80,10" stroke="#38bdf8" strokeWidth="2" />
                    </svg>
                    <div className="flex gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setVlt4('Fungsi')}
                        className={`flex-1 py-1 rounded font-bold transition-all ${vlt4 === 'Fungsi' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                      >
                        Fungsi
                      </button>
                      <button
                        type="button"
                        onClick={() => setVlt4('Bukan')}
                        className={`flex-1 py-1 rounded font-bold transition-all ${vlt4 === 'Bukan' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                      >
                        Bukan
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian Refleksi Aturan Emas */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Bagian 4B · Refleksi & Rumusan Aturan Emas Fungsi
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      1. Syarat pertama: <strong className="text-indigo-400">&quot;Tidak Boleh Jomblo&quot;</strong>, artinya:
                    </label>
                    <input
                      type="text"
                      value={goldenSingle}
                      onChange={e => setGoldenSingle(e.target.value)}
                      placeholder="Jelaskan artinya menurut pemahamanmu (apakah semua anggota himpunan asal wajib punya kawan?)..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500 placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      2. Syarat kedua: <strong className="text-cyan-400">&quot;Tidak Boleh Mendua / Selingkuh&quot;</strong>, artinya:
                    </label>
                    <input
                      type="text"
                      value={goldenAffair}
                      onChange={e => setGoldenAffair(e.target.value)}
                      placeholder="Jelaskan artinya menurut pemahamanmu (apakah anggota himpunan asal boleh memiliki lebih dari satu kawan?)..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500 placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Ringkasan Bukti Gambar Diagram Siswa Terkumpul */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Status Gambar Diagram Jawaban Kamu:
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Otomatis Disimpan ke Server Guru
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Card Kasus 1 */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300">Kasus 1: Skenario Kasir</span>
                      {case1Image ? (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                          ✓ Tersimpan
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-bold">
                          ⏳ Belum Ada Foto
                        </span>
                      )}
                    </div>
                    {case1Image ? (
                      <img src={case1Image} alt="Kasus 1" className="w-full h-20 object-contain bg-slate-950 rounded-lg border border-slate-800" />
                    ) : (
                      <div className="h-20 bg-slate-950 rounded-lg flex items-center justify-center text-slate-600 text-[10px]">
                        Diagram Kasus 1
                      </div>
                    )}
                    <span className="text-[10px] text-slate-400 block truncate">
                      Status: <strong className={case1Status === 'Fungsi' ? 'text-emerald-400' : 'text-rose-400'}>{case1Status || '-'}</strong>
                    </span>
                  </div>

                  {/* Card Kasus 2 */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300">Kasus 2: Pelanggaran</span>
                      {case2Image ? (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                          ✓ Tersimpan
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-bold">
                          ⏳ Belum Ada Foto
                        </span>
                      )}
                    </div>
                    {case2Image ? (
                      <img src={case2Image} alt="Kasus 2" className="w-full h-20 object-contain bg-slate-950 rounded-lg border border-slate-800" />
                    ) : (
                      <div className="h-20 bg-slate-950 rounded-lg flex items-center justify-center text-slate-600 text-[10px]">
                        Diagram Kasus 2
                      </div>
                    )}
                    <span className="text-[10px] text-slate-400 block truncate">
                      Pelanggar: <strong className="text-rose-400">{case2Violator || '-'}</strong>
                    </span>
                  </div>

                  {/* Card Kasus 3 */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300">Kasus 3: Kreasi Mandiri</span>
                      {case3Image ? (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                          ✓ Tersimpan
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-bold">
                          ⏳ Belum Ada Foto
                        </span>
                      )}
                    </div>
                    {case3Image ? (
                      <img src={case3Image} alt="Kasus 3" className="w-full h-20 object-contain bg-slate-950 rounded-lg border border-slate-800" />
                    ) : (
                      <div className="h-20 bg-slate-950 rounded-lg flex items-center justify-center text-slate-600 text-[10px]">
                        Diagram Kasus 3
                      </div>
                    )}
                    <span className="text-[10px] text-slate-400 block truncate">
                      {case3SetAName || 'Himpunan A'} ➔ {case3SetBName || 'Himpunan B'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigasi Stepper */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali ke Kasus 3
                </button>

                <div className="flex items-center gap-3">
                  {!canProceedStep4 && (
                    <span className="text-[11px] text-amber-400/90 hidden sm:inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Jawab ke-4 kurva VLT & lengkapi kedua refleksi syarat fungsi
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!canProceedStep4 || isSubmitting}
                    onClick={handleSubmitLkpd}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      canProceedStep4 && !isSubmitting
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Mengirim ke Server...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim Jawaban ke Guru</span>
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
          {/* LANGKAH 5: SELESAI & TANDA TERIMA DIGITAL */}
          {/* ============================================================ */}
          {currentStep === 5 && (
            <div className="max-w-lg mx-auto py-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Jawaban Berhasil Terkirim! 🎉</h3>
                <p className="text-xs text-slate-400">
                  Kerja bagus, <strong>{selectedStudentName}</strong>! Seluruh data pengerjaan dan diagram ciptaanmu telah tersimpan rapi di dashboard Guru.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 text-left">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Nama Siswa:</span>
                  <span className="font-bold text-white">{selectedStudentName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Kelas:</span>
                  <span className="font-bold text-brand-400">{currentClass.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">ID Pengumpulan:</span>
                  <span className="font-mono text-slate-300 text-[11px]">{submittedSubmissionId || 'TERKIRIM'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Waktu:</span>
                  <span className="font-mono text-slate-400 text-[11px]">{new Date().toLocaleTimeString()} WIB</span>
                </div>

                {/* Galeri Gambar yang Disimpan */}
                <div className="pt-1 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-300 block">
                    3 Diagram Panah yang Tersimpan:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {case1Image ? (
                      <div className="space-y-0.5 text-center">
                        <img src={case1Image} alt="Kasus 1" className="h-16 w-full object-contain rounded-lg border border-slate-800 bg-slate-900" />
                        <span className="text-[10px] text-slate-400">Kasus 1</span>
                      </div>
                    ) : null}
                    {case2Image ? (
                      <div className="space-y-0.5 text-center">
                        <img src={case2Image} alt="Kasus 2" className="h-16 w-full object-contain rounded-lg border border-slate-800 bg-slate-900" />
                        <span className="text-[10px] text-slate-400">Kasus 2</span>
                      </div>
                    ) : null}
                    {case3Image ? (
                      <div className="space-y-0.5 text-center">
                        <img src={case3Image} alt="Kasus 3" className="h-16 w-full object-contain rounded-lg border border-slate-800 bg-slate-900" />
                        <span className="text-[10px] text-slate-400">Kasus 3</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                >
                  Kembali ke Slide Utama
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
