import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: { port: 5501 },
  preview: { port: 5501 },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png'],
      manifest: {
        name: 'Refeitório IF Baiano',
        short_name: 'Refeitório',
        description: 'Confirme sua presença no refeitório e acompanhe seu histórico de acessos.',
        start_url: '/',
        display: 'standalone',
        background_color: '#f1f5f9',
        theme_color: '#006b1f',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // As chamadas à API (URL configurável em localStorage) não passam por aqui:
        // só o shell do app (JS/CSS/fontes/ícones) é pré-cacheado.
        navigateFallback: '/index.html',
        // Por padrão o plugin não inclui fontes no precache — sem isso, a primeira
        // renderização offline cairia pra fonte do sistema. .woff (fallback legado,
        // Android moderno nunca usa) fica de fora pra não duplicar cada fonte à toa.
        globPatterns: ['**/*.{js,css,html,woff2,png,svg,webmanifest}'],
      },
    }),
  ],
});
