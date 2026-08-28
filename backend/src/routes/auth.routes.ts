import { Router, type Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import { asyncHandler } from '../utils/asyncHandler';
import type { UsuarioAutenticado } from '../types/express';

const router = Router();

function gerarToken(payload: UsuarioAutenticado): string {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as jwt.SignOptions['expiresIn'],
  });
}

interface LoginAlunoBody {
  matricula?: string;
  senha?: string;
}

interface AlunoRow {
  id: string;
  nome: string;
  matricula: string;
  senha_hash: string;
}

interface LoginAdminBody {
  email?: string;
  senha?: string;
}

interface UsuarioAdminRow {
  id: string;
  nome: string;
  email: string;
  senha_hash: string;
  papel: 'gestor' | 'operador';
}

// POST /auth/login — login do aluno (app)
router.post(
  '/login',
  asyncHandler<Request<any, any, LoginAlunoBody>>(async (req, res) => {
    const { matricula, senha } = req.body;
    if (!matricula || !senha) {
      return res.status(400).json({ erro: 'Informe matrícula e senha' });
    }

    const resultado = await query<AlunoRow>('SELECT * FROM alunos WHERE matricula = $1 AND ativo = TRUE', [matricula]);
    const aluno = resultado.rows[0];

    if (!aluno || !(await bcrypt.compare(senha, aluno.senha_hash))) {
      return res.status(401).json({ erro: 'Matrícula ou senha inválida' });
    }

    const token = gerarToken({ id: aluno.id, tipo: 'aluno' });
    res.json({ token, aluno: { id: aluno.id, nome: aluno.nome, matricula: aluno.matricula } });
  })
);

// POST /auth/admin/login — login da equipe do refeitório (painel web)
router.post(
  '/admin/login',
  asyncHandler<Request<any, any, LoginAdminBody>>(async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha' });
    }

    const resultado = await query<UsuarioAdminRow>('SELECT * FROM usuarios_admin WHERE email = $1', [email]);
    const usuario = resultado.rows[0];

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash))) {
      return res.status(401).json({ erro: 'E-mail ou senha inválida' });
    }

    const token = gerarToken({ id: usuario.id, tipo: 'admin', papel: usuario.papel });
    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, papel: usuario.papel } });
  })
);

export default router;
