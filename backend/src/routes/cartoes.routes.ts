import { Router, type Request } from 'express';
import { query } from '../db';
import { autenticar, exigirTipo } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(autenticar, exigirTipo('admin'));

interface NovoCartaoBody {
  uid?: string;
  alunoId?: string;
}

// GET /cartoes — lista para a tela "Cartões RFID"
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const resultado = await query(
      `SELECT c.uid, c.status, c.vinculado_em, a.id AS aluno_id, a.nome AS aluno_nome
       FROM cartoes_rfid c
       JOIN alunos a ON a.id = c.aluno_id
       ORDER BY a.nome`
    );
    res.json(resultado.rows);
  })
);

// POST /cartoes — vincula um UID lido do leitor a um aluno já cadastrado
router.post(
  '/',
  asyncHandler<Request<any, any, NovoCartaoBody>>(async (req, res) => {
    const { uid, alunoId } = req.body;
    if (!uid || !alunoId) {
      return res.status(400).json({ erro: 'uid e alunoId são obrigatórios' });
    }

    try {
      await query(
        `INSERT INTO cartoes_rfid (uid, aluno_id, status, vinculado_em)
         VALUES ($1, $2, 'ativo', now())`,
        [uid, alunoId]
      );
      res.status(201).json({ vinculado: true });
    } catch (erro: any) {
      if (erro.code === '23505') {
        return res.status(409).json({ erro: 'Este UID ou este aluno já possui um cartão vinculado' });
      }
      throw erro;
    }
  })
);

// DELETE /cartoes/:uid — desvincula (ex: cartão perdido) sem apagar o registro histórico
router.delete(
  '/:uid',
  asyncHandler<Request<{ uid: string }>>(async (req, res) => {
    const resultado = await query(`UPDATE cartoes_rfid SET status = 'bloqueado' WHERE uid = $1 RETURNING uid`, [
      req.params.uid,
    ]);
    if (resultado.rowCount === 0) return res.status(404).json({ erro: 'Cartão não encontrado' });
    res.json({ bloqueado: true });
  })
);

export default router;
