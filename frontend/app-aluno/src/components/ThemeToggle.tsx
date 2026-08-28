import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { tema, alternarTema } = useTheme();

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={tema === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors"
    >
      {tema === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
