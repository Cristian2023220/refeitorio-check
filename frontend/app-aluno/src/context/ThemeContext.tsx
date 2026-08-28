import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Tema = 'light' | 'dark';
const THEME_KEY = 'refeitorio_tema';

function temaInicial(): Tema {
  const salvo = localStorage.getItem(THEME_KEY);
  if (salvo === 'light' || salvo === 'dark') return salvo;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

interface ThemeContextValue {
  tema: Tema;
  alternarTema: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(temaInicial);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'dark');
    localStorage.setItem(THEME_KEY, tema);
  }, [tema]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      tema,
      alternarTema: () => setTema((atual) => (atual === 'dark' ? 'light' : 'dark')),
    }),
    [tema]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme precisa estar dentro de um ThemeProvider');
  return context;
}
