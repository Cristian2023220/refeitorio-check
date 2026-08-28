import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { getSessao, limparSessao } from '../api/client';
import type { Papel } from '../types';

interface Sessao {
  nome: string;
  papel: Papel;
}

interface AuthContextValue {
  sessao: Sessao | null;
  entrar: (sessao: Sessao) => void;
  sair: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(() => getSessao());

  const value = useMemo<AuthContextValue>(
    () => ({
      sessao,
      entrar: (novaSessao: Sessao) => setSessao(novaSessao),
      sair: () => {
        limparSessao();
        setSessao(null);
      },
    }),
    [sessao]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de um AuthProvider');
  return context;
}
