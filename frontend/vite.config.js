import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `TAURI_DEV_HOST` lo inyecta `tauri dev` cuando se desarrolla contra un
// dispositivo móvil físico (iOS/Android). En desktop/Docker queda undefined.
const tauriHost = process.env.TAURI_DEV_HOST

// `TAURI_ENV_PLATFORM` lo inyecta `tauri build` para que ajustemos el target
// del bundler al runtime del WebView (Chromium en Win/Linux, WebKit en macOS).
const tauriPlatform = process.env.TAURI_ENV_PLATFORM
const isTauriBuild  = !!tauriPlatform

export default defineConfig({
  plugins: [react()],

  // No limpiar la pantalla: deja visibles los errores de Rust mientras Vite
  // arranca en modo `tauri dev`.
  clearScreen: false,

  server: {
    // En Docker queremos seguir escuchando en 0.0.0.0; en `tauri dev` para
    // móvil físico Tauri exige el IP que él inyecta en TAURI_DEV_HOST.
    host: tauriHost || '0.0.0.0',
    port: 5173,
    // Tauri necesita un puerto fijo. Si está ocupado, fallar (no buscar otro).
    strictPort: true,

    // HMR sobre WS cuando se ejecuta en device móvil
    hmr: tauriHost
      ? { protocol: 'ws', host: tauriHost, port: 1421 }
      : undefined,

    watch: {
      // No re-arrancar Vite cuando cambian los .rs de Tauri.
      ignored: ['**/src-tauri/**'],
    },

    // Proxy: evita CORS durante desarrollo local sin Docker.
    // En el shell Tauri esto es irrelevante (la WebView llama directo a
    // VITE_API_URL); en navegador sigue funcionando como antes.
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // Las variables que empiezan con estos prefijos quedan disponibles en
  // `import.meta.env`. `TAURI_ENV_*` las inyecta el CLI de Tauri al construir.
  envPrefix: ['VITE_', 'TAURI_ENV_*'],

  build: {
    // Match con el WebView de cada SO. Sin esto, esbuild puede generar
    // sintaxis que Safari (macOS/iOS) no entiende.
    target: isTauriBuild
      ? (tauriPlatform === 'windows' ? 'chrome105' : 'safari13')
      : 'esnext',
    // Con TAURI_ENV_DEBUG=1 conservamos sourcemaps y omitimos minify para
    // poder depurar el .exe/.app sin volver a compilar el frontend.
    minify:    !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
})
