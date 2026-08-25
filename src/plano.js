// Controla quais funções do app ficam ativas, de acordo com o plano vendido
// ao cliente. Definido uma vez no deploy de cada barbearia, pela variável de
// ambiente VITE_PLANO na Vercel (não é algo que o barbeiro troca sozinho).
//
// - basico: agendamento simples, 1 serviço por vez, 1 barbeiro.
// - intermediario: + múltiplos serviços, forma de pagamento, múltiplos
//   barbeiros, bloqueio de horário, financeiro, notificações push.
// - pro: + pacotes de serviço com restrição de dia, aba Clientes
//   (histórico, aniversário, exportar contatos), aviso de aniversário.

const NIVEIS = { basico: 0, intermediario: 1, pro: 2 };

export const PLANO = NIVEIS[import.meta.env.VITE_PLANO] !== undefined ? import.meta.env.VITE_PLANO : 'pro';

export function temPlano(minimo) {
  return NIVEIS[PLANO] >= NIVEIS[minimo];
}
