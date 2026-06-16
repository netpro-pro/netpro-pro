import React from 'react';
import Input from '../ui/Input';
import UserRow from './UserRow';

export default function UserTable({ state, actions }) {
  const { filteredUsers, roles, isLoading, searchQuery, roleFilterValue, editingId } = state;
  const { setSearchQuery, setRoleFilterValue } = actions;

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <Input
          placeholder="Buscar..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <select
          value={roleFilterValue}
          onChange={e => setRoleFilterValue(e.target.value)}
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
          {roles.map(r => (
            <option key={r.id_rol} value={r.nombre_rol}>{r.nombre_rol}</option>
          ))}
        </select>
      </div>

      <div style={{
        background: 'var(--np-surface)',
        border: '1px solid var(--np-border-strong)',
        borderRadius: '8px', overflow: 'hidden',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 160px 280px 120px',
          padding: '10px 16px',
          borderBottom: '1px solid var(--np-border-strong)',
          background: 'var(--np-elevated)',
        }}>
          {['NOMBRE DEL USUARIO', 'CREDENCIALES (CONTRASEÑA)', 'ROL', 'ACCIONES'].map((col, i) => (
            <span key={i} style={{
              fontSize: '0.72rem', fontWeight: '700',
              color: 'var(--np-text-muted)', letterSpacing: '0.05em',
            }}>
              {col}
            </span>
          ))}
        </div>

        {isLoading && filteredUsers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--np-text-muted)', fontSize: '0.85rem' }}>
            Cargando usuarios…
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--np-text-muted)', fontSize: '0.85rem' }}>
            No se encontraron usuarios.
          </div>
        ) : (
          filteredUsers.map((u, idx) => (
            <UserRow 
              key={u.id_usuario} 
              user={u} 
              isEditing={editingId === u.id_usuario} 
              roles={roles} 
              actions={{
                ...actions,
                editingRoleValue: state.editingRole // pass editingRole here
              }}
              style={{
                // The borderBottom logic is handled inside UserRow or here?
                // For simplicity, I'll let UserRow handle its own border or use a wrapper.
              }}
            />
          ))
        )}
      </div>
    </>
  );
}
