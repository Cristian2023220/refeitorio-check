import type { Papel } from '../types';

const API_URL_KEY = 'refeitorio_api_url';
const TOKEN_KEY = 'refeitorio_admin_token';
const PAPEL_KEY = 'refeitorio_admin_papel';
const NOME_KEY = 'refeitorio_admin_nome';
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

export function getSessao(): { papel: Papel; nome: string } | null {
  const papel = localStorage.getItem(PAPEL_KEY) as Papel | null;
  const nome = localStorage.getItem(NOME_KEY);
  if (!papel || !nome) return null;
  return { papel, nome };
}

function salvarSessao(token: string, papel: Papel, nome: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(PAPEL_KEY, papel);
  localStorage.setItem(NOME_KEY, nome);
}

export function limparSessao(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PAPEL_KEY);
  localStorage.removeItem(NOME_KEY);
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

export async function loginAdmin(email: string, senha: string): Promise<{ nome: string; papel: Papel }> {
  const resposta = await fetch(getApiUrl() + '/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new ApiError(dados.erro || 'Não foi possível entrar', resposta.status);
  }
  salvarSessao(dados.token, dados.usuario.papel, dados.usuario.nome);
  return dados.usuario;
}
