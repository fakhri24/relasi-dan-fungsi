import React, { useState, useEffect } from 'react';
import { X, QrCode, ShieldCheck, Laptop, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  meeting?: 1 | 2;
  onOpenLkpd: (meeting: 1 | 2) => void;
  onOpenTeacherDashboard: () => void;
}

export const ProjectorQrModal: React.FC<Props> = ({
  isOpen,
  onClose,
  meeting = 1,
  onOpenLkpd,
  onOpenTeacherDashboard
}) => {
  const [activeMeeting, setActiveMeeting] = useState<1 | 2>(meeting);

  useEffect(() => {
    if (meeting) {
      setActiveMeeting(meeting);
    }
  }, [meeting, isOpen]);

  if (!isOpen) return null;

  // Bangun URL spesifik mode LKPD sesuai pertemuan terpilih
  const getMeetingUrl = (m: 1 | 2) => {
    if (typeof window === 'undefined') return 'https://supermath.id';
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', m === 1 ? 'lkpd1' : 'lkpd2');
      // Bersihkan parameter slide agar siswa langsung fokus ke lembar LKPD
      url.searchParams.delete('slide');
      return url.toString();
    } catch {
      return `https://supermath.id?mode=${m === 1 ? 'lkpd1' : 'lkpd2'}`;
    }
  };

  const targetUrl = getMeetingUrl(activeMeeting);
  // QR Server API untuk generate QR code SVG/PNG presisi
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(targetUrl)}&margin=10`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative text-white space-y-5">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher Pertemuan 1 vs 2 */}
        <div className="flex justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveMeeting(1)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMeeting === 1
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pertemuan 1 (Relasi & Fungsi)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMeeting(2)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMeeting === 2
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pertemuan 2 (Domain & Linear)</span>
          </button>
        </div>

        {/* Header Proyektor */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <QrCode className="w-3.5 h-3.5" />
            <span>Akses Kelas Pertemuan {activeMeeting}</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Mulai LKPD Digital Siswa · P{activeMeeting}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            {activeMeeting === 1
              ? 'Investigasi 3 kasus kantin, identifikasi pelanggaran fungsi, dan uji garis vertikal.'
              : 'Analisis batas fisik baterai/kamera, notasi selang [a, b], rumus f(x) = ax + b, dan plot titik kartesius.'}
          </p>
        </div>

        {/* Kotak QR Code Besar */}
        <div className="bg-white p-4 rounded-3xl shadow-xl max-w-xs mx-auto flex flex-col items-center border-4 border-brand-500/30">
          <img
            src={qrCodeUrl}
            alt={`QR Code LKPD Digital Siswa Pertemuan ${activeMeeting}`}
            className="w-56 h-56 object-contain"
          />
          <div className="mt-2 text-center">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
              Scan untuk Kerjakan di Device (Tablet / HP)
            </span>
          </div>
        </div>

        {/* Panduan Siswa & Tombol Aksi */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onClose();
                onOpenLkpd(activeMeeting);
              }}
              className="py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all cursor-pointer"
            >
              <Laptop className="w-4 h-4" />
              <span>Buka LKPD {activeMeeting} di Layar Ini</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenTeacherDashboard();
              }}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Dashboard Guru (Admin) 🔒</span>
            </button>
          </div>

          <div className="text-center">
            <span className="text-[11px] text-slate-500">
              Data tersimpan otomatis ke Cloud Firestore · Tidak memerlukan kertas cetak
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
