import { useEffect, useState } from 'react';
import { ApiError, chamarApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Configuracoes as ConfiguracoesTipo } from '../types';

export function Configuracoes() {
  const { sessao } = useAuth();
  const ehGestor = sessao?.papel === 'gestor';

  const [config, setConfig] = useState<ConfiguracoesTipo>({});
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'erro' | 'sucesso' } | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    chamarApi<ConfiguracoesTipo>('/configuracoes')
      .then(setConfig)
      .catch((e) => setMensagem({ texto: e instanceof Error ? e.message : 'Erro ao carregar.', tipo: 'erro' }));
  }, []);

  function set<K extends keyof ConfiguracoesTipo>(chave: K, valor: string) {
    setConfig((atual) => ({ ...atual, [chave]: valor }));
  }

  async function salvar() {
    setSalvando(true);
    setMensagem(null);
    try {
      await chamarApi('/configuracoes', { method: 'PUT', body: JSON.stringify(config) });
      setMensagem({ texto: 'Configurações salvas.', tipo: 'sucesso' });
    } catch (erro) {
      const texto = erro instanceof ApiError && erro.status === 403 ? 'Só um usuário com papel de gestor pode alterar as configurações.' : erro instanceof Error ? erro.message : 'Erro ao salvar.';
      setMensagem({ texto, tipo: 'erro' });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <div className="mb-lg">
        <h2 className="font-headline-lg text-headline-lg text-text-heading m-0 mb-xs">Configurações</h2>
        <p className="font-body-sm text-body-sm text-text-muted m-0">Parâmetros usados pelo app e pelo totem.</p>
      </div>

      {!ehGestor && (
        <p className="font-body-sm text-body-sm rounded px-3 py-2 mb-md max-w-[640px] bg-warning/20 text-warning">
          Você está logado(a) como operador(a) — pode visualizar, mas só um(a) gestor(a) pode salvar alterações aqui.
        </p>
      )}

      {mensagem && (
        <p
          className={`font-body-sm text-body-sm rounded px-3 py-2 mb-md max-w-[640px] ${
            mensagem.tipo === 'erro' ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'
          }`}
        >
          {mensagem.texto}
        </p>
      )}

      <div className="bg-surface border-2 border-border shadow-[0_10px_25px_rgba(0,0,0,0.05)] rounded-xl p-lg grid grid-cols-1 md:grid-cols-2 gap-md max-w-[640px]">
        <div>
          <label className="block font-label-caps text-label-caps text-text-muted mb-xs">Início do almoço</label>
          <input
            className="w-full px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm"
            type="time"
            value={config.hora_inicio_almoco || ''}
            onChange={(e) => set('hora_inicio_almoco', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-label-caps text-label-caps text-text-muted mb-xs">Fim do almoço</label>
          <input
            className="w-full px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm"
            type="time"
            value={config.hora_fim_almoco || ''}
            onChange={(e) => set('hora_fim_almoco', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-label-caps text-label-caps text-text-muted mb-xs">Prazo para confirmar presença</label>
          <input
            className="w-full px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm"
            type="time"
            value={config.prazo_confirmacao || ''}
            onChange={(e) => set('prazo_confirmacao', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-label-caps text-label-caps text-text-muted mb-xs">Limite mensal padrão</label>
          <input
            className="w-full px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm"
            type="number"
            value={config.limite_mensal_padrao || ''}
            onChange={(e) => set('limite_mensal_padrao', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-label-caps text-label-caps text-text-muted mb-xs">Cardápio do dia (opcional, exibido no app)</label>
          <input
            className="w-full px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm"
            type="text"
            value={config.cardapio_dia || ''}
            onChange={(e) => set('cardapio_dia', e.target.value)}
          />
        </div>
      </div>
      <button
        className="mt-lg bg-primary text-on-primary font-label-caps text-label-caps px-5 py-2.5 rounded-lg shadow-sm hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={salvar}
        disabled={!ehGestor || salvando}
        type="button"
      >
        {salvando ? 'Salvando...' : 'Salvar alterações'}
      </button>
    </div>
  );
}
