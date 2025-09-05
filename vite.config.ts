import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        cleanupOutdatedCaches: true,
      },
      includeAssets: ['icons/*.png', 'calendar-favicon.svg'],
      manifest: {
        name: 'Remind Candles',
        short_name: 'Remind',
        description: 'Never miss a birthday again with our thoughtful birthday reminder application',
        theme_color: '#FFB5E8',
        icons: [
          // ... icons from manifest.webmanifest
        ]
      }
    })
  ],
})
