// O totem não tem um usuário logando — ele se autentica com uma chave fixa
// configurada uma única vez na instalação do dispositivo (X-Device-Key).
function autenticarDispositivo(req, res, next) {
  const chave = req.headers['x-device-key'];

  if (!chave || chave !== process.env.TOTEM_DEVICE_KEY) {
    return res.status(401).json({ erro: 'Dispositivo não autorizado' });
  }

  next();
}

module.exports = { autenticarDispositivo };
