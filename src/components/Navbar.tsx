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
  Sun,
  Moon,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { SlideItem } from '../types/slides';

interface NavbarProps {
  slides: SlideItem[];
  currentIndex: number;
  onSelectSlide: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenLkpd?: () => void;
  onOpenTeacherDashboard?: () => void;
  onOpenProjectorQr?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  slides,
  currentIndex,
  onSelectSlide,
  onNext,
  onPrev,
  theme = 'dark',
  onToggleTheme,
  onOpenLkpd,
  onOpenTeacherDashboard,
  onOpenProjectorQr,
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
  const currentMeeting = slides[currentIndex]?.meetingNumber || 1;

  const getMeetingBadgeStyle = (meetingNum: number) => {
    switch (meetingNum) {
      case 1:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 2:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 3:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 4:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-brand-500/20 text-brand-300 border-brand-500/30';
    }
  };

  return (
    <>
      <header className="no-print sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3">
        {/* Progress Bar di bagian paling atas dengan Penanda Sesi */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Pembatas halus antar-pertemuan */}
          <div className="absolute top-0 bottom-0 left-[35.71%] w-0.5 bg-slate-950/90 z-10" title="Batas Pertemuan 1" />
          <div className="absolute top-0 bottom-0 left-[57.14%] w-0.5 bg-slate-950/90 z-10" title="Batas Pertemuan 2" />
          <div className="absolute top-0 bottom-0 left-[85.71%] w-0.5 bg-slate-950/90 z-10" title="Batas Pertemuan 3" />
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
                <span className="font-extrabold text-slate-900 dark:text-white text-base md:text-lg tracking-tight">
                  SuperMath MTK X
                </span>
                <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30">
                  Relasi & Fungsi
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-xs font-bold border transition-colors ${getMeetingBadgeStyle(
                    currentMeeting
                  )}`}
                >
                  P{currentMeeting} · {slides[currentIndex]?.meetingJP || '2 JP'}
                </span>
              </div>
              <div className="text-xs text-slate-400 hidden md:block">
                Slide {currentIndex + 1} dari {slides.length}: <span className="text-slate-200 font-medium">{slides[currentIndex].title}</span>
                <span className="text-slate-500"> — {slides[currentIndex]?.meetingTitle}</span>
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
              <span className="hidden xl:inline">LKPD Cetak</span>
            </a>

            {onOpenProjectorQr && (
              <button
                onClick={onOpenProjectorQr}
                className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600/30 to-indigo-600/30 hover:from-brand-600/50 hover:to-indigo-600/50 border border-brand-500/50 text-brand-300 hover:text-white transition-all ml-1 flex items-center gap-1.5 text-xs font-bold shadow-sm"
                title="Buka LKPD Digital Siswa (Scan QR / Laptop)"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span className="hidden xl:inline">LKPD Digital</span>
              </button>
            )}

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 hover:text-white transition-all ml-1 flex items-center gap-1.5 text-xs font-bold"
                title={theme === 'dark' ? 'Beralih ke Mode Cerah (T)' : 'Beralih ke Mode Gelap (T)'}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden xl:inline">Cerah</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span className="hidden xl:inline">Gelap</span>
                  </>
                )}
              </button>
            )}

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

      {/* Drawer Menu Daftar Slide Terbagi 4 Pertemuan */}
      {menuOpen && (
        <div className="no-print fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-start animate-fadeIn">
          <div className="w-full max-w-md bg-slate-950 border-r border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-brand-400" />
                  <h3 className="font-extrabold text-lg text-white">Navigasi 4 Pertemuan</h3>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grouped Slides by Meeting */}
              <div className="space-y-4 mt-4">
                {[1, 2, 3, 4].map((meetingNum) => {
                  const meetingSlides = slides
                    .map((s, idx) => ({ ...s, originalIndex: idx }))
                    .filter((s) => s.meetingNumber === meetingNum);

                  if (meetingSlides.length === 0) return null;
                  const firstSlide = meetingSlides[0];

                  return (
                    <div key={`meeting-group-${meetingNum}`} className="space-y-1.5">
                      <div className="flex items-center justify-between px-1 text-xs font-mono font-bold text-slate-400 border-b border-slate-900 pb-1">
                        <span className="text-brand-300 uppercase">
                          Pertemuan {meetingNum}: {firstSlide.meetingTitle}
                        </span>
                        <span className="text-slate-500">{firstSlide.meetingJP}</span>
                      </div>
                      <div className="space-y-1">
                        {meetingSlides.map((s) => {
                          const idx = s.originalIndex;
                          const isActive = currentIndex === idx;

                          return (
                            <button
                              key={s.id}
                              onClick={() => {
                                onSelectSlide(idx);
                                setMenuOpen(false);
                              }}
                              className={`w-full p-2.5 rounded-xl text-left transition-all border flex items-center gap-2.5 ${
                                isActive
                                  ? 'bg-brand-600/20 border-brand-500 text-slate-900 dark:text-white font-bold'
                                  : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-900'
                              }`}
                            >
                              <span
                                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                                  isActive ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="text-[10px] text-brand-400 uppercase tracking-wider font-semibold">
                                  {s.tag}
                                </div>
                                <div className="text-xs truncate font-medium">{s.title}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-slate-200 transition-all flex items-center justify-between text-xs font-bold"
                  title="Ganti Tema Tampilan (Pintasan: T)"
                >
                  <span className="flex items-center gap-2">
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Moon className="w-4 h-4 text-indigo-400" />
                    )}
                    <span>Tema Layar</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300">
                    {theme === 'dark' ? '☀️ Mode Cerah' : '🌙 Mode Gelap'}
                  </span>
                </button>
              )}
              {onOpenProjectorQr && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenProjectorQr();
                  }}
                  className="w-full p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white transition-all flex items-center justify-center gap-2 text-xs font-bold shadow-md shadow-brand-600/30"
                >
                  <QrCode className="w-4 h-4 text-cyan-300" />
                  <span>Mulai LKPD Digital (QR / Tablet)</span>
                </button>
              )}

              {onOpenTeacherDashboard && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenTeacherDashboard();
                  }}
                  className="w-full p-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Dashboard Guru (Admin & Roster) 🔒</span>
                </button>
              )}

              {onOpenLkpd && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenLkpd();
                  }}
                  className="w-full p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Kerjakan LKPD Digital (Laptop) ➔</span>
                </button>
              )}

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
                💡 Pintasan: <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">→</kbd> Navigasi · <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">T</kbd> Tema
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
