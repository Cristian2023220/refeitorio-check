// Express 4 não repassa automaticamente uma rejeição de Promise para o
// middleware de erro. Sem isso, um erro dentro de uma rota async vira um
// "unhandled rejection" e pode derrubar o processo inteiro do Node.
// Envolver cada rota com isso garante que o erro sempre caia no
// app.use((erro, req, res, next) => ...) do server.js.
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { asyncHandler };
