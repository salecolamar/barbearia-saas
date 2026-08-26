import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { DEMO_MODE, PLANO, definirPlanoDemo } from '../plano';

const PLANOS = [
  { valor: 'basico', label: 'Básico' },
  { valor: 'intermediario', label: 'Intermediário' },
  { valor: 'pro', label: 'Pro' },
];

// Botão flutuante só ativo no build de demonstração (VITE_PLANO=demo) — deixa
// quem está apresentando o app trocar de plano na hora, sem sair da tela.
// Não existe (nem é possível ativar) em nenhum deploy de cliente de verdade.
export default function DemoPlanoSwitcher() {
  const [aberto, setAberto] = useState(false);
  if (!DEMO_MODE) return null;

  const atual = PLANOS.find((p) => p.valor === PLANO);

  return (
    <div style={{ position: 'fixed', bottom: 78, right: 14, zIndex: 100 }}>
      {aberto && (
        <div
          className="card"
          style={{
            position: 'absolute',
            bottom: 46,
            right: 0,
            width: 180,
            padding: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Demonstrar como
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PLANOS.map((p) => (
              <button
                key={p.valor}
                type="button"
                onClick={() => definirPlanoDemo(p.valor)}
                style={{
                  textAlign: 'left',
                  padding: '8px 10px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: p.valor === PLANO ? '1px solid var(--gold)' : '1px solid var(--border)',
                  background: p.valor === PLANO ? 'rgba(201,162,39,0.15)' : 'var(--panel-2)',
                  color: p.valor === PLANO ? 'var(--gold)' : 'var(--text)',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '9px 14px',
          borderRadius: 999,
          border: '1px solid var(--gold)',
          background: '#1a1400',
          color: 'var(--gold)',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}
      >
        {aberto ? <X size={14} /> : <SlidersHorizontal size={14} />}
        {atual?.label || 'Plano'}
      </button>
    </div>
  );
}
