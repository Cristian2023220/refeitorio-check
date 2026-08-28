import { useState, type FormEvent } from 'react';
import { getApiUrl, setApiUrl } from '../api/client';
import { Modal } from './Modal';

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
    <Modal titulo="Configurar API" onClose={onClose}>
      <form className="space-y-md" onSubmit={salvar}>
        <div className="space-y-base">
          <label className="block font-label-caps text-label-caps text-text-muted" htmlFor="api-url-input">
            URL da API
          </label>
          <input
            id="api-url-input"
            className="w-full px-3 py-2 bg-surface border border-border rounded text-body-sm font-body-sm"
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
            className="flex-1 py-2 rounded-lg border border-border text-text-heading font-body-sm hover:bg-surface-container-low transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-2 rounded-lg bg-primary text-on-primary font-body-sm font-bold hover:bg-surface-tint transition-colors"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
