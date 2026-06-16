import { authApi } from '../../api/netproApi'
import { ROLES, VIEWS } from '../constants'

export const createAuthSlice = (set, get) => ({
  userId: null,
  userName: null,
  userRole: null,
  isAuthenticated: false,

  login: async ({ name, password }) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authApi.login({ nombre: name, contrasena: password })
      const destinationView = data.id_rol === ROLES.ENGINEER ? VIEWS.DASHBOARD : VIEWS.MONITOR
      set({ 
        userId: data.id_usuario, 
        userName: data.nombre, 
        userRole: data.id_rol, 
        isAuthenticated: true, 
        currentView: destinationView, 
        isLoading: false 
      })
      if (data.id_rol === ROLES.ENGINEER) get().loadProjects()
    } catch (err) { 
      set({ isLoading: false, error: err.message })
      throw err 
    }
  },

  logout: () => {
    // This will be handled by resetting the entire store in useNetProStore.js
    // but we define the action here for the slice structure.
    set({ userId: null, userName: null, userRole: null, isAuthenticated: false })
  },
})
