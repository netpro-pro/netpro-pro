import { useState, useEffect, useMemo } from 'react'
import { useNetProStore } from '../store/useNetProStore'
import { ROLES, VIEWS } from '../store/constants'
import { isProtectedSuperadmin } from '../utils/netpro-validation'

export function useMonitor() {
  const userName = useNetProStore(s => s.userName)
  const userRole = useNetProStore(s => s.userRole)
  const users = useNetProStore(s => s.users)
  const roles = useNetProStore(s => s.roles)
  const isLoading = useNetProStore(s => s.isLoading)
  const error = useNetProStore(s => s.error)
  const loadUsers = useNetProStore(s => s.loadUsers)
  const updateUserRole = useNetProStore(s => s.updateUserRole)
  const deleteUser = useNetProStore(s => s.deleteUser)
  const openUserProjects = useNetProStore(s => s.openUserProjects)
  const navigateTo = useNetProStore(s => s.navigateTo)
  const logout = useNetProStore(s => s.logout)

  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('Todos')
  const [editingId, setEditingId] = useState(null)
  const [editingRole, setEditingRole] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      const matchRole = roleFilter === 'Todos' || u.nombre_rol === roleFilter
      return matchSearch && matchRole
    })
  }, [users, searchQuery, roleFilter])

  function startEditing(u) {
    if (isProtectedSuperadmin(u)) return
    setEditingId(u.id_usuario)
    setEditingRole(u.id_rol)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditingRole(null)
  }

  async function applyRoleChange(usuarioId) {
    try {
      await updateUserRole(usuarioId, editingRole)
      cancelEditing()
    } catch {}
  }

  async function confirmDeleteUser() {
    if (!confirmDelete) return
    try {
      await deleteUser(confirmDelete.id_usuario)
    } finally {
      setConfirmDelete(null)
    }
  }

  function getInitials(nombre) {
    return nombre.split(/[\s_]/).map(p => p[0]?.toUpperCase()).slice(0, 2).join('')
  }

  const avatarColors = [
    '#00607F', '#1557A8', '#8D5D04', '#3fb950', '#6f42c1', '#d63384',
  ]
  function avatarColor(id) {
    return avatarColors[id % avatarColors.length]
  }

  const navigateToConfig = () => navigateTo(VIEWS.CONFIGURATION)

  return {
    state: {
      userName,
      userRole,
      users,
      roles,
      isLoading,
      error,
      searchQuery,
      roleFilter,
      editingId,
      editingRole,
      confirmDelete,
      filteredUsers,
      getInitials,
      avatarColor,
      isProtectedSuperadmin,
      ROLES,
    },
    actions: {
      setSearchQuery,
      setRoleFilter,
      startEditing,
      cancelEditing,
      setEditingRole,
      applyRoleChange,
      setConfirmDelete,
      confirmDeleteUser,
      openUserProjects,
      navigateTo,
      logout,
      navigateToConfig,
    },
  }
}