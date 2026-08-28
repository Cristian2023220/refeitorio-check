# Refeitório-Check — Frontend unificado

Este frontend une dois trabalhos: o visual foi desenhado no Google Stitch (telas mais elaboradas, com
animações e um design system documentado) e a integração com a API — login, confirmação de presença,
totem, CRUD de alunos e cartões — é a mesma que já validamos rodando contra o backend real.

## O que foi feito na unificação

Cada tela do Stitch que já vinha com uma versão "funcional" (com JS de exemplo, dados fixos) foi usada
como base visual, e a lógica interna foi trocada pelas chamadas reais à API:

| Tela | Base visual (Stitch) | O que mudou |
|---|---|---|
| Totem | `totem_rfid_funcional` | Objeto `bancoDeDados` local → `POST /acesso/verificar` de verdade, com config de URL/chave por ⚙ |
| App do aluno | `app_aluno_funcional` (só a Home existia) | Vira SPA com Login, Confirmar, Histórico e Perfil — as 3 últimas foram desenhadas do zero seguindo o mesmo design system |
| Painel web | `login_funcional` + `dashboard_administrativo_dinamico` + `lista_de_presenca_interativa` | Unidos num só painel com sidebar; Alunos, Cartões RFID, Relatórios e Configurações foram desenhados do zero no mesmo estilo (não existiam no export do Stitch) |

Design tokens usados em tudo (cores, tipografia Plus Jakarta Sans / Source Sans 3, espaçamento, raios):
os mesmos definidos no `DESIGN.md` que veio no seu export do Stitch.

## Estrutura

```
frontend/
├── totem/         → tela fixa no refeitório, ligada ao leitor RFID
├── app-aluno/      → o aluno confirma presença e acompanha o histórico
└── painel-web/     → a equipe do refeitório gerencia tudo
```

## App do aluno e painel web: React + Vite + TypeScript

`app-aluno/` e `painel-web/` foram migrados para **Vite + React + TypeScript**, saindo do HTML +
JS vanilla + Tailwind via CDN original. Só o `totem/` continua como estava — é uma tela fixa e
simples, sem prioridade de migração por enquanto.

O que mudou nos dois, além da linguagem:
- **Modo escuro** de verdade (toggle no cabeçalho/topbar), via variáveis CSS + `darkMode: 'class'`
  do Tailwind — antes existia só a configuração do Tailwind, sem nenhum toggle ligado a ela.
- Fontes (Plus Jakarta Sans / Source Sans 3) e ícones (`lucide-react`) agora são bundlados, não
  dependem mais do CDN do Google Fonts em runtime.
- `prompt()`/`alert()`/`confirm()` nativos viraram modais e toasts estilizados, e as tabelas
  mostram skeletons de carregamento em vez de texto "Carregando...".
- Cada um mantém seu próprio `package.json`/`node_modules` — são projetos Vite independentes,
  não um monorepo com pacotes compartilhados.

Só o **app-aluno** vira PWA (`vite-plugin-pwa`): manifest + service worker, dá pra "Adicionar à
tela inicial" no Android e abrir em tela cheia como um app nativo. O painel web é ferramenta
interna de uso em desktop pela equipe — não faz sentido como PWA instalável, então não tem.
Os ícones do PWA em `app-aluno/public/icons/` são **placeholders** (gerados por
`npm run generate-icons`, cor sólida) — troque por uma arte definitiva quando tiver o logo.

Comandos (dentro de `app-aluno/` ou `painel-web/`): `npm run dev` (mesmo que `npm start`, nas
portas 5501/5502), `npm run build` (gera `dist/`), `npm run preview` (serve o build).

## Instalar e rodar

```bash
npm run install:all
npm install
npm start
```

- Totem: http://localhost:5500
- App do aluno: http://localhost:5501
- Painel web: http://localhost:5502

## Primeira configuração de cada um

- **Totem**: engrenagem (⚙, canto superior direito) → URL da API + chave do dispositivo (`TOTEM_DEVICE_KEY` do `.env` do backend)
- **App do aluno / Painel web**: link "API: ..." perto do botão de entrar

Em desenvolvimento local, a URL da API é `http://localhost:3000`.

## O que ficou fora desta rodada

- **Cardápio do dia**: o Stitch desenhou um card bonito pra isso, mas o backend não tem uma rota dedicada — hoje ele usa a mesma tabela `configuracoes` (chave `cardapio_dia`), então dá pra editar pelo painel, mas é só um texto solto, sem estrutura de pratos.
- Botões "Exportar CSV/PDF" e "Notificações" são apenas visuais, como já eram antes.
