import { usuariosApi } from '../../api/netproApi'
import { isProtectedSuperadmin } from '../../utils/netpro-validation'

export const createAdminSlice = (set, get) => ({
  users: [],
  roles: [],

  loadUsers: async () => {
    set({ isLoading: true, error: null })
    try {
      const [users, roles] = await Promise.all([
        usuariosApi.listar(),
        usuariosApi.listarRoles(),
      ])
      set({ users, roles, isLoading: false })
    } catch (err) { set({ isLoading: false, error: err.message }) }
  },

  createUser: async ({ name, password, id_rol }) => {
    set({ isLoading: true, error: null })
    try {
      const newItem = await usuariosApi.crear({ nombre: name, contrasena: password, id_rol })
      set(s => ({ users: [...s.users, newItem], isLoading: false }))
    } catch (err) { set({ isLoading: false, error: err.message }); throw err }
  },

  updateUserRole: async (userId, id_rol) => {
    const target = get().users.find(u => u.id_usuario === userId)
    if (isProtectedSuperadmin(target)) {
      const error = 'La cuenta superadmin está protegida y no puede cambiar de rol.'
      set({ error })
      throw new Error(error)
    }
    set({ isLoading: true, error: null })
    try {
      const actualizado = await usuariosApi.actualizarRol(userId, id_rol)
      set(s => ({
        users: s.users.map(u => u.id_usuario === userId ? actualizado : u),
        isLoading: false,
      }))
    } catch (err) { set({ isLoading: false, error: err.message }); throw err }
  },

  deleteUser: async (userId) => {
    const target = get().users.find(u => u.id_usuario === userId)
    if (isProtectedSuperadmin(target)) {
      const error = 'La cuenta superadmin está protegida y no puede ser eliminada.'
      set({ error })
      throw new Error(error)
    }
    set({ isLoading: true, error: null })
    try {
      await usuariosApi.eliminar(userId)
      set(s => ({ users: s.users.filter(u => u.id_usuario !== userId), isLoading: false }))
    } catch (err) { set({ isLoading: false, error: err.message }); throw err }
  },
})
