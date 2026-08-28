import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { tema, alternarTema } = useTheme();

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={tema === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={tema === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      className="text-text-muted hover:bg-surface-container-low transition-colors cursor-pointer p-sm rounded-full flex items-center justify-center"
    >
      {tema === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
