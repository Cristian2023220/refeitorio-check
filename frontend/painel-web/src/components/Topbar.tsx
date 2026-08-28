import { useState } from 'react';
import { Server, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ApiUrlModal } from './ApiUrlModal';

export function Topbar() {
  const [modalApiAberta, setModalApiAberta] = useState(false);

  return (
    <header className="bg-surface text-primary flex justify-between items-center w-full px-lg py-md sticky top-0 z-30 shadow-sm border-b border-border">
      <h1 className="text-headline-md font-headline-md font-bold text-primary m-0">Refeitório IF Baiano</h1>
      <div className="flex items-center space-x-md">
        <button
          className="text-text-muted hover:bg-surface-container-low transition-colors cursor-pointer p-sm rounded-full flex items-center justify-center"
          onClick={() => setModalApiAberta(true)}
          title="Configurar URL da API"
          type="button"
        >
          <Server size={20} />
        </button>
        <ThemeToggle />
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
          <User size={18} />
        </div>
      </div>
      {modalApiAberta && <ApiUrlModal onClose={() => setModalApiAberta(false)} />}
    </header>
  );
}
