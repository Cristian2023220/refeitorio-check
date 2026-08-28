import { Pool as PgPool } from 'pg';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

export type DbPool = PgPool | NeonPool;

// Escolhe o driver de Postgres pela DATABASE_URL:
// - host *.neon.tech → driver serverless do Neon (WebSocket na porta 443, contorna
//   bloqueios de porta 5432 em rede de campus/corporativa — ver backend/README.md).
// - qualquer outro host (Postgres local, Docker, outro provedor) → `pg` tradicional (TCP).
// Isso permite rodar contra um Postgres local em dev sem precisar de credenciais do Neon,
// sem mudar de driver na hora de apontar para produção.
export function criarPool(connectionString: string | undefined): DbPool {
  const usaNeon = /\.neon\.tech([:/]|$)/.test(connectionString || '');

  if (usaNeon) {
    neonConfig.webSocketConstructor = ws;
    return new NeonPool({ connectionString });
  }

  return new PgPool({ connectionString });
}
