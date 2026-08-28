import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import type { UsuarioAutenticado } from '../types/express';

// Valida o token JWT enviado no header Authorization: Bearer <token>
// e popula req.usuario com { id, tipo, papel } vindo do payload.
export function autenticar(req: Request, res: Response, next: NextFunction) {
  const cabecalho = req.headers.authorization;
  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não informado' });
  }

  const token = cabecalho.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as UsuarioAutenticado;
    req.usuario = payload;
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

// Restringe a rota a um tipo de usuário: 'aluno' ou 'admin'
export function exigirTipo(tipo: UsuarioAutenticado['tipo']) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario || req.usuario.tipo !== tipo) {
      return res.status(403).json({ erro: 'Acesso não permitido para este tipo de usuário' });
    }
    next();
  };
}

// Restringe a rota a um papel específico da equipe administrativa (ex: 'gestor')
export function exigirPapel(papel: NonNullable<UsuarioAutenticado['papel']>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario || req.usuario.papel !== papel) {
      return res.status(403).json({ erro: `Requer papel de ${papel}` });
    }
    next();
  };
}
