# Refeitório-Check — API

Backend Node.js/Express + PostgreSQL para o app do aluno, o painel web e o totem RFID.

## Nota sobre conexão com o banco

O driver é escolhido automaticamente em `src/utils/createPool.js`, pelo host da `DATABASE_URL`:

- Host `*.neon.tech` → `@neondatabase/serverless` (WebSocket na porta 443). Proposital: muitas
  redes de campus/corporativas bloqueiam a porta 5432, mas praticamente nenhuma bloqueia 443
  (a mesma porta do HTTPS).
- Qualquer outro host (Postgres local, Docker, outro provedor) → `pg` tradicional (TCP na 5432).

Ou seja, dá pra desenvolver localmente contra um Postgres em Docker sem precisar de credenciais do
Neon, sem tocar em nenhum código — só aponte a `DATABASE_URL` pro seu banco local. Exemplo rápido
pra subir um Postgres local:

```bash
docker run -d --name refeitorio-check-db \
  -e POSTGRES_USER=refeitorio -e POSTGRES_PASSWORD=refeitorio_dev_local \
  -e POSTGRES_DB=refeitorio_check -p 5544:5432 postgres:17-alpine
```
```
DATABASE_URL=postgres://refeitorio:refeitorio_dev_local@localhost:5544/refeitorio_check
```

## Como rodar

```bash
npm install
cp .env.example .env   # edite DATABASE_URL, JWT_SECRET e TOTEM_DEVICE_KEY
npm run migrate        # cria as tabelas (migrations/001_schema.sql)
npm run dev             # sobe em http://localhost:3000
```

Você precisa de um PostgreSQL rodando e acessível pela `DATABASE_URL`. Para criar o primeiro usuário administrativo (a tabela `usuarios_admin` começa vazia), gere um hash de senha e insira direto no banco:

```js
// node -e "console.log(require('bcryptjs').hashSync('sua-senha', 10))"
```
```sql
INSERT INTO usuarios_admin (nome, email, senha_hash, papel)
VALUES ('Marta Nutricionista', 'marta@ifbaiano.edu.br', '<hash gerado acima>', 'gestor');
```

## Endpoints implementados

### Autenticação
| Método | Rota |
|---|---|
| POST | `/auth/login` — login do aluno |
| POST | `/auth/admin/login` — login da equipe |

### App do aluno (JWT de aluno)
| Método | Rota |
|---|---|
| GET | `/confirmacoes/hoje` |
| POST | `/confirmacoes` |
| GET | `/me` |
| GET | `/me/saldo` |
| GET | `/me/historico` |

### Totem RFID (chave de dispositivo `X-Device-Key`)
| Método | Rota |
|---|---|
| POST | `/acesso/verificar` — `{ "uid": "0012057967" }` |

### Painel web (JWT de admin)
| Método | Rota |
|---|---|
| GET / POST / PUT / DELETE | `/alunos` |
| GET / POST / DELETE | `/cartoes` |
| GET | `/dashboard/resumo` |
| GET | `/dashboard/confirmacoes?data=YYYY-MM-DD` |
| GET | `/relatorios?inicio=&fim=` |
| GET / PUT | `/configuracoes` (PUT exige papel `gestor`) |

## Ligando o totem HTML ao backend real

A tela do leitor que prototipamos usa um objeto `bancoDeDados` local. Para virar produção, troque `processarLeitura(codigo)` por uma chamada real:

```js
async function processarLeitura(codigoCartao) {
  const resposta = await fetch('https://sua-api.dominio.br/acesso/verificar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Device-Key': 'a-mesma-chave-do-.env'
    },
    body: JSON.stringify({ uid: codigoCartao })
  });

  const dados = await resposta.json();
  // dados.resultado === 'liberado' | 'negado'
  // dados.motivo (quando negado): sem_confirmacao | sem_saldo | fora_horario | cartao_desconhecido
  // dados.aluno: { nome, matricula, curso, fotoUrl, usosNoMes, saldoRestante }
}
```

O input invisível `#leitor_rfid` continua igual — só a função que processa a leitura passa a falar com a API em vez de consultar um objeto local.

## Estrutura de pastas

```
backend/
├── server.js
├── migrations/
│   ├── 001_schema.sql
│   └── run.js
└── src/
    ├── db.js
    ├── middleware/
    │   ├── auth.js         (JWT: aluno / admin)
    │   └── deviceAuth.js    (chave fixa do totem)
    ├── services/
    │   └── acesso.service.js  (regra de negócio central)
    ├── utils/
    │   └── createPool.js   (escolhe driver Neon vs pg pela DATABASE_URL)
    └── routes/
        ├── auth.routes.js
        ├── aluno.routes.js
        ├── acesso.routes.js
        ├── alunos.routes.js
        ├── cartoes.routes.js
        ├── dashboard.routes.js
        ├── relatorios.routes.js
        └── configuracoes.routes.js
```
