import React, { useState, useEffect } from 'react';
import { 
  X, LogOut, CheckCircle2, AlertCircle, FileSpreadsheet, 
  Tv, Eye, Award, Users, Plus, Save, RefreshCw, KeyRound,
  Trash2, ZoomIn, Download, Sparkles, TrendingUp
} from 'lucide-react';
import { 
  signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, getDocs, doc, updateDoc, setDoc, deleteDoc
} from 'firebase/firestore';
import { auth, db, googleProvider, TEACHER_WHITELIST } from '../../lib/firebase';
import { resolveDiagramSrc } from '../../lib/uploadDiagram';
import { DiagramReconstruct } from './DiagramReconstruct';
import { InteractiveLinearPlotCanvas } from '../lkpd/InteractiveLinearPlotCanvas';
import { ClassRoster, LkpdSubmission, Lkpd2Submission, AnyLkpdSubmission } from '../../types/lkpd';

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

  // Active Meeting Tab: 1 (Pertemuan 1: Relasi & VLT) | 2 (Pertemuan 2: Batasan & Linear)
  const [activeMeetingTab, setActiveMeetingTab] = useState<1 | 2>(1);

  // Active Tab: 'submissions' | 'roster'
  const [activeTab, setActiveTab] = useState<'submissions' | 'roster'>('submissions');

  // Data state
  const [classes, setClasses] = useState<ClassRoster[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [submissions, setSubmissions] = useState<AnyLkpdSubmission[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Selected Submission for Review Modal
  const [selectedSub, setSelectedSub] = useState<AnyLkpdSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number | ''>('');
  const [gradeFeedback, setGradeFeedback] = useState<string>('');
  const [isSavingGrade, setIsSavingGrade] = useState(false);

  // Showcase Modal State (untuk menampilkan karya siswa di proyektor)
  const [showcaseSub, setShowcaseSub] = useState<AnyLkpdSubmission | null>(null);
  const [showcaseCase, setShowcaseCase] = useState<1 | 2 | 3>(3);

  // Zoom Lightbox Modal
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string; subtitle?: string } | null>(null);

  // Status Filter: 'all' | 'needs_grade' | 'graded' | 'unsubmitted'
  const [filterStatus, setFilterStatus] = useState<'all' | 'needs_grade' | 'graded' | 'unsubmitted'>('all');

  // Deletion state
  const [isClearingSubmissions, setIsClearingSubmissions] = useState(false);

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

  // Type helpers untuk membedakan P1 vs P2
  const selectedP1 = selectedSub && ((selectedSub as any).meeting || 1) === 1 ? (selectedSub as LkpdSubmission) : null;
  const selectedP2 = selectedSub && (selectedSub as any).meeting === 2 ? (selectedSub as Lkpd2Submission) : null;

  const reviewImg1 = selectedP1 ? resolveDiagramSrc(selectedP1.case1) : null;
  const reviewImg2 = selectedP1 ? resolveDiagramSrc(selectedP1.case2) : null;
  const reviewImg3 = selectedP1 ? resolveDiagramSrc(selectedP1.case3) : null;
  const reviewImgP2 = selectedP2 ? resolveDiagramSrc(selectedP2.plotData) : null;

  const showcaseP1 = showcaseSub && ((showcaseSub as any).meeting || 1) === 1 ? (showcaseSub as LkpdSubmission) : null;
  const showcaseP2 = showcaseSub && (showcaseSub as any).meeting === 2 ? (showcaseSub as Lkpd2Submission) : null;

  const showcaseImg = showcaseP1
    ? showcaseCase === 1
      ? resolveDiagramSrc(showcaseP1.case1)
      : showcaseCase === 2
      ? resolveDiagramSrc(showcaseP1.case2)
      : resolveDiagramSrc(showcaseP1.case3)
    : showcaseP2
    ? resolveDiagramSrc(showcaseP2.plotData)
    : null;

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
      const subList: AnyLkpdSubmission[] = subSnap.docs.map(d => ({
        id: d.id,
        ...(d.data() as any)
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

  // Filter Submissions berdasarkan kelas & pertemuan yang dipilih
  const currentClass = classes.find(c => c.id === selectedClassId);
  const currentMeetingSubmissions = submissions.filter(s => ((s as any).meeting || 1) === activeMeetingTab);
  const classSubmissions = currentMeetingSubmissions.filter(s => s.classId === selectedClassId);

  // Hitung jumlah siswa unik & dokumen untuk tab switcher pertemuan
  const p1Subs = submissions.filter(s => ((s as any).meeting || 1) === 1 && s.classId === selectedClassId);
  const p1UniqueCount = new Set(p1Subs.map(s => s.studentName.toLowerCase().trim())).size;
  const p1Revisions = p1Subs.length - p1UniqueCount;

  const p2Subs = submissions.filter(s => (s as any).meeting === 2 && s.classId === selectedClassId);
  const p2UniqueCount = new Set(p2Subs.map(s => s.studentName.toLowerCase().trim())).size;
  const p2Revisions = p2Subs.length - p2UniqueCount;

  // Daftar nama siswa dari roster ditambah nama siswa yang mengumpulkan secara manual (jika ada nama baru di luar roster)
  const rosterStudents = currentClass?.students || [];
  const submittedStudentNames = Array.from(
    new Set(classSubmissions.map(s => s.studentName.trim()).filter(Boolean))
  );
  const allStudentNames = [
    ...rosterStudents,
    ...submittedStudentNames.filter(
      name => !rosterStudents.some(r => r.toLowerCase().trim() === name.toLowerCase().trim())
    )
  ];

  // Buat mapping pengerjaan per siswa di kelas aktif untuk sesi pertemuan aktif
  // Disortir berdasarkan submittedAt menurun (terbaru di index 0)
  const studentRosterWithSubmissions = allStudentNames.map(studentName => {
    const studentSubs = classSubmissions
      .filter(s => s.studentName.toLowerCase().trim() === studentName.toLowerCase().trim())
      .sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());

    const latestSub = studentSubs[0] || null;
    return {
      studentName,
      submission: latestSub,
      allSubmissions: studentSubs,
      submissionCount: studentSubs.length,
      isSubmitted: !!latestSub
    };
  });

  const totalSubmitted = studentRosterWithSubmissions.filter(s => s.isSubmitted).length;
  const totalStudents = studentRosterWithSubmissions.length;
  const needsGradingCount = studentRosterWithSubmissions.filter(s => s.isSubmitted && (s.submission?.score === null || s.submission?.score === undefined)).length;
  const gradedCount = studentRosterWithSubmissions.filter(s => s.isSubmitted && s.submission?.score !== null && s.submission?.score !== undefined).length;
  const unsubmittedCount = totalStudents - totalSubmitted;
  const totalRevisionsCount = studentRosterWithSubmissions.reduce((acc, curr) => acc + (curr.submissionCount > 1 ? curr.submissionCount - 1 : 0), 0);

  // Filter siswa berdasarkan status pengerjaan / penilaian & pencarian
  const filteredStudents = studentRosterWithSubmissions
    .filter(item => {
      if (filterStatus === 'needs_grade') {
        return item.isSubmitted && (item.submission?.score === null || item.submission?.score === undefined);
      }
      if (filterStatus === 'graded') {
        return item.isSubmitted && item.submission?.score !== null && item.submission?.score !== undefined;
      }
      if (filterStatus === 'unsubmitted') {
        return !item.isSubmitted;
      }
      return true;
    })
    .filter(item => 
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Bersihkan semua data submissions siswa dari Firestore (Reset Uji Coba)
  const handleClearSubmissions = async () => {
    const confirmPrompt = window.confirm(
      '⚠️ PERINGATAN GURU:\nApakah Anda yakin ingin menghapus SEMUA data pengerjaan siswa yang tersimpan di server?\n\nGunakan fitur ini untuk membersihkan data uji coba atau sebelum memulai sesi kelas baru.'
    );
    if (!confirmPrompt) return;

    try {
      setLoadingData(true);
      setIsClearingSubmissions(true);
      const subSnap = await getDocs(collection(db, 'submissions'));
      const deletePromises = subSnap.docs.map(d => deleteDoc(doc(db, 'submissions', d.id)));
      await Promise.all(deletePromises);
      setSubmissions([]);
      setSelectedSub(null);
      setShowcaseSub(null);
      alert('✓ Semua data pengumpulan siswa berhasil dibersihkan! Dashboard kini kembali bersih.');
    } catch (err: unknown) {
      console.error('Gagal membersihkan data pengumpulan:', err);
      const msg = err instanceof Error ? err.message : 'Terjadi kendala';
      alert('Gagal membersihkan data: ' + msg);
    } finally {
      setLoadingData(false);
      setIsClearingSubmissions(false);
    }
  };

  // Buka Modal Review untuk satu siswa
  const handleOpenReview = (sub: AnyLkpdSubmission) => {
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

      // Sinkronkan juga ke seluruh submission/revisi dari siswa yang sama untuk sesi ini jika ada
      const studentSubs = classSubmissions.filter(
        s => s.studentName.toLowerCase().trim() === selectedSub.studentName.toLowerCase().trim()
      );
      if (studentSubs.length > 1) {
        const otherSubs = studentSubs.filter((s): s is typeof s & { id: string } => !!s.id && s.id !== selectedSub.id);
        await Promise.all(
          otherSubs.map(s => updateDoc(doc(db, 'submissions', s.id), updateData))
        );
      }

      // Perbarui local state
      setSubmissions(prev => prev.map(s => {
        if (s.studentName.toLowerCase().trim() === selectedSub.studentName.toLowerCase().trim() && ((s as any).meeting || 1) === activeMeetingTab) {
          return { ...s, ...updateData };
        }
        return s;
      }));
      setSelectedSub(prev => prev ? { ...prev, ...updateData } : null);
      alert('Nilai dan catatan guru berhasil disimpan!');
    } catch (err) {
      console.error('Gagal simpan nilai:', err);
      alert('Terjadi kesalahan saat menyimpan nilai.');
    } finally {
      setIsSavingGrade(false);
    }
  };

  // Ekspor Nilai ke File CSV (Adaptif Sesi P1 / P2)
  const handleExportCsv = () => {
    if (!currentClass) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeMeetingTab === 1) {
      csvContent += 'No,Nama Siswa,Kelas,Sesi,Status,Jumlah Kirim,Nilai,Catatan Guru,Waktu Pengumpulan Terakhir\n';
      studentRosterWithSubmissions.forEach((item, idx) => {
        const status = item.isSubmitted ? 'Sudah Mengumpulkan' : 'Belum';
        const submitCount = item.isSubmitted ? (item.submissionCount > 1 ? `${item.submissionCount}x (Ada Revisi)` : '1x') : '-';
        const score = item.submission?.score ?? '-';
        const feedback = item.submission?.teacherFeedback ? `"${item.submission.teacherFeedback.replace(/"/g, '""')}"` : '-';
        const time = item.submission?.submittedAt ? new Date(item.submission.submittedAt).toLocaleString('id-ID') : '-';
        csvContent += `${idx + 1},"${item.studentName}","${currentClass.name}","P1: Relasi & VLT","${status}","${submitCount}",${score},${feedback},"${time}"\n`;
      });
    } else {
      csvContent += 'No,Nama Siswa,Kelas,Sesi,Status,Jumlah Kirim,Nilai,Catatan Guru,Jarak Ojol,Baterai HP,Muatan Lift,Notasi Selang,Model Linear,Titik Plot,Refleksi Intercept b,Refleksi Gradien a,Waktu Pengumpulan Terakhir\n';
      studentRosterWithSubmissions.forEach((item, idx) => {
        const sub = item.submission as Lkpd2Submission | null;
        const status = item.isSubmitted ? 'Sudah Mengumpulkan' : 'Belum';
        const submitCount = item.isSubmitted ? (item.submissionCount > 1 ? `${item.submissionCount}x (Ada Revisi)` : '1x') : '-';
        const score = sub?.score ?? '-';
        const feedback = sub?.teacherFeedback ? `"${sub.teacherFeedback.replace(/"/g, '""')}"` : '-';
        const ojol = sub?.physicalLimits?.ojol?.answer || '-';
        const baterai = sub?.physicalLimits?.baterai?.answer || '-';
        const lift = sub?.physicalLimits?.lift?.dataType || '-';
        const notasi = sub?.setNotations?.q1Bracket ? `"${sub.setNotations.q1Bracket} & ${sub.setNotations.q2Inequality}${sub.setNotations.q3Interval ? ` & ${sub.setNotations.q3Interval}` : ''}"` : '-';
        const formula = sub?.linearModel?.formulaText ? `"${sub.linearModel.formulaText}"` : '-';
        const pointsCount = sub?.plotData?.points?.length ?? '-';
        const refB = sub?.goldenRule?.meaningOfB ? `"${sub.goldenRule.meaningOfB.replace(/"/g, '""')}"` : '-';
        const refA = sub?.goldenRule?.meaningOfA ? `"${sub.goldenRule.meaningOfA.replace(/"/g, '""')}"` : '-';
        const time = sub?.submittedAt ? new Date(sub.submittedAt).toLocaleString('id-ID') : '-';
        csvContent += `${idx + 1},"${item.studentName}","${currentClass.name}","P2: Batasan & Linear","${status}","${submitCount}",${score},${feedback},"${ojol}","${baterai}","${lift}",${notasi},${formula},${pointsCount},${refB},${refA},"${time}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_LKPD_P${activeMeetingTab}_${currentClass.name.replace(/\s+/g, '_')}.csv`);
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

  // Semua versi pengerjaan siswa yang sedang di-review (disortir terbaru lebih dulu)
  const selectedStudentAllSubs = selectedSub
    ? classSubmissions
        .filter(s => s.studentName.toLowerCase().trim() === selectedSub.studentName.toLowerCase().trim())
        .sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime())
    : [];

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
                {/* Meeting Selector: P1 vs P2 */}
                <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMeetingTab(1);
                      setSelectedSub(null);
                      setShowcaseSub(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      activeMeetingTab === 1
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span>Pertemuan 1: Relasi & VLT</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
                      {p1UniqueCount} Siswa {p1Revisions > 0 && `(${p1Subs.length} Kumpul)`}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMeetingTab(2);
                      setSelectedSub(null);
                      setShowcaseSub(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      activeMeetingTab === 2
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span>Pertemuan 2: Batasan & Linear</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
                      {p2UniqueCount} Siswa {p2Revisions > 0 && `(${p2Subs.length} Kumpul)`}
                    </span>
                  </button>
                </div>

                {/* Statistik Cepat */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl">
                    <span className="text-slate-400 block text-[11px]">Total Siswa Terdaftar</span>
                    <span className="text-xl font-black text-white">{totalStudents}</span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl">
                    <span className="text-slate-400 block text-[11px]">Sudah Mengumpulkan</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-emerald-400">{totalSubmitted}</span>
                      <span className="text-xs text-slate-500 font-normal">({Math.round((totalSubmitted / Math.max(1, totalStudents)) * 100)}%)</span>
                    </div>
                    {totalRevisionsCount > 0 && (
                      <span className="text-[10px] text-purple-400 font-medium block mt-0.5">
                        +{totalRevisionsCount} revisi baru terdeteksi
                      </span>
                    )}
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl">
                    <span className="text-slate-400 block text-[11px]">Perlu Dinilai</span>
                    <span className="text-xl font-black text-amber-400">
                      {needsGradingCount} <span className="text-xs text-slate-500 font-normal">siswa</span>
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 items-center justify-end">
                    <button
                      onClick={handleExportCsv}
                      className="w-full h-full py-2 px-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      title="Unduh seluruh rekap nilai ke format Excel .CSV"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Ekspor Excel</span>
                    </button>
                    <button
                      onClick={handleClearSubmissions}
                      disabled={isClearingSubmissions || submissions.length === 0}
                      className="w-full h-full py-2 px-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      title="Bersihkan seluruh data percobaan pengumpulan siswa agar database kembali bersih"
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                      <span className="hidden sm:inline">Reset Data</span>
                    </button>
                  </div>
                </div>

                {/* Filter Status & Search Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                  {/* Status Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setFilterStatus('all')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                        filterStatus === 'all'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Semua ({totalStudents})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('needs_grade')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                        filterStatus === 'needs_grade'
                          ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                          : 'text-amber-400 hover:bg-slate-900'
                      }`}
                    >
                      <span>⏳ Perlu Dinilai ({needsGradingCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('graded')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                        filterStatus === 'graded'
                          ? 'bg-indigo-600 text-white shadow-sm font-extrabold'
                          : 'text-indigo-400 hover:bg-slate-900'
                      }`}
                    >
                      <span>⭐ Sudah Dinilai ({gradedCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('unsubmitted')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                        filterStatus === 'unsubmitted'
                          ? 'bg-slate-700 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Belum Kumpul ({unsubmittedCount})
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Cari nama siswa..."
                      className="w-48 sm:w-56 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      {filteredStudents.length} siswa
                    </span>
                  </div>
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
                            <div className="flex items-center gap-2">
                              <span>{item.studentName}</span>
                              {item.submissionCount > 1 && (
                                <span 
                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-950 border border-purple-700/80 text-purple-300 font-bold text-[9px] shadow-sm"
                                  title={`Siswa ini mengumpulkan ${item.submissionCount} kali. Data terbaru otomatis ditampilkan.`}
                                >
                                  Revisi {item.submissionCount}x
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            {item.isSubmitted ? (
                              <div className="flex flex-col gap-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold text-[10px] w-fit">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  Terkumpul
                                </span>
                                {item.submission?.score !== undefined && item.submission?.score !== null ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-700 text-indigo-300 font-bold text-[10px] w-fit">
                                    ✓ Dinilai
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/80 text-amber-300 font-bold text-[10px] w-fit animate-pulse">
                                    ⏳ Perlu Dinilai
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-500 text-[10px]">
                                Belum Kumpul
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-400 font-mono text-[11px]">
                            {item.submission?.submittedAt ? (
                              <div className="flex flex-col">
                                <span>{new Date(item.submission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {item.submissionCount > 1 && (
                                  <span className="text-[9px] text-purple-400 font-sans font-medium">Terbaru</span>
                                )}
                              </div>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="p-3 text-center font-bold">
                            {item.submission?.score !== undefined && item.submission?.score !== null ? (
                              <span className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700 text-indigo-300 font-mono">
                                ⭐ {item.submission.score} / 100
                              </span>
                            ) : item.isSubmitted ? (
                              <span className="text-amber-400/90 text-[11px] font-mono italic">Belum Dinilai</span>
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
              <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Pengerjaan: <span className="text-amber-400">{selectedSub.studentName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {selectedSub.className}
                      </span>
                    </h3>
                    {selectedStudentAllSubs.length > 1 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-950 border border-purple-700/80 text-purple-300 font-bold text-[10px]">
                        Total {selectedStudentAllSubs.length} Pengumpulan
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Waktu Kirim: {new Date(selectedSub.submittedAt).toLocaleString('id-ID')}
                  </div>

                  {/* Switcher Versi jika siswa mengumpulkan >1 kali */}
                  {selectedStudentAllSubs.length > 1 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                      <span className="text-[10px] text-slate-400 font-bold">Pilih Versi:</span>
                      {selectedStudentAllSubs.map((verSub, vIdx) => {
                        const isSelectedVer = verSub.id === selectedSub.id;
                        const isLatest = vIdx === 0;
                        const verNumber = selectedStudentAllSubs.length - vIdx;
                        return (
                          <button
                            key={verSub.id}
                            type="button"
                            onClick={() => {
                              setSelectedSub(verSub);
                              setGradeScore(verSub.score ?? '');
                              setGradeFeedback(verSub.teacherFeedback ?? '');
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                              isSelectedVer
                                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <span>Versi {verNumber}</span>
                            {isLatest && (
                              <span className="text-[9px] px-1 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono">
                                Terbaru
                              </span>
                            )}
                            <span className="text-[9px] opacity-75 font-mono">
                              {new Date(verSub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 mt-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Konten Review: P1 vs P2 & Form Nilai */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
                {selectedP2 ? (
                  /* ============================================================ */
                  /* REVIEW DETAIL UNTUK PERTEMUAN 2 (DOMAIN, RANGE, LINEAR)      */
                  /* ============================================================ */
                  <div className="space-y-4">
                    {/* Visual Grafik Kartesius Siswa */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-indigo-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            Hasil Visual Grafik Koordinat Kartesius Siswa:
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {selectedP2.plotData?.points?.length || 0} Titik Terplot • {selectedP2.plotData?.hasLine ? 'Garis Linear Aktif' : 'Tanpa Garis'}
                          </span>
                        </div>
                        {reviewImgP2 && (
                          <button
                            type="button"
                            onClick={() => setZoomImage({
                              url: reviewImgP2,
                              title: `Grafik Linear Sewa Kamera`,
                              subtitle: `${selectedSub.studentName} (${selectedSub.className})`
                            })}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 text-xs font-semibold flex items-center gap-1"
                          >
                            <ZoomIn className="w-3 h-3" />
                            <span>Perbesar (Zoom)</span>
                          </button>
                        )}
                      </div>

                      {reviewImgP2 ? (
                        <div
                          onClick={() => setZoomImage({
                            url: reviewImgP2,
                            title: `Grafik Linear Sewa Kamera`,
                            subtitle: `${selectedSub.studentName} (${selectedSub.className})`
                          })}
                          className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900 max-w-xl mx-auto flex justify-center"
                        >
                          <img
                            src={reviewImgP2}
                            alt="Grafik Siswa"
                            className="w-full max-h-64 object-contain group-hover:scale-102 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5">
                            <ZoomIn className="w-4 h-4" /> Klik untuk Perbesar Layar Penuh
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-xl mx-auto">
                          <InteractiveLinearPlotCanvas
                            points={selectedP2.plotData?.points || []}
                            onChangePoints={() => {}}
                            hasLine={selectedP2.plotData?.hasLine || false}
                            onToggleLine={() => {}}
                            readOnly={true}
                          />
                        </div>
                      )}
                    </div>

                    {/* Model Linear & Tabel Perhitungan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Kartu Model Rumus & Tabel */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                        <span className="font-bold text-amber-400 block text-xs">
                          Pemodelan Fungsi Linear f(x) = ax + b:
                        </span>
                        <div className="p-2 bg-slate-900 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Rumus Siswa:</span>
                            <span className="font-mono text-emerald-400 font-bold">{selectedP2.linearModel?.formulaText || 'f(x) = 10.000x + 20.000'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Parameter a (Tarif/Jam):</span>
                            <span className="font-mono text-white">Rp {selectedP2.linearModel?.paramA?.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Parameter b (Buka Segel):</span>
                            <span className="font-mono text-white">Rp {selectedP2.linearModel?.paramB?.toLocaleString('id-ID')}</span>
                          </div>
                        </div>

                        {/* Tabel Nilai */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-[11px] text-center border-collapse">
                            <thead>
                              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                                <th className="p-1">Durasi</th>
                                <th className="p-1">Total Biaya</th>
                                <th className="p-1">Titik (x, y)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-850">
                              {(selectedP2.linearModel?.tableRows || []).map((row, idx) => (
                                <tr key={idx}>
                                  <td className="p-1 text-slate-300 font-mono">{row.x} jam</td>
                                  <td className="p-1 text-emerald-400 font-mono">Rp {Number(row.cost).toLocaleString('id-ID')}</td>
                                  <td className="p-1 text-indigo-400 font-mono">{row.pointStr}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Kartu Batasan Fisik & Notasi Interval */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                        <span className="font-bold text-cyan-400 block text-xs">
                          Analisis Batasan Fisik & Notasi Interval:
                        </span>
                        <div className="space-y-1.5 text-[11px]">
                          <div className="p-2 bg-slate-900 rounded-lg">
                            <div className="flex justify-between">
                              <span className="font-bold text-slate-300">1. Jarak Ojol:</span>
                              <span className={`px-1.5 py-0.2 rounded font-bold ${selectedP2.physicalLimits?.ojol?.answer === 'Mustahil' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                                {selectedP2.physicalLimits?.ojol?.answer || '-'}
                              </span>
                            </div>
                            <p className="text-slate-400 italic text-[10px] mt-0.5">&quot;{selectedP2.physicalLimits?.ojol?.reason || '-'}&quot;</p>
                          </div>

                          <div className="p-2 bg-slate-900 rounded-lg">
                            <div className="flex justify-between">
                              <span className="font-bold text-slate-300">2. Baterai HP (120%):</span>
                              <span className={`px-1.5 py-0.2 rounded font-bold ${selectedP2.physicalLimits?.baterai?.answer === 'Mustahil' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                                {selectedP2.physicalLimits?.baterai?.answer || '-'}
                              </span>
                            </div>
                            <p className="text-slate-400 italic text-[10px] mt-0.5">&quot;{selectedP2.physicalLimits?.baterai?.reason || '-'}&quot;</p>
                          </div>

                          <div className="p-2 bg-slate-900 rounded-lg">
                            <div className="flex justify-between">
                              <span className="font-bold text-slate-300">3. Muatan Lift:</span>
                              <span className="font-bold text-indigo-300">
                                {selectedP2.physicalLimits?.lift?.dataType || '-'} ({selectedP2.physicalLimits?.lift?.answer || '-'})
                              </span>
                            </div>
                            <p className="text-slate-400 italic text-[10px] mt-0.5">&quot;{selectedP2.physicalLimits?.lift?.reason || '-'}&quot;</p>
                          </div>

                          <div className="p-2 bg-slate-900 rounded-lg flex justify-between items-center text-[10px]">
                            <span className="text-slate-400">Notasi Interval:</span>
                            <span className="font-mono text-amber-300 font-bold">
                              Q1: {selectedP2.setNotations?.q1Bracket || '-'} | Q2: {selectedP2.setNotations?.q2Inequality || '-'} | Q3: {selectedP2.setNotations?.q3Interval || '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Refleksi Siswa P2 */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                      <span className="font-bold text-amber-400 block text-[11px] uppercase tracking-wider">
                        Refleksi Aturan Emas Siswa:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <strong className="text-emerald-400 block mb-0.5">• Arti Nilai b (Intercept):</strong>
                          <p className="text-slate-300 italic">&quot;{selectedP2.goldenRule?.meaningOfB || '-'}&quot;</p>
                        </div>
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <strong className="text-indigo-400 block mb-0.5">• Arti Nilai a (Kemiringan/Gradien):</strong>
                          <p className="text-slate-300 italic">&quot;{selectedP2.goldenRule?.meaningOfA || '-'}&quot;</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 3 Diagram Preview Grid */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center justify-between">
                    <span>Hasil Visual 3 Diagram Panah Siswa:</span>
                    <span className="text-[10px] text-slate-400 font-normal">Klik foto untuk perbesar (Zoom Lightbox)</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Kasus 1 */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 space-y-1.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-400 block text-xs">Kasus 1: Skenario Kasir</span>
                          {reviewImg1 && (
                            <button
                              type="button"
                              onClick={() => setZoomImage({
                                url: reviewImg1,
                                title: `Diagram Kasus 1: Skenario Kasir`,
                                subtitle: `${selectedSub.studentName} (${selectedSub.className})`
                              })}
                              className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                              <ZoomIn className="w-3 h-3" /> Zoom
                            </button>
                          )}
                        </div>

                        {reviewImg1 ? (
                          <div
                            onClick={() => setZoomImage({
                              url: reviewImg1,
                              title: `Diagram Kasus 1: Skenario Kasir`,
                              subtitle: `${selectedSub.studentName} (${selectedSub.className})`
                            })}
                            className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-800 bg-slate-900"
                          >
                            <img
                              src={reviewImg1}
                              alt="Diagram Kasus 1"
                              className="w-full h-32 object-contain group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[11px] font-bold gap-1">
                              <ZoomIn className="w-4 h-4" /> Klik Perbesar
                            </div>
                          </div>
                        ) : (
                          <div className="h-32 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                            <div className="pointer-events-none w-full flex justify-center px-2">
                              {selectedP1 && <DiagramReconstruct caseNumber={1} caseData={selectedP1.case1} />}
                            </div>
                            <span className="absolute bottom-1 right-1.5 text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700">
                              Rekonstruksi vektor
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-400 text-[11px]">Status: </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedP1?.case1?.status === 'Fungsi' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'}`}>
                            {selectedP1?.case1?.status || '-'}
                          </span>
                        </div>
                        <p className="text-slate-300 mt-1 italic text-[11px] line-clamp-3">&quot;{selectedP1?.case1?.reason || 'Tidak ada alasan'}&quot;</p>
                      </div>
                    </div>

                    {/* Kasus 2 */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 space-y-1.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-400 block text-xs">Kasus 2: Pelanggaran</span>
                          {reviewImg2 && (
                            <button
                              type="button"
                              onClick={() => setZoomImage({
                                url: reviewImg2,
                                title: `Diagram Kasus 2: Pelanggaran`,
                                subtitle: `${selectedSub.studentName} (${selectedSub.className})`
                              })}
                              className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                            >
                              <ZoomIn className="w-3 h-3" /> Zoom
                            </button>
                          )}
                        </div>

                        {reviewImg2 ? (
                          <div
                            onClick={() => setZoomImage({
                              url: reviewImg2,
                              title: `Diagram Kasus 2: Pelanggaran`,
                              subtitle: `${selectedSub.studentName} (${selectedSub.className})`
                            })}
                            className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-800 bg-slate-900"
                          >
                            <img
                              src={reviewImg2}
                              alt="Diagram Kasus 2"
                              className="w-full h-32 object-contain group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[11px] font-bold gap-1">
                              <ZoomIn className="w-4 h-4" /> Klik Perbesar
                            </div>
                          </div>
                        ) : (
                          <div className="h-32 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                            <div className="pointer-events-none w-full flex justify-center px-2">
                              {selectedP1 && <DiagramReconstruct caseNumber={2} caseData={selectedP1.case2} />}
                            </div>
                            <span className="absolute bottom-1 right-1.5 text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700">
                              Rekonstruksi vektor
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-400 text-[11px]">Status: </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedP1?.case2?.status === 'Fungsi' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'}`}>
                            {selectedP1?.case2?.status || '-'}
                          </span>
                        </div>
                        <p className="text-slate-300 mt-1 italic text-[11px] line-clamp-3">
                          &quot;{selectedP1?.case2?.violator ? `Pelanggar: ${selectedP1.case2.violator}. ` : ''}{selectedP1?.case2?.reason || 'Tidak ada alasan'}&quot;
                        </p>
                      </div>
                    </div>

                    {/* Kasus 3 (Kreasi Mandiri) */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 space-y-1.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cyan-400 block text-xs truncate max-w-[170px]">
                            Kasus 3: {selectedP1?.case3?.setAName || 'A'} ➔ {selectedP1?.case3?.setBName || 'B'}
                          </span>
                          {reviewImg3 && (
                            <button
                              type="button"
                              onClick={() => setZoomImage({
                                url: reviewImg3,
                                title: `Diagram Kasus 3: ${selectedP1?.case3?.setAName} ➔ ${selectedP1?.case3?.setBName}`,
                                subtitle: `${selectedSub.studentName} (${selectedSub.className})`
                              })}
                              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                            >
                              <ZoomIn className="w-3 h-3" /> Zoom
                            </button>
                          )}
                        </div>

                        {reviewImg3 ? (
                          <div
                            onClick={() => setZoomImage({
                              url: reviewImg3,
                              title: `Diagram Kasus 3: ${selectedP1?.case3?.setAName} ➔ ${selectedP1?.case3?.setBName}`,
                              subtitle: `${selectedSub.studentName} (${selectedSub.className})`
                            })}
                            className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-800 bg-slate-900"
                          >
                            <img
                              src={reviewImg3}
                              alt="Diagram Kasus 3"
                              className="w-full h-32 object-contain group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[11px] font-bold gap-1">
                              <ZoomIn className="w-4 h-4" /> Klik Perbesar
                            </div>
                          </div>
                        ) : (
                          <div className="h-32 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                            <div className="pointer-events-none w-full flex justify-center px-2">
                              {selectedP1 && <DiagramReconstruct caseNumber={3} caseData={selectedP1.case3} />}
                            </div>
                            <span className="absolute bottom-1 right-1.5 text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700">
                              Rekonstruksi vektor
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-400 text-[11px]">Status: </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedP1?.case3?.status === 'Fungsi' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'}`}>
                            {selectedP1?.case3?.status || '-'}
                          </span>
                        </div>
                        <p className="text-slate-300 mt-1 italic text-[11px] line-clamp-3">&quot;{selectedP1?.case3?.reason || 'Tidak ada alasan'}&quot;</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VLT & Refleksi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-400 block mb-1">Jawaban Uji Garis Vertikal (VLT):</span>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">K1: {selectedP1?.vlt?.q1 || '-'}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">K2: {selectedP1?.vlt?.q2 || '-'}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">K3: {selectedP1?.vlt?.q3 || '-'}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">K4: {selectedP1?.vlt?.q4 || '-'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block mb-1">Refleksi Aturan Emas Siswa:</span>
                    <p className="text-slate-300">
                      • <strong>Jomblo:</strong> {selectedP1?.goldenRule?.noSingle || '-'}<br />
                      • <strong>Mendua:</strong> {selectedP1?.goldenRule?.noAffair || '-'}
                    </p>
                  </div>
                </div>
                  </>
                )}

                {/* Form Grading & Feedback Manual Guru */}
                <div className="p-4 bg-amber-950/30 border border-amber-800/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Award className="w-4 h-4" />
                      Penilaian Manual Guru:
                    </h4>
                    <span className="text-[10px] text-slate-400">Pilih nilai preset atau ketik manual</span>
                  </div>

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
                      {/* Preset Skor Cepat */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {[100, 95, 90, 85, 80, 75, 70].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setGradeScore(val)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                              gradeScore === val 
                                ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm' 
                                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-500/60'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-300 block mb-1">Catatan Guru / Feedback Siswa:</label>
                      <input
                        type="text"
                        value={gradeFeedback}
                        onChange={e => setGradeFeedback(e.target.value)}
                        placeholder="Tulis umpan balik guru atau pilih template di bawah..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      {/* Template Catatan Cepat */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {[
                          'Analisis sangat tepat & diagram rapi! 🌟',
                          'Identifikasi pelanggaran di Kasus 2 tepat.',
                          'Kreasi Kasus 3 orisinal & logikanya kuat.',
                          'Perhatikan kembali syarat himpunan asal.'
                        ].map(tmpl => (
                          <button
                            key={tmpl}
                            type="button"
                            onClick={() => setGradeFeedback(prev => prev ? `${prev} ${tmpl}` : tmpl)}
                            className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-500/60 transition-all text-left"
                          >
                            + {tmpl}
                          </button>
                        ))}
                      </div>
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
            <div className="w-full max-w-4xl bg-slate-900 border border-indigo-500/50 rounded-3xl p-6 shadow-2xl relative space-y-4 max-h-[95vh] overflow-y-auto">
              <button
                onClick={() => setShowcaseSub(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all"
                title="Tutup Mode Showcase"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <span className="text-xs uppercase tracking-widest font-mono text-indigo-400 font-bold flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Karya Pilihan Siswa · Diskusi Kelas Proyektor
                </span>
                <h2 className="text-2xl font-black text-white">
                  {showcaseSub.studentName} <span className="text-indigo-400 font-bold">({showcaseSub.className})</span>
                </h2>
              </div>

              {showcaseP2 ? (
                /* Showcase untuk P2: Grafik Linear & Model */
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <span className="text-indigo-400 font-mono">
                        {showcaseP2.linearModel?.formulaText || 'f(x) = 10.000x + 20.000'}
                      </span>
                    </h3>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                      {showcaseP2.plotData?.points?.length || 0} Titik Terplot • Garis Lurus Aktif
                    </span>
                  </div>

                  {/* Gambar Grafik Siswa */}
                  {showcaseImg ? (
                    <div
                      onClick={() => setZoomImage({
                        url: showcaseImg,
                        title: `Grafik Linear: ${showcaseP2.linearModel?.formulaText || 'f(x) = 10.000x + 20.000'}`,
                        subtitle: `${showcaseSub.studentName} (${showcaseSub.className})`
                      })}
                      className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 flex justify-center max-w-xl mx-auto"
                    >
                      <img
                        src={showcaseImg}
                        alt="Grafik Linear Siswa"
                        className="w-full max-h-[380px] object-contain group-hover:scale-102 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5">
                        <ZoomIn className="w-4 h-4" /> Klik untuk Perbesar Layar Penuh
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-xl mx-auto">
                      <InteractiveLinearPlotCanvas
                        points={showcaseP2.plotData?.points || []}
                        onChangePoints={() => {}}
                        hasLine={showcaseP2.plotData?.hasLine || false}
                        onToggleLine={() => {}}
                        readOnly={true}
                      />
                    </div>
                  )}

                  {/* Refleksi Siswa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                      <strong className="text-emerald-400 text-xs block mb-1">
                        Arti Intercept b (Biaya Awal):
                      </strong>
                      <p className="text-white italic text-sm">
                        &quot;{showcaseP2.goldenRule?.meaningOfB || '-'}&quot;
                      </p>
                    </div>
                    <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                      <strong className="text-indigo-400 text-xs block mb-1">
                        Arti Gradien a (Kemiringan):
                      </strong>
                      <p className="text-white italic text-sm">
                        &quot;{showcaseP2.goldenRule?.meaningOfA || '-'}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Tab Selector untuk 3 Kasus */}
                  <div className="flex justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowcaseCase(1)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    showcaseCase === 1
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Kasus 1: Pesanan Kantin
                </button>
                <button
                  type="button"
                  onClick={() => setShowcaseCase(2)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    showcaseCase === 2
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Kasus 2: Pelanggaran
                </button>
                <button
                  type="button"
                  onClick={() => setShowcaseCase(3)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    showcaseCase === 3
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Kasus 3: Kreasi Mandiri
                </button>
              </div>

              {/* Konten Kasus Aktif */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                {/* Header Kasus */}
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {showcaseCase === 1 && (
                      <span className="text-amber-400">Kasus 1: Pesanan Makanan Kantin ➔ Meja Pemesan (Many-to-One)</span>
                    )}
                    {showcaseCase === 2 && (
                      <span className="text-rose-400">Kasus 2: Identifikasi Pelanggaran Syarat Relasi</span>
                    )}
                    {showcaseCase === 3 && (
                      <span className="text-cyan-400">
                        Kasus 3: {showcaseP1?.case3?.setAName || 'A'} ➔ {showcaseP1?.case3?.setBName || 'B'} (Kreasi Mandiri)
                      </span>
                    )}
                  </h3>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    {showcaseCase === 1 && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        showcaseP1?.case1?.status === 'Fungsi' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'
                      }`}>
                        {showcaseP1?.case1?.status === 'Fungsi' ? '✓ FUNGSI SAH' : '✗ BUKAN FUNGSI'}
                      </span>
                    )}
                    {showcaseCase === 2 && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        showcaseP1?.case2?.status === 'Fungsi' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'
                      }`}>
                        {showcaseP1?.case2?.status === 'Fungsi' ? '✓ FUNGSI SAH' : '✗ BUKAN FUNGSI'}
                      </span>
                    )}
                    {showcaseCase === 3 && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        showcaseP1?.case3?.status === 'Fungsi' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'
                      }`}>
                        {showcaseP1?.case3?.status === 'Fungsi' ? '✓ FUNGSI SAH' : '✗ BUKAN FUNGSI'}
                      </span>
                    )}

                    {/* Tombol Zoom */}
                    {showcaseImg && (
                      <button
                        type="button"
                        onClick={() => {
                          if (showcaseImg) {
                            setZoomImage({
                              url: showcaseImg,
                              title: `Diagram Kasus ${showcaseCase}`,
                              subtitle: `${showcaseSub.studentName} (${showcaseSub.className})`
                            });
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 transition-all"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Zoom</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Gambar Snapshot Diagram (Triple Failsafe: URL -> Base64 -> render ulang vektor) */}
                {showcaseImg ? (
                  <div
                    onClick={() => setZoomImage({
                      url: showcaseImg,
                      title: showcaseCase === 3
                        ? `Diagram Kasus 3: ${showcaseP1?.case3?.setAName} ➔ ${showcaseP1?.case3?.setBName}`
                        : `Diagram Kasus ${showcaseCase}`,
                      subtitle: `${showcaseSub.studentName} (${showcaseSub.className})`
                    })}
                    className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 flex justify-center"
                  >
                    <img
                      src={showcaseImg}
                      alt={`Diagram Kasus ${showcaseCase}`}
                      className="w-full max-h-[360px] object-contain group-hover:scale-102 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5">
                      <ZoomIn className="w-4 h-4" /> Klik untuk Perbesar Layar Penuh
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 flex flex-col items-center gap-2">
                    <div className="pointer-events-none w-full max-w-xl">
                      {showcaseP1 && (
                        <DiagramReconstruct
                          caseNumber={showcaseCase}
                          caseData={
                            showcaseCase === 1 ? showcaseP1.case1
                              : showcaseCase === 2 ? showcaseP1.case2
                              : showcaseP1.case3
                          }
                        />
                      )}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700">
                      ⚠️ Snapshot gambar tidak tersedia — direkonstruksi dari data panah siswa
                    </span>
                  </div>
                )}

                {/* Argumen Siswa */}
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-sm space-y-1">
                  <span className="text-slate-400 font-semibold text-xs block">Argumen Matematis Siswa:</span>
                  <p className="text-white italic text-base leading-relaxed">
                    {showcaseCase === 1 && (showcaseP1?.case1?.reason ? `"${showcaseP1.case1.reason}"` : 'Tidak ada penjelasan')}
                    {showcaseCase === 2 && (
                      <>
                        {showcaseP1?.case2?.violator && (
                          <span className="text-rose-400 font-bold not-italic block mb-0.5">
                            Pelanggar Terdeteksi: {showcaseP1.case2.violator}
                          </span>
                        )}
                        &quot;{showcaseP1?.case2?.reason || 'Tidak ada penjelasan'}&quot;
                      </>
                    )}
                    {showcaseCase === 3 && (showcaseP1?.case3?.reason ? `"${showcaseP1.case3.reason}"` : 'Tidak ada penjelasan')}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )}

        {/* ============================================================ */}
        {/* MODAL LIGHTBOX ZOOM GAMBAR DIAGRAM */}
        {/* ============================================================ */}
        {zoomImage && (
          <div 
            className="fixed inset-0 z-80 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setZoomImage(null)}
          >
            <div 
              className="max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-4 shadow-2xl relative space-y-3"
              onClick={e => e.stopPropagation()}
            >
              {/* Header Lightbox */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{zoomImage.title}</h3>
                  {zoomImage.subtitle && (
                    <p className="text-xs text-amber-400 font-medium">{zoomImage.subtitle}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={zoomImage.url}
                    download="diagram-siswa.webp"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Unduh file gambar diagram"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Unduh Gambar</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setZoomImage(null)}
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Preview Gambar Resolusi Penuh */}
              <div className="flex items-center justify-center bg-slate-950 rounded-2xl border border-slate-800/80 p-2 overflow-hidden">
                <img
                  src={zoomImage.url}
                  alt={zoomImage.title}
                  className="max-h-[75vh] w-auto object-contain rounded-xl"
                />
              </div>

              <div className="text-center text-[11px] text-slate-500">
                Tekan tombol Silang atau klik di luar untuk menutup preview gambar
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
