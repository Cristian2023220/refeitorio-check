import { useState, type FormEvent } from 'react';
import { Lock, User as UserIcon, UtensilsCrossed } from 'lucide-react';
import { getApiUrl, login } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ApiUrlModal } from '../components/ApiUrlModal';

export function Login() {
  const { entrar } = useAuth();
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [modalApiAberta, setModalApiAberta] = useState(false);

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);

    if (!matricula.trim() || !senha) {
      setErro('Preencha matrícula e senha.');
      return;
    }

    setCarregando(true);
    try {
      const { token } = await login(matricula.trim(), senha);
      entrar(token);
    } catch (erroLogin) {
      setErro(erroLogin instanceof Error ? erroLogin.message : 'Não foi possível conectar à API.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-lg py-xl bg-background"
      style={{ paddingTop: 'calc(2rem + env(safe-area-inset-top))', paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
    >
      <div className="w-16 h-16 bg-primary-container rounded-lg flex items-center justify-center mb-md shadow-sm">
        <UtensilsCrossed size={32} className="text-on-primary-container" />
      </div>
      <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-xs text-center">
        Refeitório IF Baiano
      </h1>
      <p className="font-body-md text-body-md text-text-muted mb-lg text-center">Acesse sua conta para continuar.</p>

      <form className="w-full max-w-sm space-y-md" onSubmit={aoEnviar}>
        <div className="space-y-base">
          <label className="block font-label-caps text-label-caps text-text-muted" htmlFor="login_matricula">
            Matrícula
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              <UserIcon size={20} />
            </div>
            <input
              id="login_matricula"
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded text-text-heading font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="2024IFBA001"
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-base">
          <label className="block font-label-caps text-label-caps text-text-muted" htmlFor="login_senha">
            Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              <Lock size={20} />
            </div>
            <input
              id="login_senha"
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded text-text-heading font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="••••••••"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
        </div>
        {erro && (
          <p className="font-body-sm text-body-sm text-error bg-error-container/40 rounded px-3 py-2">{erro}</p>
        )}
        <button
          className="w-full flex justify-center py-3 px-4 rounded bg-primary text-on-primary font-card-header text-card-header hover:bg-primary-container hover:shadow-lg transition-all duration-300 transform active:scale-[0.98] disabled:opacity-60"
          type="submit"
          disabled={carregando}
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <button
        className="mt-lg font-body-sm text-body-sm text-text-muted underline"
        onClick={() => setModalApiAberta(true)}
        type="button"
      >
        API: {getApiUrl()}
      </button>

      {modalApiAberta && <ApiUrlModal onClose={() => setModalApiAberta(false)} />}
    </div>
  );
}
