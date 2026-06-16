import Input from '../ui/Input'
import MonitorRow from './MonitorRow'

export default function MonitorTable({
  filteredUsers,
  roles,
  isLoading,
  searchQuery,
  roleFilter,
  editingId,
  editingRole,
  onSearchChange,
  onRoleFilterChange,
  onStartEdit,
  onRoleChange,
  onApplyRoleChange,
  onCancelEdit,
  onOpenProjects,
  onDelete,
  isProtectedSuperadmin,
  ROLES,
}) {
  return (
    <>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <Input
          placeholder="Buscar por tipo o por nombre..."
          value={searchQuery}
          onChange={onSearchChange}
          style={{ flex: 1 }}
        />
        <select
          value={roleFilter}
          onChange={onRoleFilterChange}
          style={{
            background: 'var(--np-elevated)',
            border: '1px solid var(--np-border-strong)',
            borderRadius: '6px',
            color: 'var(--np-text)',
            outline: 'none',
            padding: '8px 12px',
            fontSize: '0.85rem',
            width: 'auto',
            minWidth: '130px',
            cursor: 'pointer',
          }}
        >
          <option value="Todos">Todos</option>
          {roles.map((r) => (
            <option key={r.id_rol} value={r.nombre_rol}>
              {r.nombre_rol}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          background: 'var(--np-surface)',
          border: '1px solid var(--np-border-strong)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '56px 1fr 160px 200px 180px',
            padding: '10px 16px',
            borderBottom: '1px solid var(--np-border-strong)',
            background: 'var(--np-elevated)',
          }}
        >
          {['FOTO', 'GESTION DE NOMBRE', 'TIPO', 'EDICIÓN', 'OPCIONES'].map((col, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                color: 'var(--np-text-muted)',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {col}
              {col === 'TIPO' && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                >
                  <path
                    d="M2 3h6M3 5h4M4 7h2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
          ))}
        </div>

        {isLoading && filteredUsers.length === 0 ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: 'var(--np-text-muted)',
              fontSize: '0.85rem',
            }}
          >
            Cargando usuarios…
          </div>
        ) : filteredUsers.length === 0 ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: 'var(--np-text-muted)',
              fontSize: '0.85rem',
            }}
          >
            No se encontraron usuarios.
          </div>
        ) : (
          filteredUsers.map((u, idx) => (
            <MonitorRow
              key={u.id_usuario}
              user={u}
              idx={idx}
              total={filteredUsers.length}
              isEditing={editingId === u.id_usuario}
              roles={roles}
              isProtected={isProtectedSuperadmin(u)}
              onStartEdit={onStartEdit}
              onRoleChange={onRoleChange}
              onApplyRoleChange={onApplyRoleChange}
              onCancelEdit={onCancelEdit}
              onOpenProjects={onOpenProjects}
              onDelete={onDelete}
              ROLES={ROLES}
              editingRole={editingRole}
            />
          ))
        )}
      </div>
    </>
  )
}