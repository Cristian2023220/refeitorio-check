import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';

import authRoutes from './src/routes/auth.routes';
import alunoRoutes from './src/routes/aluno.routes'; // app do aluno
import acessoRoutes from './src/routes/acesso.routes'; // totem RFID
import alunosRoutes from './src/routes/alunos.routes'; // painel web (CRUD)
import cartoesRoutes from './src/routes/cartoes.routes'; // painel web
import dashboardRoutes from './src/routes/dashboard.routes'; // painel web
import relatoriosRoutes from './src/routes/relatorios.routes'; // painel web
import configuracoesRoutes from './src/routes/configuracoes.routes'; // painel web

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

app.get('/', (_req, res) => res.json({ servico: 'Refeitório-Check API', status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/acesso', acessoRoutes); // /acesso/verificar
app.use('/alunos', alunosRoutes); // /alunos (CRUD admin)
app.use('/cartoes', cartoesRoutes);
app.use('/dashboard', dashboardRoutes); // /dashboard/resumo, /dashboard/confirmacoes
app.use('/relatorios', relatoriosRoutes);
app.use('/configuracoes', configuracoesRoutes);

// Fica por último de propósito: este router está montado em '/' (sem prefixo fixo,
// já que /confirmacoes e /me não têm um prefixo próprio) e exige token de aluno para
// tudo que passa por ele. Se viesse antes dos outros, ele interceptaria toda
// requisição do sistema — inclusive as do painel admin — antes delas chegarem
// nas rotas certas. Mantendo por último, os prefixos específicos acima (que já
// respondem sozinhos) nunca chegam a cair aqui.
app.use('/', alunoRoutes); // /confirmacoes/*, /me*

// Tratador de erro genérico — evita vazar stack trace para o cliente
app.use((erro: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log(`Refeitório-Check API rodando na porta ${PORTA}`));
