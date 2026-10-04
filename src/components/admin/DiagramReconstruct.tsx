import React from 'react';
import { InteractiveArrowCanvas } from '../lkpd/InteractiveArrowCanvas';
import { ArrowRelation } from '../../types/lkpd';

/**
 * Lapisan 3 (Triple Failsafe) — Render Ulang Vektor SVG dari Data Panah Siswa.
 *
 * Dipakai oleh dashboard guru ketika snapshot gambar tidak tersedia
 * (tidak ada URL Storage maupun Base64): diagram tetap dapat ditampilkan
 * karena data panah relasi tersimpan lengkap di dokumen Firestore.
 */

interface DiagramCaseData {
  arrows?: ArrowRelation[];
  setAName?: string;
  setBName?: string;
  elementsA?: string[];
  elementsB?: string[];
}

interface Props {
  caseNumber: 1 | 2 | 3;
  caseData: DiagramCaseData;
}

// Anggota himpunan default Kasus 1 & 2 (skenario kasir kantin)
const DEFAULT_ITEMS_A = ['Ali', 'Budi', 'Citra', 'Dewi'];
const DEFAULT_ITEMS_B = ['Bakso', 'Mie', 'Soto'];

export const DiagramReconstruct: React.FC<Props> = ({ caseNumber, caseData }) => {
  const isCustom = caseNumber === 3;
  const itemsA = isCustom ? (caseData.elementsA?.length ? caseData.elementsA : DEFAULT_ITEMS_A) : DEFAULT_ITEMS_A;
  const itemsB = isCustom ? (caseData.elementsB?.length ? caseData.elementsB : DEFAULT_ITEMS_B) : DEFAULT_ITEMS_B;

  return (
    <div className="w-full select-none pointer-events-none">
      <InteractiveArrowCanvas
        readOnly
        allowDownload={false}
        title={`Rekonstruksi Kasus ${caseNumber}`}
        setAName={isCustom ? caseData.setAName || 'Himpunan A' : 'Siswa Pemesan'}
        setBName={isCustom ? caseData.setBName || 'Himpunan B' : 'Menu Makanan'}
        itemsA={itemsA}
        itemsB={itemsB}
        arrows={caseData.arrows || []}
        onChangeArrows={() => {}}
      />
    </div>
  );
};
