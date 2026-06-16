import { proyectosApi, versionesApi } from '../../api/netproApi'
import { generateUniqueName } from '../../utils/project-utils'

export const createProjectSlice = (set, get) => ({
  projects: [],
  activeProjectId: null,
  activeProjectName: null,

  loadProjects: async () => {
    const { userId } = get()
    if (!userId) return
    set({ isLoading: true, error: null })
    try { 
      const projects = await proyectosApi.listar(userId)
      set({ projects, isLoading: false }) 
    } catch (err) { 
      set({ isLoading: false, error: err.message }) 
    }
  },

  createProject: async (name) => {
    const { userId } = get()
    const cleanName = (name ?? '').trim()
    if (!userId || !cleanName) return
    const existingNames = new Set(get().projects.map(p => p.nombre))
    const finalName = generateUniqueName(cleanName, existingNames)
    set({ isLoading: true, error: null })
    try {
      await proyectosApi.crear({ nombre: finalName, idUsuario: userId })
      await get().loadProjects()
    } catch (err) { 
      set({ isLoading: false, error: err.message })
      throw err 
    }
  },

  copyProject: async (project) => {
    const { userId } = get()
    if (!userId || !project) return
    const existingNames = new Set(get().projects.map(p => p.nombre))
    const cloneName = generateUniqueName(project.nombre, existingNames)
    set({ isLoading: true, error: null })
    try {
      let snapshot = null
      try {
        snapshot = await versionesApi.ultimaVersion(project.id_proyecto)
      } catch { }

      const newItem = await proyectosApi.crear({
        nombre: cloneName,
        idUsuario: userId,
      })

      if (snapshot?.data_json && Object.keys(snapshot.data_json).length > 0) {
        try {
          await versionesApi.guardar({
            idProyecto: newItem.id_proyecto,
            dataJson: snapshot.data_json,
          })
        } catch (_) {  }
      }

      await get().loadProjects()
    } catch (err) {
      set({ isLoading: false, error: err.message })
      throw err
    }
  },

  renameProject: async (projectId, newName) => {
    const cleanName = (newName ?? '').trim()
    if (!cleanName) return
    const others = get().projects.filter(p => p.id_proyecto !== projectId).map(p => p.nombre)
    const existingNames = new Set(others)
    let final = generateUniqueName(cleanName, existingNames)
    
    set({ isLoading: true, error: null })
    try {
      const updatedItem = await proyectosApi.renombrar(projectId, final)
      set((state) => ({
        isLoading: false,
        projects: state.projects.map(p =>
          p.id_proyecto === projectId ? { ...p, nombre: updatedItem.nombre } : p
        ),
        activeProjectName:
          state.activeProjectId === projectId ? updatedItem.nombre : state.activeProjectName,
        managedProjectName:
          state.managedProjectId === projectId ? updatedItem.nombre : state.managedProjectName,
      }))
    } catch (err) { 
      set({ isLoading: false, error: err.message })
      throw err 
    }
  },

  deleteProject: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      await proyectosApi.eliminar(projectId)
      set((state) => ({ projects: state.projects.filter(p => p.id_proyecto !== projectId), isLoading: false }))
    } catch (err) { 
      set({ isLoading: false, error: err.message })
      throw err 
    }
  },
})
