import Button from '../ui/Button'
import UserAvatar from '../ui/UserAvatar'

export default function MonitorRow({
  user,
  idx,
  total,
  isEditing,
  roles,
  isProtected,
  onStartEdit,
  onRoleChange,
  onApplyRoleChange,
  onCancelEdit,
  onOpenProjects,
  onDelete,
  ROLES,
  editingRole,
}) {
  const isLast = idx === total - 1

  return (
    <div
      className="np-fade-up"
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 1fr 160px 200px 180px',
        padding: '10px 16px',
        alignItems: 'center',
        borderBottom: isLast ? 'none' : '1px solid var(--np-border)',
        background: isProtected ? 'rgba(83,238,255,0.04)' : undefined,
      }}
    >
      <UserAvatar name={user.nombre} id={user.id_usuario} size={36} fontSize="0.75rem" />

      <span
        style={{
          fontSize: '0.85rem',
          color: 'var(--np-text)',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {user.nombre}
        {isProtected && (
          <span
            title="Cuenta protegida"
            style={{
              fontSize: '0.62rem',
              background: 'rgba(83,238,255,0.15)',
              border: '1px solid rgba(83,238,255,0.4)',
              color: 'var(--np-cyan)',
              padding: '1px 6px',
              borderRadius: '3px',
              letterSpacing: '0.04em',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
            }}
          >
            🔒 PROTEGIDA
          </span>
        )}
      </span>

      {isEditing && !isProtected ? (
        <div style={{ position: 'relative' }}>
          <select
            autoFocus
            value={editingRole}
            onChange={(e) => onRoleChange(user.id_usuario, Number(e.target.value))}
            style={{
              background: 'var(--np-elevated)',
              border: '1px solid var(--np-border-strong)',
              borderRadius: '6px',
              color: 'var(--np-text)',
              outline: 'none',
              padding: '5px 8px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            {roles.map((r) => (
              <option key={r.id_rol} value={r.id_rol}>
                {r.nombre_rol}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <span style={{ fontSize: '0.82rem', color: 'var(--np-text-dim)' }}>
          {user.nombre_rol}
        </span>
      )}

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {isProtected ? (
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--np-text-muted)',
              fontStyle: 'italic',
            }}
          >
            — sin opciones —
          </span>
        ) : isEditing ? (
          <>
            <Button variant="warning" size="sm" onClick={() => onApplyRoleChange(user.id_usuario)}>
              Aplicar cambio
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancelEdit}>
              Cancelar
            </Button>
          </>
        ) : (
          <Button variant="warning" size="sm" onClick={() => onStartEdit(user)}>
            Editar Rol
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '6px' }}>
        {user.id_rol === ROLES.ENGINEER && (
          <Button variant="primary" size="sm" onClick={() => onOpenProjects(user.id_usuario)}>
            Proyectos
          </Button>
        )}
        {!isProtected && (
          <Button variant="danger" size="sm" onClick={() => onDelete(user)}>
            Eliminar
          </Button>
        )}
      </div>
    </div>
  )
}