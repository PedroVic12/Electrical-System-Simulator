import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Impede que o Vite limpe a tela do console, útil para ver os logs do Tauri
  clearScreen: false,
  // Configuração do servidor para o desenvolvimento com o Tauri
  server: {
    port: 1420,
    strictPort: true,
  },
})
