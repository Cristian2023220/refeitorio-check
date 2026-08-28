// Gera ícones PNG placeholder para o manifest do PWA (fundo verde sólido + círculo
// central), sem depender de nenhuma lib de imagem. São só um ponto de partida —
// troque por uma arte de verdade em public/icons/ quando tiver o logo definitivo.
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
const BACKGROUND = [0, 107, 31]; // --color-primary
const FOREGROUND = [255, 255, 255];

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lengthBuf = Buffer.alloc(4);
  lengthBuf.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([lengthBuf, typeBuf, data, crcBuf]);
}

function gerarPng(size, { maskable = false } = {}) {
  const raw = Buffer.alloc(size * (1 + size * 4));
  // Círculo ocupando a "zona segura" (~40% de raio) no centro. Em ícones maskable
  // até 20% das bordas podem ser cortadas pelo SO, então o fundo sólido cobre isso
  // e o círculo fica bem dentro da área visível garantida.
  const raioRelativo = maskable ? 0.22 : 0.3;
  const centro = size / 2;
  const raio = size * raioRelativo;

  for (let y = 0; y < size; y++) {
    const linhaInicio = y * (1 + size * 4);
    raw[linhaInicio] = 0; // filtro "none"
    for (let x = 0; x < size; x++) {
      const dx = x - centro;
      const dy = y - centro;
      const dentroDoCirculo = dx * dx + dy * dy <= raio * raio;
      const cor = dentroDoCirculo ? FOREGROUND : BACKGROUND;
      const offset = linhaInicio + 1 + x * 4;
      raw[offset] = cor[0];
      raw[offset + 1] = cor[1];
      raw[offset + 2] = cor[2];
      raw[offset + 3] = 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'icon-192.png'), gerarPng(192));
writeFileSync(join(OUT_DIR, 'icon-512.png'), gerarPng(512));
writeFileSync(join(OUT_DIR, 'maskable-512.png'), gerarPng(512, { maskable: true }));

console.log('Ícones placeholder gerados em public/icons/. Troque por uma arte definitiva quando possível.');
