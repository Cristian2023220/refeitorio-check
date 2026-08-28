// Escolhe o driver de Postgres pela DATABASE_URL:
// - host *.neon.tech → driver serverless do Neon (WebSocket na porta 443, contorna
//   bloqueios de porta 5432 em rede de campus/corporativa — ver backend/README.md).
// - qualquer outro host (Postgres local, Docker, outro provedor) → `pg` tradicional (TCP).
// Isso permite rodar contra um Postgres local em dev sem precisar de credenciais do Neon,
// sem mudar de driver na hora de apontar para produção.
function criarPool(connectionString) {
  const usaNeon = /\.neon\.tech([:/]|$)/.test(connectionString || '');

  if (usaNeon) {
    const { Pool, neonConfig } = require('@neondatabase/serverless');
    neonConfig.webSocketConstructor = require('ws');
    return new Pool({ connectionString });
  }

  const { Pool } = require('pg');
  return new Pool({ connectionString });
}

module.exports = { criarPool };
