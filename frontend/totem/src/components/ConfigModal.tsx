import { useState, type FormEvent } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getConfig, setConfig } from '../api/client';
import { useTheme } from '../context/ThemeContext';

interface ConfigModalProps {
  onClose: () => void;
  onSalvar: () => void;
}

export function ConfigModal({ onClose, onSalvar }: ConfigModalProps) {
  const { tema, alternarTema } = useTheme();
  const [apiUrl, setApiUrl] = useState(() => getConfig().apiUrl);
  const [deviceKey, setDeviceKey] = useState(() => getConfig().deviceKey);

  function salvar(evento: FormEvent) {
    evento.preventDefault();
    setConfig({ apiUrl, deviceKey });
    onSalvar();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-40 flex items-center justify-center p-lg" onClick={onClose}>
      <div className="w-full max-w-sm bg-surface rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] border border-border p-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-md">
          <h3 className="font-headline-md text-headline-md text-primary">Configuração do totem</h3>
          <button
            type="button"
            onClick={alternarTema}
            aria-label={tema === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container-low text-text-muted hover:bg-surface-container-high transition-colors"
          >
            {tema === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <form onSubmit={salvar}>
          <label className="font-label-caps text-label-caps text-text-muted uppercase block mb-xs">URL da API</label>
          <input
            className="w-full px-3 py-2 mb-md bg-surface border border-border rounded text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="http://localhost:3000"
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
          <label className="font-label-caps text-label-caps text-text-muted uppercase block mb-xs">Chave do dispositivo (X-Device-Key)</label>
          <input
            className="w-full px-3 py-2 mb-lg bg-surface border border-border rounded text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="a mesma do .env do backend"
            type="text"
            value={deviceKey}
            onChange={(e) => setDeviceKey(e.target.value)}
          />
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
      </div>
    </div>
  );
}
