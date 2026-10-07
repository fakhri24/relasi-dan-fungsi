import React, { useState, useEffect } from 'react';
import { SlideItem } from './types/slides';
import { Navbar } from './components/Navbar';
import { SlideContainer } from './components/SlideContainer';
import { WorksheetPrint } from './components/WorksheetPrint';

// 14 Slides Across 4 Meetings
import { Slide1OpeningRelasi } from './components/slides/Slide1OpeningRelasi';
import { Slide1Hook } from './components/slides/Slide1Hook';
import { Slide2Machine } from './components/slides/Slide2Machine';
import { Slide3ArrowDiagram } from './components/slides/Slide3ArrowDiagram';
import { Slide4VerticalLineTest } from './components/slides/Slide4VerticalLineTest';
import { Slide6OpeningDomain } from './components/slides/Slide6OpeningDomain';
import { Slide5DomainRange } from './components/slides/Slide5DomainRange';
import { Slide8IntervalNotation } from './components/slides/Slide8IntervalNotation';
import { Slide6LinearGraph } from './components/slides/Slide6LinearGraph';
import { Slide9OpeningPiecewise } from './components/slides/Slide9OpeningPiecewise';
import { Slide7WhyPiecewise } from './components/slides/Slide7WhyPiecewise';
import { Slide8PiecewiseIntro } from './components/slides/Slide8PiecewiseIntro';
import { Slide9SandboxBuilder } from './components/slides/Slide9SandboxBuilder';
import { Slide13OpeningProject } from './components/slides/Slide13OpeningProject';
import { Slide10ProjectHub } from './components/slides/Slide10ProjectHub';

// Modul LKPD Digital & Dashboard Guru
import { LkpdDigitalModal } from './components/lkpd/LkpdDigitalModal';
import { LkpdDigitalModalP2 } from './components/lkpd/LkpdDigitalModalP2';
import { TeacherDashboard } from './components/admin/TeacherDashboard';
import { ProjectorQrModal } from './components/lkpd/ProjectorQrModal';

const SLIDES: SlideItem[] = [
  // Pertemuan 1 (Slide 1–5)
  { id: 1, meetingNumber: 1, meetingTitle: 'Fondasi Relasi & Fungsi', meetingJP: '2 JP', title: 'Relasi & Target', subtitle: 'Hubungan Bebas', tag: '01 · PEMBUKA' },
  { id: 2, meetingNumber: 1, meetingTitle: 'Fondasi Relasi & Fungsi', meetingJP: '2 JP', title: 'Mesin Kasir', subtitle: 'Kasir Rusak', tag: '02 · PEMANTIK' },
  { id: 3, meetingNumber: 1, meetingTitle: 'Fondasi Relasi & Fungsi', meetingJP: '2 JP', title: 'Mesin Fungsi', subtitle: 'Input & Output', tag: '03 · MESIN' },
  { id: 4, meetingNumber: 1, meetingTitle: 'Fondasi Relasi & Fungsi', meetingJP: '2 JP', title: 'Relasi & Fungsi', subtitle: 'Diagram Panah', tag: '04 · DIAGRAM' },
  { id: 5, meetingNumber: 1, meetingTitle: 'Fondasi Relasi & Fungsi', meetingJP: '2 JP', title: 'Uji Garis Vertikal', subtitle: 'Scanner Garis', tag: '05 · UJI GRAFIK' },

  // Pertemuan 2 (Slide 6–9)
  { id: 6, meetingNumber: 2, meetingTitle: 'Batasan Nyata & Linear', meetingJP: '2 JP', title: 'Batasan Nyata', subtitle: 'Target Belajar P2', tag: '06 · PEMBUKA' },
  { id: 7, meetingNumber: 2, meetingTitle: 'Batasan Nyata & Linear', meetingJP: '2 JP', title: 'Domain & Range', subtitle: 'Batasan Nyata', tag: '07 · DOMAIN' },
  { id: 8, meetingNumber: 2, meetingTitle: 'Batasan Nyata & Linear', meetingJP: '2 JP', title: 'Notasi Selang', subtitle: 'Simbol Matematika', tag: '08 · NOTASI' },
  { id: 9, meetingNumber: 2, meetingTitle: 'Batasan Nyata & Linear', meetingJP: '2 JP', title: 'Model Linier', subtitle: 'f(x) = ax + b', tag: '09 · MODEL' },

  // Pertemuan 3 (Slide 10–13)
  { id: 10, meetingNumber: 3, meetingTitle: 'Fungsi Sepenggal (Piecewise)', meetingJP: '2 JP', title: 'Piecewise', subtitle: 'Target Belajar P3', tag: '10 · PEMBUKA' },
  { id: 11, meetingNumber: 3, meetingTitle: 'Fungsi Sepenggal (Piecewise)', meetingJP: '2 JP', title: 'Batasan 1 Garis', subtitle: 'Dilema Tarif', tag: '11 · MASALAH' },
  { id: 12, meetingNumber: 3, meetingTitle: 'Fungsi Sepenggal (Piecewise)', meetingJP: '2 JP', title: 'Fungsi Bercabang', subtitle: 'Piecewise & Titik', tag: '12 · PIECEWISE' },
  { id: 13, meetingNumber: 3, meetingTitle: 'Fungsi Sepenggal (Piecewise)', meetingJP: '2 JP', title: 'Rancang Fungsi', subtitle: 'Sandbox Builder', tag: '13 · SANDBOX' },

  // Pertemuan 4 (Slide 14–15)
  { id: 14, meetingNumber: 4, meetingTitle: 'Proyek Nyata & Asesmen', meetingJP: '2 JP', title: 'Proyek Nyata', subtitle: 'Target Belajar P4', tag: '14 · PEMBUKA' },
  { id: 15, meetingNumber: 4, meetingTitle: 'Proyek Nyata & Asesmen', meetingJP: '2 JP', title: 'Katalog Proyek', subtitle: 'Kasus & Rubrik', tag: '15 · PROYEK' },
];

export const App: React.FC = () => {
  const getInitialSlide = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const slideParam = params.get('slide');
      if (slideParam) {
        const idx = parseInt(slideParam, 10) - 1;
        if (idx >= 0 && idx < SLIDES.length) return idx;
      }
    } catch {
      // fallback
    }
    return 0;
  };

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(getInitialSlide);

  // State Modal LKPD Digital (P1 & P2), Dashboard Guru & QR Code Proyektor
  const [isLkpdOpen, setIsLkpdOpen] = useState(false);
  const [isLkpd2Open, setIsLkpd2Open] = useState(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState(false);
  const [isProjectorQrOpen, setIsProjectorQrOpen] = useState(false);
  const [projectorQrMeeting, setProjectorQrMeeting] = useState<1 | 2>(1);

  // Auto-detect mode via URL parameters (cth: ?mode=lkpd1, ?mode=lkpd2, ?mode=admin)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      if (mode === 'lkpd2' || params.get('lkpd') === '2') {
        setIsLkpd2Open(true);
      } else if (mode === 'lkpd' || mode === 'lkpd1' || params.get('lkpd') === '1') {
        setIsLkpdOpen(true);
      } else if (mode === 'admin' || params.get('admin') === '1') {
        setIsTeacherDashboardOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // State Tema: 'dark' (Mode Gelap) atau 'light' (Mode Cerah)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('supermath_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('supermath_theme', nextTheme);
    } catch {}
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    try {
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (meta) meta.setAttribute('content', nextTheme);
    } catch {}
  };

  // Pintasan Keyboard T untuk beralih mode cepat
  useEffect(() => {
    const handleThemeKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handleThemeKey);
    return () => window.removeEventListener('keydown', handleThemeKey);
  }, [theme]);

  const updateSlide = (newIndex: number) => {
    setCurrentSlideIndex(newIndex);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('slide', String(newIndex + 1));
      window.history.replaceState(null, '', url.toString());
    } catch {
      // ignore
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      updateSlide(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      updateSlide(currentSlideIndex - 1);
    }
  };

  const renderSlideContent = () => {
    switch (currentSlideIndex) {
      case 0:
        return <Slide1OpeningRelasi onNext={handleNext} />;
      case 1:
        return <Slide1Hook />;
      case 2:
        return <Slide2Machine />;
      case 3:
        return <Slide3ArrowDiagram />;
      case 4:
        return <Slide4VerticalLineTest onOpenQrModal={() => { setProjectorQrMeeting(1); setIsProjectorQrOpen(true); }} />;
      case 5:
        return <Slide6OpeningDomain onNext={handleNext} />;
      case 6:
        return <Slide5DomainRange />;
      case 7:
        return <Slide8IntervalNotation />;
      case 8:
        return <Slide6LinearGraph onOpenQrModal={() => { setProjectorQrMeeting(2); setIsProjectorQrOpen(true); }} />;
      case 9:
        return <Slide9OpeningPiecewise onNext={handleNext} />;
      case 10:
        return <Slide7WhyPiecewise />;
      case 11:
        return <Slide8PiecewiseIntro />;
      case 12:
        return <Slide9SandboxBuilder />;
      case 13:
        return <Slide13OpeningProject onNext={handleNext} />;
      case 14:
        return <Slide10ProjectHub />;
      default:
        return <Slide1OpeningRelasi onNext={handleNext} />;
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-950 flex flex-col justify-between font-sans transition-colors duration-200">
      {/* Navbar & Slide Controller */}
      <Navbar
        slides={SLIDES}
        currentIndex={currentSlideIndex}
        onSelectSlide={updateSlide}
        onNext={handleNext}
        onPrev={handlePrev}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenLkpd={(m) => (m === 2 ? setIsLkpd2Open(true) : setIsLkpdOpen(true))}
        onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
        onOpenProjectorQr={(m) => {
          setProjectorQrMeeting(m || 1);
          setIsProjectorQrOpen(true);
        }}
      />

      {/* Slide Presentation Frame */}
      <SlideContainer onNext={handleNext} onPrev={handlePrev}>
        {renderSlideContent()}
      </SlideContainer>

      {/* Print-Only A4 Project Worksheet */}
      <WorksheetPrint />

      {/* Modal Interaktif LKPD Digital Siswa Pertemuan 1 */}
      <LkpdDigitalModal
        isOpen={isLkpdOpen}
        onClose={() => setIsLkpdOpen(false)}
      />

      {/* Modal Interaktif LKPD Digital Siswa Pertemuan 2 */}
      <LkpdDigitalModalP2
        isOpen={isLkpd2Open}
        onClose={() => setIsLkpd2Open(false)}
      />

      {/* Panel Dashboard Guru (Admin & Roster) */}
      <TeacherDashboard
        isOpen={isTeacherDashboardOpen}
        onClose={() => setIsTeacherDashboardOpen(false)}
      />

      {/* Modal QR Code Proyektor Akses Siswa di Kelas (P1 & P2) */}
      <ProjectorQrModal
        isOpen={isProjectorQrOpen}
        onClose={() => setIsProjectorQrOpen(false)}
        meeting={projectorQrMeeting}
        onOpenLkpd={(m) => (m === 2 ? setIsLkpd2Open(true) : setIsLkpdOpen(true))}
        onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
      />
    </div>
  );
};

export default App;
