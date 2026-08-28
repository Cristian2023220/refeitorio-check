import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { criarPool } from '../src/utils/createPool';

async function main() {
  const pool = criarPool(process.env.DATABASE_URL);
  const sql = fs.readFileSync(path.join(__dirname, '001_schema.sql'), 'utf8');

  console.log('Aplicando migração 001_schema.sql...');
  // O arquivo tem várias declarações separadas por ";" — passar direto pra `query<T>()`
  // tipada não faz sentido aqui (não é uma linha de resultado), por isso o `any` pontual.
  await (pool.query as (texto: string) => Promise<unknown>)(sql);
  console.log('Migração concluída.');

  await pool.end();
}

main().catch((erro) => {
  console.error('Falha na migração:', erro);
  process.exit(1);
});
