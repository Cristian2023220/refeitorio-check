export type Motivo = 'cartao_desconhecido' | 'fora_horario' | 'sem_confirmacao' | 'sem_saldo';

export interface AlunoAcesso {
  nome: string;
  matricula: string;
  curso: string | null;
  fotoUrl: string | null;
  usosNoMes: number | null;
  saldoRestante: number | null;
}

export interface RespostaAcesso {
  resultado: 'liberado' | 'negado';
  motivo?: Motivo;
  aluno?: AlunoAcesso;
}
