const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

// O driver serverless do Neon fala com o banco por WebSocket (porta 443),
// em vez de uma conexão TCP direta na porta 5432 do Postgres.
// Isso evita bloqueios de rede/firewall que barram a porta 5432 mas liberam HTTPS/WSS.
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Wrapper simples para padronizar chamadas e facilitar log/depuração
async function query(texto, parametros) {
  return pool.query(texto, parametros);
}

module.exports = { pool, query };
