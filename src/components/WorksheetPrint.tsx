import React from 'react';

export const WorksheetPrint: React.FC = () => {
  return (
    <div className="hidden print:block text-black bg-white p-8 max-w-4xl mx-auto font-sans">
      {/* Kop Lembar Kerja */}
      <div className="border-b-2 border-black pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Lembar Kerja Proyek Matematika</h1>
            <h2 className="text-lg font-bold text-gray-800">Katalog Fungsi Sepenggal (Piecewise) di Dunia Nyata</h2>
            <p className="text-xs text-gray-600">Mata Pelajaran: Matematika · Fase E (Kelas X) · Kurikulum Merdeka</p>
          </div>
          <div className="border border-black p-3 text-xs w-48">
            <div className="font-bold mb-1">Nilai & Catatan Guru:</div>
            <div className="h-12"></div>
            <div className="text-[10px] text-gray-500 border-t border-gray-400 pt-1 text-center">Paraf Guru</div>
          </div>
        </div>

        {/* Identitas Kelompok */}
        <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-medium border-t border-gray-300 pt-3">
          <div>
            <div className="mb-1">Nama Kelompok: _______________________________</div>
            <div>Kelas: _________________  Tanggal: ______________</div>
          </div>
          <div>
            <div>Anggota:</div>
            <ol className="list-decimal list-inside text-gray-700">
              <li>___________________________ 3. ___________________________</li>
              <li>___________________________ 4. ___________________________</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Bagian 1: Identifikasi Masalah */}
      <div className="mb-5">
        <h3 className="font-bold text-sm uppercase bg-gray-200 px-2 py-1 mb-2 border-l-4 border-black">
          1. Identifikasi Kasus Nyata yang Dipilih
        </h3>
        <p className="text-xs text-gray-700 mb-2">
          Pilihlah salah satu topik nyata (Tarif Ojol, Parkir Mall, Pajak PPh 21, Tarif Air/Listrik, atau ide sendiri).
        </p>
        <div className="border border-gray-400 p-3 rounded text-xs space-y-2">
          <div><strong>Nama Kasus / Kebijakan:</strong> ________________________________________________________________</div>
          <div><strong>Variabel Input (x):</strong> ________________________  <strong>Satuan:</strong> ______________</div>
          <div><strong>Variabel Output (y):</strong> _______________________  <strong>Satuan:</strong> ______________</div>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div><strong>Domain Fisik (Daerah Asal):</strong> ________________________</div>
            <div><strong>Range Fisik (Daerah Hasil):</strong> ________________________</div>
          </div>
        </div>
      </div>

      {/* Bagian 2: Perumusan Fungsi Piecewise */}
      <div className="mb-5">
        <h3 className="font-bold text-sm uppercase bg-gray-200 px-2 py-1 mb-2 border-l-4 border-black">
          2. Perumusan Fungsi Sepenggal (Piecewise Function)
        </h3>
        <p className="text-xs text-gray-700 mb-2">
          Tuliskan fungsi dalam notasi kurung kurawal matematika lengkap dengan rentang syaratnya:
        </p>
        <div className="border border-gray-400 p-4 rounded text-sm font-mono h-24 flex items-center justify-center">
          f(x) = &#123; ...
        </div>
      </div>

      {/* Bagian 3: Sketsa Grafik */}
      <div className="mb-5">
        <h3 className="font-bold text-sm uppercase bg-gray-200 px-2 py-1 mb-2 border-l-4 border-black">
          3. Gambar Grafik Fungsi (Perhatikan Titik ● dan ○)
        </h3>
        <div className="border border-gray-400 p-2 rounded h-56 flex flex-col justify-between">
          <div className="text-[10px] text-gray-500 italic text-right">Skala sumbu X dan Y harus seimbang dan jelas</div>
          <div className="w-full h-44 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
            [ Area Gambar Sumbu Koordinat Cartesius & Grafik Sepenggal ]
          </div>
        </div>
      </div>

      {/* Bagian 4: Simulasi 3 Kasus Hitungan & Kesimpulan */}
      <div>
        <h3 className="font-bold text-sm uppercase bg-gray-200 px-2 py-1 mb-2 border-l-4 border-black">
          4. Simulasi 3 Nilai Uji & Analisis Singkat
        </h3>
        <div className="grid grid-cols-3 gap-2 text-xs mb-3">
          <div className="border border-gray-400 p-2 rounded">
            <strong>Uji 1 (Cabang Awal):</strong>
            <div className="mt-1">x = ________</div>
            <div>Hasil f(x) = ________</div>
          </div>
          <div className="border border-gray-400 p-2 rounded">
            <strong>Uji 2 (Cabang Tengah):</strong>
            <div className="mt-1">x = ________</div>
            <div>Hasil f(x) = ________</div>
          </div>
          <div className="border border-gray-400 p-2 rounded">
            <strong>Uji 3 (Cabang Akhir):</strong>
            <div className="mt-1">x = ________</div>
            <div>Hasil f(x) = ________</div>
          </div>
        </div>
        <div className="border border-gray-400 p-2.5 rounded text-xs">
          <strong>Kesimpulan Kelompok:</strong> Mengapa kebijakan tarif ini adil atau efektif bagi masyarakat?
          <div className="h-10 mt-1 border-b border-gray-300 border-dashed"></div>
        </div>
      </div>
    </div>
  );
};
