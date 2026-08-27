const express = require('express');
const bcrypt = require('bcryptjs');
const { query } = require('../db');
const { autenticar, exigirTipo } = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();
router.use(autenticar, exigirTipo('admin'));

// GET /alunos?busca= — lista para a tela "Alunos", com busca por nome/matrícula
router.get('/', asyncHandler(async (req, res) => {
  const { busca } = req.query;
  const resultado = await query(
    `SELECT a.id, a.nome, a.matricula, a.curso, a.limite_mensal, a.foto_url,
            (SELECT COUNT(*) FROM registros_acesso r
             WHERE r.aluno_id = a.id AND r.resultado = 'liberado'
               AND date_trunc('month', r.lido_em) = date_trunc('month', now())) AS usos_no_mes
     FROM alunos a
     WHERE a.ativo = TRUE
       AND ($1::text IS NULL OR a.nome ILIKE '%' || $1 || '%' OR a.matricula ILIKE '%' || $1 || '%')
     ORDER BY a.nome`,
    [busca || null]
  );
  res.json(resultado.rows);
}));

// POST /alunos — cadastro de um novo aluno
router.post('/', asyncHandler(async (req, res) => {
  const { matricula, nome, curso, telefone, fotoUrl, limiteMensal, senha } = req.body;
  if (!matricula || !nome || !senha) {
    return res.status(400).json({ erro: 'matrícula, nome e senha são obrigatórios' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const resultado = await query(
    `INSERT INTO alunos (matricula, nome, curso, telefone, foto_url, limite_mensal, senha_hash)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, 30), $7)
     RETURNING id, matricula, nome`,
    [matricula, nome, curso, telefone, fotoUrl, limiteMensal, senhaHash]
  );
  res.status(201).json(resultado.rows[0]);
}));

// PUT /alunos/:id — edição de dados cadastrais
router.put('/:id', asyncHandler(async (req, res) => {
  const { nome, curso, telefone, fotoUrl, limiteMensal } = req.body;
  const resultado = await query(
    `UPDATE alunos SET nome = COALESCE($1, nome), curso = COALESCE($2, curso),
            telefone = COALESCE($3, telefone), foto_url = COALESCE($4, foto_url),
            limite_mensal = COALESCE($5, limite_mensal)
     WHERE id = $6 RETURNING id`,
    [nome, curso, telefone, fotoUrl, limiteMensal, req.params.id]
  );

  if (resultado.rowCount === 0) return res.status(404).json({ erro: 'Aluno não encontrado' });
  res.json({ atualizado: true });
}));

// DELETE /alunos/:id — desativação lógica (mantém o histórico intacto)
router.delete('/:id', asyncHandler(async (req, res) => {
  const resultado = await query('UPDATE alunos SET ativo = FALSE WHERE id = $1 RETURNING id', [req.params.id]);
  if (resultado.rowCount === 0) return res.status(404).json({ erro: 'Aluno não encontrado' });
  res.json({ desativado: true });
}));

module.exports = router;
