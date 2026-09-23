import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Menu,
  X,
  Compass,
  BookOpen,
  FileText,
} from 'lucide-react';
import { SlideItem } from '../types/slides';

interface NavbarProps {
  slides: SlideItem[];
  currentIndex: number;
  onSelectSlide: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  slides,
  currentIndex,
  onSelectSlide,
  onNext,
  onPrev,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  const progressPercent = ((currentIndex + 1) / slides.length) * 100;

  return (
    <>
      <header className="no-print sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3">
        {/* Progress Bar di bagian paling atas */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Logo & Judul Topik */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-all"
              title="Daftar Slide"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base md:text-lg tracking-tight">
                  SuperMath MTK X
                </span>
                <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30">
                  Relasi & Fungsi
                </span>
              </div>
              <div className="text-xs text-slate-400 hidden md:block">
                Slide {currentIndex + 1} dari {slides.length}: <span className="text-slate-200 font-medium">{slides[currentIndex].title}</span>
              </div>
            </div>
          </div>

          {/* Navigasi Slide Tengah & Kontrol Guru */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 text-slate-200 transition-all flex items-center gap-1 text-xs font-bold"
              title="Slide Sebelumnya (Panah Kiri)"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-mono">Prev</span>
            </button>

            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs md:text-sm font-bold text-slate-200">
              <span className="text-brand-400">{currentIndex + 1}</span>
              <span className="text-slate-500"> / </span>
              <span>{slides.length}</span>
            </div>

            <button
              onClick={onNext}
              disabled={currentIndex === slides.length - 1}
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all flex items-center gap-1 text-xs font-bold shadow-md shadow-brand-600/20"
              title="Slide Berikutnya (Panah Kanan / Spasi)"
            >
              <span className="hidden sm:inline font-mono">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <a
              href="./panduan-guru.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all ml-1 flex items-center gap-1.5 text-xs font-bold"
              title="Buka Panduan Modul Ajar Guru"
            >
              <BookOpen className="w-4 h-4 text-brand-400" />
              <span className="hidden xl:inline">Panduan Guru</span>
            </a>

            <a
              href="./lks-siswa.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all ml-1 flex items-center gap-1.5 text-xs font-bold"
              title="Cetak Lembar Kerja Siswa (LKPD A4)"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="hidden xl:inline">LKPD Siswa</span>
            </a>

            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all ml-1"
              title="Mode Layar Penuh (F)"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Menu Daftar Slide */}
      {menuOpen && (
        <div className="no-print fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-start animate-fadeIn">
          <div className="w-full max-w-md bg-slate-950 border-r border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-brand-400" />
                  <h3 className="font-extrabold text-lg text-white">Navigasi Modul</h3>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mt-4">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectSlide(idx);
                      setMenuOpen(false);
                    }}
                    className={`w-full p-3 rounded-xl text-left transition-all border flex items-center gap-3 ${
                      currentIndex === idx
                        ? 'bg-brand-600/20 border-brand-500 text-white font-bold'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        currentIndex === idx ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs text-brand-400 uppercase tracking-wider font-semibold">
                        {s.tag}
                      </div>
                      <div className="text-sm truncate font-medium">{s.title}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <a
                href="./panduan-guru.html"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-2.5 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/40 text-brand-300 transition-all flex items-center justify-center gap-2 text-xs font-bold"
              >
                <BookOpen className="w-4 h-4" /> Buka Panduan Guru (4 Pertemuan) ↗
              </a>
              <a
                href="./lks-siswa.html"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 transition-all flex items-center justify-center gap-2 text-xs font-bold"
              >
                <FileText className="w-4 h-4" /> Cetak Lembar Kerja Siswa (LKPD 1-4) ↗
              </a>
              <div className="text-xs text-slate-500">
                💡 Pintasan Keyboard: <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">←</kbd> Sebelumnya · <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">→</kbd> Berikutnya
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
