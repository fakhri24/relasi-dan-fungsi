import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Scan,
  RefreshCw,
  Store,
  Plus,
  X,
  Layers,
  Tag,
} from 'lucide-react';
import { MathFormula } from '../MathFormula';

interface CanteenItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  barcode: string;
  isCustom?: boolean;
}

const DEFAULT_ITEMS: CanteenItem[] = [
  { id: 'nice-cone', name: 'Nice Cone', icon: '🍦', price: 8000, barcode: '899-NICE-01' },
  { id: 'teh-kubus', name: 'Teh Kubus', icon: '🧃', price: 4000, barcode: '899-KUBUS-02' },
  { id: 'le-kristal', name: 'Le Kristal', icon: '💧', price: 4000, barcode: '899-KRISTAL-03' },
  { id: 'silver-king', name: 'SilverKing', icon: '🍫', price: 6000, barcode: '899-SILVER-04' },
];

interface ScanLogEntry {
  id: string;
  item: CanteenItem;
  priceOutput: string;
  isDeterministic: boolean;
}

export const Slide1Hook: React.FC = () => {
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [items, setItems] = useState<CanteenItem[]>(DEFAULT_ITEMS);
  const [selectedItem, setSelectedItem] = useState<CanteenItem>(DEFAULT_ITEMS[0]);
  const [testState, setTestState] = useState<'idle' | 'chaotic' | 'deterministic'>('idle');
  const [scanCount, setScanCount] = useState<number>(0);
  const [scanHistory, setScanHistory] = useState<ScanLogEntry[]>([]);

  // Modal tambah barang custom
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<string>('5000');
  const [customIcon, setCustomIcon] = useState<string>('🥟');

  const chaoticOutputs = ['Rp 45.000', 'Rp 500', 'Sabun Colek', 'Rp 120.000', 'Piring Pecah', 'Rp 99.000'];
  const currentChaotic = chaoticOutputs[scanCount % chaoticOutputs.length];

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const handleScan = (scanMode: 'chaotic' | 'deterministic') => {
    setTestState(scanMode);
    setScanCount((prev) => prev + 1);

    const isDeterministic = scanMode === 'deterministic';
    const outputText = isDeterministic ? formatRupiah(selectedItem.price) : currentChaotic;

    const newEntry: ScanLogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      item: selectedItem,
      priceOutput: outputText,
      isDeterministic,
    };

    setScanHistory((prev) => [newEntry, ...prev.slice(0, 3)]);
  };

  const handleSelectItem = (item: CanteenItem) => {
    setSelectedItem(item);
    setTestState('idle');
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const priceNum = parseInt(customPrice, 10) || 5000;
    const cleanId = `custom-${Date.now()}`;
    const cleanCode = `899-${customName.slice(0, 6).toUpperCase().replace(/\s+/g, '')}-99`;

    const newItem: CanteenItem = {
      id: cleanId,
      name: customName.trim(),
      icon: customIcon || '🥪',
      price: priceNum,
      barcode: cleanCode,
      isCustom: true,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedItem(newItem);
    setTestState('idle');
    setIsModalOpen(false);
    setCustomName('');
  };

  // Deteksi pasangan barang berbeda dengan harga normal yang sama di riwayat scan
  const samePriceDetected = useMemo(() => {
    const validScans = scanHistory.filter((s) => s.isDeterministic);
    const seenPrices = new Map<number, string[]>();

    for (const scan of validScans) {
      const names = seenPrices.get(scan.item.price) || [];
      if (!names.includes(scan.item.name)) {
        names.push(scan.item.name);
        seenPrices.set(scan.item.price, names);
      }
    }

    for (const [price, names] of seenPrices.entries()) {
      if (names.length >= 2) {
        return { price, names };
      }
    }
    return null;
  }, [scanHistory]);

  return (
    <div className="flex flex-col h-full justify-between max-w-6xl mx-auto">
      {/* Header Slide & Switch Mode */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" /> 01 · PEMANTIK
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Mesin Kasir
          </h1>
        </div>

        {/* Tab Switcher: 1 Barang Fokus vs Multi-Barang */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => {
              setMode('single');
              setSelectedItem(DEFAULT_ITEMS[0]);
              setTestState('idle');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'single'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> 1 Barang Fokus
          </button>
          <button
            onClick={() => {
              setMode('multi');
              setTestState('idle');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'multi'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Multi-Barang Kantin
          </button>
        </div>
      </div>

      {/* Visual Interaktif: Eksperimen Mesin Kasir */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2 items-center flex-1 min-h-0">
        {/* Panel Kiri: Input Kasir & Seleksi Barang */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between h-[360px]">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-brand-400" />
                {mode === 'single' ? 'Input Barcode Kasir' : 'Katalog Barang Kantin'}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-brand-300">
                {selectedItem.barcode}
              </span>
            </div>

            {/* Mode Multi-Barang: Quick Chips Selector */}
            {mode === 'multi' && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1.5 max-h-[88px] overflow-y-auto pr-1">
                  {items.map((item) => {
                    const isSelected = selectedItem.id === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                          isSelected
                            ? 'bg-brand-600 border-brand-400 text-white ring-2 ring-brand-400/40 shadow-sm'
                            : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.name}</span>
                        <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-800/90 text-slate-300">
                          {formatRupiah(item.price)}
                        </span>
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border border-dashed border-slate-700 text-slate-400 hover:text-brand-300 hover:border-brand-500/60 bg-slate-950/40 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
              </div>
            )}

            {/* Kartu Barang Aktif di Meja Scan */}
            <div className="mt-3 p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shadow-inner">
                  {selectedItem.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{selectedItem.name}</h4>
                    {selectedItem.isCustom && (
                      <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                        Kustom
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Scan className="w-3.5 h-3.5" /> 1 Input Barcode
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">Asli: {formatRupiah(selectedItem.price)}</span>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] uppercase font-mono text-slate-500">Harga Resmi</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {formatRupiah(selectedItem.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Tombol Uji Kasir */}
          <div>
            <div className="flex gap-2.5">
              <button
                onClick={() => handleScan('chaotic')}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 border ${
                  testState === 'chaotic'
                    ? 'bg-rose-600/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/50'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-rose-500/40'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                {testState === 'chaotic' ? 'Scan Ulang' : 'Uji Kasir Rusak'}
              </button>
              <button
                onClick={() => handleScan('deterministic')}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 border ${
                  testState === 'deterministic'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/50'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {testState === 'deterministic' ? 'Scan Ulang' : 'Uji Kasir Normal'}
              </button>
            </div>
          </div>
        </div>

        {/* Panel Kanan: Layar Monitor Kasir & Bukti Many-to-One */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between h-[360px] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent opacity-50 animate-pulse" />

          {/* Bagian Utama Monitor */}
          <div className="my-auto flex flex-col items-center justify-center">
            {testState === 'idle' && (
              <div className="space-y-2">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-800/90 flex items-center justify-center text-brand-400 shadow-inner">
                  <HelpCircle className="w-7 h-7 animate-pulse" />
                </div>
                <h4 className="text-lg font-bold text-slate-200">Layar Kasir Siap</h4>
                <p className="text-xs font-mono text-slate-400 max-w-xs mx-auto">
                  {mode === 'single'
                    ? 'Pilih mode uji kasir di sebelah kiri'
                    : `Tekan Uji Kasir untuk men-scan barcode ${selectedItem.name}`}
                </p>
              </div>
            )}

            {testState === 'chaotic' && (
              <div className="space-y-2.5 animate-fadeIn w-full max-w-sm">
                <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-rose-400 font-bold bg-rose-950/60 border border-rose-800/60 px-3 py-0.5 rounded-full inline-block">
                    ❌ BUKAN FUNGSI (Harga Berubah)
                  </span>
                  <div className="text-3xl md:text-4xl font-extrabold text-rose-300 font-mono mt-2 tracking-tight">
                    {currentChaotic}
                  </div>
                </div>
                <div className="text-xs text-rose-400 font-medium flex items-center justify-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" /> 1 Barcode menghasilkan banyak harga acak
                </div>
              </div>
            )}

            {testState === 'deterministic' && (
              <div className="space-y-2.5 animate-fadeIn w-full max-w-sm">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-3 py-0.5 rounded-full inline-block">
                    ✅ FUNGSI SAH (Tepat 1 Harga)
                  </span>
                  <div className="text-3xl md:text-4xl font-extrabold text-emerald-300 font-mono mt-2 tracking-tight">
                    {formatRupiah(selectedItem.price)}
                  </div>
                </div>
                <div className="text-xs text-emerald-400 font-medium font-mono">
                  1 Barcode ({selectedItem.name}) → Tepat 1 Harga Pasti
                </div>
              </div>
            )}
          </div>

          {/* Bagian Bawah Panel Kanan: Riwayat Scan & Deteksi Many-to-One */}
          {mode === 'multi' && (
            <div className="pt-2 border-t border-slate-800/80 mt-1">
              {/* Notifikasi Cerdas: Harga Sama = Tetap Fungsi */}
              {samePriceDetected ? (
                <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-semibold animate-fadeIn flex items-center justify-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    <strong>{samePriceDetected.names.join(' & ')}</strong> sama-sama berharga{' '}
                    <strong>{formatRupiah(samePriceDetected.price)}</strong> = <em>Tetap Fungsi Sah!</em>
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
                  <span>Riwayat Scan Terakhir:</span>
                  <div className="flex gap-1.5 overflow-hidden">
                    {scanHistory.length === 0 ? (
                      <span className="text-slate-600">Belum ada scan</span>
                    ) : (
                      scanHistory.slice(0, 3).map((entry) => (
                        <span
                          key={entry.id}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                            entry.isDeterministic
                              ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
                              : 'bg-rose-950/50 border-rose-800 text-rose-300'
                          }`}
                        >
                          {entry.item.icon} {entry.item.name}: {entry.priceOutput}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Takeaway */}
      <div className="bg-slate-900 border-l-4 border-brand-500 px-4 py-2.5 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold">
            KUNCI
          </span>
          <p className="text-slate-200 text-xs md:text-sm font-semibold">
            {mode === 'single'
              ? 'Satu input barcode harus menghasilkan tepat satu harga output pasti.'
              : 'Tiap barang wajib punya tepat 1 harga. Dua barang berbeda boleh memiliki harga yang sama!'}
          </p>
        </div>
        <div className="hidden sm:block text-brand-300 text-xs md:text-sm font-mono">
          {mode === 'single' ? (
            <MathFormula math="f(\text{Nice Cone}) = 8000" />
          ) : (
            <MathFormula math="f(\text{Teh Kubus}) = f(\text{Le Kristal}) = 4000" />
          )}
        </div>
      </div>

      {/* Modal Ringkas Tambah Barang Kustom */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-brand-400" /> Tambah Barang Kantin
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomItem} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Nama Jajanan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Cireng Bumbu, Cilok"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Harga Satuan (Rp)
                </label>
                <input
                  type="number"
                  required
                  step={500}
                  min={500}
                  placeholder="Misal: 4000"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Pilih Ikon
                </label>
                <div className="flex gap-2">
                  {['🥟', '🍢', '🍩', '🥤', '🍿', '🥪'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setCustomIcon(emoji)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all ${
                        customIcon === emoji
                          ? 'bg-brand-600/30 border-brand-400 scale-105'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-800 hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md"
                >
                  Simpan Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
