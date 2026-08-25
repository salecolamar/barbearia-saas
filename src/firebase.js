import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Configuração do Firebase deste cliente, vinda das Environment Variables da
// Vercel (VITE_FIREBASE_*) — cada cliente tem seu próprio projeto Firebase e
// seu próprio deploy na Vercel, mas todos usam este MESMO código. Veja o
// README.md, seção 3.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'SUA_API_KEY_AQUI',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'seu-projeto.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'seu-projeto',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'seu-projeto.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'SEU_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'SEU_APP_ID',
};

// Chave pública (VAPID) do Cloud Messaging, usada para lembretes por notificação.
// Firebase Console → Configurações do projeto → Cloud Messaging → Certificados push da Web.
export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || 'SUA_VAPID_KEY_AQUI';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const authReady = signInAnonymously(auth).catch((err) => {
  console.error('Falha no login anônimo do Firebase:', err);
});
