import { useEffect, useState } from 'react';
import { CheckCircle2, History as HistoryIcon, XCircle } from 'lucide-react';
import { chamarApi } from '../api/client';
import type { HistoricoItem, MotivoNegacao } from '../types';

const ROTULOS_MOTIVO: Record<MotivoNegacao, string> = {
  sem_confirmacao: 'Presença não confirmada',
  sem_saldo: 'Limite mensal atingido',
  fora_horario: 'Fora do horário do almoço',
  cartao_desconhecido: 'Cartão não reconhecido',
};

function Skeleton() {
  return (
    <div className="p-md space-y-sm animate-pulse">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-14 bg-surface-container-low rounded-lg" />
      ))}
    </div>
  );
}

export function Historico() {
  const [itens, setItens] = useState<HistoricoItem[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    chamarApi<HistoricoItem[]>('/me/historico')
      .then(setItens)
      .catch((e) => setErro(e instanceof Error ? e.message : 'Erro ao carregar histórico.'));
  }, []);

  const liberados = itens?.filter((i) => i.resultado === 'liberado').length ?? '—';
  const negados = itens?.filter((i) => i.resultado === 'negado').length ?? '—';
  const total = itens?.length ?? '—';

  return (
    <div className="max-w-md mx-auto px-md py-lg space-y-lg">
      <h2 className="font-headline-md text-headline-md text-text-heading">Histórico</h2>
      <div className="grid grid-cols-3 gap-sm">
        <div className="bg-surface rounded-xl border border-border p-md text-center">
          <p className="font-label-caps text-label-caps text-text-muted uppercase">Liberados</p>
          <p className="font-stat-value text-stat-value text-primary mt-xs">{liberados}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-md text-center">
          <p className="font-label-caps text-label-caps text-text-muted uppercase">Negados</p>
          <p className="font-stat-value text-stat-value text-error mt-xs">{negados}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-md text-center">
          <p className="font-label-caps text-label-caps text-text-muted uppercase">Total</p>
          <p className="font-stat-value text-stat-value text-text-heading mt-xs">{total}</p>
        </div>
      </div>
      <section className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="border-b border-border px-md py-sm bg-surface-bright flex items-center gap-xs">
          <HistoryIcon size={20} className="text-secondary" />
          <h3 className="font-card-header text-card-header text-text-heading">Acessos recentes</h3>
        </div>
        <div className="divide-y divide-border">
          {erro && <p className="p-md font-body-sm text-body-sm text-error">{erro}</p>}
          {!erro && itens === null && <Skeleton />}
          {!erro && itens?.length === 0 && (
            <p className="p-md font-body-sm text-body-sm text-text-muted">Nenhum acesso registrado ainda.</p>
          )}
          {itens?.map((item, indice) => {
            const data = new Date(item.lido_em).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            });
            const ok = item.resultado === 'liberado';
            const motivo = ok ? 'Almoço' : (item.motivo_negacao && ROTULOS_MOTIVO[item.motivo_negacao]) || 'Negado';
            return (
              <div key={indice} className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-md">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      ok ? 'bg-secondary-container text-primary-container' : 'bg-error-container text-error'
                    }`}
                  >
                    {ok ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  </div>
                  <div>
                    <p className="font-body-md text-body-md text-on-surface font-semibold">{motivo}</p>
                    <p className="font-body-sm text-body-sm text-text-muted">{data}</p>
                  </div>
                </div>
                <span
                  className={`font-label-caps text-label-caps px-2 py-1 rounded ${
                    ok ? 'bg-surface-container-high text-on-surface-variant' : 'bg-error-container text-error'
                  }`}
                >
                  {ok ? 'Liberado' : 'Negado'}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
