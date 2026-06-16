// build.rs — Hook de compilación que Tauri usa para inyectar configuración
// (tauri.conf.json, capacidades, recursos, iconos) dentro del binario final.
fn main() {
    tauri_build::build()
}
