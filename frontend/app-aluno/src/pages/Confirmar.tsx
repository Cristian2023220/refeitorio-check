import { useEffect, useState } from 'react';
import { CheckCircle2, QrCode, UtensilsCrossed } from 'lucide-react';
import { chamarApi } from '../api/client';
import type { CardapioHoje, ConfirmacaoHoje, Saldo } from '../types';
import { Toast } from '../components/Toast';

export function Confirmar() {
  const [saldo, setSaldo] = useState<Saldo | null>(null);
  const [confirmado, setConfirmado] = useState<boolean | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [cardapio, setCardapio] = useState<string | null>(null);
  const [erroToast, setErroToast] = useState<string | null>(null);

  useEffect(() => {
    chamarApi<Saldo>('/me/saldo').then(setSaldo).catch(console.error);
    chamarApi<ConfirmacaoHoje>('/confirmacoes/hoje').then((dados) => setConfirmado(dados.confirmado)).catch(console.error);
    chamarApi<CardapioHoje>('/cardapio-hoje').then((dados) => setCardapio(dados.cardapio)).catch(console.error);
  }, []);

  async function confirmarPresenca() {
    setConfirmando(true);
    try {
      await chamarApi('/confirmacoes', { method: 'POST' });
      setConfirmado(true);
    } catch (erro) {
      setErroToast(erro instanceof Error ? erro.message : 'Não foi possível confirmar presença.');
    } finally {
      setConfirmando(false);
    }
  }

  const percentual = saldo && saldo.limiteMensal > 0 ? Math.min(Math.round((saldo.usosNoMes / saldo.limiteMensal) * 100), 100) : 0;

  return (
    <main className="max-w-md mx-auto px-md py-lg space-y-lg">
      <section className="bg-gradient-to-br from-surface to-surface-bright rounded-xl border border-border shadow-[0_10px_25px_rgba(0,0,0,0.05)] p-lg flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-container opacity-10 rounded-full" />
        <h2 className="font-label-caps text-label-caps text-text-muted mb-sm uppercase tracking-wider">
          Saldo de Refeições
        </h2>
        <div className="flex items-baseline gap-xs">
          <span className="font-stat-value text-[48px] leading-none font-bold text-primary">
            {saldo ? saldo.saldoRestante : '—'}
          </span>
          <span className="font-body-md text-body-md text-text-muted">restantes</span>
        </div>
        <div className="w-full max-w-[200px] h-2 bg-surface-container mt-md rounded-full overflow-hidden">
          <div className="h-full bg-primary-fixed rounded-full transition-all" style={{ width: `${percentual}%` }} />
        </div>
        <p className="font-body-sm text-body-sm text-text-muted mt-xs">
          {saldo ? saldo.usosNoMes : '—'} usados este mês
        </p>
      </section>

      <section>
        <button
          className={`w-full font-headline-md text-status-display py-lg rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-sm ${
            confirmado
              ? 'bg-secondary-container text-on-secondary-container'
              : 'bg-primary hover:bg-surface-tint text-on-primary'
          }`}
          onClick={confirmarPresenca}
          disabled={Boolean(confirmado) || confirmando}
        >
          {confirmado ? <CheckCircle2 /> : <QrCode />}
          <span>{confirmando ? 'Confirmando...' : confirmado ? 'Presença Confirmada' : 'Confirmar Presença Hoje'}</span>
        </button>
        <p className="text-center font-body-sm text-body-sm text-text-muted mt-sm">
          O prazo encerra às <span>10:00</span>
        </p>
      </section>

      <section className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="border-b border-border px-md py-sm bg-surface-bright flex items-center gap-xs">
          <UtensilsCrossed size={20} className="text-tertiary" />
          <h3 className="font-card-header text-card-header text-text-heading">Cardápio do Dia</h3>
        </div>
        <div className="p-md">
          <div className="flex items-start gap-md">
            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 shadow-sm bg-surface-container-low flex items-center justify-center">
              <UtensilsCrossed size={24} className="text-text-muted" />
            </div>
            <div>
              <h4 className="font-headline-md text-[18px] text-on-surface mb-xs">
                {cardapio ? 'Almoço de hoje' : 'Almoço do dia'}
              </h4>
              <p className="font-body-sm text-body-sm text-text-muted">
                {cardapio || 'O cardápio de hoje ainda não foi cadastrado pela equipe do refeitório.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {erroToast && <Toast mensagem={erroToast} onFechar={() => setErroToast(null)} />}
    </main>
  );
}
