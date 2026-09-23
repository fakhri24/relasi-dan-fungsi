import React from 'react';
import { X, QrCode, ShieldCheck, Laptop } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenLkpd: () => void;
  onOpenTeacherDashboard: () => void;
}

export const ProjectorQrModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenLkpd,
  onOpenTeacherDashboard
}) => {
  if (!isOpen) return null;

  // URL halaman saat ini untuk QR Code
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://supermath.id';
  // QR Server API untuk generate QR code SVG/PNG presisi
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(currentUrl)}&margin=10`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative text-white space-y-6">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Proyektor */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950 border border-brand-800 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <QrCode className="w-3.5 h-3.5" />
            <span>Akses Kelas Pertemuan 1</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Mulai LKPD Digital Siswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Arahkan kamera tablet atau smartphone ke layar proyektor untuk membuka lembar kerja interaktif.
          </p>
        </div>

        {/* Kotak QR Code Besar */}
        <div className="bg-white p-4 rounded-3xl shadow-xl max-w-xs mx-auto flex flex-col items-center border-4 border-brand-500/30">
          <img
            src={qrCodeUrl}
            alt="QR Code LKPD Digital Siswa"
            className="w-56 h-56 object-contain"
          />
          <div className="mt-2 text-center">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
              Scan untuk Kerjakan di Device
            </span>
          </div>
        </div>

        {/* Panduan Siswa & Tombol Aksi */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onClose();
                onOpenLkpd();
              }}
              className="py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all"
            >
              <Laptop className="w-4 h-4" />
              <span>Buka di Layar Ini (Laptop)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenTeacherDashboard();
              }}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold flex items-center justify-center gap-2 transition-all"
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
