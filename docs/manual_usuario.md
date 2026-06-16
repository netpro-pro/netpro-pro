# Manual de Usuario

## ¿Qué hace este sistema?
NetPro es una herramienta diseñada para ingenieros de redes que permite dibujar la topología de una red (nodos, enlaces, dispositivos) de forma visual, guardar diferentes versiones de ese diseño y simular el comportamiento del tráfico para analizar cuellos de botella o fallos en la infraestructura.

## Requisitos previos
- **Para el usuario final (Escritorio):** Solo necesita tener instalado el ejecutable de NetPro (`.deb`, `.appimage` o `.exe` según el SO).
- **Para el usuario web:** Un navegador moderno (Chrome, Firefox, Edge) con acceso a la URL del servidor.

## Guía de uso paso a paso

### 1. Acceso al Sistema
- Inicie la aplicación y acceda a la pantalla de **Login**.
- Ingrese sus credenciales. Si es un usuario de prueba, puede usar `ing_demo` / `demo1234`.

### 2. Gestión de Proyectos (Dashboard)
- Desde el Dashboard, puede crear un **Nuevo Proyecto** asignándole un nombre.
- Puede ver la lista de proyectos existentes y seleccionar uno para empezar a trabajar.

### 3. Diseño de la Red (Workspace & Editor)
- **Añadir Dispositivos:** Arrastre y suelte los nodos desde la paleta de componentes al lienzo.
- **Conectar Nodos:** Use la herramienta de enlaces para conectar dos dispositivos.
- **Configurar Nodo:** Haga doble clic en un dispositivo para abrir el **Editor**, donde podrá definir la IP, máscara, gateway y otros parámetros técnicos.
- **Guardar Versión:** Una vez satisfecho con el diseño, guarde una "Versión" del proyecto. Esto crea un snapshot del estado actual.

### 4. Simulación y Análisis
- Diríjase a la pestaña de **Simulación**.
- Configure los parámetros de tráfico y ejecute la simulación.
- El sistema analizará el flujo de datos y marcará los enlaces saturados o nodos fallidos.

### 5. Generación de Reportes
- Acceda a la sección de **Reportes**.
- Seleccione la simulación realizada y genere un documento con los resultados, métricas de rendimiento y sugerencias de optimización.

### 6. Administración (Solo Superadmin)
- Acceda al **Monitor de Usuarios** para crear nuevas cuentas, cambiar roles de otros usuarios o eliminar accesos.

## Ejemplos de uso

**Caso 1: Diseño de una red LAN pequeña**
1. Crear proyecto "Oficina_Piso1".
2. Colocar 1 Router, 1 Switch y 5 PCs.
3. Conectar PCs al Switch y el Switch al Router.
4. Asignar IPs en el rango `192.168.1.0/24` en el Editor.
5. Guardar como "Versión 1.0 - Inicial".

**Caso 2: Simulación de fallo de enlace**
1. En un proyecto existente, ejecute la simulación.
2. Marque un enlace crítico como "Caído".
3. Observe cómo el sistema recalcula las rutas y genere el reporte de impacto.

## Errores comunes y soluciones

| Error | Causa probable | Solución |
|-------|---------------|---------|
| "Error de conexión al servidor" | El backend no está corriendo o la URL es incorrecta | Verifique que el contenedor de Docker esté activo o reinicie el servidor FastAPI |
| "Acceso denegado" | El usuario no tiene el rol necesario (ej: Ingeniero intentando borrar usuarios) | Contacte al Superadmin para solicitar un cambio de rol |
| "Fallo al guardar versión" | Formato de datos JSON inválido o problema de base de datos | Verifique que todos los nodos tengan configuraciones básicas y que la DB esté conectada |
