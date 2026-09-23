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
import { Slide6LinearGraph } from './components/slides/Slide6LinearGraph';
import { Slide9OpeningPiecewise } from './components/slides/Slide9OpeningPiecewise';
import { Slide7WhyPiecewise } from './components/slides/Slide7WhyPiecewise';
import { Slide8PiecewiseIntro } from './components/slides/Slide8PiecewiseIntro';
import { Slide9SandboxBuilder } from './components/slides/Slide9SandboxBuilder';
import { Slide13OpeningProject } from './components/slides/Slide13OpeningProject';
import { Slide10ProjectHub } from './components/slides/Slide10ProjectHub';

const SLIDES: SlideItem[] = [
  // Pertemuan 1 (Slide 1–5)
  { id: 1, meetingNumber: 1, meetingTitle: 'Fondasi Relasi & Fungsi', meetingJP: '2 JP', title: 'Relasi & Target', subtitle: 'Hubungan Bebas', tag: '01 · PEMBUKA' },
  { id: 2, meetingNumber: 1, meetingTitle: 'Fondasi Relasi & Fungsi', meetingJP: '2 JP', title: 'Mesin Kasir', subtitle: 'Kasir Rusak', tag: '02 · PEMANTIK' },
  { id: 3, meetingNumber: 1, meetingTitle: 'Fondasi Relasi & Fungsi', meetingJP: '2 JP', title: 'Mesin Fungsi', subtitle: 'Input & Output', tag: '03 · MESIN' },
  { id: 4, meetingNumber: 1, meetingTitle: 'Fondasi Relasi & Fungsi', meetingJP: '2 JP', title: 'Relasi & Fungsi', subtitle: 'Diagram Panah', tag: '04 · DIAGRAM' },
  { id: 5, meetingNumber: 1, meetingTitle: 'Fondasi Relasi & Fungsi', meetingJP: '2 JP', title: 'Uji Garis Vertikal', subtitle: 'Scanner Garis', tag: '05 · UJI GRAFIK' },

  // Pertemuan 2 (Slide 6–8)
  { id: 6, meetingNumber: 2, meetingTitle: 'Batasan Nyata & Linear', meetingJP: '2 JP', title: 'Batasan Nyata', subtitle: 'Target Belajar P2', tag: '06 · PEMBUKA' },
  { id: 7, meetingNumber: 2, meetingTitle: 'Batasan Nyata & Linear', meetingJP: '2 JP', title: 'Domain & Range', subtitle: 'Batasan Nyata', tag: '07 · DOMAIN' },
  { id: 8, meetingNumber: 2, meetingTitle: 'Batasan Nyata & Linear', meetingJP: '2 JP', title: 'Model Linier', subtitle: 'f(x) = ax + b', tag: '08 · MODEL' },

  // Pertemuan 3 (Slide 9–12)
  { id: 9, meetingNumber: 3, meetingTitle: 'Fungsi Sepenggal (Piecewise)', meetingJP: '2 JP', title: 'Piecewise', subtitle: 'Target Belajar P3', tag: '09 · PEMBUKA' },
  { id: 10, meetingNumber: 3, meetingTitle: 'Fungsi Sepenggal (Piecewise)', meetingJP: '2 JP', title: 'Batasan 1 Garis', subtitle: 'Dilema Tarif', tag: '10 · MASALAH' },
  { id: 11, meetingNumber: 3, meetingTitle: 'Fungsi Sepenggal (Piecewise)', meetingJP: '2 JP', title: 'Fungsi Bercabang', subtitle: 'Piecewise & Titik', tag: '11 · PIECEWISE' },
  { id: 12, meetingNumber: 3, meetingTitle: 'Fungsi Sepenggal (Piecewise)', meetingJP: '2 JP', title: 'Rancang Fungsi', subtitle: 'Sandbox Builder', tag: '12 · SANDBOX' },

  // Pertemuan 4 (Slide 13–14)
  { id: 13, meetingNumber: 4, meetingTitle: 'Proyek Nyata & Asesmen', meetingJP: '2 JP', title: 'Proyek Nyata', subtitle: 'Target Belajar P4', tag: '13 · PEMBUKA' },
  { id: 14, meetingNumber: 4, meetingTitle: 'Proyek Nyata & Asesmen', meetingJP: '2 JP', title: 'Katalog Proyek', subtitle: 'Kasus & Rubrik', tag: '14 · PROYEK' },
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
        return <Slide4VerticalLineTest />;
      case 5:
        return <Slide6OpeningDomain onNext={handleNext} />;
      case 6:
        return <Slide5DomainRange />;
      case 7:
        return <Slide6LinearGraph />;
      case 8:
        return <Slide9OpeningPiecewise onNext={handleNext} />;
      case 9:
        return <Slide7WhyPiecewise />;
      case 10:
        return <Slide8PiecewiseIntro />;
      case 11:
        return <Slide9SandboxBuilder />;
      case 12:
        return <Slide13OpeningProject onNext={handleNext} />;
      case 13:
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
      />

      {/* Slide Presentation Frame */}
      <SlideContainer onNext={handleNext} onPrev={handlePrev}>
        {renderSlideContent()}
      </SlideContainer>

      {/* Print-Only A4 Project Worksheet */}
      <WorksheetPrint />
    </div>
  );
};

export default App;
