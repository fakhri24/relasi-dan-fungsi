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
  { id: 1, title: 'Pemantik: Mengapa Butuh Fungsi?', subtitle: 'Dunia Tanpa Kepastian', tag: 'Hook' },
  { id: 2, title: 'Model Mental: Mesin Fungsi', subtitle: 'Input, Aturan, dan Output', tag: 'Konsep 1' },
  { id: 3, title: 'Relasi vs Fungsi: Syarat Pemetaan', subtitle: 'Diagram Panah Interaktif', tag: 'Konsep 2' },
  { id: 4, title: 'Uji Garis Vertikal pada Grafik', subtitle: 'Vertical Line Test', tag: 'Konsep 3' },
  { id: 5, title: 'Domain & Range: Batasan Fisik', subtitle: 'Bukan Sekadar Angka', tag: 'Konsep 4' },
  { id: 6, title: 'Kata-kata → Rumus → Grafik', subtitle: 'Representasi f(x) = ax + b', tag: 'Konsep 5' },
  { id: 7, title: 'Tantangan: Mengapa 1 Rumus Gagal?', subtitle: 'Kebutuhan Aturan Bercabang', tag: 'Masalah' },
  { id: 8, title: 'Membaca Notasi Fungsi Sepenggal', subtitle: 'Piecewise & Titik Terbuka/Tertutup', tag: 'Konsep 6' },
  { id: 9, title: 'Sandbox: Merakit Aturan Sendiri', subtitle: 'Eksperimen Interaktif', tag: 'Lab' },
  { id: 10, title: 'Proyek: Katalog Fungsi Dunia Nyata', subtitle: 'Studi Kasus, Rubrik & Worksheet', tag: 'Proyek' },
];

export const App: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between font-sans">
      {/* Navbar & Slide Controller */}
      <Navbar
        slides={SLIDES}
        currentIndex={currentSlideIndex}
        onSelectSlide={setCurrentSlideIndex}
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
