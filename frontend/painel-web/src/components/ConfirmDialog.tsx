import { Modal } from './Modal';

interface ConfirmDialogProps {
  titulo: string;
  mensagem: string;
  rotuloConfirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmDialog({ titulo, mensagem, rotuloConfirmar = 'Confirmar', onConfirmar, onCancelar }: ConfirmDialogProps) {
  return (
    <Modal titulo={titulo} onClose={onCancelar}>
      <p className="font-body-sm text-body-sm text-text-muted">{mensagem}</p>
      <div className="flex gap-sm mt-lg">
        <button
          className="flex-1 py-2 rounded-lg border border-border text-text-heading font-body-sm hover:bg-surface-container-low transition-colors"
          onClick={onCancelar}
          type="button"
        >
          Cancelar
        </button>
        <button
          className="flex-1 py-2 rounded-lg bg-error text-on-primary font-body-sm font-bold hover:opacity-90 transition-opacity"
          onClick={onConfirmar}
          type="button"
        >
          {rotuloConfirmar}
        </button>
      </div>
    </Modal>
  );
}
