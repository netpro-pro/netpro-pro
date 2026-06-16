import { useMonitor } from '../hooks/useMonitor'
import MonitorHeader from '../components/admin/MonitorHeader'
import MonitorTable from '../components/admin/MonitorTable'
import ConfirmModal from '../components/ui/ConfirmModal'

export default function Monitor() {
  const { state, actions } = useMonitor()

  const {
    userName,
    userRole,
    error,
    filteredUsers,
    roles,
    isLoading,
    searchQuery,
    roleFilter,
    editingId,
    editingRole,
    confirmDelete,
    isProtectedSuperadmin,
    ROLES,
  } = state

  const {
    setSearchQuery,
    setRoleFilter,
    startEditing,
    cancelEditing,
    setEditingRole,
    applyRoleChange,
    setConfirmDelete,
    confirmDeleteUser,
    openUserProjects,
    logout,
    navigateToConfig,
  } = actions

  return (
    <div className="np-theme-admin" style={{ minHeight: '100vh', background: 'var(--np-bg)' }}>
      <MonitorHeader
        userName={userName}
        userRole={userRole}
        ROLES={ROLES}
        onLogout={logout}
        onConfig={navigateToConfig}
      />

      <main style={{ padding: '24px 20px', maxWidth: '860px', margin: '0 auto' }}>
        {error && (
          <div
            style={{
              marginBottom: '16px',
              padding: '10px 14px',
              background: 'rgba(212,15,15,0.15)',
              border: '1px solid var(--np-danger)',
              borderRadius: '6px',
              color: 'var(--np-danger)',
              fontSize: '0.82rem',
            }}
          >
            {error}
          </div>
        )}

        <MonitorTable
          filteredUsers={filteredUsers}
          roles={roles}
          isLoading={isLoading}
          searchQuery={searchQuery}
          roleFilter={roleFilter}
          editingId={editingId}
          editingRole={editingRole}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onRoleFilterChange={(e) => setRoleFilter(e.target.value)}
          onStartEdit={startEditing}
          onRoleChange={setEditingRole}
          onApplyRoleChange={applyRoleChange}
          onCancelEdit={cancelEditing}
          onOpenProjects={openUserProjects}
          onDelete={setConfirmDelete}
          isProtectedSuperadmin={isProtectedSuperadmin}
          ROLES={ROLES}
        />
      </main>

      <ConfirmModal
        open={!!confirmDelete}
        title="¿Eliminar usuario?"
        message={`¿Estás seguro de que deseas eliminar a ${confirmDelete?.nombre}? Esta acción es permanente y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        destructive={true}
        onConfirm={confirmDeleteUser}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}