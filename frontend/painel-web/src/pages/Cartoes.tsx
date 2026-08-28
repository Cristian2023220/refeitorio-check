import { useEffect, useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { chamarApi } from '../api/client';
import type { Aluno, Cartao } from '../types';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast } from '../components/Toast';

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

export function Cartoes() {
  const [itens, setItens] = useState<Cartao[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [alunos, setAlunos] = useState<Aluno[] | null>(null);
  const [uid, setUid] = useState('');
  const [alunoId, setAlunoId] = useState('');
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [cartaoParaBloquear, setCartaoParaBloquear] = useState<Cartao | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function carregar() {
    setItens(null);
    setErro(null);
    chamarApi<Cartao[]>('/cartoes')
      .then(setItens)
      .catch((e) => setErro(e instanceof Error ? e.message : 'Erro ao carregar.'));
  }

  useEffect(carregar, []);

  function abrirModal() {
    setUid('');
    setAlunoId('');
    setErroModal(null);
    setAlunos(null);
    setModalAberto(true);
    chamarApi<Aluno[]>('/alunos')
      .then(setAlunos)
      .catch((e) => setErroModal(e instanceof Error ? e.message : 'Erro ao carregar alunos.'));
  }

  async function salvarNovoCartao(evento: FormEvent) {
    evento.preventDefault();
    if (!uid.trim() || !alunoId) {
      setErroModal('Informe o UID e selecione um aluno.');
      return;
    }
    try {
      await chamarApi('/cartoes', { method: 'POST', body: JSON.stringify({ uid: uid.trim(), alunoId }) });
      setModalAberto(false);
      carregar();
    } catch (erroSalvar) {
      setErroModal(erroSalvar instanceof Error ? erroSalvar.message : 'Erro ao vincular.');
    }
  }

  async function confirmarBloqueio() {
    if (!cartaoParaBloquear) return;
    try {
      await chamarApi('/cartoes/' + cartaoParaBloquear.uid, { method: 'DELETE' });
      setCartaoParaBloquear(null);
      carregar();
    } catch (erroBloquear) {
      setCartaoParaBloquear(null);
      setToast(erroBloquear instanceof Error ? erroBloquear.message : 'Erro ao bloquear cartão.');
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-text-heading m-0 mb-xs">Cartões RFID</h2>
          <p className="font-body-sm text-body-sm text-text-muted m-0">Vincule o UID lido pelo leitor ao cadastro do aluno.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2.5 rounded-lg shadow-sm hover:bg-primary-container transition-colors"
          onClick={abrirModal}
          type="button"
        >
          <Plus size={18} /> Vincular cartão
        </button>
      </div>

      <div className="bg-surface border-2 border-border shadow-[0_10px_25px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest border-b border-border">
              <th className="p-md font-label-caps text-label-caps text-text-muted font-bold">UID</th>
              <th className="p-md font-label-caps text-label-caps text-text-muted font-bold">Aluno vinculado</th>
              <th className="p-md font-label-caps text-label-caps text-text-muted font-bold hidden sm:table-cell">Status</th>
              <th className="p-md font-label-caps text-label-caps text-text-muted font-bold hidden md:table-cell">Vinculado em</th>
              <th className="p-md font-label-caps text-label-caps text-text-muted font-bold text-right">Ação</th>
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
            {!erro && itens === null && <Skeleton />}
            {!erro && itens?.length === 0 && (
              <tr>
                <td className="p-md text-text-muted" colSpan={5}>
                  Nenhum cartão vinculado ainda.
                </td>
              </tr>
            )}
            {itens?.map((c) => (
              <tr key={c.uid} className="hover:bg-surface-container-low transition-colors">
                <td className="p-md font-body-sm text-body-sm text-text-heading">{c.uid}</td>
                <td className="p-md font-body-sm text-body-sm text-text-heading">{c.aluno_nome}</td>
                <td className="p-md hidden sm:table-cell">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full ${
                      c.status === 'ativo' ? 'bg-primary text-on-primary' : 'bg-error text-on-primary'
                    } font-label-caps text-[10px] uppercase`}
                  >
                    {c.status === 'ativo' ? 'Vinculado' : 'Bloqueado'}
                  </span>
                </td>
                <td className="p-md hidden md:table-cell font-body-sm text-body-sm text-text-muted">
                  {c.vinculado_em ? new Date(c.vinculado_em).toLocaleDateString('pt-BR') : '—'}
                </td>
                <td className="p-md text-right">
                  {c.status === 'ativo' && (
                    <button className="text-error hover:underline font-label-caps text-[11px]" onClick={() => setCartaoParaBloquear(c)}>
                      Bloquear
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <Modal titulo="Vincular cartão RFID" onClose={() => setModalAberto(false)}>
          <form className="space-y-sm" onSubmit={salvarNovoCartao}>
            <input
              className="w-full px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm"
              placeholder="UID lido no leitor (ex: 0012057967)"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
            />
            <select
              className="w-full px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm"
              value={alunoId}
              onChange={(e) => setAlunoId(e.target.value)}
            >
              <option value="">{alunos === null ? 'Carregando alunos...' : 'Selecione um aluno'}</option>
              {alunos?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome} — {a.matricula}
                </option>
              ))}
            </select>
            {erroModal && <p className="font-body-sm text-body-sm text-error bg-error-container/40 rounded px-3 py-2">{erroModal}</p>}
            <div className="flex gap-sm mt-lg">
              <button
                type="button"
                className="flex-1 py-2 rounded-lg border border-border text-text-heading font-body-sm hover:bg-surface-container-low transition-colors"
                onClick={() => setModalAberto(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-primary text-on-primary font-body-sm font-bold hover:bg-surface-tint transition-colors"
              >
                Vincular
              </button>
            </div>
          </form>
        </Modal>
      )}

      {cartaoParaBloquear && (
        <ConfirmDialog
          titulo="Bloquear cartão"
          mensagem="Bloquear este cartão? Ele deixa de liberar acesso no totem."
          rotuloConfirmar="Bloquear"
          onConfirmar={confirmarBloqueio}
          onCancelar={() => setCartaoParaBloquear(null)}
        />
      )}

      {toast && <Toast mensagem={toast} onFechar={() => setToast(null)} />}
    </div>
  );
}
