import { proyectosApi, actividadesApi, logsApi, versionesApi } from '../../api/netproApi'
import { VIEWS } from '../constants'

export const createManagementSlice = (set, get) => ({
  managedProjectId: null,
  managedProjectName: null,
  recentActivities: [],
  auditLogs: [],
  auditLogsFilter: '',
  versionHistory: [],
  selectedVersions: [],
  versionComparison: null,

  openUserProjects: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      const projects = await proyectosApi.listar(userId)
      if (!projects || projects.length === 0) {
        set({ isLoading: false, error: 'Este ingeniero no tiene proyectos registrados.' })
        return
      }
      const firstProject = projects[0]
      const activities = await actividadesApi.listar(firstProject.id_proyecto)
      set({
        currentView: VIEWS.PROJECT_MANAGEMENT,
        managedProjectId: firstProject.id_proyecto,
        managedProjectName: firstProject.nombre,
        recentActivities: activities,
        isLoading: false,
      })
    } catch (err) {
      set({ isLoading: false, error: err.message })
    }
  },

  openProjectManagement: async (projectId) => {
    const { projects, recentActivities, managedProjectId } = get()
    const project = projects.find(p => p.id_proyecto === projectId)
    const name = project?.nombre ?? `Proyecto ${projectId}`

    const isCached = managedProjectId === projectId && recentActivities.length > 0

    set({
      currentView: VIEWS.PROJECT_MANAGEMENT,
      managedProjectId: projectId,
      managedProjectName: name,
      isLoading: !isCached,
      error: null,
    })

    if (!isCached) {
      try {
        const activities = await actividadesApi.listar(projectId)
        set({ recentActivities: activities, isLoading: false })
      } catch (err) {
        set({ recentActivities: [], isLoading: false, error: err.message })
      }
    } else {
      actividadesApi.listar(projectId)
        .then(activities => set({ recentActivities: activities }))
        .catch(() => {})
    }
  },

  registerActivity: async ({ idVersion, detalleCambio }) => {
    try {
      const nueva = await actividadesApi.registrar({ idVersion, detalleCambio })
      set(s => ({
        recentActivities: [nueva, ...s.recentActivities].slice(0, 5),
      }))
      return nueva
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  reloadActivities: async () => {
    const { managedProjectId } = get()
    if (!managedProjectId) return
    set({ isLoading: true, error: null })
    try {
      const activities = await actividadesApi.listar(managedProjectId)
      set({ recentActivities: activities, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: err.message })
    }
  },

  openLogViewer: async () => {
    const { managedProjectId } = get()
    set({ currentView: VIEWS.LOG_VIEWER, isLoading: true, error: null, auditLogs: [], auditLogsFilter: '' })
    if (!managedProjectId) { set({ isLoading: false }); return }
    try {
      const logs = await logsApi.listar(managedProjectId)
      set({ auditLogs: logs, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: err.message, auditLogs: [] })
    }
  },

  setAuditLogsFilter: (filter) => set({ auditLogsFilter: filter }),

  exportLogsCsv: () => {
    const { auditLogs, auditLogsFilter, managedProjectName } = get()
    const filter = auditLogsFilter.toLowerCase()
    const data = filter
      ? auditLogs.filter(l =>
          l.detalle_cambio?.toLowerCase().includes(filter) ||
          l.fecha_hora?.toLowerCase().includes(filter)
        )
      : auditLogs

    const header = 'Fecha,Detalle\n'
    const rows = data.map(l => {
      const date = l.fecha_hora ?? ''
      const detail = (l.detalle_cambio ?? '').replace(/,/g, ';')
      return `${date},${detail}`
    }).join('\n')
    const csv = header + rows

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `logs_${managedProjectName ?? 'netpro'}_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  },

  openVersionHistory: async () => {
    const { managedProjectId } = get()
    set({ currentView: VIEWS.VERSION_HISTORY, isLoading: true, error: null, versionHistory: [], selectedVersions: [], versionComparison: null })
    if (!managedProjectId) { set({ isLoading: false }); return }
    try {
      const versions = await versionesApi.listar(managedProjectId)
      set({ versionHistory: versions, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: err.message, versionHistory: [] })
    }
  },

  toggleVersionSelection: (versionId) => {
    const selected = get().selectedVersions
    const exists = selected.includes(versionId)
    set({ selectedVersions: exists ? selected.filter(v => v !== versionId) : [...selected, versionId] })
  },

  compareSelectedVersions: async () => {
    const { selectedVersions, versionHistory } = get()
    if (selectedVersions.length < 2) return
    set({ isLoading: true, error: null })
    try {
      const [idA, idB] = selectedVersions
      const verA = versionHistory.find(v => v.id_version === idA)
      const verB = versionHistory.find(v => v.id_version === idB)
      const metricsA = verA?.data_json?.metricas ?? verA?.metricas ?? {}
      const metricsB = verB?.data_json?.metricas ?? verB?.metricas ?? {}
      set({
        isLoading: false,
        versionComparison: {
          anterior: { version: verA, metricas: metricsA },
          actual:   { version: verB, metricas: metricsB },
        }
      })
    } catch (err) {
      set({ isLoading: false, error: err.message })
    }
  },
})
