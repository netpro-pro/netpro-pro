# NetPro

NetPro es un sistema avanzado de diseño y simulación de topologías de red, desarrollado para permitir a ingenieros y supervisores planificar, versionar y analizar infraestructuras de red de manera eficiente. La aplicación combina una interfaz web moderna con la potencia de un ejecutable de escritorio mediante Tauri.

## Objetivos
- Facilitar el diseño visual de topologías de red utilizando herramientas de diagramación.
- Implementar un control de versiones para los diseños de red, permitiendo rastrear cambios y revertir versiones.
- Proporcionar una simulación de red para validar el comportamiento de la topología.
- Generar reportes detallados de los resultados de las simulaciones.
- Gestionar roles de usuario (Ingeniero, Supervisor, Superadmin) para controlar el acceso a las funcionalidades.

## Requisitos
- **Sistema Operativo:** Windows 10+, Linux (Ubuntu 22.04+ recomendado) o macOS.
- **Lenguajes y Herramientas:**
  - Python 3.11+
  - Node.js 18+ y npm/yarn
  - Rust (estable) y Cargo (para la compilación de Tauri)
  - PostgreSQL 15+
  - Docker y Docker Compose (opcional, para despliegue rápido)

## Instalación

### Opción 1: Usando Docker (Recomendado para desarrollo rápido)
1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   cd netpro
   ```
2. Inicia los servicios (Backend y Base de Datos):
   ```bash
   docker-compose -f infra/docker-compose.yml up -d
   ```
3. Instala las dependencias del frontend:
   ```bash
   cd frontend
   npm install
   ```
4. Ejecuta el frontend en modo desarrollo:
   ```bash
   npm run dev
   ```

### Opción 2: Instalación Manual

#### Backend
1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Crea y activa un entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   # venv\Scripts\activate  # Windows
   ```
3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Configura las variables de entorno creando un archivo `.env` basado en `env.example`.
5. Inicia el servidor:
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend (Web/Tauri)
1. Navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Ejecuta en modo desarrollo web:
   ```bash
   npm run dev
   ```
4. Para ejecutar la versión de escritorio (Tauri):
   ```bash
   npm run tauri:dev
   ```

## Ejecución
Una vez que el backend y el frontend estén corriendo:
- Accede a `http://localhost:5173` (o el puerto indicado por Vite).
- **Credenciales de prueba (Seed):**
  - Admin: `admin` / `admin123`
  - Ingeniero: `ing_demo` / `demo1234`
  - Supervisor: `supervisor` / `super123`

## Estructura de Directorios
```text
netpro/
├── backend/           # API REST desarrollada con FastAPI
│   ├── app/           # Lógica de la aplicación
│   │   ├── core/      # Configuraciones y utilidades centrales
│   │   ├── routers/   # Endpoints de la API
│   │   ├── models.py  # Modelos de SQLAlchemy
│   │   ├── schemas.py # Esquemas de Pydantic
│   │   └── main.py    # Punto de entrada de la API
│   ├── Dockerfile     # Configuración de contenedor backend
│   └── requirements.txt # Dependencias de Python
├── frontend/          # Interfaz de usuario y wrapper de escritorio
│   ├── src/           # Código fuente de React
│   │   ├── api/       # Clientes de comunicación con backend
│   │   ├── components/ # Componentes reutilizables
│   │   ├── pages/     # Vistas principales (Dashboard, Workspace, etc.)
│   │   └── store/     # Gestión de estado global (Zustand)
│   ├── src-tauri/     # Configuración y código Rust de Tauri
│   │   ├── src/       # Lógica de backend de escritorio en Rust
│   │   └── tauri.conf.json # Configuración de la aplicación Tauri
│   ├── Dockerfile     # Configuración de contenedor frontend
│   └── package.json   # Dependencias de Node.js
├── infra/             # Configuración de infraestructura
│   └── docker-compose.yml # Orquestación de servicios (App + DB)
├── docs/              # Documentación técnica detallada
└── README.md          # Guía principal del proyecto
```

## Flujo de Trabajo Git
El proyecto utiliza una estrategia basada en **Feature Branches**:
- `main`: Contiene el código estable y listo para producción.
- `feature/*`: Ramas temporales para el desarrollo de nuevas funcionalidades o correcciones (ej: `feature/network-logic`).
- Se utilizan Pull Requests para integrar los cambios de las ramas `feature` hacia `main`, asegurando que el código sea revisado.

## Entorno de Desarrollo
- **Sistema Operativo:** Linux (Ubuntu) y Windows (vía WSL2).
- **IDE Recomendado:** VS Code con extensiones para Python, Rust y React.
- **Base de Datos:** PostgreSQL.

## Autores
- [NetPro Team]

## Licencia
Este proyecto se distribuye bajo una licencia propietaria/interna.
