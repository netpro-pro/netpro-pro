// Evita una ventana de consola adicional en Windows en builds release.
// ¡NO QUITAR! Sin esto, el .exe abriría una terminal negra junto a la ventana.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    netpro_lib::run()
}
