import { useEffect, useState } from 'react';
import { chamarApi } from '../api/client';
import type { RelatorioLinha } from '../types';

function periodoPadrao() {
  const fim = new Date();
  const inicio = new Date();
  inicio.setDate(fim.getDate() - 6);
  return { inicio: inicio.toISOString().slice(0, 10), fim: fim.toISOString().slice(0, 10) };
}

function Skeleton() {
  return (
    <tr>
      <td className="p-md" colSpan={5}>
        <div className="space-y-sm animate-pulse">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 bg-surface-container-low rounded-lg" />
          ))}
        </div>
      </td>
    </tr>
  );
}

export function Relatorios() {
  const [periodo, setPeriodo] = useState(periodoPadrao);
  const [linhas, setLinhas] = useState<RelatorioLinha[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  function carregar() {
    setLinhas(null);
    setErro(null);
    chamarApi<RelatorioLinha[]>(`/relatorios?inicio=${periodo.inicio}&fim=${periodo.fim}`)
      .then(setLinhas)
      .catch((e) => setErro(e instanceof Error ? e.message : 'Erro ao carregar.'));
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mb-lg">
        <h2 className="font-headline-lg text-headline-lg text-text-heading m-0 mb-xs">Relatórios</h2>
        <p className="font-body-sm text-body-sm text-text-muted m-0">Histórico de uso por período.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-lg">
        <input
          className="px-3 py-2 bg-surface border border-border rounded-lg text-body-sm font-body-sm"
          type="date"
          value={periodo.inicio}
          onChange={(e) => setPeriodo({ ...periodo, inicio: e.target.value })}
        />
        <input
          className="px-3 py-2 bg-surface border border-border rounded-lg text-body-sm font-body-sm"
          type="date"
          value={periodo.fim}
          onChange={(e) => setPeriodo({ ...periodo, fim: e.target.value })}
        />
        <button
          className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2 rounded-lg shadow-sm hover:bg-primary-container transition-colors"
          onClick={carregar}
          type="button"
        >
          Filtrar
        </button>
      </div>
      <div className="bg-surface border-2 border-border shadow-[0_10px_25px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest border-b border-border">
              <th className="p-md font-label-caps text-label-caps text-text-muted font-bold">Data</th>
              <th className="p-md font-label-caps text-label-caps text-text-muted font-bold text-center">Confirmados</th>
              <th className="p-md font-label-caps text-label-caps text-text-muted font-bold text-center">Liberados</th>
              <th className="p-md font-label-caps text-label-caps text-text-muted font-bold text-center">Negados</th>
              <th className="p-md font-label-caps text-label-caps text-text-muted font-bold text-right">Comparecimento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {erro && (
              <tr>
                <td className="p-md text-error" colSpan={5}>
                  {erro}
                </td>
              </tr>
            )}
            {!erro && linhas === null && <Skeleton />}
            {linhas?.map((l) => (
              <tr key={l.data} className="hover:bg-surface-container-low transition-colors">
                <td className="p-md font-body-sm text-body-sm text-text-heading">{new Date(l.data).toLocaleDateString('pt-BR')}</td>
                <td className="p-md text-center font-body-sm text-body-sm text-text-heading">{l.confirmados}</td>
                <td className="p-md text-center font-body-sm text-body-sm text-text-heading">{l.liberados}</td>
                <td className="p-md text-center font-body-sm text-body-sm text-text-heading">{l.negados}</td>
                <td className="p-md text-right font-body-sm text-body-sm text-text-heading">{l.taxaComparecimento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
