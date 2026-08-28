import { useEffect, useRef, useState } from 'react';
import { Settings } from 'lucide-react';
import { DispositivoNaoAutorizadoError, getConfig, verificarAcesso } from './api/client';
import type { AlunoAcesso, Motivo } from './types';
import { IdleState } from './components/IdleState';
import { ResultState } from './components/ResultState';
import { ConfigModal } from './components/ConfigModal';

const MENSAGENS_NEGACAO: Record<Motivo, string> = {
  cartao_desconhecido: 'Cartão não reconhecido',
  fora_horario: 'Fora do horário de almoço',
  sem_confirmacao: 'Presença não confirmada para hoje',
  sem_saldo: 'Limite mensal atingido',
};

interface Resultado {
  sucesso: boolean;
  aluno: AlunoAcesso;
  motivoTexto?: string;
}

export function App() {
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [modalConfigAberto, setModalConfigAberto] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!getConfig().deviceKey) {
      setMensagemErro('Configure a chave do dispositivo (⚙ no canto superior)');
    }
  }, []);

  useEffect(() => {
    function refocar(evento: MouseEvent) {
      const alvo = evento.target as HTMLElement;
      if (alvo.tagName !== 'BUTTON' && alvo.tagName !== 'INPUT') {
        inputRef.current?.focus();
      }
    }
    document.addEventListener('click', refocar);
    return () => document.removeEventListener('click', refocar);
  }, []);

  async function processarLeitura(uid: string) {
    setMensagemErro(null);
    try {
      const dados = await verificarAcesso(uid);

      if (dados.resultado === 'liberado' && dados.aluno) {
        setResultado({ sucesso: true, aluno: dados.aluno });
      } else if (dados.aluno) {
        setResultado({
          sucesso: false,
          aluno: dados.aluno,
          motivoTexto: dados.motivo && MENSAGENS_NEGACAO[dados.motivo],
        });
      } else {
        const texto = (dados.motivo && MENSAGENS_NEGACAO[dados.motivo]) || 'Acesso negado';
        setMensagemErro(`${texto} (${uid})`);
        setTimeout(() => setMensagemErro(null), 3000);
      }
    } catch (erro) {
      if (erro instanceof DispositivoNaoAutorizadoError) {
        setMensagemErro(erro.message);
      } else {
        setMensagemErro(erro instanceof Error ? erro.message : 'Erro inesperado.');
      }
    }
  }

  function aoPressionarTecla(evento: React.KeyboardEvent<HTMLInputElement>) {
    if (evento.key !== 'Enter') return;
    evento.preventDefault();
    const codigoLido = inputRef.current?.value.trim();
    if (inputRef.current) inputRef.current.value = '';
    if (codigoLido) processarLeitura(codigoLido);
  }

  return (
    <div className="bg-background h-screen w-screen overflow-hidden flex flex-col text-on-surface relative">
      <input ref={inputRef} id="leitor_rfid" autoComplete="off" autoFocus type="text" onKeyDown={aoPressionarTecla} />

      <button
        className="fixed top-5 right-5 z-30 w-11 h-11 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors"
        onClick={() => setModalConfigAberto(true)}
        title="Configurar API"
        type="button"
      >
        <Settings size={20} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {!resultado && <IdleState mensagemErro={mensagemErro} onLerUid={processarLeitura} />}
        {resultado && (
          <ResultState
            sucesso={resultado.sucesso}
            aluno={resultado.aluno}
            motivoTexto={resultado.motivoTexto}
            onFinalizar={() => {
              setResultado(null);
              inputRef.current?.focus();
            }}
          />
        )}
      </div>

      {modalConfigAberto && (
        <ConfigModal
          onClose={() => setModalConfigAberto(false)}
          onSalvar={() => {
            if (getConfig().deviceKey) setMensagemErro(null);
          }}
        />
      )}
    </div>
  );
}
