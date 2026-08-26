// Controla quais funções do app ficam ativas, de acordo com o plano vendido
// ao cliente. Definido uma vez no deploy de cada barbearia, pela variável de
// ambiente VITE_PLANO na Vercel (não é algo que o barbeiro troca sozinho).
//
// - basico: agendamento com múltiplos serviços, múltiplos barbeiros, recado
//   na tela inicial.
// - intermediario: + bloqueio de horário, financeiro (só o total recebido),
//   notificações push.
// - pro: + forma de pagamento (com detalhamento no financeiro), pacotes de
//   serviço com restrição de dia, aba Clientes (histórico, clientes
//   inativos, aniversário, exportar contatos), programa de fidelidade.
//
// Existe um quarto valor especial, "demo": só um deploy específico (de
// demonstração pra clientes em potencial) usa isso, e SÓ nesse caso o plano
// pode ser trocado em tempo real pelo próprio app (ver DEMO_MODE/
// definirPlanoDemo abaixo). Em qualquer outro valor de VITE_PLANO, o plano
// fica travado no que foi contratado — não tem como o cliente "se promover"
// sozinho trocando algo no navegador.

const NIVEIS = { basico: 0, intermediario: 1, pro: 2 };

const PLANO_BUILD = import.meta.env.VITE_PLANO;
export const DEMO_MODE = PLANO_BUILD === 'demo';

const CHAVE_DEMO = 'barbearia:demo-plano';

function planoEfetivo() {
  if (DEMO_MODE) {
    const salvo = typeof localStorage !== 'undefined' ? localStorage.getItem(CHAVE_DEMO) : null;
    return NIVEIS[salvo] !== undefined ? salvo : 'pro';
  }
  return NIVEIS[PLANO_BUILD] !== undefined ? PLANO_BUILD : 'pro';
}

export const PLANO = planoEfetivo();

export function temPlano(minimo) {
  return NIVEIS[PLANO] >= NIVEIS[minimo];
}

// Só tem efeito no build de demonstração. Troca o plano exibido e recarrega
// a página pra todo o app (inclusive o painel /admin) refletir a mudança.
export function definirPlanoDemo(novoPlano) {
  if (!DEMO_MODE || NIVEIS[novoPlano] === undefined) return;
  localStorage.setItem(CHAVE_DEMO, novoPlano);
  window.location.reload();
}
