const express = require('express');
const { query } = require('../db');
const { autenticar, exigirTipo } = require('../middleware/auth');
const { calcularSaldoMensal } = require('../services/acesso.service');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

// Todas as rotas abaixo exigem um JWT de aluno
router.use(autenticar, exigirTipo('aluno'));

async function buscarAluno(alunoId) {
  const resultado = await query('SELECT * FROM alunos WHERE id = $1', [alunoId]);
  return resultado.rows[0];
}

// GET /confirmacoes/hoje — o app usa isso para pintar o "anel" de confirmado ou não
router.get('/confirmacoes/hoje', asyncHandler(async (req, res) => {
  const resultado = await query(
    `SELECT confirmado_em FROM confirmacoes_presenca
     WHERE aluno_id = $1 AND data = CURRENT_DATE AND refeicao = 'almoco'`,
    [req.usuario.id]
  );

  res.json({ confirmado: resultado.rowCount > 0, confirmadoEm: resultado.rows[0]?.confirmado_em || null });
}));

// POST /confirmacoes — confirma presença no almoço de hoje, respeitando o prazo configurado
router.post('/confirmacoes', asyncHandler(async (req, res) => {
  const prazo = await query("SELECT valor FROM configuracoes WHERE chave = 'prazo_confirmacao'");
  const [horaPrazo, minutoPrazo] = prazo.rows[0].valor.split(':').map(Number);

  const agora = new Date();
  const dentroDoPrazo =
    agora.getHours() < horaPrazo || (agora.getHours() === horaPrazo && agora.getMinutes() <= minutoPrazo);

  if (!dentroDoPrazo) {
    return res.status(400).json({ erro: `Prazo para confirmar (${prazo.rows[0].valor}) já passou` });
  }

  try {
    await query(
      `INSERT INTO confirmacoes_presenca (aluno_id, data, refeicao) VALUES ($1, CURRENT_DATE, 'almoco')`,
      [req.usuario.id]
    );
    res.status(201).json({ confirmado: true });
  } catch (erro) {
    if (erro.code === '23505') {
      // unique_violation: já tinha confirmado hoje, não é um erro real
      return res.json({ confirmado: true, jaConfirmado: true });
    }
    throw erro;
  }
}));

// GET /me — perfil exibido na aba "Perfil" do app
router.get('/me', asyncHandler(async (req, res) => {
  const aluno = await buscarAluno(req.usuario.id);
  const cartao = await query('SELECT status FROM cartoes_rfid WHERE aluno_id = $1', [aluno.id]);

  res.json({
    nome: aluno.nome,
    matricula: aluno.matricula,
    curso: aluno.curso,
    telefone: aluno.telefone,
    fotoUrl: aluno.foto_url,
    limiteMensal: aluno.limite_mensal,
    cartaoVinculado: cartao.rowCount > 0,
  });
}));

// GET /me/saldo — usado no cabeçalho da tela de confirmação
router.get('/me/saldo', asyncHandler(async (req, res) => {
  const aluno = await buscarAluno(req.usuario.id);
  const { usados, saldo } = await calcularSaldoMensal(aluno);
  res.json({ usosNoMes: usados, saldoRestante: saldo, limiteMensal: aluno.limite_mensal });
}));

// GET /me/historico — lista exibida na aba "Histórico"
router.get('/me/historico', asyncHandler(async (req, res) => {
  const resultado = await query(
    `SELECT lido_em, resultado, motivo_negacao
     FROM registros_acesso
     WHERE aluno_id = $1
     ORDER BY lido_em DESC
     LIMIT 30`,
    [req.usuario.id]
  );
  res.json(resultado.rows);
}));

// GET /cardapio-hoje — o app usa isso para preencher o card "Cardápio do Dia"
router.get('/cardapio-hoje', asyncHandler(async (req, res) => {
  const resultado = await query("SELECT valor FROM configuracoes WHERE chave = 'cardapio_dia'");
  res.json({ cardapio: resultado.rows[0]?.valor || null });
}));

module.exports = router;
