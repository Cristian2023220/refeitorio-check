const express = require('express');
const { autenticarDispositivo } = require('../middleware/deviceAuth');
const { verificarAcesso } = require('../services/acesso.service');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

// POST /acesso/verificar — chamado pelo totem a cada leitura de cartão.
// Corpo esperado: { uid: "0012057967" }
// Header exigido: X-Device-Key
router.post('/verificar', autenticarDispositivo, asyncHandler(async (req, res) => {
  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ erro: 'UID do cartão não informado' });
  }

  const resultado = await verificarAcesso(uid);

  // Sempre 200: "negado" é uma resposta de negócio válida, não um erro HTTP.
  // O totem decide o que mostrar na tela a partir do campo "resultado".
  res.json(resultado);
}));

module.exports = router;
