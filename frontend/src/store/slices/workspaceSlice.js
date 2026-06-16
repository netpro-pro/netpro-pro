import { versionesApi, actividadesApi } from '../../api/netproApi'
import { VIEWS } from '../constants'
import { parseNetProCode, diffTopologies, updateGlobalIPs } from '../../utils/netpro-parser'
import { applyCollisions } from '../../utils/netpro-canvas'
import { performPingSimulation, calculateVersionMetrics } from '../../utils/simulation-utils'
import { validateNodeConfig } from '../../utils/netpro-validation'

export const createWorkspaceSlice = (set, get) => ({
  currentCode: '',
  currentVersion: null,
  canvasNodes: [],
  canvasLinks: [],
  canvasObstacles: [],
  cliConfig: { bandwidth: null, networkSpeed: null },
  editingNode: null,
  simulationResult: null,
  simulationResults: [],
  lastPackets: [],

  openWorkspace: async (projectId) => {
    const project = get().projects.find(p => p.id_proyecto === projectId)
    const name = project?.nombre ?? `Proyecto ${projectId}`
    set({
      currentView: VIEWS.WORKSPACE, activeProjectId: projectId, activeProjectName: name,
      isLoading: true, error: null, currentCode: '', currentVersion: null,
      sessionLogs: [], simulationResult: null, simulationResults: [],
      canvasObstacles: [], cliConfig: { bandwidth: null, networkSpeed: null },
    })
    try {
      const version = await versionesApi.ultimaVersion(projectId)
      const code = version.data_json?.codigo ?? ''
      const { nodes, links, obstacles, cli } = parseNetProCode(code)
      set({
        isLoading: false, currentVersion: version, currentCode: code,
        canvasNodes: applyCollisions(nodes),
        canvasLinks: links,
        canvasObstacles: obstacles,
        cliConfig: cli,
      })
    } catch { set({ isLoading: false }) }
  },

  updateCode: (code) => {
    const { nodes, links, obstacles, cli } = parseNetProCode(code)
    set({
      currentCode: code,
      canvasNodes: applyCollisions(nodes),
      canvasLinks: links,
      canvasObstacles: obstacles,
      cliConfig: cli,
    })
  },

  saveVersion: async () => {
    const { activeProjectId, currentCode, currentVersion, simulationResults } = get()
    if (!activeProjectId) return
    set({ isLoading: true, error: null })
    try {
      const oldCode = currentVersion?.data_json?.codigo ?? ''
      const metrics = calculateVersionMetrics(simulationResults)

      const version = await versionesApi.guardar({
        idProyecto: activeProjectId,
        dataJson: { codigo: currentCode, metricas: metrics },
      })

      const changes = diffTopologies(oldCode, currentCode)
      for (const detail of changes) {
        try {
          await actividadesApi.registrar({
            idVersion: version.id_version,
            detalleCambio: detail,
          })
        } catch (_) { }
      }

      set((state) => ({
        isLoading: false,
        currentVersion: version,
        sessionLogs: [
          ...state.sessionLogs,
          {
            ts: new Date().toISOString(),
            msg: `✅ Guardado como ${version.numero_version} (${changes.length} cambios registrados)`,
          },
        ],
      }))
    } catch (err) { set({ isLoading: false, error: err.message }); throw err }
  },

  simulateTopology: () => {
    const { canvasNodes, canvasLinks, canvasObstacles, cliConfig, currentCode } = get()
    const result = performPingSimulation({ canvasNodes, canvasLinks, canvasObstacles, cliConfig, currentCode })
    
    set((state) => ({ 
      simulationResult: result.success ? result.msg : result.msg, 
      sessionLogs: [...state.sessionLogs, { ts: new Date().toISOString(), msg: result.msg }] 
    }))
  },

  openEditor: (node) => set({ currentView: VIEWS.EDITOR, editingNode: { ...node } }),

  applyNodeChanges: (changes) => {
    const { editingNode, currentCode } = get()
    if (!editingNode) return { ok: false, error: 'No hay nodo en edición' }

    const v = validateNodeConfig(changes)
    if (!v.ok) {
      set({ error: v.error })
      return v
    }

    let newCode = currentCode
    const attrs = []
    if (changes.label) attrs.push(`label: "${changes.label}"`)
    if (changes.ip)    attrs.push(`ip: "${changes.ip}"`)
    if (changes.mask)  attrs.push(`mask: "${changes.mask}"`)
    attrs.push(`dhcp: false`)
    const newLine = `device ${changes.name || editingNode.id} type ${editingNode.type} { ${attrs.join(', ')} }`
    const regex = new RegExp(`device\\s+${editingNode.id}\\s+type\\s+\\w+\\s*\\{[^}]*\\}`, 'g')
    newCode = newCode.replace(regex, newLine)
    const { nodes, links, obstacles, cli } = parseNetProCode(newCode)
    set((state) => ({
      currentView: VIEWS.WORKSPACE,
      currentCode: newCode,
      canvasNodes: applyCollisions(nodes),
      canvasLinks: links,
      canvasObstacles: obstacles,
      cliConfig: cli,
      editingNode: null,
      error: null,
      sessionLogs: [
        ...state.sessionLogs,
         { ts: new Date().toISOString(), msg: `✏️  Nodo ${changes.name || editingNode.id} actualizado` },
      ],
    }))
    return { ok: true }
  },

  updateGlobalIPs: ({ search, replacement, transformFn }) => {
    const { currentCode } = get()
    const result = updateGlobalIPs(currentCode, { search, replacement, transformFn })
    
    if (!result.ok) return result
    if (result.count === 0) return { ok: true, count: 0 }

    const { nodes, links, obstacles, cli } = parseNetProCode(result.updatedCode)
    set((state) => ({
      currentCode: result.updatedCode,
      canvasNodes: applyCollisions(nodes),
      canvasLinks: links,
      canvasObstacles: obstacles,
      cliConfig: cli,
      sessionLogs: [
        ...state.sessionLogs,
        { ts: new Date().toISOString(), msg: `🌐 Actualización global de IPs: ${result.count} nodo(s)` },
      ],
    }))
    return { ok: true, count: result.count }
  },

  exitEditor: () => set({ currentView: VIEWS.WORKSPACE, editingNode: null }),

  clearSimulations: () => set(s => ({
    simulationResults: [],
    lastPackets: [],
    simulationResult: null,
    currentVersion: s.currentVersion
      ? { ...s.currentVersion, data_json: { ...s.currentVersion.data_json, metricas: null } }
      : null,
  })),

  saveLastPackets: (packets) => set({ lastPackets: packets }),

  saveSimulationResult: (result) => set(s => ({
    simulationResults: [...s.simulationResults, { ...result, id: Date.now() }],
  })),
})
