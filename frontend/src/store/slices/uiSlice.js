import { VIEWS } from '../constants'

export const createUiSlice = (set, get) => ({
  currentView: VIEWS.LOGIN,
  isLoading: false,
  error: null,
  sessionLogs: [],

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  navigateTo: (view, params) => set((state) => {
    const next = { currentView: view }
    if (params && Object.prototype.hasOwnProperty.call(params, 'proyectoId')) {
      next.activeProjectId = params.proyectoId
    }
    return next
  }),

  addSessionLog: (msg) => set(s => ({
    sessionLogs: [...s.sessionLogs, { ts: new Date().toISOString(), msg }],
  })),

  clearSessionLogs: () => set({ sessionLogs: [] }),
})
