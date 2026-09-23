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

  // State Jawaban Kasus 1 (Pesanan Kantin Many-to-One)
  const [case1Arrows, setCase1Arrows] = useState<ArrowRelation[]>([
    { from: 'Ali', to: 'Bakso' },
    { from: 'Budi', to: 'Mie' },
    { from: 'Citra', to: 'Bakso' },
    { from: 'Dewi', to: 'Soto' }
  ]);
  const [case1Status, setCase1Status] = useState<'Fungsi' | 'Bukan'>('Fungsi');
  const [case1Reason, setCase1Reason] = useState('Semua siswa (A) memesan tepat satu menu, meskipun Ali dan Citra sama-sama memilih Bakso.');

  // State Jawaban Kasus 2 (Uji Pelanggaran)
  const [case2Arrows, setCase2Arrows] = useState<ArrowRelation[]>([
    { from: 'Ali', to: 'Bakso' },
    { from: 'Budi', to: 'Mie' },
    { from: 'Budi', to: 'Soto' }, // Budi mendua
    { from: 'Citra', to: 'Bakso' }
    // Dewi jomblo (tidak pesan)
  ]);
  const [case2Status, setCase2Status] = useState<'Fungsi' | 'Bukan'>('Bukan');
  const [case2Violator, setCase2Violator] = useState('Budi (memesan 2 menu) dan Dewi (tidak memesan makanan)');
  const [case2Reason, setCase2Reason] = useState('Budi bercabang (mendua) dan Dewi tidak memiliki pasangan di Kodomain.');

  // State Jawaban Kasus 3 (Kreasi Mandiri Siswa)
  const [case3SetAName, setCase3SetAName] = useState('Nama Siswa');
  const [case3SetBName, setCase3SetBName] = useState('Ukuran Sepatu');
  const [case3ItemsA, setCase3ItemsA] = useState<string[]>(['Fauzi', 'Kirana', 'Bagus', 'Dewi']);
  const [case3ItemsB, setCase3ItemsB] = useState<string[]>(['38', '39', '40', '41']);
  const [case3Arrows, setCase3Arrows] = useState<ArrowRelation[]>([
    { from: 'Fauzi', to: '40' },
    { from: 'Kirana', to: '38' },
    { from: 'Bagus', to: '41' },
    { from: 'Dewi', to: '39' }
  ]);
  const [case3Status, setCase3Status] = useState<'Fungsi' | 'Bukan'>('Fungsi');
  const [case3Reason, setCase3Reason] = useState('Setiap siswa pasti memiliki tepat 1 ukuran sepatu yang pas di kakinya.');

  // State Uji Garis Vertikal (VLT)
  const [vlt1, setVlt1] = useState<'Fungsi' | 'Bukan' | ''>('Fungsi');
  const [vlt2, setVlt2] = useState<'Fungsi' | 'Bukan' | ''>('Bukan');
  const [vlt3, setVlt3] = useState<'Fungsi' | 'Bukan' | ''>('Bukan');
  const [vlt4, setVlt4] = useState<'Fungsi' | 'Bukan' | ''>('Fungsi');

  // State Refleksi Aturan Emas
  const [goldenSingle, setGoldenSingle] = useState('Semua anggota himpunan asal (domain) wajib memiliki pasangan, tidak boleh kosong.');
  const [goldenAffair, setGoldenAffair] = useState('Setiap anggota himpunan asal hanya boleh memilih satu tujuan, tidak boleh bercabang.');

  // State Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSubmissionId, setSubmittedSubmissionId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  // Kirim Jawaban ke Firebase
  const handleSubmitLkpd = async () => {
    if (!selectedStudentName) {
      alert('Silakan pilih Nama Siswa Anda terlebih dahulu di Langkah 1!');
      setCurrentStep(0);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Ekspor Base64 dari ketiga kanvas
      const [img1, img2, img3] = await Promise.all([
        case1Ref.current ? case1Ref.current.exportToBase64() : Promise.resolve(''),
        case2Ref.current ? case2Ref.current.exportToBase64() : Promise.resolve(''),
        case3Ref.current ? case3Ref.current.exportToBase64() : Promise.resolve('')
      ]);

      const submissionPayload = {
        classId: selectedClassId,
        className: currentClass.name,
        studentName: selectedStudentName,
        submittedAt: new Date().toISOString(),
        case1: {
          status: case1Status,
          reason: case1Reason,
          arrows: case1Arrows,
          imageBase64: img1
        },
        case2: {
          status: case2Status,
          violator: case2Violator,
          reason: case2Reason,
          arrows: case2Arrows,
          imageBase64: img2
        },
        case3: {
          setAName: case3SetAName,
          setBName: case3SetBName,
          elementsA: case3ItemsA,
          elementsB: case3ItemsB,
          arrows: case3Arrows,
          status: case3Status,
          reason: case3Reason,
          imageBase64: img3
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
            ].map(step => (
              <button
                key={step.id}
                onClick={() => {
                  if (submittedSubmissionId && step.id !== 5) return;
                  if (step.id > 0 && !selectedStudentName) {
                    alert('Silakan pilih nama siswa terlebih dahulu!');
                    return;
                  }
                  setCurrentStep(step.id);
                }}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  currentStep === step.id
                    ? 'bg-brand-600 text-white font-bold shadow-md shadow-brand-600/30'
                    : currentStep > step.id
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {currentStep > step.id && <Check className="w-3 h-3 text-emerald-400" />}
                <span>{step.label}</span>
              </button>
            ))}
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
                  disabled={!selectedStudentName}
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all"
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
              <InteractiveArrowCanvas
                ref={case1Ref}
                title="Kasus 1: Pesanan Standar Kantin (Many-to-One)"
                subtitle="Ali, Budi, Citra, dan Dewi memesan jajanan di kantin. Hubungkan panah relasi sesuai pesanan mereka!"
                setAName="Siswa Pemesan"
                setBName="Menu Makanan"
                itemsA={['Ali', 'Budi', 'Citra', 'Dewi']}
                itemsB={['Bakso', 'Mie', 'Soto']}
                arrows={case1Arrows}
                onChangeArrows={setCase1Arrows}
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
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      ✓ FUNGSI SAH
                    </button>
                    <button
                      type="button"
                      onClick={() => setCase1Status('Bukan')}
                      className={`flex-1 py-1.5 px-3 rounded-lg font-bold border transition-all ${
                        case1Status === 'Bukan'
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
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
                    placeholder="Jelaskan mengapa kondisi di atas sah/tidak sah sebagai fungsi..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Navigasi Stepper */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/30"
                >
                  Lanjut ke Kasus 2 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LANGKAH 2: KASUS 2 (UJI PELANGGARAN) */}
          {/* ============================================================ */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <InteractiveArrowCanvas
                ref={case2Ref}
                title="Kasus 2: Skenario Pelanggaran Aturan Fungsi"
                subtitle="Coba buat skenario di mana seorang siswa memesan 2 menu makanan (mendua) atau ada yang tidak memesan (jomblo)!"
                setAName="Siswa Pemesan"
                setBName="Menu Makanan"
                itemsA={['Ali', 'Budi', 'Citra', 'Dewi']}
                itemsB={['Bakso', 'Mie', 'Soto']}
                arrows={case2Arrows}
                onChangeArrows={setCase2Arrows}
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
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      ✓ FUNGSI SAH
                    </button>
                    <button
                      type="button"
                      onClick={() => setCase2Status('Bukan')}
                      className={`flex-1 py-1.5 px-3 rounded-lg font-bold border transition-all ${
                        case2Status === 'Bukan'
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
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
                    placeholder="Contoh: Budi karena pesan 2 kali..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500"
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
                    placeholder="Alasan matematis..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500"
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
                  <ChevronLeft className="w-4 h-4" /> Kembali ke Kasus 1
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/30"
                >
                  Lanjut ke Kasus 3 (Kreasi Sendiri) <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LANGKAH 3: KASUS 3 ("THE CREATOR MISSION" - KREASI BEBAS) */}
          {/* ============================================================ */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-brand-950/40 border border-brand-800/80 rounded-xl p-3 text-xs flex items-center gap-2 text-brand-200">
                <Sparkles className="w-5 h-5 text-brand-400 shrink-0" />
                <div>
                  <span className="font-bold">Misi Arsitek Matematika:</span> Buatlah satu contoh relasi dari kehidupan nyata di sekitarmu! Tentukan nama Himpunan A & B, masukkan anggotanya, dan tentukan apakah relasi ciptaanmu adalah Fungsi atau Bukan Fungsi!
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
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      ✓ FUNGSI SAH
                    </button>
                    <button
                      type="button"
                      onClick={() => setCase3Status('Bukan')}
                      className={`flex-1 py-1.5 px-3 rounded-lg font-bold border transition-all ${
                        case3Status === 'Bukan'
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
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
                    placeholder="Contoh: Setiap orang pasti hanya punya 1 tanggal lahir..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Navigasi Stepper */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali ke Kasus 2
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/30"
                >
                  Lanjut ke VLT & Refleksi <ChevronRight className="w-4 h-4" />
                </button>
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
                        className={`flex-1 py-1 rounded font-bold ${vlt1 === 'Fungsi' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                      >
                        Fungsi
                      </button>
                      <button
                        type="button"
                        onClick={() => setVlt1('Bukan')}
                        className={`flex-1 py-1 rounded font-bold ${vlt1 === 'Bukan' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}
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
                        className={`flex-1 py-1 rounded font-bold ${vlt2 === 'Fungsi' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                      >
                        Fungsi
                      </button>
                      <button
                        type="button"
                        onClick={() => setVlt2('Bukan')}
                        className={`flex-1 py-1 rounded font-bold ${vlt2 === 'Bukan' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}
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
                        className={`flex-1 py-1 rounded font-bold ${vlt3 === 'Fungsi' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                      >
                        Fungsi
                      </button>
                      <button
                        type="button"
                        onClick={() => setVlt3('Bukan')}
                        className={`flex-1 py-1 rounded font-bold ${vlt3 === 'Bukan' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}
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
                        className={`flex-1 py-1 rounded font-bold ${vlt4 === 'Fungsi' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                      >
                        Fungsi
                      </button>
                      <button
                        type="button"
                        onClick={() => setVlt4('Bukan')}
                        className={`flex-1 py-1 rounded font-bold ${vlt4 === 'Bukan' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}
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
                      placeholder="Jelaskan dengan bahasamu..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500"
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
                      placeholder="Jelaskan dengan bahasamu..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Navigasi Stepper */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali ke Kasus 3
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitLkpd}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
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
            <div className="max-w-lg mx-auto py-8 text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Jawaban Berhasil Terkirim! 🎉</h3>
                <p className="text-xs text-slate-400">
                  Kerja bagus, <strong>{selectedStudentName}</strong>! Data pengerjaan dan diagram ciptaanmu telah tersimpan rapi di dashboard Guru.
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
                <div className="flex justify-between">
                  <span className="text-slate-400">Waktu:</span>
                  <span className="font-mono text-slate-400 text-[11px]">{new Date().toLocaleTimeString()} WIB</span>
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
