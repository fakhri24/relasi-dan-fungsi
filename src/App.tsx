import React, { useState } from 'react';
import { SlideItem } from './types/slides';
import { Navbar } from './components/Navbar';
import { SlideContainer } from './components/SlideContainer';
import { WorksheetPrint } from './components/WorksheetPrint';

// 10 Slides
import { Slide1Hook } from './components/slides/Slide1Hook';
import { Slide2Machine } from './components/slides/Slide2Machine';
import { Slide3ArrowDiagram } from './components/slides/Slide3ArrowDiagram';
import { Slide4VerticalLineTest } from './components/slides/Slide4VerticalLineTest';
import { Slide5DomainRange } from './components/slides/Slide5DomainRange';
import { Slide6LinearGraph } from './components/slides/Slide6LinearGraph';
import { Slide7WhyPiecewise } from './components/slides/Slide7WhyPiecewise';
import { Slide8PiecewiseIntro } from './components/slides/Slide8PiecewiseIntro';
import { Slide9SandboxBuilder } from './components/slides/Slide9SandboxBuilder';
import { Slide10ProjectHub } from './components/slides/Slide10ProjectHub';

const SLIDES: SlideItem[] = [
  { id: 1, title: 'Mesin Kasir', subtitle: 'Kasir Rusak', tag: '01 · PEMANTIK' },
  { id: 2, title: 'Mesin Fungsi', subtitle: 'Input & Output', tag: '02 · MESIN' },
  { id: 3, title: 'Relasi & Fungsi', subtitle: 'Diagram Panah', tag: '03 · RELASI' },
  { id: 4, title: 'Uji Garis Vertikal', subtitle: 'Scanner Garis', tag: '04 · UJI GRAFIK' },
  { id: 5, title: 'Domain & Range', subtitle: 'Batasan Nyata', tag: '05 · DOMAIN' },
  { id: 6, title: 'Model Linier', subtitle: 'f(x) = ax + b', tag: '06 · MODEL' },
  { id: 7, title: 'Batasan 1 Garis', subtitle: 'Dilema Tarif', tag: '07 · MASALAH' },
  { id: 8, title: 'Fungsi Bercabang', subtitle: 'Piecewise & Titik', tag: '08 · PIECEWISE' },
  { id: 9, title: 'Rancang Fungsi', subtitle: 'Sandbox Builder', tag: '09 · SANDBOX' },
  { id: 10, title: 'Katalog Proyek', subtitle: 'Kasus & Rubrik', tag: '10 · PROYEK' },
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
        return <Slide1Hook />;
      case 1:
        return <Slide2Machine />;
      case 2:
        return <Slide3ArrowDiagram />;
      case 3:
        return <Slide4VerticalLineTest />;
      case 4:
        return <Slide5DomainRange />;
      case 5:
        return <Slide6LinearGraph />;
      case 6:
        return <Slide7WhyPiecewise />;
      case 7:
        return <Slide8PiecewiseIntro />;
      case 8:
        return <Slide9SandboxBuilder />;
      case 9:
        return <Slide10ProjectHub />;
      default:
        return <Slide1Hook />;
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-950 flex flex-col justify-between font-sans">
      {/* Navbar & Slide Controller */}
      <Navbar
        slides={SLIDES}
        currentIndex={currentSlideIndex}
        onSelectSlide={updateSlide}
        onNext={handleNext}
        onPrev={handlePrev}
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
