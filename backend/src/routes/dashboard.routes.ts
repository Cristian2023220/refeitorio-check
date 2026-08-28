import { Router } from 'express';
import { query } from '../db';
import { autenticar, exigirTipo } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(autenticar, exigirTipo('admin'));

// GET /dashboard/resumo — os 4 cartões de número do topo do dashboard
router.get(
  '/resumo',
  asyncHandler(async (_req, res) => {
    const [confirmadosHoje, liberadosHoje, negadosHoje, saldoMedio] = await Promise.all([
      query<{ total: number }>(`SELECT COUNT(*)::int AS total FROM confirmacoes_presenca WHERE data = CURRENT_DATE`),
      query<{ total: number }>(
        `SELECT COUNT(*)::int AS total FROM registros_acesso WHERE resultado = 'liberado' AND lido_em::date = CURRENT_DATE`
      ),
      query<{ total: number }>(
        `SELECT COUNT(*)::int AS total FROM registros_acesso WHERE resultado = 'negado' AND lido_em::date = CURRENT_DATE`
      ),
      query<{ media: number | null }>(`
        SELECT AVG(a.limite_mensal - COALESCE(usados.total, 0))::int AS media
        FROM alunos a
        LEFT JOIN (
          SELECT aluno_id, COUNT(*)::int AS total FROM registros_acesso
          WHERE resultado = 'liberado' AND date_trunc('month', lido_em) = date_trunc('month', now())
          GROUP BY aluno_id
        ) usados ON usados.aluno_id = a.id
        WHERE a.ativo = TRUE
      `),
    ]);

    res.json({
      confirmadosHoje: confirmadosHoje.rows[0].total,
      liberadosHoje: liberadosHoje.rows[0].total,
      negadosHoje: negadosHoje.rows[0].total,
      saldoMedioRestante: saldoMedio.rows[0].media,
    });
  })
);

// GET /confirmacoes?data=YYYY-MM-DD — a lista que o totem "usa" (para conferência da equipe)
router.get(
  '/confirmacoes',
  asyncHandler(async (req, res) => {
    const data = (req.query.data as string) || new Date().toISOString().slice(0, 10);

    const resultado = await query(
      `SELECT a.nome, a.matricula, a.curso, cp.confirmado_em,
              r.resultado AS status_no_totem
       FROM confirmacoes_presenca cp
       JOIN alunos a ON a.id = cp.aluno_id
       LEFT JOIN registros_acesso r ON r.aluno_id = a.id AND r.lido_em::date = cp.data
       WHERE cp.data = $1
       ORDER BY a.nome`,
      [data]
    );

    res.json(resultado.rows);
  })
);

export default router;
