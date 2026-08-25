// Gera public/firebase-messaging-sw.js a partir das mesmas variáveis de
// ambiente VITE_FIREBASE_* usadas em src/firebase.js. Roda automaticamente
// antes de "npm run dev" e "npm run build" (veja package.json).
//
// O service worker é um arquivo estático puro — o Vite não processa
// import.meta.env nele — então essa é a forma de cada cliente (com seu
// próprio projeto Firebase) ter o service worker certo, sem precisar de um
// código diferente por cliente.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

// Na Vercel, as Environment Variables já chegam como process.env de verdade.
// Localmente, o Vite lê .env.local sozinho pro app, mas este script roda como
// Node puro fora do Vite — então carregamos .env.local aqui também, sem
// sobrescrever nada que já esteja definido no ambiente (shell tem prioridade).
const envLocalPath = new URL('../.env.local', import.meta.url);
if (existsSync(envLocalPath)) {
  for (const linha of readFileSync(envLocalPath, 'utf8').split('\n')) {
    const match = linha.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;
    const [, chave, valorBruto = ''] = match;
    if (process.env[chave] === undefined) {
      process.env[chave] = valorBruto.replace(/^['"]|['"]$/g, '');
    }
  }
}

const config = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'SUA_API_KEY_AQUI',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'seu-projeto.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'seu-projeto',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'seu-projeto.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'SEU_SENDER_ID',
  appId: process.env.VITE_FIREBASE_APP_ID || 'SEU_APP_ID',
};

const conteudo = `// Gerado automaticamente por scripts/generate-sw.mjs a partir das
// Environment Variables VITE_FIREBASE_* — não edite este arquivo direto,
// edite as variáveis de ambiente e rode o build de novo.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp(${JSON.stringify(config, null, 2)});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'Barbearia', {
    body: body || 'Seu horário está chegando.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  });
});
`;

writeFileSync(new URL('../public/firebase-messaging-sw.js', import.meta.url), conteudo);
console.log('public/firebase-messaging-sw.js gerado.');
