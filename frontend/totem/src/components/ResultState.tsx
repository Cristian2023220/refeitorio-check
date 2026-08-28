import { useEffect, useState } from 'react';
import { CheckCircle2, CircleX, TriangleAlert, Wallet } from 'lucide-react';
import type { AlunoAcesso } from '../types';

const FOTO_PADRAO = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
const SEGUNDOS_ATE_RESETAR = 6;

interface ResultStateProps {
  sucesso: boolean;
  aluno: AlunoAcesso;
  motivoTexto?: string;
  onFinalizar: () => void;
}

export function ResultState({ sucesso, aluno, motivoTexto, onFinalizar }: ResultStateProps) {
  const [segundosRestantes, setSegundosRestantes] = useState(SEGUNDOS_ATE_RESETAR);

  useEffect(() => {
    setSegundosRestantes(SEGUNDOS_ATE_RESETAR);
    const intervalo = setInterval(() => {
      setSegundosRestantes((atual) => {
        if (atual <= 1) {
          clearInterval(intervalo);
          onFinalizar();
          return 0;
        }
        return atual - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aluno, sucesso]);

  return (
    <div className="absolute inset-0 bg-surface/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-lg">
      <div className="w-full max-w-3xl bg-surface rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] border-2 border-border overflow-hidden slide-up">
        <div className={`h-32 flex items-center justify-center relative overflow-hidden ${sucesso ? 'bg-gradient-to-br from-primary-container to-primary' : 'bg-gradient-to-br from-error-container to-error'}`}>
          {sucesso ? <CheckCircle2 size={64} className="text-white" /> : <CircleX size={64} className="text-white" />}
          <h2 className="font-headline-lg text-headline-lg text-white ml-md relative z-10">
            {sucesso ? 'Acesso Liberado' : 'Acesso Negado'}
          </h2>
        </div>

        <div className="p-xl flex flex-col md:flex-row gap-xl items-center relative">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-surface shadow-[0_4px_10px_rgba(0,0,0,0.1)] shrink-0 relative -mt-24 md:mt-0 z-10 bg-surface-container-low">
            <img className="w-full h-full object-cover" alt="Foto do aluno" src={aluno.fotoUrl || FOTO_PADRAO} />
          </div>
          <div className="flex-1 text-center md:text-left space-y-md">
            <div>
              <p className="font-label-caps text-label-caps text-text-muted mb-xs uppercase">Nome do Aluno</p>
              <h3 className="font-headline-md text-headline-md text-text-heading">{aluno.nome}</h3>
            </div>
            <div className="flex flex-col md:flex-row gap-lg justify-center md:justify-start">
              <div>
                <p className="font-label-caps text-label-caps text-text-muted mb-xs uppercase">Matrícula</p>
                <p className="font-stat-value text-stat-value text-on-surface">{aluno.matricula}</p>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-text-muted mb-xs uppercase">Curso</p>
                <p className="font-body-md text-body-md text-on-surface">{aluno.curso || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background border-t border-border p-md flex justify-between items-center px-xl">
          <div>
            <p className="font-label-caps text-label-caps text-text-muted uppercase">Refeições Restantes</p>
            <p className={`font-status-display text-status-display flex items-center gap-2 ${sucesso ? 'text-primary' : 'text-error'}`}>
              {sucesso ? <Wallet size={20} /> : <TriangleAlert size={20} />}
              <span>{sucesso ? (aluno.saldoRestante ?? '—') : motivoTexto || 'Acesso negado'}</span>
            </p>
          </div>
          {sucesso && (
            <div>
              <p className="font-label-caps text-label-caps text-text-muted uppercase text-right">Usos Totais</p>
              <p className="font-body-md text-body-md text-on-surface text-right font-bold">{aluno.usosNoMes ?? '—'}</p>
            </div>
          )}
        </div>
      </div>
      <p className="mt-lg text-text-muted font-body-sm text-body-sm text-center">
        A tela retornará ao início automaticamente em <span>{segundosRestantes}</span> segundos.
      </p>
    </div>
  );
}
