const jwt = require('jsonwebtoken');

// Valida o token JWT enviado no header Authorization: Bearer <token>
// e popula req.usuario com { id, tipo, papel } vindo do payload.
function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization;
  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não informado' });
  }

  const token = cabecalho.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

// Restringe a rota a um tipo de usuário: 'aluno' ou 'admin'
function exigirTipo(tipo) {
  return (req, res, next) => {
    if (!req.usuario || req.usuario.tipo !== tipo) {
      return res.status(403).json({ erro: 'Acesso não permitido para este tipo de usuário' });
    }
    next();
  };
}

// Restringe a rota a um papel específico da equipe administrativa (ex: 'gestor')
function exigirPapel(papel) {
  return (req, res, next) => {
    if (!req.usuario || req.usuario.papel !== papel) {
      return res.status(403).json({ erro: `Requer papel de ${papel}` });
    }
    next();
  };
}

module.exports = { autenticar, exigirTipo, exigirPapel };
