import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  // Aplica la ruta base '/Minispa/' solo en producción, de lo contrario usa '/'
  base: command === 'build' ? '/Minispa/' : '/',
}))