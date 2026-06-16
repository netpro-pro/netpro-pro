# NetPro System

Sistema de diseño, versionado y simulación de topologías de red.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + Zustand + Tailwind CSS |
| Backend  | FastAPI + SQLAlchemy 2 (async) + asyncpg |
| Base de datos | PostgreSQL 15 |
| Contenedores | Docker Compose |

---

## Arranque rápido (Docker Compose)

```bash
# Desde la carpeta raíz del proyecto:
cd infra
docker compose up --build
```

| Servicio | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| Backend (FastAPI) | http://localhost:8000 |
| Docs interactivas | http://localhost:8000/docs |

### Credenciales de desarrollo (seed automático)

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `admin123` | Superadmin |
| `ing_demo` | `demo1234` | Ingeniero |

> ⚠️ Las contraseñas están en **texto plano** en el seed. Para producción, reemplazar por bcrypt en `main.py → seed_initial_data()`.

---

## Arranque local (sin Docker)

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp env.example .env          # Ajusta DATABASE_URL a tu Postgres local
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## App de escritorio (Tauri)

NetPro se puede empaquetar como app nativa de escritorio (Windows/macOS/Linux)
con [Tauri 2](https://v2.tauri.app/). El frontend React es exactamente el mismo;
Tauri solo añade un shell Rust + WebView del sistema.

> **Arquitectura:** Tauri envuelve el frontend; el backend FastAPI sigue siendo
> un servicio aparte. La app de escritorio se comunica con `VITE_API_URL`
> exactamente como el frontend web, así que se puede correr el backend en
> Docker Compose y abrir la app de escritorio en paralelo.

### Pre-requisitos (una sola vez)

1. **Rust** — instalar con [rustup](https://rustup.rs/).
2. **Dependencias del sistema** (solo Linux): seguir la
   [guía oficial](https://v2.tauri.app/start/prerequisites/) (paquetes de
   `webkit2gtk`, `libssl-dev`, `build-essential`, etc.).
3. **WebView2** (solo Windows): viene preinstalado en Windows 11 y en la
   mayoría de Windows 10 actualizado; si falta, lo proporciona el bundle.

### Desarrollo

```bash
cd frontend
npm install
npm run tauri:dev          # Compila Rust, levanta Vite y abre la ventana
```

La primera ejecución descarga y compila las crates de Tauri (~5–10 min).
Las siguientes son incrementales (~10 s).

> Hot Module Reload del frontend funciona igual que en navegador; los cambios
> en archivos `.rs` recompilan y reinician la ventana automáticamente.

### Build de producción

```bash
cd frontend
cp .env.production.example .env.production    # Ajustar VITE_API_URL si aplica
npm run tauri:build
```

Genera instaladores en `src-tauri/target/release/bundle/`:

| SO | Formato |
|---|---|
| Windows | `.msi` y `.exe` (NSIS) |
| macOS | `.dmg` y `.app` |
| Linux | `.deb`, `.rpm` y `.AppImage` |

### Iconos

Los iconos en `src-tauri/icons/` son **placeholders** generados automáticamente
(cuadrado teal con la "N"). Para producción, sustituirlos con el logo real:

```bash
cd frontend
npm run tauri:icon ruta/al/logo.png   # Genera todos los tamaños/formatos
```

### Comandos Rust expuestos al frontend

Definidos en `src-tauri/src/lib.rs`. Usar desde React vía
`src/utils/runtime.js`:

```js
import { invokeTauri, isTauri } from './utils/runtime'

if (isTauri) {
  const version = await invokeTauri('app_version')   // "1.0.0"
  const info    = await invokeTauri('runtime_info')  // { platform, arch, ... }
}
```

En navegador, `invokeTauri()` devuelve `null` sin error: el mismo bundle sirve
para web y desktop.

### Estructura añadida

```
frontend/
├── src-tauri/                # Shell Rust de la app de escritorio
│   ├── Cargo.toml            # Dependencias Rust (tauri, plugin-shell, serde)
│   ├── build.rs              # Hook de compilación (inyecta tauri.conf.json)
│   ├── tauri.conf.json       # Config: ventana, bundle, identifier, CSP, etc.
│   ├── src/
│   │   ├── main.rs           # Entry point del binario (no tocar habitualmente)
│   │   └── lib.rs            # Aquí van los #[tauri::command]
│   ├── capabilities/
│   │   └── default.json      # ACL: qué APIs Tauri puede llamar el frontend
│   └── icons/                # Iconos para todos los SOs
└── src/utils/runtime.js      # Helpers `isTauri` / `invokeTauri`
```

---

## Variables de entorno importantes

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Cadena de conexión async | `postgresql+asyncpg://user:pass@host:5432/db` |
| `DB_ECHO` | SQL logging (0/1) | `0` |
| `VITE_API_URL` | URL del backend (frontend) | `http://localhost:8000` |

> ⚠️ **El prefijo `postgresql+asyncpg://` es obligatorio.** Usar `postgresql://` causa un error al conectar porque SQLAlchemy no carga el driver async.

---

## Estructura del proyecto
 
 ```
 netpro/
 ├── backend/
 │   ├── app/
 │   │   ├── main.py          # Punto de entrada, CORS, lifespan, seed
 │   │   ├── database.py      # Engine async, sesiones, init_db()
 │   │   ├── models.py        # ORM: Rol, Usuario, Proyecto, Version, Reporte, Log
 │   │   ├── schemas.py       # Pydantic DTOs (LoginRequest/Response, ProyectoDetalle…)
 │   │   ├── core/
 │   │   │   └── network_logic.py
 │   │   └── routers/
 │   │       ├── auth.py      # Autenticación y JWT
 │   │       ├── proyectos.py # Gestión de topologías
 │   │       ├── usuarios.py  # CRUD de usuarios y roles
 │   │       ├── versiones.py # Versionado de topologías
 │   │       ├── actividades.py# Registro de cambios
 │   │       └── logs.py      # Logs del sistema
 │   ├── requirements.txt
 │   ├── Dockerfile
 │   └── env.example
 ├── frontend/
 │   ├── src/
 │   │   ├── main.jsx          # Entry point (React + Zustand)
 │   │   ├── App.jsx           # State-driven router
 │   │   ├── store/            # Estado global (slices, constants)
 │   │   │   └── useNetProStore.js
 │   │   ├── api/              # Clientes API (axios/fetch)
 │   │   │   └── netproApi.js
 │   │   ├── pages/            # Pantallas principales (Dashboard, Editor, Simulation, etc.)
 │   │   ├── components/       # Componentes UI organizados por módulo (admin, simulation, etc.)
 │   │   ├── hooks/            # Lógica de negocio reutilizable
 │   │   ├── utils/            # Helpers de red, física y validaciones
 │   │   └── styles/           # Design tokens (fuente única de verdad CSS)
 │   ├── index.html
 │   ├── vite.config.js
 │   ├── tailwind.config.js
 │   └── package.json
 └── infra/
     └── docker-compose.yml
 ````