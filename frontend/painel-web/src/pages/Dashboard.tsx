import { useEffect, useState } from 'react';
import { Ban, ClipboardCheck, Clock, Contact, CircleX, TriangleAlert, UtensilsCrossed, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { chamarApi } from '../api/client';
import type { Aluno, Cartao, ConfirmadoHoje, RelatorioLinha, ResumoDashboard } from '../types';
import { StatCard } from '../components/StatCard';

function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

interface Alerta {
  texto: string;
  Icone: LucideIcon;
  cor: string;
}

export function Dashboard() {
  const [resumo, setResumo] = useState<ResumoDashboard | null>(null);
  const [alertas, setAlertas] = useState<Alerta[] | null>(null);
  const [barras, setBarras] = useState<RelatorioLinha[] | null>(null);

  useEffect(() => {
    chamarApi<ResumoDashboard>('/dashboard/resumo').then(setResumo).catch(console.error);

    Promise.all([
      chamarApi<Aluno[]>('/alunos'),
      chamarApi<Cartao[]>('/cartoes'),
      chamarApi<ConfirmadoHoje[]>('/dashboard/confirmacoes?data=' + hojeISO()),
    ])
      .then(([alunosLista, cartoesLista, confirmadosLista]) => {
        const semCartao = Math.max(alunosLista.length - cartoesLista.length, 0);
        const atingiramLimite = alunosLista.filter((a) => a.usos_no_mes >= a.limite_mensal).length;
        const naoConfirmaram = Math.max(alunosLista.length - confirmadosLista.length, 0);

        setAlertas([
          { texto: `${semCartao} aluno(s) sem cartão vinculado`, Icone: Contact, cor: 'bg-surface-container-high text-on-surface' },
          { texto: `${atingiramLimite} aluno(s) atingiram o limite mensal`, Icone: Ban, cor: 'bg-error-container text-on-error-container' },
          { texto: `${naoConfirmaram} aluno(s) ainda não confirmaram hoje`, Icone: Clock, cor: 'bg-warning/20 text-warning' },
        ]);
      })
      .catch(console.error);

    const fim = new Date();
    const inicio = new Date();
    inicio.setDate(fim.getDate() - 6);
    chamarApi<RelatorioLinha[]>(`/relatorios?inicio=${inicio.toISOString().slice(0, 10)}&fim=${fim.toISOString().slice(0, 10)}`)
      .then(setBarras)
      .catch(console.error);
  }, []);

  const maiorValor = barras ? Math.max(...barras.map((l) => l.liberados), 1) : 1;

  return (
    <div>
      <div className="mb-lg">
        <h2 className="font-headline-lg text-headline-lg text-text-heading m-0 mb-xs">Visão Geral</h2>
        <p className="font-body-sm text-body-sm text-text-muted m-0">
          Acompanhe as métricas diárias do refeitório — {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md md:gap-lg mb-lg">
        <StatCard rotulo="Confirmados Hoje" valor={resumo ? resumo.confirmadosHoje : '—'} icone={ClipboardCheck} />
        <StatCard rotulo="Já Liberados" valor={resumo ? resumo.liberadosHoje : '—'} icone={UtensilsCrossed} />
        <StatCard rotulo="Negados Hoje" valor={resumo ? resumo.negadosHoje : '—'} icone={CircleX} />
        <StatCard rotulo="Saldo Médio Restante" valor={resumo ? (resumo.saldoMedioRestante ?? '—') : '—'} icone={Wallet} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md md:gap-lg">
        <div className="lg:col-span-2 bg-surface rounded-xl border-2 border-border shadow-[0_10px_25px_rgba(0,0,0,0.05)] flex flex-col">
          <div className="p-md border-b border-border flex justify-between items-center">
            <h3 className="font-card-header text-card-header text-text-heading m-0">Liberados por dia — última semana</h3>
          </div>
          <div className="p-md flex-1 flex items-end justify-around min-h-[260px] gap-xs sm:gap-md">
            {barras?.map((linha) => {
              const dia = new Date(linha.data).toLocaleDateString('pt-BR', { weekday: 'short' });
              const altura = Math.max(Math.round((linha.liberados / maiorValor) * 100), 4);
              return (
                <div key={linha.data} className="flex flex-col items-center flex-1 group">
                  <div
                    className="w-full max-w-[40px] bg-secondary-container group-hover:bg-primary transition-colors rounded-t-sm"
                    style={{ height: `${altura}%` }}
                  />
                  <span className="font-label-caps text-label-caps text-text-muted mt-sm">{dia}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface rounded-xl border-2 border-border shadow-[0_10px_25px_rgba(0,0,0,0.05)] flex flex-col">
          <div className="p-md border-b border-border flex justify-between items-center bg-surface-container-low rounded-t-xl">
            <div className="flex items-center space-x-sm">
              <TriangleAlert size={20} className="text-warning" />
              <h3 className="font-card-header text-card-header text-text-heading m-0">Alertas</h3>
            </div>
          </div>
          <ul className="m-0 p-xs list-none space-y-xs flex-1">
            {alertas?.map((alerta) => (
              <li key={alerta.texto} className="p-md hover:bg-surface-container-low transition-colors rounded-lg flex items-center gap-md">
                <div className={`w-10 h-10 rounded-full ${alerta.cor} flex items-center justify-center shrink-0`}>
                  <alerta.Icone size={20} />
                </div>
                <p className="font-body-sm text-body-sm text-text-heading m-0">{alerta.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
