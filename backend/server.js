require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth.routes');
const alunoRoutes = require('./src/routes/aluno.routes');       // app do aluno
const acessoRoutes = require('./src/routes/acesso.routes');     // totem RFID
const alunosRoutes = require('./src/routes/alunos.routes');     // painel web (CRUD)
const cartoesRoutes = require('./src/routes/cartoes.routes');   // painel web
const dashboardRoutes = require('./src/routes/dashboard.routes'); // painel web
const relatoriosRoutes = require('./src/routes/relatorios.routes'); // painel web
const configuracoesRoutes = require('./src/routes/configuracoes.routes'); // painel web

const app = express();
app.use(cors());
app.use(express.json());

// Evita que um erro de conexão assíncrono (ex: WebSocket do banco caindo)
// derrube o processo inteiro do Node — em vez disso, só loga e segue rodando.
// Isso é uma rede de segurança; o ideal é sempre investigar o que aparece aqui.
process.on('unhandledRejection', (erro) => {
  console.error('Erro não tratado (unhandledRejection):', erro);
});
process.on('uncaughtException', (erro) => {
  console.error('Exceção não tratada (uncaughtException):', erro);
});

app.get('/', (req, res) => res.json({ servico: 'Refeitório-Check API', status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/acesso', acessoRoutes);          // /acesso/verificar
app.use('/alunos', alunosRoutes);          // /alunos (CRUD admin)
app.use('/cartoes', cartoesRoutes);
app.use('/dashboard', dashboardRoutes);    // /dashboard/resumo, /dashboard/confirmacoes
app.use('/relatorios', relatoriosRoutes);
app.use('/configuracoes', configuracoesRoutes);

// Fica por último de propósito: este router está montado em '/' (sem prefixo fixo,
// já que /confirmacoes e /me não têm um prefixo próprio) e exige token de aluno para
// tudo que passa por ele. Se viesse antes dos outros, ele interceptaria toda
// requisição do sistema — inclusive as do painel admin — antes delas chegarem
// nas rotas certas. Mantendo por último, os prefixos específicos acima (que já
// respondem sozinhos) nunca chegam a cair aqui.
app.use('/', alunoRoutes);                 // /confirmacoes/*, /me*

// Tratador de erro genérico — evita vazar stack trace para o cliente
app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log(`Refeitório-Check API rodando na porta ${PORTA}`));
