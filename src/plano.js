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
//   inativos, aniversário, exportar contatos).

const NIVEIS = { basico: 0, intermediario: 1, pro: 2 };

export const PLANO = NIVEIS[import.meta.env.VITE_PLANO] !== undefined ? import.meta.env.VITE_PLANO : 'pro';

export function temPlano(minimo) {
  return NIVEIS[PLANO] >= NIVEIS[minimo];
}
