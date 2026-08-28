import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { getToken, limparToken, setToken as salvarToken } from '../api/client';

interface AuthContextValue {
  autenticado: boolean;
  entrar: (token: string) => void;
  sair: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [autenticado, setAutenticado] = useState(() => Boolean(getToken()));

  const value = useMemo<AuthContextValue>(
    () => ({
      autenticado,
      entrar: (token: string) => {
        salvarToken(token);
        setAutenticado(true);
      },
      sair: () => {
        limparToken();
        setAutenticado(false);
      },
    }),
    [autenticado]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de um AuthProvider');
  return context;
}
