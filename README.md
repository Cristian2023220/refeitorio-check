# Refeitório-Check

Sistema de gestão do refeitório do IFBaiano — Campus Itapetinga. Alunos confirmam presença pelo app,
a equipe acompanha pelo painel web, e a liberação no refeitório acontece por leitura de cartão RFID no totem.

## Estrutura do projeto

```
refeitorio_check/
├── backend/          → API (Node/Express + TypeScript) + banco (PostgreSQL/Neon)
└── frontend/
    ├── totem/         → tela fixa no refeitório, ligada ao leitor RFID
    ├── app-aluno/      → o aluno confirma presença e acompanha o histórico
    └── painel-web/     → a equipe do refeitório gerencia tudo
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

Depois:
```bash
npm run migrate
npm run dev
```
A API sobe em `http://localhost:3000`.

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
