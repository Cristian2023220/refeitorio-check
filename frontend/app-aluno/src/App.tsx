import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Login } from './pages/Login';
import { Confirmar } from './pages/Confirmar';
import { Historico } from './pages/Historico';
import { Perfil } from './pages/Perfil';

export type Tela = 'confirmar' | 'historico' | 'perfil';

export function App() {
  const { autenticado } = useAuth();
  const [tela, setTela] = useState<Tela>('confirmar');

  if (!autenticado) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-background text-on-background pb-[calc(80px+env(safe-area-inset-bottom))]">
      <Header />
      {tela === 'confirmar' && <Confirmar />}
      {tela === 'historico' && <Historico />}
      {tela === 'perfil' && <Perfil />}
      <BottomNav telaAtiva={tela} onSelecionar={setTela} />
    </div>
  );
}
