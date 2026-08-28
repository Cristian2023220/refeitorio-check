import { Home, History, User } from 'lucide-react';
import type { Tela } from '../App';

interface BottomNavProps {
  telaAtiva: Tela;
  onSelecionar: (tela: Tela) => void;
}

const ITENS: { tela: Tela; rotulo: string; Icone: typeof Home }[] = [
  { tela: 'confirmar', rotulo: 'Início', Icone: Home },
  { tela: 'historico', rotulo: 'Histórico', Icone: History },
  { tela: 'perfil', rotulo: 'Perfil', Icone: User },
];

export function BottomNav({ telaAtiva, onSelecionar }: BottomNavProps) {
  return (
    <nav
      className="bg-surface border-t border-border shadow-[0_-4px_10px_rgba(0,0,0,0.05)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-2"
      style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
    >
      {ITENS.map(({ tela, rotulo, Icone }) => {
        const ativo = tela === telaAtiva;
        return (
          <button
            key={tela}
            type="button"
            onClick={() => onSelecionar(tela)}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl w-16 scale-95 active:scale-90 transition-transform ${
              ativo ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant'
            }`}
          >
            <Icone size={22} strokeWidth={ativo ? 2.5 : 2} />
            <span className="font-label-caps text-[10px] mt-xs">{rotulo}</span>
          </button>
        );
      })}
    </nav>
  );
}
