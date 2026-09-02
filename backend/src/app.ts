import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';

import authRoutes from './routes/auth.routes';
import alunoRoutes from './routes/aluno.routes';
import acessoRoutes from './routes/acesso.routes';
import alunosRoutes from './routes/alunos.routes';
import cartoesRoutes from './routes/cartoes.routes';
import dashboardRoutes from './routes/dashboard.routes';
import relatoriosRoutes from './routes/relatorios.routes';
import configuracoesRoutes from './routes/configuracoes.routes';

const app = express();
app.use(cors());
app.use(express.json());

process.on('unhandledRejection', (erro) => {
  console.error('Erro não tratado (unhandledRejection):', erro);
});
process.on('uncaughtException', (erro) => {
  console.error('Exceção não tratada (uncaughtException):', erro);
});

app.get('/', (_req, res) => res.json({ servico: 'Refeitório-Check API', status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/acesso', acessoRoutes);
app.use('/alunos', alunosRoutes);
app.use('/cartoes', cartoesRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/relatorios', relatoriosRoutes);
app.use('/configuracoes', configuracoesRoutes);
app.use('/', alunoRoutes);

app.use((erro: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

export default app;