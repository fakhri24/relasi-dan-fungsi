import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Lapisan 1 (Triple Failsafe) — Upload snapshot diagram siswa ke Firebase Storage.
 *
 * - Menerima Data URL (image/webp, image/png, image/jpeg) hasil exportToBase64.
 * - Validasi tipe & ukuran maksimal 2 MB sebelum upload (sesuai storage.rules).
 * - Timeout 12 detik agar tidak menggantung saat koneksi sekolah lambat.
 * - Mengembalikan download URL, atau null jika gagal (pemanggil wajib
 *   menyimpan Base64 ke Firestore sebagai lapisan fallback ke-2).
 */

const MAX_BYTES = 2 * 1024 * 1024;
const UPLOAD_TIMEOUT_MS = 12000;

const ALLOWED_MIME = ['image/webp', 'image/png', 'image/jpeg'];

const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout: koneksi upload terlalu lambat')), ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

const dataUrlToBytes = (dataUrl: string): { bytes: Uint8Array; mime: string } | null => {
  const match = dataUrl.match(/^data:(image\/(?:webp|png|jpeg));base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return { bytes, mime };
};

export const uploadDiagramSnapshot = async (
  dataUrl: string,
  caseSlug: string
): Promise<string | null> => {
  try {
    const parsed = dataUrlToBytes(dataUrl);
    if (!parsed) {
      console.warn('uploadDiagramSnapshot: format Data URL tidak dikenali, fallback Base64');
      return null;
    }
    if (!ALLOWED_MIME.includes(parsed.mime)) {
      console.warn('uploadDiagramSnapshot: tipe gambar tidak diizinkan:', parsed.mime);
      return null;
    }
    if (parsed.bytes.length > MAX_BYTES) {
      console.warn('uploadDiagramSnapshot: ukuran gambar melebihi 2 MB, fallback Base64');
      return null;
    }

    const safeSlug = caseSlug.replace(/[^a-z0-9-]/gi, '') || 'diagram';
    const fileName = `${Date.now()}-${safeSlug}-${Math.random().toString(36).slice(2, 8)}`;
    const storageRef = ref(storage, `submissions/${fileName}`);

    await withTimeout(
      uploadBytes(storageRef, parsed.bytes, { contentType: parsed.mime }),
      UPLOAD_TIMEOUT_MS
    );
    const url = await withTimeout(getDownloadURL(storageRef), 5000);
    return url;
  } catch (err) {
    console.warn('uploadDiagramSnapshot gagal (fallback Base64 ke Firestore):', err);
    return null;
  }
};

/**
 * Pemilihan sumber tampilan gambar diagram dengan rantai fallback:
 * URL Storage (lapisan 1) -> Base64 Firestore (lapisan 2) -> null (lapisan 3: render ulang SVG).
 */
export const resolveDiagramSrc = (
  answer?: { imageUrl?: string; imageBase64?: string }
): string | null => {
  if (!answer) return null;
  return answer.imageUrl || answer.imageBase64 || null;
};
