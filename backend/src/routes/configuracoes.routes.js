const express = require('express');
const { query } = require('../db');
const { autenticar, exigirTipo, exigirPapel } = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();
router.use(autenticar, exigirTipo('admin'));

// GET /configuracoes — qualquer operador pode ler
router.get('/', asyncHandler(async (req, res) => {
  const resultado = await query('SELECT chave, valor FROM configuracoes');
  const config = Object.fromEntries(resultado.rows.map((r) => [r.chave, r.valor]));
  res.json(config);
}));

// PUT /configuracoes — só gestor pode alterar horário do almoço, prazo e limite padrão
router.put('/', exigirPapel('gestor'), asyncHandler(async (req, res) => {
  const entradas = Object.entries(req.body);

  for (const [chave, valor] of entradas) {
    await query(
      `INSERT INTO configuracoes (chave, valor) VALUES ($1, $2)
       ON CONFLICT (chave) DO UPDATE SET valor = EXCLUDED.valor`,
      [chave, String(valor)]
    );
  }

  res.json({ atualizado: true });
}));

module.exports = router;
