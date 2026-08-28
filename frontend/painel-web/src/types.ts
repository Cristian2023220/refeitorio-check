export type Papel = 'gestor' | 'operador';

export interface UsuarioAdmin {
  nome: string;
  papel: Papel;
}

export interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  curso: string | null;
  limite_mensal: number;
  foto_url: string | null;
  usos_no_mes: number;
}

export interface Cartao {
  uid: string;
  status: 'ativo' | 'bloqueado';
  vinculado_em: string | null;
  aluno_id: string;
  aluno_nome: string;
}

export interface ResumoDashboard {
  confirmadosHoje: number;
  liberadosHoje: number;
  negadosHoje: number;
  saldoMedioRestante: number | null;
}

export type StatusNoTotem = 'liberado' | 'negado' | null;

export interface ConfirmadoHoje {
  nome: string;
  matricula: string;
  curso: string | null;
  confirmado_em: string | null;
  status_no_totem: StatusNoTotem;
}

export interface RelatorioLinha {
  data: string;
  confirmados: number;
  liberados: number;
  negados: number;
  taxaComparecimento: string;
}

export interface Configuracoes {
  hora_inicio_almoco?: string;
  hora_fim_almoco?: string;
  prazo_confirmacao?: string;
  limite_mensal_padrao?: string;
  cardapio_dia?: string;
}
