import { query } from '../db';

export interface Aluno {
  id: string;
  matricula: string;
  nome: string;
  curso: string | null;
  telefone: string | null;
  foto_url: string | null;
  senha_hash: string;
  limite_mensal: number;
  ativo: boolean;
  criado_em: Date;
}

export type Motivo = 'cartao_desconhecido' | 'fora_horario' | 'sem_confirmacao' | 'sem_saldo';

export interface AlunoFormatado {
  nome: string;
  matricula: string;
  curso: string | null;
  fotoUrl: string | null;
  usosNoMes: number | null;
  saldoRestante: number | null;
}

export type ResultadoAcesso =
  | { resultado: 'liberado'; aluno: AlunoFormatado }
  | { resultado: 'negado'; motivo: Motivo; aluno?: AlunoFormatado };

// Converte "HH:MM" em minutos desde a meia-noite, para comparar com o horário atual
function paraMinutos(horaTexto: string): number {
  const [h, m] = horaTexto.split(':').map(Number);
  return h * 60 + m;
}

async function buscarConfiguracao(chave: string): Promise<string | undefined> {
  const resultado = await query<{ valor: string }>('SELECT valor FROM configuracoes WHERE chave = $1', [chave]);
  return resultado.rows[0]?.valor;
}

export async function dentroDoHorarioDoAlmoco(): Promise<boolean> {
  const inicio = await buscarConfiguracao('hora_inicio_almoco');
  const fim = await buscarConfiguracao('hora_fim_almoco');

  const agora = new Date();
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

  return minutosAgora >= paraMinutos(inicio!) && minutosAgora <= paraMinutos(fim!);
}

// Saldo do mês = limite mensal do aluno - quantos acessos "liberado" ele já usou neste mês
export async function calcularSaldoMensal(aluno: Aluno): Promise<{ usados: number; saldo: number }> {
  const resultado = await query<{ usados: number }>(
    `SELECT COUNT(*)::int AS usados
     FROM registros_acesso
     WHERE aluno_id = $1
       AND resultado = 'liberado'
       AND date_trunc('month', lido_em) = date_trunc('month', now())`,
    [aluno.id]
  );

  const usados = resultado.rows[0].usados;
  return { usados, saldo: aluno.limite_mensal - usados };
}

export async function existeConfirmacaoHoje(alunoId: string): Promise<boolean> {
  const resultado = await query(
    `SELECT 1 FROM confirmacoes_presenca
     WHERE aluno_id = $1 AND data = CURRENT_DATE AND refeicao = 'almoco'`,
    [alunoId]
  );
  return resultado.rowCount! > 0;
}

async function registrarEvento({
  alunoId,
  uidLido,
  resultado,
  motivoNegacao,
}: {
  alunoId: string | null;
  uidLido: string;
  resultado: 'liberado' | 'negado';
  motivoNegacao?: Motivo | null;
}): Promise<void> {
  await query(
    `INSERT INTO registros_acesso (aluno_id, uid_lido, resultado, motivo_negacao)
     VALUES ($1, $2, $3, $4)`,
    [alunoId, uidLido, resultado, motivoNegacao || null]
  );
}

// Ponto único de decisão usado por POST /acesso/verificar.
// A ordem das checagens importa (ver backend_refeitorio_check.md, seção 5):
// cartão desconhecido -> horário -> confirmação -> saldo.
export async function verificarAcesso(uidLido: string): Promise<ResultadoAcesso> {
  const cartao = await query<Aluno>(
    `SELECT c.uid, a.* FROM cartoes_rfid c
     JOIN alunos a ON a.id = c.aluno_id
     WHERE c.uid = $1 AND c.status = 'ativo'`,
    [uidLido]
  );

  if (cartao.rowCount === 0) {
    await registrarEvento({ alunoId: null, uidLido, resultado: 'negado', motivoNegacao: 'cartao_desconhecido' });
    return { resultado: 'negado', motivo: 'cartao_desconhecido' };
  }

  const aluno = cartao.rows[0];

  if (!(await dentroDoHorarioDoAlmoco())) {
    await registrarEvento({ alunoId: aluno.id, uidLido, resultado: 'negado', motivoNegacao: 'fora_horario' });
    return { resultado: 'negado', motivo: 'fora_horario', aluno: formatarAluno(aluno) };
  }

  if (!(await existeConfirmacaoHoje(aluno.id))) {
    await registrarEvento({ alunoId: aluno.id, uidLido, resultado: 'negado', motivoNegacao: 'sem_confirmacao' });
    return { resultado: 'negado', motivo: 'sem_confirmacao', aluno: formatarAluno(aluno) };
  }

  const { usados, saldo } = await calcularSaldoMensal(aluno);
  if (saldo <= 0) {
    await registrarEvento({ alunoId: aluno.id, uidLido, resultado: 'negado', motivoNegacao: 'sem_saldo' });
    return { resultado: 'negado', motivo: 'sem_saldo', aluno: formatarAluno(aluno, usados, saldo) };
  }

  await registrarEvento({ alunoId: aluno.id, uidLido, resultado: 'liberado' });
  return { resultado: 'liberado', aluno: formatarAluno(aluno, usados + 1, saldo - 1) };
}

function formatarAluno(aluno: Aluno, usados: number | null = null, saldo: number | null = null): AlunoFormatado {
  return {
    nome: aluno.nome,
    matricula: aluno.matricula,
    curso: aluno.curso,
    fotoUrl: aluno.foto_url,
    usosNoMes: usados,
    saldoRestante: saldo,
  };
}
