import type { RespostaAcesso } from '../types';

const API_URL_KEY = 'refeitorio_totem_api_url';
const DEVICE_KEY_KEY = 'refeitorio_totem_device_key';
const DEFAULT_API_URL = 'http://localhost:3000';

export interface ConfigTotem {
  apiUrl: string;
  deviceKey: string;
}

export function getConfig(): ConfigTotem {
  return {
    apiUrl: localStorage.getItem(API_URL_KEY) || DEFAULT_API_URL,
    deviceKey: localStorage.getItem(DEVICE_KEY_KEY) || '',
  };
}

export function setConfig(config: ConfigTotem): void {
  localStorage.setItem(API_URL_KEY, config.apiUrl.trim());
  localStorage.setItem(DEVICE_KEY_KEY, config.deviceKey.trim());
}

export class DispositivoNaoAutorizadoError extends Error {}

export async function verificarAcesso(uid: string): Promise<RespostaAcesso> {
  const { apiUrl, deviceKey } = getConfig();

  let resposta: Response;
  try {
    resposta = await fetch(`${apiUrl}/acesso/verificar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-Key': deviceKey,
      },
      body: JSON.stringify({ uid }),
    });
  } catch {
    throw new Error('Não foi possível falar com a API — confira a URL em ⚙');
  }

  if (resposta.status === 401) {
    throw new DispositivoNaoAutorizadoError('Dispositivo não autorizado — confira a chave em ⚙');
  }

  return resposta.json();
}
