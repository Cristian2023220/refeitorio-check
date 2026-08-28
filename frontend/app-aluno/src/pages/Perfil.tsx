import { useEffect, useState } from 'react';
import { chamarApi, getApiUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Aluno } from '../types';
import { ApiUrlModal } from '../components/ApiUrlModal';

const FOTO_PADRAO = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

export function Perfil() {
  const { sair } = useAuth();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [modalApiAberta, setModalApiAberta] = useState(false);

  useEffect(() => {
    chamarApi<Aluno>('/me').then(setAluno).catch(console.error);
  }, []);

  return (
    <div className="max-w-md mx-auto px-md py-lg space-y-lg">
      <h2 className="font-headline-md text-headline-md text-text-heading">Perfil</h2>
      <section className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden p-lg flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-container shadow-sm mb-md">
          <img alt="Perfil" className="w-full h-full object-cover" src={aluno?.fotoUrl || FOTO_PADRAO} />
        </div>
        <h3 className="font-headline-md text-[18px] text-text-heading">{aluno?.nome || '—'}</h3>
        <p className="font-body-sm text-body-sm text-text-muted">{aluno?.curso || '—'}</p>
      </section>
      <section className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="divide-y divide-border">
          <div className="p-md flex justify-between">
            <span className="font-body-sm text-body-sm text-text-muted">Matrícula</span>
            <span className="font-body-sm text-body-sm text-text-heading font-semibold">{aluno?.matricula || '—'}</span>
          </div>
          <div className="p-md flex justify-between">
            <span className="font-body-sm text-body-sm text-text-muted">Telefone</span>
            <span className="font-body-sm text-body-sm text-text-heading font-semibold">{aluno?.telefone || '—'}</span>
          </div>
          <div className="p-md flex justify-between">
            <span className="font-body-sm text-body-sm text-text-muted">Cartão RFID</span>
            <span
              className={`font-label-caps text-label-caps px-2 py-1 rounded-full ${
                aluno?.cartaoVinculado ? 'bg-secondary-container text-on-secondary-container' : 'bg-warning/20 text-warning'
              }`}
            >
              {aluno ? (aluno.cartaoVinculado ? 'Vinculado' : 'Pendente') : '—'}
            </span>
          </div>
          <div className="p-md flex justify-between">
            <span className="font-body-sm text-body-sm text-text-muted">Limite mensal</span>
            <span className="font-body-sm text-body-sm text-text-heading font-semibold">
              {aluno ? `${aluno.limiteMensal} usos` : '—'}
            </span>
          </div>
        </div>
      </section>
      <button
        className="w-full py-3 rounded-lg border border-error text-error font-body-sm font-bold hover:bg-error-container/30 transition-colors"
        onClick={sair}
      >
        Sair da conta
      </button>
      <button
        className="w-full font-body-sm text-body-sm text-text-muted underline"
        onClick={() => setModalApiAberta(true)}
        type="button"
      >
        API: {getApiUrl()}
      </button>

      {modalApiAberta && <ApiUrlModal onClose={() => setModalApiAberta(false)} />}
    </div>
  );
}
