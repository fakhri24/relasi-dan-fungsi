import React, { useState, useEffect } from 'react';
import { 
  X, LogOut, CheckCircle2, AlertCircle, FileSpreadsheet, 
  Tv, Eye, Award, Users, Plus, Save, RefreshCw, KeyRound
} from 'lucide-react';
import { 
  signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, getDocs, doc, updateDoc, setDoc
} from 'firebase/firestore';
import { auth, db, googleProvider, TEACHER_WHITELIST } from '../../lib/firebase';
import { ClassRoster, LkpdSubmission } from '../../types/lkpd';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Master PIN darurat untuk guru
const TEACHER_MASTER_PIN = '246810';

export const TeacherDashboard: React.FC<Props> = ({ isOpen, onClose }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isPinAuthenticated, setIsPinAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab: 'submissions' | 'roster'
  const [activeTab, setActiveTab] = useState<'submissions' | 'roster'>('submissions');

  // Data state
  const [classes, setClasses] = useState<ClassRoster[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [submissions, setSubmissions] = useState<LkpdSubmission[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Selected Submission for Review Modal
  const [selectedSub, setSelectedSub] = useState<LkpdSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number | ''>('');
  const [gradeFeedback, setGradeFeedback] = useState<string>('');
  const [isSavingGrade, setIsSavingGrade] = useState(false);

  // Showcase Modal State (untuk menampilkan karya siswa di proyektor)
  const [showcaseSub, setShowcaseSub] = useState<LkpdSubmission | null>(null);

  // Roster Management State
  const [newClassName, setNewClassName] = useState('');
  const [bulkStudentText, setBulkStudentText] = useState('');
  const [isSavingRoster, setIsSavingRoster] = useState(false);

  // Filter Search
  const [searchTerm, setSearchTerm] = useState('');

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Cek whitelist email
        if (user.email && TEACHER_WHITELIST.includes(user.email)) {
          setCurrentUser(user);
          setAuthError(null);
        } else {
          signOut(auth);
          setAuthError(`Akses ditolak: Email ${user.email} bukan akun guru terdaftar.`);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const isTeacherAuthed = !!currentUser || isPinAuthenticated;

  // Fetch Classes & Submissions saat auth sukses
  const fetchData = async () => {
    if (!isTeacherAuthed) return;
    try {
      setLoadingData(true);

      // 1. Fetch Classes
      const classesSnap = await getDocs(collection(db, 'classes'));
      let classList: ClassRoster[] = [];
      if (!classesSnap.empty) {
        classList = classesSnap.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<ClassRoster, 'id'>)
        }));
      } else {
        // Inisialisasi default classes ke Firestore jika masih kosong
        const defaultClass1: ClassRoster = {
          id: 'kelas-x-1',
          name: 'X-1 (Fase E)',
          createdAt: new Date().toISOString(),
          students: [
            'Ahmad Fauzi', 'Anisa Rahmawati', 'Bagus Pratama', 'Budi Santoso', 
            'Citra Kirana', 'Dewi Lestari', 'Dimas Anggara', 'Fajar Ramadhan',
            'Fitri Handayani', 'Gilang Perkasa', 'Hana Safitri', 'Indah Permata',
            'Joko Susilo', 'Kevin Sanjaya', 'Lestari Ayu', 'Muhammad Rizky'
          ]
        };
        await setDoc(doc(db, 'classes', defaultClass1.id), defaultClass1);
        classList = [defaultClass1];
      }

      setClasses(classList);
      if (classList.length > 0 && !selectedClassId) {
        setSelectedClassId(classList[0].id);
      }

      // 2. Fetch Submissions
      const subSnap = await getDocs(collection(db, 'submissions'));
      const subList: LkpdSubmission[] = subSnap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<LkpdSubmission, 'id'>)
      }));
      setSubmissions(subList);

    } catch (err: unknown) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isOpen && isTeacherAuthed) {
      fetchData();
    }
  }, [isOpen, isTeacherAuthed]);

  if (!isOpen) return null;

  // Handle Google Sign In
  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setAuthError(null);
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user.email && !TEACHER_WHITELIST.includes(res.user.email)) {
        await signOut(auth);
        setAuthError(`Akses Ditolak: Email ${res.user.email} tidak terdaftar sebagai guru.`);
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      const msg = err instanceof Error ? err.message : 'Login gagal';
      setAuthError(`Kendala Google Login: ${msg}. Anda dapat menggunakan Master PIN di bawah.`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle PIN Login (Fallback jika popup Google terblokir)
  const handlePinLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === TEACHER_MASTER_PIN) {
      setIsPinAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Master PIN salah. Silakan coba lagi.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsPinAuthenticated(false);
    setCurrentUser(null);
  };

  // Filter Submissions berdasarkan kelas yang dipilih
  const currentClass = classes.find(c => c.id === selectedClassId);
  const classSubmissions = submissions.filter(s => s.classId === selectedClassId);

  // Buat mapping pengerjaan per siswa di kelas aktif
  const studentRosterWithSubmissions = (currentClass?.students || []).map(studentName => {
    const sub = classSubmissions.find(s => s.studentName.toLowerCase().trim() === studentName.toLowerCase().trim());
    return {
      studentName,
      submission: sub || null,
      isSubmitted: !!sub
    };
  });

  const filteredStudents = studentRosterWithSubmissions.filter(item => 
    item.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSubmitted = studentRosterWithSubmissions.filter(s => s.isSubmitted).length;
  const totalStudents = studentRosterWithSubmissions.length;

  // Buka Modal Review untuk satu siswa
  const handleOpenReview = (sub: LkpdSubmission) => {
    setSelectedSub(sub);
    setGradeScore(sub.score ?? '');
    setGradeFeedback(sub.teacherFeedback ?? '');
  };

  // Simpan Nilai & Feedback ke Firestore
  const handleSaveGrade = async () => {
    if (!selectedSub || !selectedSub.id) return;
    try {
      setIsSavingGrade(true);
      const subRef = doc(db, 'submissions', selectedSub.id);
      const updateData = {
        score: gradeScore === '' ? null : Number(gradeScore),
        teacherFeedback: gradeFeedback,
        gradedAt: new Date().toISOString()
      };
      await updateDoc(subRef, updateData);

      // Perbarui local state
      setSubmissions(prev => prev.map(s => s.id === selectedSub.id ? { ...s, ...updateData } : s));
      setSelectedSub(prev => prev ? { ...prev, ...updateData } : null);
      alert('Nilai dan catatan guru berhasil disimpan!');
    } catch (err) {
      console.error('Gagal simpan nilai:', err);
      alert('Terjadi kesalahan saat menyimpan nilai.');
    } finally {
      setIsSavingGrade(false);
    }
  };

  // Ekspor Nilai ke File CSV
  const handleExportCsv = () => {
    if (!currentClass) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'No,Nama Siswa,Kelas,Status,Nilai,Catatan Guru,Waktu Pengumpulan\n';

    studentRosterWithSubmissions.forEach((item, idx) => {
      const status = item.isSubmitted ? 'Sudah Mengumpulkan' : 'Belum';
      const score = item.submission?.score ?? '-';
      const feedback = item.submission?.teacherFeedback ? `"${item.submission.teacherFeedback.replace(/"/g, '""')}"` : '-';
      const time = item.submission?.submittedAt ? new Date(item.submission.submittedAt).toLocaleString() : '-';
      csvContent += `${idx + 1},"${item.studentName}","${currentClass.name}","${status}",${score},${feedback},"${time}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_LKPD_${currentClass.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Tambah Kelas Baru
  const handleCreateClass = async () => {
    const name = newClassName.trim();
    if (!name) return;
    try {
      setIsSavingRoster(true);
      const newId = `kelas-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const newClassDoc: ClassRoster = {
        id: newId,
        name,
        students: [],
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'classes', newId), newClassDoc);
      setClasses(prev => [...prev, newClassDoc]);
      setSelectedClassId(newId);
      setNewClassName('');
    } catch (err) {
      console.error('Gagal tambah kelas:', err);
    } finally {
      setIsSavingRoster(false);
    }
  };

  // Simpan Bulk Students (dari paste Excel)
  const handleSaveBulkStudents = async () => {
    if (!selectedClassId) return;
    try {
      setIsSavingRoster(true);
      const lines = bulkStudentText
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);

      if (lines.length === 0) return;

      const classRef = doc(db, 'classes', selectedClassId);
      await updateDoc(classRef, {
        students: lines
      });

      setClasses(prev => prev.map(c => c.id === selectedClassId ? { ...c, students: lines } : c));
      setBulkStudentText('');
      alert(`Berhasil menyimpan ${lines.length} nama siswa ke kelas ${currentClass?.name}!`);
    } catch (err) {
      console.error('Gagal update siswa:', err);
    } finally {
      setIsSavingRoster(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto text-white">
        {/* Header Dashboard */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                Dashboard Guru: Evaluasi LKPD Digital
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-300">
                  Panel Guru
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Monitoring Hasil Diagram Panah Siswa · Real-time Cloud Firestore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isTeacherAuthed && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Keluar dari Panel Guru"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              title="Tutup Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* LAYAR LOGIN GURU (JIKA BELUM TERAUTENTIKASI) */}
        {/* ============================================================ */}
        {!isTeacherAuthed ? (
          <div className="p-8 max-w-md mx-auto my-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <KeyRound className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Login Khusus Guru</h3>
              <p className="text-xs text-slate-400">
                Masuk menggunakan akun Google <strong>fkhr2nd@gmail.com</strong> untuk mengakses daftar pengerjaan siswa.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="button"
              disabled={isLoggingIn}
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isLoggingIn ? 'Menghubungkan...' : 'Masuk dengan Google (fkhr2nd@gmail.com)'}</span>
            </button>

            {/* Opsi Master PIN Fallback */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[11px] text-slate-500">Atau masuk menggunakan Master PIN:</span>
              <form onSubmit={handlePinLogin} className="flex gap-2">
                <input
                  type="password"
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  placeholder="Ketik 6 digit PIN guru..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-center tracking-widest focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold"
                >
                  Masuk
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* DASHBOARD UTAMA GURU */
          /* ============================================================ */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Sub-Header & Selector Kelas */}
            <div className="bg-slate-950/60 border-b border-slate-800 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Kelas Aktif:</span>
                <select
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.students?.length || 0} Siswa)
                    </option>
                  ))}
                </select>
                <button
                  onClick={fetchData}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Tab Selector: Pengerjaan vs Roster */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'submissions'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monitoring & Nilai
                </button>
                <button
                  onClick={() => setActiveTab('roster')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'roster'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kelola Kelas & Siswa
                </button>
              </div>
            </div>

            {/* ============================================================ */}
            {/* TAB 1: MONITORING & PENILAIAN SISWA */}
            {/* ============================================================ */}
            {activeTab === 'submissions' && (
              <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-5 space-y-4">
                {/* Statistik Cepat */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl">
                    <span className="text-slate-400 block text-[11px]">Total Siswa Terdaftar</span>
                    <span className="text-xl font-black text-white">{totalStudents}</span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl">
                    <span className="text-slate-400 block text-[11px]">Sudah Mengumpulkan</span>
                    <span className="text-xl font-black text-emerald-400">
                      {totalSubmitted} <span className="text-xs text-slate-500 font-normal">({Math.round((totalSubmitted / Math.max(1, totalStudents)) * 100)}%)</span>
                    </span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl">
                    <span className="text-slate-400 block text-[11px]">Belum Mengumpulkan</span>
                    <span className="text-xl font-black text-amber-400">{totalStudents - totalSubmitted}</span>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      onClick={handleExportCsv}
                      className="w-full h-full py-2 px-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Ekspor Excel (.csv)</span>
                    </button>
                  </div>
                </div>

                {/* Filter Search */}
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Cari nama siswa di kelas ini..."
                    className="max-w-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-slate-500">
                    Menampilkan {filteredStudents.length} siswa
                  </span>
                </div>

                {/* Tabel / Grid Siswa */}
                <div className="flex-1 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/40">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-950 sticky top-0 border-b border-slate-800 text-slate-400 text-[11px]">
                      <tr>
                        <th className="p-3 w-12 text-center">No</th>
                        <th className="p-3">Nama Siswa</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Waktu Submit</th>
                        <th className="p-3 text-center">Nilai Skor</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredStudents.map((item, idx) => (
                        <tr key={item.studentName} className="hover:bg-slate-900/60 transition-colors">
                          <td className="p-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                          <td className="p-3 font-semibold text-white">
                            {item.studentName}
                          </td>
                          <td className="p-3">
                            {item.isSubmitted ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold text-[10px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                Sudah Masuk
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-500 text-[10px]">
                                Belum
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-400 font-mono text-[11px]">
                            {item.submission?.submittedAt 
                              ? new Date(item.submission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : '-'}
                          </td>
                          <td className="p-3 text-center font-bold">
                            {item.submission?.score !== undefined && item.submission?.score !== null ? (
                              <span className="px-2 py-0.5 rounded-lg bg-indigo-950/80 border border-indigo-700 text-indigo-300">
                                {item.submission.score} / 100
                              </span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {item.isSubmitted && item.submission && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setShowcaseSub(item.submission)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 border border-slate-700 transition-all"
                                  title="Tampilkan Karya ke Layar Proyektor"
                                >
                                  <Tv className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenReview(item.submission!)}
                                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Review & Nilai</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 2: KELOLA ROSTER KELAS & SISWA */}
            {/* ============================================================ */}
            {activeTab === 'roster' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
                {/* Tambah Kelas Baru */}
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-400" />
                    Tambah Kelas Baru
                  </h4>
                  <div className="flex gap-2 max-w-md">
                    <input
                      type="text"
                      value={newClassName}
                      onChange={e => setNewClassName(e.target.value)}
                      placeholder="Nama Kelas (contoh: X-3, X-E2)..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      disabled={isSavingRoster}
                      onClick={handleCreateClass}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Buat Kelas
                    </button>
                  </div>
                </div>

                {/* Bulk Paste Siswa untuk Kelas Aktif */}
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-400" />
                        Daftar Siswa untuk {currentClass?.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Copy-paste daftar nama siswa dari Microsoft Excel atau Lembar Absensi (1 baris untuk 1 nama).
                      </p>
                    </div>
                    <span className="text-xs text-indigo-400 font-bold">
                      Saat ini: {currentClass?.students?.length || 0} Siswa
                    </span>
                  </div>

                  <textarea
                    rows={8}
                    value={bulkStudentText}
                    onChange={e => setBulkStudentText(e.target.value)}
                    placeholder={`Contoh format:\nAhmad Fauzi\nCitra Kirana\nBagus Pratama\nDewi Lestari`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      disabled={isSavingRoster || !bulkStudentText.trim()}
                      onClick={handleSaveBulkStudents}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Daftar Siswa ke Firebase</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL REVIEW DETAIL JAWABAN & FORM NILAI SISWA */}
        {/* ============================================================ */}
        {selectedSub && (
          <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white my-auto">
              {/* Header Modal Review */}
              <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Pengerjaan: <span className="text-amber-400">{selectedSub.studentName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {selectedSub.className}
                    </span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Dikirim: {new Date(selectedSub.submittedAt).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Konten Review: 3 Diagram & Form Nilai */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
                {/* 3 Diagram Preview Grid */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                    Hasil Visual Diagram Panah Siswa:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Kasus 1 */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                      <span className="font-bold text-indigo-400 block">Kasus 1: Pesanan Standar</span>
                      {selectedSub.case1?.imageBase64 ? (
                        <img 
                          src={selectedSub.case1.imageBase64} 
                          alt="Diagram Kasus 1" 
                          className="w-full rounded-lg border border-slate-800"
                        />
                      ) : (
                        <div className="h-28 bg-slate-900 rounded-lg flex items-center justify-center text-slate-600">
                          Tidak ada snapshot
                        </div>
                      )}
                      <div className="pt-1">
                        <span className="font-bold text-slate-400">Status: </span>
                        <span className={selectedSub.case1?.status === 'Fungsi' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {selectedSub.case1?.status}
                        </span>
                        <p className="text-slate-300 mt-1 italic">&quot;{selectedSub.case1?.reason}&quot;</p>
                      </div>
                    </div>

                    {/* Kasus 2 */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                      <span className="font-bold text-rose-400 block">Kasus 2: Pelanggaran</span>
                      {selectedSub.case2?.imageBase64 ? (
                        <img 
                          src={selectedSub.case2.imageBase64} 
                          alt="Diagram Kasus 2" 
                          className="w-full rounded-lg border border-slate-800"
                        />
                      ) : (
                        <div className="h-28 bg-slate-900 rounded-lg flex items-center justify-center text-slate-600">
                          Tidak ada snapshot
                        </div>
                      )}
                      <div className="pt-1">
                        <span className="font-bold text-slate-400">Status: </span>
                        <span className={selectedSub.case2?.status === 'Fungsi' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {selectedSub.case2?.status}
                        </span>
                        <p className="text-slate-300 mt-1 italic">&quot;{selectedSub.case2?.violator} - {selectedSub.case2?.reason}&quot;</p>
                      </div>
                    </div>

                    {/* Kasus 3 (Kreasi Mandiri) */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                      <span className="font-bold text-cyan-400 block">
                        Kasus 3: {selectedSub.case3?.setAName} ➔ {selectedSub.case3?.setBName}
                      </span>
                      {selectedSub.case3?.imageBase64 ? (
                        <img 
                          src={selectedSub.case3.imageBase64} 
                          alt="Diagram Kasus 3" 
                          className="w-full rounded-lg border border-slate-800"
                        />
                      ) : (
                        <div className="h-28 bg-slate-900 rounded-lg flex items-center justify-center text-slate-600">
                          Tidak ada snapshot
                        </div>
                      )}
                      <div className="pt-1">
                        <span className="font-bold text-slate-400">Status: </span>
                        <span className={selectedSub.case3?.status === 'Fungsi' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {selectedSub.case3?.status}
                        </span>
                        <p className="text-slate-300 mt-1 italic">&quot;{selectedSub.case3?.reason}&quot;</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VLT & Refleksi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-400 block mb-1">Jawaban Uji Garis Vertikal (VLT):</span>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">K1: {selectedSub.vlt?.q1 || '-'}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">K2: {selectedSub.vlt?.q2 || '-'}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">K3: {selectedSub.vlt?.q3 || '-'}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">K4: {selectedSub.vlt?.q4 || '-'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block mb-1">Refleksi Aturan Emas Siswa:</span>
                    <p className="text-slate-300">
                      • <strong>Jomblo:</strong> {selectedSub.goldenRule?.noSingle || '-'}<br />
                      • <strong>Mendua:</strong> {selectedSub.goldenRule?.noAffair || '-'}
                    </p>
                  </div>
                </div>

                {/* Form Grading & Feedback Guru */}
                <div className="p-4 bg-amber-950/30 border border-amber-800/80 rounded-2xl space-y-3">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Award className="w-4 h-4" />
                    Penilaian Guru & Feedback:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Nilai Skor (0 - 100):</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gradeScore}
                        onChange={e => setGradeScore(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Contoh: 95"
                        className="w-full bg-slate-900 border border-amber-600/50 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-300 block mb-1">Catatan Guru / Feedback:</label>
                      <input
                        type="text"
                        value={gradeFeedback}
                        onChange={e => setGradeFeedback(e.target.value)}
                        placeholder="Contoh: Kasus mandirinya sangat kreatif dan logikanya tepat!"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Modal Review */}
              <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => setShowcaseSub(selectedSub)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-bold flex items-center gap-1.5"
                >
                  <Tv className="w-4 h-4" />
                  <span>Mode Showcase Proyektor</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSub(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    disabled={isSavingGrade}
                    onClick={handleSaveGrade}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/30 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingGrade ? 'Menyimpan...' : 'Simpan Nilai'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL SHOWCASE PROYEKTOR (TAMPILKAN KARYA KE KELAS) */}
        {/* ============================================================ */}
        {showcaseSub && (
          <div className="fixed inset-0 z-70 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-slate-900 border border-indigo-500/50 rounded-3xl p-6 shadow-2xl relative space-y-4">
              <button
                onClick={() => setShowcaseSub(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <span className="text-xs uppercase tracking-widest font-mono text-indigo-400 font-bold">
                  🌟 Karya Pilihan Siswa · Diskusi Kelas
                </span>
                <h2 className="text-2xl font-black text-white">
                  {showcaseSub.studentName} ({showcaseSub.className})
                </h2>
              </div>

              {/* Tampilkan Diagram Kasus 3 (Kreasi Mandiri) Siswa */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-cyan-400">
                    Kasus Kreasi: {showcaseSub.case3?.setAName} ➔ {showcaseSub.case3?.setBName}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    showcaseSub.case3?.status === 'Fungsi' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'
                  }`}>
                    {showcaseSub.case3?.status === 'Fungsi' ? '✓ FUNGSI SAH' : '✗ BUKAN FUNGSI'}
                  </span>
                </div>

                {showcaseSub.case3?.imageBase64 && (
                  <img
                    src={showcaseSub.case3.imageBase64}
                    alt="Diagram Showcase"
                    className="w-full max-h-[380px] object-contain rounded-xl border border-slate-800 bg-slate-900"
                  />
                )}

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-sm">
                  <span className="text-slate-400 font-semibold">Argumen Matematis Siswa:</span>
                  <p className="text-white mt-1 italic text-base">
                    &quot;{showcaseSub.case3?.reason}&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
