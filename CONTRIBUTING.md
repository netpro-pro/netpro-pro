# Cómo Contribuir al Proyecto

## Requisitos para contribuir
- Tener Git instalado y configurado.
- Haber leído el `README.md` completo para entender la instalación y ejecución.
- Poseer conocimientos básicos de:
  - Python (FastAPI, SQLAlchemy).
  - JavaScript/TypeScript (React, Zustand).
  - Rust (opcional, solo si se trabaja en el wrapper de Tauri).
- Tener acceso como colaborador al repositorio de GitHub.

## Pasos para contribuir

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repo>
   cd netpro
   ```

2. **Crea una rama para tu cambio:**
   Utilice la convención `feature/` para nuevas funciones o `fix/` para correcciones.
   ```bash
   git checkout -b feature/nombre-descriptivo
   ```

3. **Realiza tus cambios siguiendo las buenas prácticas:**
   - **Estilo de código:** Siga las convenciones existentes en el proyecto (PEP 8 para Python, Airbnb/estándar para React).
   - **Modularidad:** No añada lógica compleja directamente en los componentes de React; use hooks personalizados o el store de Zustand.
   - **Documentación:** Si crea un nuevo módulo o endpoint, actualice el archivo `docs/arquitectura.md`.

4. **Haz commits descriptivos:**
   Utilice el formato de *Conventional Commits*:
   ```bash
   git commit -m "feat: agregar validación de IPs en el editor de nodos"
   ```

5. **Sube tu rama y abre un Pull Request:**
   ```bash
   git push origin feature/nombre-descriptivo
   ```
   Abra un PR hacia la rama `main` describiendo detalladamente los cambios realizados y adjuntando capturas de pantalla si es un cambio visual.

6. **Revisión:**
   Espere a que al menos un integrante del equipo revise el código y apruebe el PR.

## Convención de commits
Para mantener un historial limpio, utilice los siguientes prefijos:
- `feat:` Nueva funcionalidad.
- `fix:` Corrección de un error.
- `docs:` Cambios exclusivamente en la documentación.
- `refactor:` Cambio de código que no añade funcionalidad ni corrige errores.
- `test:` Adición o modificación de pruebas.
- `chore:` Tareas de mantenimiento (actualización de dependencias, configuración de build).

## Reporte de errores
Si encuentra un bug, abra un **Issue** en GitHub detallando:
1. **Descripción:** Qué esperaba que pasara y qué pasó en realidad.
2. **Pasos para reproducir:** Lista numerada de acciones para llegar al error.
3. **Entorno:** Sistema operativo, versión del navegador y versión de NetPro.
4. **Capturas:** Adjunte imágenes o logs del servidor si es posible.
