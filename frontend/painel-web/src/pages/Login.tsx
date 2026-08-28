import { useState, type FormEvent } from 'react';
import { Lock, ShieldCheck, User as UserIcon, UtensilsCrossed } from 'lucide-react';
import { getApiUrl, loginAdmin } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ApiUrlModal } from '../components/ApiUrlModal';

export function Login() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [modalApiAberta, setModalApiAberta] = useState(false);

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);

    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }

    setCarregando(true);
    try {
      const usuario = await loginAdmin(email.trim(), senha);
      entrar(usuario);
    } catch (erroLogin) {
      setErro(erroLogin instanceof Error ? erroLogin.message : 'Não foi possível conectar à API.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-md md:p-lg bg-background">
      <main className="w-full max-w-[1000px] flex flex-col md:flex-row bg-surface rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] border-2 border-border overflow-hidden min-h-[600px]">
        <div className="hidden md:block md:w-1/2 relative bg-surface-container-low border-r border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container via-primary to-surface-tint opacity-90" />
          <div className="absolute inset-0 flex items-center justify-center">
            <UtensilsCrossed size={220} className="text-white/25" />
          </div>
          <div className="absolute bottom-lg left-lg right-lg text-white">
            <p className="font-body-md text-white/90 drop-shadow-md">Bem-vindo ao sistema de gestão do Refeitório IF Baiano.</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center px-lg py-xl md:px-12">
          <div className="mb-xl text-center md:text-left flex flex-col items-center md:items-start">
            <div className="w-16 h-16 bg-primary-container rounded-lg flex items-center justify-center mb-md shadow-sm">
              <UtensilsCrossed size={32} className="text-on-primary-container" />
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">
              Gestão Admin
            </h1>
            <p className="font-body-md text-body-md text-text-muted">Painel da equipe · Refeitório IF Baiano</p>
          </div>

          <form className="space-y-md" onSubmit={aoEnviar}>
            <div className="space-y-base">
              <label className="block font-label-caps text-label-caps text-text-muted" htmlFor="login_email">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <UserIcon size={20} />
                </div>
                <input
                  id="login_email"
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded text-text-heading font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="marta@ifbaiano.edu.br"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

          <div className="mt-xl text-center md:text-left">
            <p className="font-body-sm text-body-sm text-text-muted flex items-center justify-center md:justify-start gap-1 mb-sm">
              <ShieldCheck size={16} /> Ambiente Seguro e Institucional
            </p>
            <button
              className="font-body-sm text-body-sm text-text-muted underline"
              onClick={() => setModalApiAberta(true)}
              type="button"
            >
              API: {getApiUrl()}
            </button>
          </div>
        </div>
      </main>

      {modalApiAberta && <ApiUrlModal onClose={() => setModalApiAberta(false)} />}
    </div>
  );
}
