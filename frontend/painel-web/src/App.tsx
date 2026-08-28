import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ConfirmadosHoje } from './pages/ConfirmadosHoje';
import { Alunos } from './pages/Alunos';
import { Cartoes } from './pages/Cartoes';
import { Relatorios } from './pages/Relatorios';
import { Configuracoes } from './pages/Configuracoes';

export type Pagina = 'dashboard' | 'confirmados' | 'alunos' | 'cartoes' | 'relatorios' | 'config';

export function App() {
  const { sessao } = useAuth();
  const [pagina, setPagina] = useState<Pagina>('dashboard');

  if (!sessao) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Sidebar paginaAtiva={pagina} onSelecionar={setPagina} />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Topbar />
        <div className="flex-1 p-md md:p-lg xl:p-xl overflow-y-auto w-full max-w-[1200px] mx-auto">
          {pagina === 'dashboard' && <Dashboard />}
          {pagina === 'confirmados' && <ConfirmadosHoje />}
          {pagina === 'alunos' && <Alunos />}
          {pagina === 'cartoes' && <Cartoes />}
          {pagina === 'relatorios' && <Relatorios />}
          {pagina === 'config' && <Configuracoes />}
        </div>
      </div>
    </div>
  );
}
