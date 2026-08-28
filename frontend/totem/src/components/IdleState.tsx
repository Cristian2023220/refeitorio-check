import { useState, type FormEvent } from 'react';
import { Nfc } from 'lucide-react';

interface IdleStateProps {
  mensagemErro: string | null;
  onLerUid: (uid: string) => void;
}

export function IdleState({ mensagemErro, onLerUid }: IdleStateProps) {
  const [uidManual, setUidManual] = useState('');

  function aoEnviar(evento: FormEvent) {
    evento.preventDefault();
    const uid = uidManual.trim();
    if (!uid) return;
    setUidManual('');
    onLerUid(uid);
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-xl z-10 w-full max-w-2xl mx-auto">
      <div className="mb-12 relative">
        <div className="w-48 h-48 bg-surface-container-high rounded-full flex items-center justify-center relative z-10 shadow-[0_10px_25px_rgba(0,0,0,0.05)] border-2 border-border">
          <Nfc size={80} className="text-primary" />
          <div className="absolute inset-0 rounded-full bg-primary/20 pulse-ring -z-10" />
        </div>
      </div>
      <h1 className="font-headline-lg text-headline-lg text-text-heading mb-md">Aproxime seu cartão</h1>
      <p className="font-body-md text-body-md text-text-muted max-w-md">
        Mantenha seu cartão ou crachá institucional próximo ao leitor abaixo da tela para registrar seu acesso ao refeitório.
      </p>
      {mensagemErro && <p className="text-error mt-4 font-bold">{mensagemErro}</p>}
      <form className="mt-xl flex gap-sm items-center w-full max-w-sm mx-auto opacity-60 hover:opacity-100 transition-opacity" onSubmit={aoEnviar}>
        <input
          className="flex-1 px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Digitar UID manualmente (teste)"
          type="text"
          value={uidManual}
          onChange={(e) => setUidManual(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded bg-surface-container-high text-text-heading font-body-sm font-bold hover:bg-primary hover:text-on-primary transition-colors"
          type="submit"
        >
          Ler
        </button>
      </form>
    </div>
  );
}
