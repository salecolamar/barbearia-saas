# Guia — Implantar o app pra um novo cliente

Este repositório é a base **compartilhada** dos três planos (Básico, Intermediário, Pro). Cada cliente (barbearia) ganha seu **próprio banco de dados** (Firebase) e seu **próprio link** (projeto na Vercel) — mas todos apontam pro mesmo código aqui. Isso quer dizer que uma melhoria feita aqui vale pra todo mundo automaticamente, sem precisar copiar nada.

| Função | Básico | Intermediário | Pro |
|---|---|---|---|
| Agendamento com múltiplos serviços | ✅ | ✅ | ✅ |
| Múltiplos barbeiros | ✅ | ✅ | ✅ |
| Recado na tela inicial | ✅ | ✅ | ✅ |
| Forma de pagamento | – | ✅ | ✅ |
| Bloqueio de horário | – | ✅ | ✅ |
| Aba Financeiro | – | ✅ | ✅ |
| Notificações push (novo agendamento + lembrete) | – | ✅ | ✅ |
| Pacotes de serviço com restrição de dia | – | – | ✅ |
| Aba Clientes (histórico, exportar contatos) | – | – | ✅ |
| Aniversário do cliente + aviso | – | – | ✅ |

---

## Checklist rápido (todo novo cliente)

1. Criar um **projeto Firebase** novo pra esse cliente.
2. Criar um **projeto Vercel** novo, importando **este mesmo repositório do GitHub**.
3. Preencher as **Environment Variables** desse projeto (Firebase do cliente + `VITE_PLANO` do plano vendido).
4. Deploy → pegar o link → instalar no celular → configurar a barbearia (`/admin`).

Os passos detalhados de cada um estão abaixo.

---

## 1. Firebase (banco de dados desse cliente)

1. Acesse **console.firebase.google.com** e clique em **"Adicionar projeto"**.
2. Dê um nome (ex: nome da barbearia). Pode **desativar** o Google Analytics. Clique em **"Criar projeto"**.
3. No menu da esquerda, **Firestore Database** → **"Criar banco de dados"**.
   - Escolha **"Iniciar no modo de produção"**.
   - Região: `southamerica-east1 (São Paulo)`.
   - Clique em **Ativar**.
4. Ative o login anônimo: **Authentication** → **"Vamos começar"** → aba **"Sign-in method"** → **"Anônimo"** → ativar → **Salvar**.
5. Em **Firestore Database → Regras**, apague tudo e cole:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
   Clique em **Publicar**.

   > 🔒 Só quem abre o app (e recebe uma sessão anônima automática) consegue ler ou
   > escrever no banco. Não é 100% à prova de tudo, mas é uma proteção sólida
   > pro uso do dia a dia.

6. Tela inicial do projeto → ícone **`</>`** (Web) → nome qualquer (ex: `barbearia-web`) → **"Registrar app"** (não precisa marcar Hosting).
7. Copie o bloco `const firebaseConfig = { ... }` que aparece — você vai usar cada valor dele no passo 2, como variável de ambiente na Vercel.

**Ver os dados depois:** Firestore Database → coleções `agendamentos`, `barbeiros`, `servicos`, `config`, `clientes`.

---

## 2. Vercel (publicar o app desse cliente com um link)

1. Na conta da Vercel (mesma de sempre), **"Add New… → Project"**.
2. Encontre o repositório **`barbearia-saas`** na lista e clique **"Import"**. Isso cria um **projeto novo e independente** na Vercel, mesmo usando o mesmo repositório.
3. Confirme **Framework Preset = Vite**.
4. Antes de clicar em Deploy, abra **Environment Variables** e adicione, uma por linha (valor à direita, nome à esquerda):

   | Nome | Valor |
   |---|---|
   | `VITE_PLANO` | `basico`, `intermediario` ou `pro` — o plano que esse cliente comprou |
   | `VITE_FIREBASE_API_KEY` | do `firebaseConfig` do passo 1 |
   | `VITE_FIREBASE_AUTH_DOMAIN` | idem |
   | `VITE_FIREBASE_PROJECT_ID` | idem |
   | `VITE_FIREBASE_STORAGE_BUCKET` | idem |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | idem |
   | `VITE_FIREBASE_APP_ID` | idem |

   No plano Intermediário ou Pro, adicione também (opcional, só se for usar notificações — veja seção 5):
   | `VITE_FIREBASE_VAPID_KEY` | chave VAPID do Cloud Messaging |
   | `FIREBASE_SERVICE_ACCOUNT_KEY` | JSON da conta de serviço |
   | `REMINDER_SECRET` | uma senha qualquer, inventada por você |

5. Clique em **"Deploy"**. Em 1–2 minutos você recebe um link tipo `nome-do-cliente.vercel.app`. Pode renomear o projeto (Settings → General → Project Name) pra ficar mais fácil de identificar.

> **Trocar o plano de um cliente depois** é só editar `VITE_PLANO` nas Environment Variables desse projeto na Vercel e clicar em **Deployments → ⋯ → Redeploy** — não precisa mexer em código nem no Firebase.

### Se o build falhar
- **"vite: command not found"**: Settings → General → Build & Development Settings → confirme Framework Preset = Vite. Depois Deployments → ⋯ → **Redeploy**.

---

## 3. Instalar no celular

**Android (Chrome):** abra o link → menu (⋮) → **"Adicionar à tela inicial"**.

**iPhone (precisa ser Safari):** abra o link → botão de compartilhar → **"Adicionar à Tela de Início"**.

---

## 4. Configurar a barbearia (primeiro uso)

1. No celular ou computador, acesse `SEU-LINK.vercel.app/admin`.
2. Na primeira vez, crie o **nome da barbearia** e um **PIN** (protege o painel do barbeiro). Guarde esse PIN.
3. Nas abas do painel:
   - **Horários**: marque os dias em que a barbearia funciona e o horário de início/fim de cada um.
   - **Barbeiros**: cadastre o nome de cada barbeiro.
   - **Serviços**: cadastre cada serviço (nome, duração em minutos, preço opcional).
4. Pronto — o app do cliente (`SEU-LINK.vercel.app`) já mostra os horários disponíveis de verdade.

---

## 5. Notificações (opcional — Intermediário e Pro)

Duas coisas dependem da mesma configuração abaixo:
- O **cliente** pode ativar um lembrete ao confirmar o agendamento (avisa ~30 min antes).
- O **barbeiro** é avisado na hora, assim que um cliente marca um horário — basta clicar em **"Ativar notificações"** no canto superior do painel `/admin`.

Para isso funcionar de verdade (mesmo com o app fechado):

1. **Chave de notificação (VAPID):** Firebase Console → ⚙️ Configurações do projeto → aba **Cloud Messaging** → em "Certificados push da Web", **Gerar par de chaves**. Cole o valor em `VITE_FIREBASE_VAPID_KEY` nas Environment Variables da Vercel (passo 2).
2. **Chave do servidor:** Firebase Console → ⚙️ Configurações do projeto → aba **Contas de serviço** → **"Gerar nova chave privada"**. Baixa um `.json`.
3. Cole **todo o conteúdo** desse `.json` na variável `FIREBASE_SERVICE_ACCOUNT_KEY` da Vercel.
4. Defina também `REMINDER_SECRET` (uma senha qualquer).
5. Salve as variáveis e rode **Redeploy**.
6. Crie uma conta grátis em **cron-job.org** e configure um "cronjob":
   - URL: `https://SEU-LINK.vercel.app/api/send-reminders?secret=SEU_REMINDER_SECRET`
   - Intervalo: a cada 10 minutos.
7. (Só no plano Pro) Outro cronjob pra aniversário de cliente:
   - URL: `https://SEU-LINK.vercel.app/api/send-birthday-alerts?secret=SEU_REMINDER_SECRET`
   - Intervalo: 1 vez por dia.

O aviso ao barbeiro de novo agendamento já funciona assim que os passos 1-5 estiverem prontos — só o lembrete do cliente e o aviso de aniversário dependem do cron-job.org.

---

## Atualizações futuras (todos os clientes de uma vez)

Como todos os projetos na Vercel apontam pro mesmo repositório `barbearia-saas`, quando uma melhoria for enviada (`git push`) pro branch `main`, **a Vercel redeploya automaticamente todos os projetos dos clientes** em poucos minutos — não precisa fazer nada manualmente em cada um. Cada projeto mantém suas próprias variáveis (Firebase + plano), só o código muda.
