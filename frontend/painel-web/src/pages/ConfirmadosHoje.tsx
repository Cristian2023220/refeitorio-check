import { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, CircleX, Search, Clock } from 'lucide-react';
import { chamarApi } from '../api/client';
import type { ConfirmadoHoje } from '../types';

function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function Skeleton() {
  return (
    <tr>
      <td className="p-md" colSpan={4}>
        <div className="space-y-sm animate-pulse">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 bg-surface-container-low rounded-lg" />
          ))}
        </div>
      </td>
    </tr>
  );
}

export function ConfirmadosHoje() {
  const [data, setData] = useState(hojeISO());
  const [busca, setBusca] = useState('');
  const [itens, setItens] = useState<ConfirmadoHoje[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setItens(null);
    setErro(null);
    chamarApi<ConfirmadoHoje[]>('/dashboard/confirmacoes?data=' + data)
      .then(setItens)
      .catch((e) => setErro(e instanceof Error ? e.message : 'Erro ao carregar.'));
  }, [data]);

  const itensFiltrados = useMemo(() => {
    if (!itens) return null;
    const termo = busca.toLowerCase();
    return itens.filter((c) => c.nome.toLowerCase().includes(termo) || c.matricula.toLowerCase().includes(termo));
  }, [itens, busca]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-text-heading m-0 mb-xs">Lista de Presença</h2>
          <p className="font-body-sm text-body-sm text-text-muted m-0">Base usada pelo totem para liberar o acesso no refeitório.</p>
        </div>
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            className="pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-body-sm font-body-sm text-text-heading focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-surface border-2 border-border shadow-[0_10px_25px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
        <div className="p-md border-b border-border bg-surface-container-low flex justify-between items-center flex-wrap gap-sm">
          <h3 className="font-card-header text-card-header text-text-heading">Alunos confirmados</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              className="pl-10 pr-4 py-1.5 bg-surface border border-border rounded-full text-body-sm font-body-sm text-text-heading focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors w-48 md:w-64"
              placeholder="Buscar aluno..."
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-border">
                <th className="p-md font-label-caps text-label-caps text-text-muted font-bold">Nome / Matrícula</th>
                <th className="p-md font-label-caps text-label-caps text-text-muted font-bold hidden sm:table-cell">Turma</th>
                <th className="p-md font-label-caps text-label-caps text-text-muted font-bold hidden md:table-cell">Confirmado às</th>
                <th className="p-md font-label-caps text-label-caps text-text-muted font-bold text-right">Status no totem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {erro && (
                <tr>
                  <td className="p-md text-error" colSpan={4}>
                    {erro}
                  </td>
                </tr>
              )}
              {!erro && itensFiltrados === null && <Skeleton />}
              {!erro && itensFiltrados?.length === 0 && (
                <tr>
                  <td className="p-md text-text-muted" colSpan={4}>
                    Nenhuma confirmação encontrada.
                  </td>
                </tr>
              )}
              {itensFiltrados?.map((c) => {
                const hora = c.confirmado_em
                  ? new Date(c.confirmado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                  : '—';
                const status = c.status_no_totem || 'pendente';
                const cor = status === 'liberado' ? 'bg-primary text-on-primary' : status === 'negado' ? 'bg-error text-on-primary' : 'bg-warning text-on-primary';
                const rotulo = status === 'liberado' ? 'Liberado' : status === 'negado' ? 'Negado' : 'Aguardando';
                const Icone = status === 'liberado' ? CheckCircle2 : status === 'negado' ? CircleX : Clock;
                return (
                  <tr key={`${c.matricula}-${c.confirmado_em}`} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-md">
                      <div className="font-body-md text-body-md text-text-heading font-medium">{c.nome}</div>
                      <div className="font-body-sm text-body-sm text-text-muted">Mat: {c.matricula}</div>
                    </td>
                    <td className="p-md hidden sm:table-cell font-body-sm text-body-sm text-text-muted">{c.curso || '—'}</td>
                    <td className="p-md hidden md:table-cell font-body-sm text-body-sm text-text-heading">{hora}</td>
                    <td className="p-md text-right">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${cor} font-label-caps text-[10px] uppercase tracking-wide`}>
                        <Icone size={14} /> {rotulo}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
