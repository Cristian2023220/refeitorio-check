import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Plus, Search } from 'lucide-react';
import { chamarApi } from '../api/client';
import type { Aluno } from '../types';
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

const ALUNO_VAZIO = { nome: '', matricula: '', curso: '', telefone: '', limiteMensal: '30', senha: '' };

export function Alunos() {
  const [busca, setBusca] = useState('');
  const [itens, setItens] = useState<Aluno[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoAluno, setNovoAluno] = useState(ALUNO_VAZIO);
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [alunoParaExcluir, setAlunoParaExcluir] = useState<Aluno | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timeoutBusca = useRef<ReturnType<typeof setTimeout> | null>(null);

  function carregar(termo: string) {
    setItens(null);
    setErro(null);
    chamarApi<Aluno[]>('/alunos' + (termo ? '?busca=' + encodeURIComponent(termo) : ''))
      .then(setItens)
      .catch((e) => setErro(e instanceof Error ? e.message : 'Erro ao carregar.'));
  }

  useEffect(() => {
    carregar('');
  }, []);

  function aoDigitarBusca(valor: string) {
    setBusca(valor);
    if (timeoutBusca.current) clearTimeout(timeoutBusca.current);
    timeoutBusca.current = setTimeout(() => carregar(valor.trim()), 350);
  }

  function abrirModal() {
    setNovoAluno(ALUNO_VAZIO);
    setErroModal(null);
    setModalAberto(true);
  }

  async function salvarNovoAluno(evento: FormEvent) {
    evento.preventDefault();
    if (!novoAluno.nome || !novoAluno.matricula || !novoAluno.senha) {
      setErroModal('Nome, matrícula e senha são obrigatórios.');
      return;
    }
    try {
      await chamarApi('/alunos', {
        method: 'POST',
        body: JSON.stringify({
          nome: novoAluno.nome.trim(),
          matricula: novoAluno.matricula.trim(),
          curso: novoAluno.curso.trim(),
          telefone: novoAluno.telefone.trim(),
          limiteMensal: Number(novoAluno.limiteMensal) || 30,
          senha: novoAluno.senha,
        }),
      });
      setModalAberto(false);
      carregar(busca);
    } catch (erroSalvar) {
      setErroModal(erroSalvar instanceof Error ? erroSalvar.message : 'Erro ao cadastrar.');
    }
  }

  async function confirmarExclusao() {
    if (!alunoParaExcluir) return;
    try {
      await chamarApi('/alunos/' + alunoParaExcluir.id, { method: 'DELETE' });
      setAlunoParaExcluir(null);
      carregar(busca);
    } catch (erroExcluir) {
      setAlunoParaExcluir(null);
      setToast(erroExcluir instanceof Error ? erroExcluir.message : 'Erro ao desativar aluno.');
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-text-heading m-0 mb-xs">Alunos</h2>
          <p className="font-body-sm text-body-sm text-text-muted m-0">Gestão de dados, curso e limite mensal de cada aluno.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2.5 rounded-lg shadow-sm hover:bg-primary-container transition-colors"
          onClick={abrirModal}
          type="button"
        >
          <Plus size={18} /> Novo aluno
        </button>
      </div>

      <div className="bg-surface border-2 border-border shadow-[0_10px_25px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
        <div className="p-md border-b border-border bg-surface-container-low flex justify-between items-center flex-wrap gap-sm">
          <h3 className="font-card-header text-card-header text-text-heading">Cadastro</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              className="pl-10 pr-4 py-1.5 bg-surface border border-border rounded-full text-body-sm font-body-sm text-text-heading focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors w-48 md:w-64"
              placeholder="Buscar por nome ou matrícula..."
              type="text"
              value={busca}
              onChange={(e) => aoDigitarBusca(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-border">
                <th className="p-md font-label-caps text-label-caps text-text-muted font-bold">Nome / Matrícula</th>
                <th className="p-md font-label-caps text-label-caps text-text-muted font-bold hidden sm:table-cell">Curso</th>
                <th className="p-md font-label-caps text-label-caps text-text-muted font-bold text-center">Limite mensal</th>
                <th className="p-md font-label-caps text-label-caps text-text-muted font-bold text-center">Usos no mês</th>
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
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              )}
              {itens?.map((a) => (
                <tr key={a.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-md">
                    <div className="font-body-md text-body-md text-text-heading font-medium">{a.nome}</div>
                    <div className="font-body-sm text-body-sm text-text-muted">Mat: {a.matricula}</div>
                  </td>
                  <td className="p-md hidden sm:table-cell font-body-sm text-body-sm text-text-muted">{a.curso || '—'}</td>
                  <td className="p-md text-center font-body-sm text-body-sm text-text-heading">{a.limite_mensal}</td>
                  <td className="p-md text-center font-body-sm text-body-sm text-text-heading">{a.usos_no_mes}</td>
                  <td className="p-md text-right">
                    <button className="text-error hover:underline font-label-caps text-[11px]" onClick={() => setAlunoParaExcluir(a)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <Modal titulo="Novo aluno" onClose={() => setModalAberto(false)}>
          <form className="space-y-sm" onSubmit={salvarNovoAluno}>
            <input
              className="w-full px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm"
              placeholder="Nome completo"
              value={novoAluno.nome}
              onChange={(e) => setNovoAluno({ ...novoAluno, nome: e.target.value })}
            />
            <input
              className="w-full px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm"
              placeholder="Matrícula"
              value={novoAluno.matricula}
              onChange={(e) => setNovoAluno({ ...novoAluno, matricula: e.target.value })}
            />
            <input
              className="w-full px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm"
              placeholder="Curso / turma"
              value={novoAluno.curso}
              onChange={(e) => setNovoAluno({ ...novoAluno, curso: e.target.value })}
            />
            <input
              className="w-full px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm"
              placeholder="Telefone"
              value={novoAluno.telefone}
              onChange={(e) => setNovoAluno({ ...novoAluno, telefone: e.target.value })}
            />
            <input
              className="w-full px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm"
              placeholder="Limite mensal"
              type="number"
              value={novoAluno.limiteMensal}
              onChange={(e) => setNovoAluno({ ...novoAluno, limiteMensal: e.target.value })}
            />
            <input
              className="w-full px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm"
              placeholder="Senha inicial"
              value={novoAluno.senha}
              onChange={(e) => setNovoAluno({ ...novoAluno, senha: e.target.value })}
            />
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
                Cadastrar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {alunoParaExcluir && (
        <ConfirmDialog
          titulo="Desativar aluno"
          mensagem={`Desativar o cadastro de ${alunoParaExcluir.nome}? O histórico dele é mantido.`}
          rotuloConfirmar="Desativar"
          onConfirmar={confirmarExclusao}
          onCancelar={() => setAlunoParaExcluir(null)}
        />
      )}

      {toast && <Toast mensagem={toast} onFechar={() => setToast(null)} />}
    </div>
  );
}
