# Entorno de Desarrollo

## Sistema Operativo
- **SO utilizado:** Fedora 44.
- **Distribución y versión:** Fedora 44 (Workstation)

## Herramientas instaladas
- **Git:** 2.x.x
- **Python:** 3.11.x (con `pip` y `venv`)
- **Node.js:** 18.x.x / 20.x.x (con `npm`)
- **Rust:** 1.77.2 (establemente configurado con `rustup`)
- **PostgreSQL:** 15.x
- **Editor/IDE:** Visual Studio Code.
- **Extensiones relevantes:**
  - Python (Microsoft)
  - Rust-analyzer
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Docker


## Entorno virtual
El backend utiliza un entorno virtual de Python para aislar las dependencias:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Linux/WSL2
# venv\Scripts\activate   # En Windows CMD/PowerShell
pip install -r requirements.txt
```

## Variables de entorno
El proyecto requiere un archivo `.env` en la raíz de la carpeta `backend/`. Se proporciona el archivo `backend/env.example` como referencia.

**Claves necesarias:**
- `DATABASE_URL`: Cadena de conexión a PostgreSQL (ej: `postgresql+asyncpg://user:pass@localhost/netpro`).
- `SECRET_KEY`: Clave secreta para la firma de tokens JWT.
- `ALGORITHM`: Algoritmo de cifrado para JWT (ej: `HS256`).

Se ha creado un archivo `.env.example` con las claves vacías para facilitar la configuración inicial.
