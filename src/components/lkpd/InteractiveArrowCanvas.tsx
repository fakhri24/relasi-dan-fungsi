import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Trash2, Plus, Download, CheckCircle2, AlertTriangle, Camera, Check } from 'lucide-react';
import { ArrowRelation } from '../../types/lkpd';

export interface InteractiveArrowCanvasRef {
  exportToBase64: () => Promise<string>;
}

interface Props {
  title: string;
  subtitle?: string;
  setAName: string;
  setBName: string;
  itemsA: string[];
  itemsB: string[];
  arrows: ArrowRelation[];
  onChangeArrows: (newArrows: ArrowRelation[]) => void;
  // Jika true, siswa bisa menambah / mengedit nama himpunan dan anggota (Kasus 3)
  isEditableSets?: boolean;
  onUpdateSetAName?: (name: string) => void;
  onUpdateSetBName?: (name: string) => void;
  onUpdateItemsA?: (items: string[]) => void;
  onUpdateItemsB?: (items: string[]) => void;
  allowDownload?: boolean;
  savedImage?: string;
  onSaveSnapshot?: (base64: string) => void;
}

export const InteractiveArrowCanvas = forwardRef<InteractiveArrowCanvasRef, Props>(({
  title,
  subtitle,
  setAName,
  setBName,
  itemsA,
  itemsB,
  arrows,
  onChangeArrows,
  isEditableSets = false,
  onUpdateSetAName,
  onUpdateSetBName,
  onUpdateItemsA,
  onUpdateItemsB,
  allowDownload = true,
  savedImage,
  onSaveSnapshot
}, ref) => {
  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [newItemA, setNewItemA] = useState('');
  const [newItemB, setNewItemB] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Analisis real-time apakah diagram ini memenuhi syarat fungsi
  const sourceCounts: Record<string, number> = {};
  itemsA.forEach(item => { sourceCounts[item] = 0; });
  arrows.forEach(rel => {
    if (sourceCounts[rel.from] !== undefined) {
      sourceCounts[rel.from]++;
    }
  });

  const jombloList = itemsA.filter(item => sourceCounts[item] === 0);
  const menduaList = itemsA.filter(item => sourceCounts[item] > 1);
  const isFunctionValid = itemsA.length > 0 && jombloList.length === 0 && menduaList.length === 0;

  // Koordinat geometris SVG
  const width = 560;
  const height = 320;
  const leftX = 140; // Garis tengah himpunan A
  const rightX = 420; // Garis tengah himpunan B
  const anchorDotAX = 206; // Bibir kanan kapsul himpunan A
  const anchorDotBX = 354; // Bibir kiri kapsul himpunan B

  // Hitung posisi Y untuk tiap item di A
  const getYPosA = (index: number, total: number) => {
    if (total <= 1) return height / 2;
    const startY = 80;
    const endY = height - 40;
    const step = (endY - startY) / Math.max(1, total - 1);
    return startY + index * step;
  };

  // Hitung posisi Y untuk tiap item di B
  const getYPosB = (index: number, total: number) => {
    if (total <= 1) return height / 2;
    const startY = 80;
    const endY = height - 40;
    const step = (endY - startY) / Math.max(1, total - 1);
    return startY + index * step;
  };

  // Handle klik item A
  const handleItemAClick = (item: string) => {
    if (selectedA === item) {
      setSelectedA(null);
    } else {
      setSelectedA(item);
    }
  };

  // Handle klik item B
  const handleItemBClick = (itemB: string) => {
    if (!selectedA) return;

    // Cek apakah relasi sudah ada
    const existingIndex = arrows.findIndex(
      arr => arr.from === selectedA && arr.to === itemB
    );

    if (existingIndex >= 0) {
      // Hapus panah jika sudah ada
      const updated = arrows.filter((_, idx) => idx !== existingIndex);
      onChangeArrows(updated);
    } else {
      // Tambah panah baru
      onChangeArrows([...arrows, { from: selectedA, to: itemB }]);
    }
    setSelectedA(null);
  };

  // Hapus semua panah
  const handleResetArrows = () => {
    onChangeArrows([]);
    setSelectedA(null);
  };

  // Tambah item ke Himpunan A
  const handleAddItemA = () => {
    const val = newItemA.trim();
    if (!val || itemsA.includes(val) || itemsA.length >= 6) return;
    onUpdateItemsA?.([...itemsA, val]);
    setNewItemA('');
  };

  // Hapus item dari Himpunan A
  const handleRemoveItemA = (itemToRemove: string) => {
    if (itemsA.length <= 1) return;
    onUpdateItemsA?.(itemsA.filter(i => i !== itemToRemove));
    onChangeArrows(arrows.filter(a => a.from !== itemToRemove));
    if (selectedA === itemToRemove) setSelectedA(null);
  };

  // Tambah item ke Himpunan B
  const handleAddItemB = () => {
    const val = newItemB.trim();
    if (!val || itemsB.includes(val) || itemsB.length >= 6) return;
    onUpdateItemsB?.([...itemsB, val]);
    setNewItemB('');
  };

  // Hapus item dari Himpunan B
  const handleRemoveItemB = (itemToRemove: string) => {
    if (itemsB.length <= 1) return;
    onUpdateItemsB?.(itemsB.filter(i => i !== itemToRemove));
    onChangeArrows(arrows.filter(a => a.to !== itemToRemove));
  };

  // Fungsi export SVG ke Base64 Image
  const exportToBase64 = async (): Promise<string> => {
    return new Promise((resolve) => {
      try {
        if (!svgRef.current) {
          resolve('');
          return;
        }

        const svgElement = svgRef.current;
        const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
        svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const svgString = new XMLSerializer().serializeToString(svgClone);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width * 1.5;
          canvas.height = height * 1.5;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#090d16';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/webp', 0.85);
            URL.revokeObjectURL(blobURL);
            resolve(dataUrl);
          } else {
            resolve('');
          }
        };
        image.onerror = (err) => {
          console.error('Image render error:', err);
          URL.revokeObjectURL(blobURL);
          resolve('');
        };
        image.src = blobURL;
      } catch (err) {
        console.error('Export Base64 failed', err);
        resolve('');
      }
    });
  };

  useImperativeHandle(ref, () => ({
    exportToBase64
  }));

  // Handle klik tombol Simpan Gambar ke Jawaban
  const handleSaveSnapshot = async () => {
    try {
      setIsCapturing(true);
      const base64 = await exportToBase64();
      if (base64) {
        onSaveSnapshot?.(base64);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2500);
      }
    } catch (err) {
      console.error('Save snapshot failed:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  // Download manual PNG
  const handleDownloadImage = async () => {
    const base64 = await exportToBase64();
    if (!base64) return;
    const link = document.createElement('a');
    link.download = `diagram-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
    link.href = base64;
    link.click();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 md:p-4 shadow-xl flex flex-col space-y-3">
      {/* Header Interaktif */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
            {title}
          </h4>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {/* Badge Validasi Real-time */}
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
            isFunctionValid 
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20' 
              : 'bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20'
          }`}>
            {isFunctionValid ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Format Fungsi Sah</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>
                  {jombloList.length > 0 && menduaList.length > 0
                    ? 'Ada Jomblo & Mendua'
                    : jombloList.length > 0
                    ? `Ada Jomblo (${jombloList.join(', ')})`
                    : menduaList.length > 0
                    ? `Ada Mendua (${menduaList.join(', ')})`
                    : 'Belum Ada Panah'}
                </span>
              </>
            )}
          </div>

          {/* Tombol Simpan Gambar ke Jawaban LKPD */}
          <button
            type="button"
            onClick={handleSaveSnapshot}
            disabled={isCapturing}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              justSaved || savedImage
                ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 shadow-emerald-500/20'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30'
            }`}
            title="Simpan diagram panah ini ke data jawaban LKPD"
          >
            {isCapturing ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : justSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tersimpan!</span>
              </>
            ) : savedImage ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Perbarui Simpanan</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5 text-white" />
                <span>Simpan Diagram</span>
              </>
            )}
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleResetArrows}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1"
            title="Reset semua panah relasi"
          >
            <Trash2 className="w-3 h-3" />
            <span>Reset Panah</span>
          </button>

          {/* Download button */}
          {allowDownload && (
            <button
              type="button"
              onClick={handleDownloadImage}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-900/60 hover:bg-brand-800 text-brand-300 hover:text-white border border-brand-700/60 transition-all flex items-center gap-1"
              title="Unduh gambar diagram PNG ke perangkat"
            >
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Unduh PNG</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Anggota Himpunan (Khusus Kasus 3: Kreasi Mandiri) */}
      {isEditableSets && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs">
          {/* Editor Himpunan A */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">Himpunan Asal (A):</span>
              <input
                type="text"
                value={setAName}
                onChange={e => onUpdateSetAName?.(e.target.value)}
                placeholder="Nama Himpunan A (cth: Siswa)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={newItemA}
                onChange={e => setNewItemA(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddItemA())}
                placeholder="Tambah anggota A..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddItemA}
                className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Tambah
              </button>
            </div>
            {/* List anggota A dengan tombol hapus */}
            <div className="flex flex-wrap gap-1 mt-1">
              {itemsA.map(item => (
                <span key={item} className="inline-flex items-center gap-1 bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 rounded px-1.5 py-0.5 text-[11px]">
                  {item}
                  {itemsA.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItemA(item)}
                      className="text-indigo-400 hover:text-rose-400"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Editor Himpunan B */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">Himpunan Kawan (B):</span>
              <input
                type="text"
                value={setBName}
                onChange={e => onUpdateSetBName?.(e.target.value)}
                placeholder="Nama Himpunan B (cth: Hobi)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={newItemB}
                onChange={e => setNewItemB(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddItemB())}
                placeholder="Tambah anggota B..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddItemB}
                className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Tambah
              </button>
            </div>
            {/* List anggota B dengan tombol hapus */}
            <div className="flex flex-wrap gap-1 mt-1">
              {itemsB.map(item => (
                <span key={item} className="inline-flex items-center gap-1 bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 rounded px-1.5 py-0.5 text-[11px]">
                  {item}
                  {itemsB.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItemB(item)}
                      className="text-cyan-400 hover:text-rose-400"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instruksi Sentuh & Klik */}
      <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
        <span>
          💡 <strong>Cara Pakai:</strong> Klik 1 nama di <strong>Himpunan A</strong> (akan menyala), lalu klik 1 pilihan di <strong>Himpunan B</strong> untuk menarik panah. Klik panah yang sama untuk menghapus.
        </span>
        {selectedA && (
          <span className="text-amber-400 font-bold animate-pulse">
            Terpilih: {selectedA} ➔ Pilih tujuan di Himpunan B!
          </span>
        )}
      </div>

      {/* Kanvas Diagram SVG */}
      <div className="relative w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 flex justify-center py-2">
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-xl h-auto select-none"
          style={{ minHeight: '260px' }}
        >
          <defs>
            {/* Definisi Mata Panah Tajam Bergradien */}
            <marker
              id={`arrow-head-${title.replace(/[^a-z0-9]/gi, '')}`}
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M 0 1 L 7 4 L 0 7 z" fill="#38bdf8" />
            </marker>

            <linearGradient id={`grad-arrow-${title.replace(/[^a-z0-9]/gi, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            <filter id="glow-filter" filterUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Stadium Kapsul Venn Himpunan A (Domain) */}
          <rect
            x={leftX - 70}
            y="36"
            width="140"
            height={height - 52}
            rx="42"
            fill="#1e1b4b"
            fillOpacity="0.45"
            stroke="#6366f1"
            strokeWidth="2"
            strokeDasharray="5 3"
          />
          <text
            x={leftX}
            y="25"
            textAnchor="middle"
            fill="#a5b4fc"
            fontSize="13"
            fontWeight="bold"
            fontFamily="Inter, sans-serif"
          >
            {setAName} (A)
          </text>

          {/* Stadium Kapsul Venn Himpunan B (Kodomain) */}
          <rect
            x={rightX - 70}
            y="36"
            width="140"
            height={height - 52}
            rx="42"
            fill="#083344"
            fillOpacity="0.45"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeDasharray="5 3"
          />
          <text
            x={rightX}
            y="25"
            textAnchor="middle"
            fill="#67e8f9"
            fontSize="13"
            fontWeight="bold"
            fontFamily="Inter, sans-serif"
          >
            {setBName} (B)
          </text>

          {/* Garis Panah Relasi Kurva Bezier */}
          {arrows.map((rel, idx) => {
            const indexA = itemsA.indexOf(rel.from);
            const indexB = itemsB.indexOf(rel.to);
            if (indexA === -1 || indexB === -1) return null;

            const y1 = getYPosA(indexA, itemsA.length);
            const y2 = getYPosB(indexB, itemsB.length);

            // Hitung panah dari sumber yang sama untuk variasi lengkungan
            const sourceArrows = arrows.filter(a => a.from === rel.from);
            const sourceArrowIdx = sourceArrows.findIndex(a => a.to === rel.to);
            const isMultiSource = sourceArrows.length > 1;

            // Titik kontrol Bezier cerdas (busur jika horizontal, spread jika multi-sumber)
            let pathD: string;
            if (y1 === y2) {
              const arcY = y1 - (isMultiSource ? 16 : 12);
              pathD = `M ${anchorDotAX} ${y1} C ${anchorDotAX + 55} ${arcY}, ${anchorDotBX - 55} ${arcY}, ${anchorDotBX} ${y2}`;
            } else {
              const spreadOffset = isMultiSource ? (sourceArrowIdx === 0 ? -5 : 5) : 0;
              const cp1Y = y1 + spreadOffset;
              pathD = `M ${anchorDotAX} ${y1} C ${anchorDotAX + 60} ${cp1Y}, ${anchorDotBX - 60} ${y2}, ${anchorDotBX} ${y2}`;
            }

            return (
              <g key={`${rel.from}-${rel.to}-${idx}`} className="cursor-pointer group">
                {/* Hit area lebih tebal untuk kemudahan klik */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="16"
                  onClick={() => {
                    const updated = arrows.filter((_, i) => i !== idx);
                    onChangeArrows(updated);
                  }}
                />
                {/* Garis panah glow */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={`url(#grad-arrow-${title.replace(/[^a-z0-9]/gi, '')})`}
                  strokeWidth="2.5"
                  markerEnd={`url(#arrow-head-${title.replace(/[^a-z0-9]/gi, '')})`}
                  filter="url(#glow-filter)"
                  className="transition-all hover:stroke-rose-400 group-hover:stroke-width-3"
                />
              </g>
            );
          })}

          {/* Elemen-elemen Himpunan A */}
          {itemsA.map((item, idx) => {
            const y = getYPosA(idx, itemsA.length);
            const isSelected = selectedA === item;
            const count = sourceCounts[item] || 0;
            const isJomblo = count === 0;
            const isMendua = count > 1;

            return (
              <g
                key={`a-${item}`}
                onClick={() => handleItemAClick(item)}
                className="cursor-pointer group"
              >
                {/* Pill Background Item A - pas di dalam kapsul */}
                <rect
                  x={leftX - 58}
                  y={y - 14}
                  width="112"
                  height="28"
                  rx="14"
                  fill={isSelected ? '#4338ca' : isMendua ? '#881337' : '#1e1b4b'}
                  stroke={isSelected ? '#a5b4fc' : isMendua ? '#f43f5e' : isJomblo ? '#6366f1' : '#10b981'}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  className="transition-all hover:fill-indigo-900"
                />
                {/* Teks Item A */}
                <text
                  x={leftX - 6}
                  y={y + 4}
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : '#e0e7ff'}
                  fontSize="11"
                  fontWeight={isSelected ? 'bold' : '600'}
                  fontFamily="Inter, sans-serif"
                >
                  {item}
                </text>
                {/* Titik Noktah Bibir Kanan A */}
                <circle
                  cx={anchorDotAX}
                  cy={y}
                  r={isSelected ? '5.5' : '4'}
                  fill={isSelected ? '#38bdf8' : '#818cf8'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-transform group-hover:scale-125"
                />
              </g>
            );
          })}

          {/* Elemen-elemen Himpunan B */}
          {itemsB.map((item, idx) => {
            const y = getYPosB(idx, itemsB.length);

            return (
              <g
                key={`b-${item}`}
                onClick={() => handleItemBClick(item)}
                className="cursor-pointer group"
              >
                {/* Titik Noktah Bibir Kiri B */}
                <circle
                  cx={anchorDotBX}
                  cy={y}
                  r="4"
                  fill="#06b6d4"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-transform group-hover:scale-125"
                />
                {/* Pill Background Item B - pas di dalam kapsul */}
                <rect
                  x={rightX - 54}
                  y={y - 14}
                  width="112"
                  height="28"
                  rx="14"
                  fill="#083344"
                  stroke="#0891b2"
                  strokeWidth="1.5"
                  className="transition-all hover:fill-cyan-900 group-hover:stroke-cyan-400"
                />
                {/* Teks Item B */}
                <text
                  x={rightX + 2}
                  y={y + 4}
                  textAnchor="middle"
                  fill="#e0f2fe"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                >
                  {item}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
});

InteractiveArrowCanvas.displayName = 'InteractiveArrowCanvas';
