import { Router } from 'express';
import { query } from '../db';
import { autenticar, exigirTipo } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(autenticar, exigirTipo('admin'));

interface RelatorioLinha {
  data: string;
  confirmados: number;
  liberados: number;
  negados: number;
}

// GET /relatorios?inicio=YYYY-MM-DD&fim=YYYY-MM-DD
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { inicio, fim } = req.query as { inicio?: string; fim?: string };
    if (!inicio || !fim) {
      return res.status(400).json({ erro: 'Informe inicio e fim (YYYY-MM-DD)' });
    }

    const resultado = await query<RelatorioLinha>(
      `SELECT
         dias.data,
         COALESCE(c.total, 0) AS confirmados,
         COALESCE(l.total, 0) AS liberados,
         COALESCE(n.total, 0) AS negados
       FROM generate_series($1::date, $2::date, '1 day') AS dias(data)
       LEFT JOIN (SELECT data, COUNT(*)::int AS total FROM confirmacoes_presenca GROUP BY data) c ON c.data = dias.data
       LEFT JOIN (SELECT lido_em::date AS data, COUNT(*)::int AS total FROM registros_acesso WHERE resultado = 'liberado' GROUP BY lido_em::date) l ON l.data = dias.data
       LEFT JOIN (SELECT lido_em::date AS data, COUNT(*)::int AS total FROM registros_acesso WHERE resultado = 'negado' GROUP BY lido_em::date) n ON n.data = dias.data
       ORDER BY dias.data`,
      [inicio, fim]
    );

    const linhas = resultado.rows.map((linha) => ({
      ...linha,
      taxaComparecimento:
        linha.confirmados > 0 ? `${Math.round((linha.liberados / linha.confirmados) * 100)}%` : '—',
    }));

    res.json(linhas);
  })
);

export default router;
