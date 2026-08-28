import { criarPool } from './utils/createPool';

const pool = criarPool(process.env.DATABASE_URL);

export interface QueryResultLike<T> {
  rows: T[];
  rowCount: number | null;
}

// Wrapper simples para padronizar chamadas e facilitar log/depuração
export async function query<T = any>(texto: string, parametros?: unknown[]): Promise<QueryResultLike<T>> {
  const resultado = await (pool.query as (texto: string, parametros?: unknown[]) => Promise<QueryResultLike<T>>)(
    texto,
    parametros
  );
  return resultado;
}

export { pool };
