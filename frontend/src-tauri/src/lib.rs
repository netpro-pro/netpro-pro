// =============================================================================
// NetPro - Tauri lib
// -----------------------------------------------------------------------------
// Esta es la "spine" de la app de escritorio. Tauri 2 separa el binario
// (`main.rs`) de la lógica (`lib.rs`) porque la entrada cambia entre desktop
// y mobile (en mobile, el sistema operativo invoca `run()` directamente).
//
// La regla en este proyecto:
//   * El frontend (React) sigue siendo el "dueño" de la lógica de negocio.
//   * El backend FastAPI sigue siendo la fuente de verdad de los datos.
//   * Esta capa Rust solo expone comandos nativos cuando algo NO se puede
//     hacer desde la WebView (filesystem real, ventanas múltiples, tray, etc.).
// =============================================================================

use serde::Serialize;

// -----------------------------------------------------------------------------
// Comando #1 — Devuelve la versión declarada en Cargo.toml.
// Útil para el "About" de la app y para verificar que el bridge IPC funciona.
// Desde el frontend:
//   import { invoke } from '@tauri-apps/api/core'
//   const v = await invoke('app_version')
// -----------------------------------------------------------------------------
#[tauri::command]
fn app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

// -----------------------------------------------------------------------------
// Comando #2 — Información del entorno de ejecución.
// El frontend la usa para ajustar UX (p. ej. mostrar shortcuts nativos sólo
// dentro del shell de escritorio).
// -----------------------------------------------------------------------------
#[derive(Serialize)]
struct RuntimeInfo {
    version:  &'static str,
    platform: &'static str,
    arch:     &'static str,
    debug:    bool,
}

#[tauri::command]
fn runtime_info() -> RuntimeInfo {
    RuntimeInfo {
        version:  env!("CARGO_PKG_VERSION"),
        platform: std::env::consts::OS,    // "windows" | "macos" | "linux"
        arch:     std::env::consts::ARCH,  // "x86_64" | "aarch64" | ...
        debug:    cfg!(debug_assertions),
    }
}

// -----------------------------------------------------------------------------
// Punto de entrada compartido (desktop + mobile).
// `mobile_entry_point` solo se aplica al compilar para iOS/Android.
// -----------------------------------------------------------------------------
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Plugin shell: necesario para abrir URLs/archivos con la app por defecto
        // del sistema (lo usaremos para "abrir docs en navegador", etc.).
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            app_version,
            runtime_info,
        ])
        .run(tauri::generate_context!())
        .expect("Error fatal arrancando la aplicación NetPro");
}
