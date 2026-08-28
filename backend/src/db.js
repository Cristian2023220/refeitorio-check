const { criarPool } = require('./utils/createPool');

const pool = criarPool(process.env.DATABASE_URL);

// Wrapper simples para padronizar chamadas e facilitar log/depuração
async function query(texto, parametros) {
  return pool.query(texto, parametros);
}

module.exports = { pool, query };
