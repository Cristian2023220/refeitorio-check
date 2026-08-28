import { Router } from 'express';
import { query } from '../db';
import { autenticar, exigirTipo, exigirPapel } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(autenticar, exigirTipo('admin'));

// GET /configuracoes — qualquer operador pode ler
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const resultado = await query<{ chave: string; valor: string }>('SELECT chave, valor FROM configuracoes');
    const config = Object.fromEntries(resultado.rows.map((r) => [r.chave, r.valor]));
    res.json(config);
  })
);

// PUT /configuracoes — só gestor pode alterar horário do almoço, prazo e limite padrão
router.put(
  '/',
  exigirPapel('gestor'),
  asyncHandler(async (req, res) => {
    const entradas = Object.entries(req.body as Record<string, unknown>);

    for (const [chave, valor] of entradas) {
      await query(
        `INSERT INTO configuracoes (chave, valor) VALUES ($1, $2)
         ON CONFLICT (chave) DO UPDATE SET valor = EXCLUDED.valor`,
        [chave, String(valor)]
      );
    }

    res.json({ atualizado: true });
  })
);

export default router;
