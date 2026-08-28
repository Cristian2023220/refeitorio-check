// Extensão de Express.Request populada por src/middleware/auth.ts a partir do payload do JWT.
export interface UsuarioAutenticado {
  id: string;
  tipo: 'aluno' | 'admin';
  papel?: 'gestor' | 'operador';
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}

export {};
