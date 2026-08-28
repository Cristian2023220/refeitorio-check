import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface ToastProps {
  mensagem: string;
  onFechar: () => void;
}

export function Toast({ mensagem, onFechar }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onFechar, 4000);
    return () => clearTimeout(timer);
  }, [onFechar]);

  return (
    <div className="fixed bottom-[calc(80px+env(safe-area-inset-bottom)+16px)] left-0 right-0 flex justify-center px-md z-[70]">
      <div className="max-w-sm w-full bg-error-container text-error rounded-lg shadow-lg px-md py-sm flex items-start gap-sm">
        <AlertCircle size={20} className="shrink-0 mt-0.5" />
        <p className="font-body-sm text-body-sm flex-1">{mensagem}</p>
      </div>
    </div>
  );
}
