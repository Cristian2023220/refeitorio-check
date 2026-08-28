import { BarChart3, ClipboardCheck, LayoutDashboard, LogOut, Nfc, Settings, UtensilsCrossed, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Pagina } from '../App';

interface SidebarProps {
  paginaAtiva: Pagina;
  onSelecionar: (pagina: Pagina) => void;
}

const ITENS: { pagina: Pagina; rotulo: string; Icone: LucideIcon }[] = [
  { pagina: 'dashboard', rotulo: 'Dashboard', Icone: LayoutDashboard },
  { pagina: 'confirmados', rotulo: 'Confirmados hoje', Icone: ClipboardCheck },
  { pagina: 'alunos', rotulo: 'Alunos', Icone: Users },
  { pagina: 'cartoes', rotulo: 'Cartões RFID', Icone: Nfc },
  { pagina: 'relatorios', rotulo: 'Relatórios', Icone: BarChart3 },
  { pagina: 'config', rotulo: 'Configurações', Icone: Settings },
];

export function Sidebar({ paginaAtiva, onSelecionar }: SidebarProps) {
  const { sessao, sair } = useAuth();

  return (
    <nav className="bg-surface h-screen w-64 flex flex-col border-r border-border shadow-md fixed left-0 top-0 bottom-0 z-40 p-md space-y-md">
      <div className="flex items-center gap-md p-2 mb-md border-b border-border pb-md">
        <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-sm shrink-0">
          <UtensilsCrossed size={22} className="text-on-primary" />
        </div>
        <div>
          <h2 className="font-headline-md text-headline-md text-primary leading-tight">Gestão Admin</h2>
          <span className="font-label-caps text-label-caps text-text-muted">Campus IF Baiano</span>
        </div>
      </div>

      <div className="flex-1 space-y-sm">
        {ITENS.map(({ pagina, rotulo, Icone }) => {
          const ativo = pagina === paginaAtiva;
          return (
            <button
              key={pagina}
              type="button"
              onClick={() => onSelecionar(pagina)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none transition-colors text-left ${
                ativo ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <Icone size={20} />
              <span className="font-label-caps text-label-caps">{rotulo}</span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-border pt-md space-y-xs">
        <div className="px-4 pb-sm">
          <p className="font-body-sm text-body-sm text-text-heading font-bold">{sessao?.nome || '—'}</p>
          <p className="font-label-caps text-label-caps text-text-muted">{sessao?.papel === 'gestor' ? 'Gestor(a)' : 'Operador(a)'}</p>
        </div>
        <button
          type="button"
          onClick={sair}
          className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container transition-colors cursor-pointer select-none rounded-lg text-left"
        >
          <LogOut size={20} />
          <span className="font-label-caps text-label-caps">Sair</span>
        </button>
      </div>
    </nav>
  );
}
