import { useState, type FormEvent } from 'react';
import { getApiUrl, setApiUrl } from '../api/client';

interface ApiUrlModalProps {
  onClose: () => void;
}

export function ApiUrlModal({ onClose }: ApiUrlModalProps) {
  const [url, setUrl] = useState(getApiUrl());

  function salvar(evento: FormEvent) {
    evento.preventDefault();
    if (url.trim()) setApiUrl(url);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-on-background/40 flex items-end sm:items-center justify-center z-[60] p-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-surface rounded-xl shadow-lg p-lg space-y-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-headline-md text-headline-md text-text-heading">Configurar API</h2>
        <form className="space-y-md" onSubmit={salvar}>
          <div className="space-y-base">
            <label className="block font-label-caps text-label-caps text-text-muted" htmlFor="api-url-input">
              URL da API
            </label>
            <input
              id="api-url-input"
              className="w-full px-4 py-2 bg-surface border border-border rounded text-text-heading font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://localhost:3000"
              autoFocus
            />
          </div>
          <div className="flex gap-sm">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded border border-border text-text-muted font-body-sm font-bold hover:bg-surface-container-low transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded bg-primary text-on-primary font-body-sm font-bold hover:bg-primary-container transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
