require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { criarPool } = require('../src/utils/createPool');

async function main() {
  const pool = criarPool(process.env.DATABASE_URL);
  const sql = fs.readFileSync(path.join(__dirname, '001_schema.sql'), 'utf8');

  console.log('Aplicando migração 001_schema.sql...');
  await pool.query(sql);
  console.log('Migração concluída.');

  await pool.end();
}

main().catch((erro) => {
  console.error('Falha na migração:', erro);
  process.exit(1);
});
