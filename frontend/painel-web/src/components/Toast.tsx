import { useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ToastProps {
  mensagem: string;
  tipo?: 'erro' | 'sucesso';
  onFechar: () => void;
}

export function Toast({ mensagem, tipo = 'erro', onFechar }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onFechar, 4000);
    return () => clearTimeout(timer);
  }, [onFechar]);

  const cores = tipo === 'erro' ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container';

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center px-md z-[70]">
      <div className={`max-w-sm w-full ${cores} rounded-lg shadow-lg px-md py-sm flex items-start gap-sm`}>
        {tipo === 'erro' ? <AlertCircle size={20} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={20} className="shrink-0 mt-0.5" />}
        <p className="font-body-sm text-body-sm flex-1">{mensagem}</p>
      </div>
    </div>
  );
}
