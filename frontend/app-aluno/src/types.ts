export interface Aluno {
  nome: string;
  matricula: string;
  curso: string | null;
  telefone: string | null;
  fotoUrl: string | null;
  limiteMensal: number;
  cartaoVinculado: boolean;
}

export interface Saldo {
  usosNoMes: number;
  saldoRestante: number;
  limiteMensal: number;
}

export interface ConfirmacaoHoje {
  confirmado: boolean;
  confirmadoEm: string | null;
}

export type MotivoNegacao = 'sem_confirmacao' | 'sem_saldo' | 'fora_horario' | 'cartao_desconhecido';

export interface HistoricoItem {
  lido_em: string;
  resultado: 'liberado' | 'negado';
  motivo_negacao: MotivoNegacao | null;
}

export interface CardapioHoje {
  cardapio: string | null;
}
