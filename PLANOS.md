# O que cada plano contém

Este arquivo é a lista oficial do que entra em cada plano (Básico, Intermediário, Pro). É a referência pra decidir preço/venda — sempre que uma função for adicionada, removida ou trocada de plano, é só pedir e o código (`src/plano.js` e os pontos marcados abaixo) é atualizado junto com este arquivo, pra nunca ficarem desalinhados.

Controlado por uma única variável, `VITE_PLANO`, definida por cliente na Vercel (`basico`, `intermediario` ou `pro`). Detalhes técnicos de como implantar estão no `README.md`.

---

## Em todos os planos (Básico, Intermediário e Pro)

**App do cliente**
- Agendamento com múltiplos serviços no mesmo horário
- Bloqueio automático do horário e dos barbeiros ocupados (inclusive pela duração somada dos serviços escolhidos)
- Cancelar ou editar os serviços de um agendamento já feito ("Meus horários")
- Selo de "cliente novo" / "Xª visita" pro barbeiro identificar clientes recorrentes
- Botões de instalar o app na tela inicial (Android e iPhone)
- WhatsApp, Instagram, endereço e horário de funcionamento na tela inicial
- Recado fixado na tela inicial (aviso, promoção, etc.)

**Painel do administrador (`/admin`)**
- Aba **Agendados**: agenda do dia, marcar presença/falta, cancelar, agendar pra um cliente
- Aba **Barbeiros**: cadastrar quantos quiser
- Aba **Serviços**: cadastrar nome, duração e preço
- Aba **Horários**: dias e horário de funcionamento
- Aba **Perfil**: nome, descrição, endereço, WhatsApp, Instagram, recado, PIN

---

## Intermediário (+ tudo do Básico)

- **Forma de pagamento**: cliente escolhe Dinheiro/Crédito/Débito/PIX ao confirmar
- **Bloqueio de horário**: barbeiro bloqueia um intervalo (ex: almoço) direto no painel
- **Aba Financeiro**: faturamento por dia/semana/mês, separado por forma de pagamento, serviços mais pedidos
- **Notificações push**: barbeiro é avisado na hora de um novo agendamento; cliente pode ativar lembrete ~30 min antes

---

## Pro (+ tudo do Intermediário)

- **Aba Clientes**: lista de todo mundo que já agendou, busca por nome/telefone, exportar contatos (.vcf)
- **Aniversário do cliente**: campo no cadastro + aviso no painel quando o aniversário de alguém tá chegando (e notificação push, se configurada)
- **Pacotes de serviço com restrição de dia** (ex: um combo que só vale de segunda a quarta) — recurso já existe no banco de dados, mas hoje só é configurado por mim direto no banco; não tem uma tela no painel pra isso ainda

---

## Como pedir uma mudança

Só me falar o que quer mudar (ex: "tira X do Pro e deixa disponível também no Intermediário", "cria uma função nova só no Pro"). Eu atualizo o código com o `temPlano(...)` certo e reescrevo este arquivo no mesmo commit, pra ele sempre refletir o que tá em produção.
