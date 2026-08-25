import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Substitua pelos valores reais do projeto Firebase deste cliente (veja o README.md).
const firebaseConfig = {
  apiKey: 'SUA_API_KEY_AQUI',
  authDomain: 'seu-projeto.firebaseapp.com',
  projectId: 'seu-projeto',
  storageBucket: 'seu-projeto.firebasestorage.app',
  messagingSenderId: 'SEU_SENDER_ID',
  appId: 'SEU_APP_ID',
};

// Chave pública (VAPID) do Cloud Messaging, usada para lembretes por notificação.
// Firebase Console → Configurações do projeto → Cloud Messaging → Certificados push da Web.
export const VAPID_KEY = 'SUA_VAPID_KEY_AQUI';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const authReady = signInAnonymously(auth).catch((err) => {
  console.error('Falha no login anônimo do Firebase:', err);
});
