const BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8000'

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

async function request(method, path, body) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (networkErr) {
    throw new ApiError(
      'No se pudo conectar con el servidor NetPro.',
      0,
      networkErr,
    )
  }

  if (response.status === 204) return null

  let payload
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new ApiError(
      payload?.detail || `Error ${response.status}`,
      response.status,
      payload,
    )
  }
  return payload
}

export const authApi = {
  login: ({ nombre, contrasena }) =>
    request('POST', '/auth/login', { nombre, contrasena }),
}

export const proyectosApi = {
  listar: (usuarioId) =>
    request('GET', `/proyectos/${usuarioId}`),

  crear: ({ nombre, idUsuario }) =>
    request('POST', '/proyectos', { nombre, id_usuario: idUsuario }),

  renombrar: (proyectoId, nombre) =>
    request('PATCH', `/proyectos/${proyectoId}/nombre`, { nombre }),

  eliminar: (proyectoId) =>
    request('DELETE', `/proyectos/${proyectoId}`),
}

export const versionesApi = {
  ultimaVersion: (proyectoId) =>
    request('GET', `/versiones/${proyectoId}/ultima`),

  guardar: ({ idProyecto, dataJson }) =>
    request('POST', '/versiones', { id_proyecto: idProyecto, data_json: dataJson }),

  listar: (proyectoId) =>
    request('GET', `/versiones/${proyectoId}`),
}

export const reportesApi = {
  listar: (proyectoId) =>
    request('GET', `/reportes/${proyectoId}`),

  guardar: ({ idProyecto, metricas, logs }) =>
    request('POST', '/reportes', { id_proyecto: idProyecto, metricas, logs }),
}

export { ApiError }

export const usuariosApi = {
  listar: () =>
    request('GET', '/usuarios'),

  crear: ({ nombre, contrasena, id_rol }) =>
    request('POST', '/usuarios', { nombre, contrasena, id_rol }),

  actualizarRol: (usuarioId, id_rol) =>
    request('PATCH', `/usuarios/${usuarioId}/rol`, { id_rol }),

  eliminar: (usuarioId) =>
    request('DELETE', `/usuarios/${usuarioId}`),

  listarRoles: () =>
    request('GET', '/usuarios/roles/lista'),
}

export const logsApi = {
  listar: (proyectoId, filtro = '') => {
    const qs = filtro ? `?q=${encodeURIComponent(filtro)}` : ''
    return request('GET', `/logs/${proyectoId}${qs}`)
  },
}

export const actividadesApi = {
  listar: (proyectoId) =>
    request('GET', `/actividades/${proyectoId}`),

  registrar: ({ idVersion, detalleCambio }) =>
    request('POST', '/actividades', {
      id_version: idVersion,
      detalle_cambio: detalleCambio,
    }),
}
