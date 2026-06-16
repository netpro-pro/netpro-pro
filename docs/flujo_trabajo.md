# Evidencia del Flujo de Trabajo Git

## Estrategia utilizada
El proyecto utiliza una variante de **GitHub Flow**, basada en la creación de ramas de funcionalidad (`feature branches`) que se integran a la rama principal (`main`) tras una revisión.

## Ramas del repositorio
- `main`: Rama principal que contiene el código estable y desplegable.
- `feature/network-logic`: Rama dedicada al desarrollo de la lógica de simulación y cálculo de rutas de red.
- `feature/security-audit`: Rama utilizada para la implementación de mejoras de seguridad y auditoría de permisos.

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
