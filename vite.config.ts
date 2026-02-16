import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Varsayılan limit 500kb'dir. jspdf ve html2canvas büyük olduğu için uyarı verir.
    // Limiti 1600kb'ye çıkararak uyarıyı susturuyoruz.
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Büyük kütüphaneleri ayrı dosyalara bölerek tarayıcının daha hızlı yüklemesini sağlıyoruz.
        manualChunks: {
          vendor: ['react', 'react-dom'],
          pdf: ['html2canvas', 'jspdf'],
          ui: ['canvas-confetti', '@google/genai']
        }
      }
    }
  }
});