import app from './src/app';

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log(`Refeitório-Check API rodando na porta ${PORTA}`));