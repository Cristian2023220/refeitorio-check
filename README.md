# Refeitório-Check

Sistema de gestão do refeitório do IFBaiano — Campus Itapetinga. Alunos confirmam presença pelo app,
a equipe acompanha pelo painel web, e a liberação no refeitório acontece por leitura de cartão RFID no totem.

## Stack

- **Backend**: Node.js/Express + TypeScript, PostgreSQL (Neon em produção; o driver troca sozinho
  pra `pg` tradicional se a `DATABASE_URL` não for do Neon — dá pra rodar contra um Postgres local
  em dev, sem credencial nenhuma, veja `backend/README.md`).
- **Frontend**: três apps independentes em React + Vite + TypeScript, com modo escuro. Só o
  `app-aluno` é PWA instalável (o painel web e o totem são ferramentas internas/kiosk, não fazem
  sentido como app instalável).

## Estrutura do projeto

```
refeitorio_check/
├── backend/          → API (Node/Express + TypeScript) + banco (PostgreSQL/Neon)
└── frontend/
    ├── totem/         → tela fixa no refeitório, ligada ao leitor RFID (React + TypeScript)
    ├── app-aluno/      → o aluno confirma presença e acompanha o histórico (React + TS + PWA)
    └── painel-web/     → a equipe do refeitório gerencia tudo (React + TypeScript)
```

## Como rodar pela primeira vez (depois de clonar)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Abra o `.env` criado e preencha com **suas próprias** credenciais (peça a quem compartilhou o projeto,
ou crie um banco Neon novo — veja `backend/README.md`):

```
DATABASE_URL=postgres://usuario:senha@seu-host-neon/neondb?sslmode=require
JWT_SECRET=qualquer-string-longa-e-aleatoria
TOTEM_DEVICE_KEY=outra-string-longa-e-aleatoria
```

Não tem um banco Neon à mão ainda? Não precisa esperar — aponte a `DATABASE_URL` pra um Postgres
local (ex: um container Docker) e o backend detecta sozinho e usa o driver certo. Veja o exemplo
rápido em `backend/README.md`, seção "Nota sobre conexão com o banco".

Depois:
```bash
npm run migrate
npm run dev
```
A API sobe em `http://localhost:3000`. Em produção: `npm run build` e depois `npm start`.

Detalhes de endpoints, regras de negócio e como criar o primeiro usuário admin estão em `backend/README.md`.

### 2. Frontend

Em outro terminal:
```bash
cd frontend
npm run install:all
npm install
npm start
```
- Totem: http://localhost:5500
- App do aluno: http://localhost:5501
- Painel web: http://localhost:5502

Na primeira vez que abrir cada um, configure a URL da API (`http://localhost:3000`) — o link/ícone de
configuração fica perto do botão de entrar (app/painel) ou no ícone de engrenagem (totem).

## Importante — segurança

- O arquivo `.env` **nunca é commitado** (está no `.gitignore`). Cada pessoa que clonar o projeto precisa
  do próprio banco ou das credenciais compartilhadas por um canal seguro (nunca cole senhas em chat, issue
  do GitHub ou README).
- Se uma credencial do banco (Neon) for exposta em algum lugar por engano, troque a senha no painel do Neon
  antes de continuar usando o projeto.
