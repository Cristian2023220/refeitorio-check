import { Router, type Request } from 'express';
import { autenticarDispositivo } from '../middleware/deviceAuth';
import { verificarAcesso } from '../services/acesso.service';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

interface VerificarAcessoBody {
  uid?: string;
}

// POST /acesso/verificar — chamado pelo totem a cada leitura de cartão.
// Corpo esperado: { uid: "0012057967" }
// Header exigido: X-Device-Key
router.post(
  '/verificar',
  autenticarDispositivo,
  asyncHandler<Request<any, any, VerificarAcessoBody>>(async (req, res) => {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ erro: 'UID do cartão não informado' });
    }

    const resultado = await verificarAcesso(uid);

    // Sempre 200: "negado" é uma resposta de negócio válida, não um erro HTTP.
    // O totem decide o que mostrar na tela a partir do campo "resultado".
    res.json(resultado);
  })
);

export default router;
