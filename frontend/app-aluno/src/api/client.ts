const API_URL_KEY = 'refeitorio_api_url';
const TOKEN_KEY = 'refeitorio_aluno_token';
const DEFAULT_API_URL = 'http://localhost:3000';

export function getApiUrl(): string {
  return localStorage.getItem(API_URL_KEY) || DEFAULT_API_URL;
}

export function setApiUrl(url: string): void {
  localStorage.setItem(API_URL_KEY, url.trim());
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function limparToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function chamarApi<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const resposta = await fetch(getApiUrl() + caminho, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + getToken(),
      ...(opcoes.headers || {}),
    },
  });

  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new ApiError(dados.erro || 'Erro na requisição', resposta.status);
  }
  return dados as T;
}

export async function login(matricula: string, senha: string): Promise<{ token: string }> {
  const resposta = await fetch(getApiUrl() + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matricula, senha }),
  });
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new ApiError(dados.erro || 'Não foi possível entrar', resposta.status);
  }
  return dados;
}
