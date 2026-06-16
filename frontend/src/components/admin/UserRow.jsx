import React from 'react';
import Button from '../ui/Button';
import { getUserInitials, getUserAvatarColor } from '../../utils/configuration-utils';

export default function UserRow({ user, isEditing, roles, actions }) {
  const { handleUpdateUserRole, handleCancelEdit, handleEditUser, setUserToDelete } = actions;
  const { editingRole, setEditingRole } = actions; // Wait, editingRole is state, not action. I'll fix the props in UserTable.

  return (
    <div
      className="np-fade-up"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 160px 280px 120px',
        padding: '10px 16px',
        alignItems: 'center',
        borderBottom: '1px solid var(--np-border)',
        background: isEditing ? 'rgba(0,96,127,0.08)' : 'transparent',
        transition: 'background 150ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: getUserAvatarColor(user.id_usuario),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: '700', color: '#fff', flexShrink: 0,
        }}>
          {getUserInitials(user.nombre)}
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--np-text)', fontWeight: '500' }}>
          {user.nombre}
        </span>
      </div>

      <span style={{ fontSize: '0.82rem', color: 'var(--np-text-dim)', letterSpacing: '0.15em' }}>
        ••••••
      </span>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        {isEditing ? (
          <>
            <select
              autoFocus
              value={actions.editingRoleValue}
              onChange={e => actions.setEditingRole(Number(e.target.value))}
              style={{
                background: 'var(--np-elevated)',
                border: '1px solid var(--np-border-strong)',
                borderRadius: '6px',
                color: 'var(--np-text)',
                outline: 'none',
                padding: '4px 8px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                width: 'auto',
              }}
            >
              {roles.map(r => (
                <option key={r.id_rol} value={r.id_rol}>{r.nombre_rol}</option>
              ))}
            </select>
            <Button variant="warning" size="sm" onClick={() => handleUpdateUserRole(user.id_usuario)}>
              Guardar registro
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <span style={{
              fontSize: '0.8rem', color: 'var(--np-text-dim)',
              background: 'var(--np-elevated)',
              border: '1px solid var(--np-border-strong)',
              borderRadius: '4px', padding: '3px 8px',
            }}>
              {user.nombre_rol}
            </span>
            <Button variant="warning" size="sm" onClick={() => handleEditUser(user)}>
              Guardar registro
            </Button>
          </>
        )}
      </div>

      <div>
        <Button variant="danger" size="sm" onClick={() => setUserToDelete(user)}>
          Eliminar
        </Button>
      </div>
    </div>
  );
}
