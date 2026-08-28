import { useEffect, useState } from 'react';
import { chamarApi } from '../api/client';
import type { Aluno } from '../types';
import { ThemeToggle } from './ThemeToggle';

const FOTO_PADRAO = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

export function Header() {
  const [aluno, setAluno] = useState<Aluno | null>(null);

  useEffect(() => {
    chamarApi<Aluno>('/me')
      .then(setAluno)
      .catch((erro) => console.error(erro));
  }, []);

  const primeiroNome = aluno?.nome.split(' ')[0];

  return (
    <header className="bg-surface px-md py-lg shadow-sm sticky top-0 z-40" style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}>
      <div className="flex justify-between items-center max-w-md mx-auto">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
            {primeiroNome ? `Olá, ${primeiroNome}! 👋` : 'Olá! 👋'}
          </h1>
          <p className="font-body-sm text-body-sm text-text-muted mt-xs">{aluno?.curso || '—'}</p>
        </div>
        <div className="flex items-center gap-sm">
          <ThemeToggle />
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container shadow-sm shrink-0">
            <img alt="Perfil" className="w-full h-full object-cover" src={aluno?.fotoUrl || FOTO_PADRAO} />
          </div>
        </div>
      </div>
    </header>
  );
}
