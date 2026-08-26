// Gera os dois service workers do app (public/firebase-messaging-sw.js e
// public/sw.js) a cada build. Roda automaticamente antes de "npm run dev" e
// "npm run build" (veja package.json). São arquivos estáticos puros — o
// Vite não processa import.meta.env neles — então essa é a forma de cada
// cliente (com seu próprio projeto Firebase) ter o service worker certo,
// e de forçar o navegador a detectar uma versão nova do app a cada deploy.
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

// ---------------------------------------------------------------------
// public/sw.js (cache do app / suporte offline) — o conteúdo do arquivo
// precisa MUDAR a cada deploy pra o navegador perceber que existe uma
// versão nova do service worker e reinstalar. Como o código dele nunca
// mudava sozinho, o app instalado na tela inicial podia ficar preso numa
// versão antiga por dias. Agora ele carrega um carimbo de versão novo em
// todo build.
const versao = Date.now().toString(36);
const swConteudo = `// Gerado automaticamente por scripts/generate-sw.mjs a cada build — o
// carimbo de versão abaixo muda sempre, pra forçar o navegador a detectar
// que existe uma versão nova do app e atualizar sozinho.
const CACHE = 'barbearia-${versao}';
const APP_SHELL = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first: sempre busca a versão mais nova quando há internet,
// e só usa o cache (modo offline) se a rede falhar.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
`;

writeFileSync(new URL('../public/sw.js', import.meta.url), swConteudo);
console.log('public/sw.js gerado (versão ' + versao + ').');
