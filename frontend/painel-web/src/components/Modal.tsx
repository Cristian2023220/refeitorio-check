import type { ReactNode } from 'react';

interface ModalProps {
  titulo: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ titulo, onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-lg"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] border border-border p-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-headline-md text-headline-md text-primary mb-md">{titulo}</h3>
        {children}
      </div>
    </div>
  );
}
