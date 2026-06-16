# Evidencia del Flujo de Trabajo Git

## Evidencias de Desarrollo en Linux (Apartado 5.4)

Para dar cumplimiento a los requisitos del entorno de desarrollo y optimizar la gestión de dependencias, automatización y control de versiones, el proyecto ha sido desarrollado íntegramente en un entorno basado en Linux.

- **Entorno Principal:** Fedora 44 (Workstation).
- **Validación:** Todo el ciclo de vida del software, incluyendo la configuración de la base de datos PostgreSQL, la orquestación de contenedores con Docker y la compilación nativa de la aplicación de escritorio mediante Tauri (Rust), se ha ejecutado en Fedora 44.
- **Repositorio de Pruebas:** Las evidencias verificables (capturas de pantalla de la terminal, registros de ejecución y logs del sistema) se encuentran disponibles en la carpeta `/evidencias_linux` de este repositorio.

## Estrategia utilizada
El proyecto utiliza una variante de **GitHub Flow**, basada en la creación de ramas de funcionalidad (`feature branches`) que se integran a la rama principal (`main`) tras una revisión.

## Ramas del repositorio

| Rama | Issue | Descripción |
| :--- | :---: | :--- |
| `feature/issue-1-db-models-auth` | #1 | Definición de modelos de base de datos y sistema de autenticación. |
| `feature/issue-2-api-proyectos-versiones` | #19 | Desarrollo de endpoints para la gestión de proyectos y versionado. |
| `feature/issue-3-logs-actividades-seed` | #16 | Implementación de logs de auditoría y scripts de datos semilla (seed). |
| `feature/issue-4-frontend-setup-zustand` | #17 | Configuración de la arquitectura del frontend y estado global con Zustand. |
| `feature/issue-5-dashboard-editor` | #20 | Implementación de la interfaz del Dashboard y el Editor de topologías. |
| `feature/issue-6-api-client-axios-auth` | #21 | Creación del cliente API centralizado con Axios y gestión de tokens JWT. |
| `feature/issue-7-dockerizacion` | #14 | Configuración de Docker y Docker Compose para el despliegue de infraestructura. |
| `feature/issue-8-implementacion-docs-base` | #18 | Creación de la estructura inicial de documentación técnica. |
| `feature/issue-9-testing-docs` | #9 | Documentación de estrategias de prueba y testing del sistema. |


## Historial de Pull Requests
*Nota: Basado en el historial de commits, se han realizado las siguientes integraciones principales:*
- **Integración de Lógica de Simulación:** Implementación de correcciones en la velocidad de simulación y gestión de espacios de trabajo.
- **Actualización de Diseño:** Rediseño de la interfaz de administración y generación de reportes en PDF.
- **Refactorización General:** Serie de commits de "Refactorizacion" destinados a limpiar el código y mejorar la modularidad del backend y frontend.

## Resolución de Conflictos
Se han identificado merges complejos durante la fase de refactorización. Los conflictos se resolvieron manualmente priorizando la nueva estructura de carpetas (`backend/app/` y `frontend/src/`) y unificando la gestión de estado en el frontend mediante Zustand.

## Issues registrados
El equipo utiliza el tablero de GitHub para organizar las tareas:
- **#1: Implementación de Base de Datos:** Configuración de SQLAlchemy y Postgres.
- **#2: Diseño de Interfaz de Topologías:** Integración de React Flow para el lienzo de dibujo.
- **#3: Sistema de Versionado:** Implementación de almacenamiento JSONB para estados de red.

## Buenas prácticas aplicadas
- **Mensajes de Commit:** Se observa un esfuerzo por categorizar los cambios, aunque existen mensajes genéricos. Ejemplos reales:
  - `docs: update project structure in README.md`
  - `Changes: Simulation network speed ccrrection`
  - `Update: Report PDF`
- **Uso de PRs:** Las funcionalidades complejas se desarrollaron en ramas separadas antes de llegar a `main`.
- **Consistencia:** Se mantiene una estructura de carpetas clara y separada por responsabilidades (Frontend vs Backend).
