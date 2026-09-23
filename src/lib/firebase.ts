import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Konfigurasi resmi Firebase SDK untuk project relasi-fungsi-edu-x
export const firebaseConfig = {
  apiKey: "AIzaSyBhcsxPAnmErPwi9Sw5TklWrp8LayPHj7A",
  authDomain: "relasi-fungsi-edu-x.firebaseapp.com",
  projectId: "relasi-fungsi-edu-x",
  storageBucket: "relasi-fungsi-edu-x.firebasestorage.app",
  messagingSenderId: "80045695057",
  appId: "1:80045695057:web:36debc8f1b5b6fee265870"
};

// Inisialisasi Firebase App (Singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Provider Google Auth
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Daftar email guru yang memiliki hak akses Admin
export const TEACHER_WHITELIST = [
  'fkhr2nd@gmail.com',
  'f.fadllillah@gmail.com'
];
