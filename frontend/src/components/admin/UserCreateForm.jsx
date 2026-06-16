import React from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function UserCreateForm({ state, actions }) {
  const { userNameInput, userPassword, userRole, validationError, isCreationSuccessful, isLoading, error } = state;
  const { setUserNameInput, setUserPassword, setUserRole, setValidationError, handleCreateUser } = actions;

  return (
    <div style={{
      background: 'var(--np-surface)',
      border: '1px solid var(--np-border-strong)',
      borderRadius: '8px',
      padding: '18px 20px',
      marginBottom: '20px',
    }}>
      <div style={{
        fontSize: '0.78rem', fontWeight: '700', color: 'var(--np-text-muted)',
        letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px',
      }}>
        CREAR NUEVO REGISTRO
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1', minWidth: '150px' }}>
          <Input
            label="Nombre de Usuario"
            placeholder="Nombre de usuario"
            value={userNameInput}
            onChange={e => { setUserNameInput(e.target.value); setValidationError('') }}
          />
        </div>
        <div style={{ flex: '1', minWidth: '150px' }}>
          <Input
            label="Contraseña"
            type="password"
            placeholder="Contraseña"
            value={userPassword}
            onChange={e => { setUserPassword(e.target.value); setValidationError('') }}
            onKeyDown={e => e.key === 'Enter' && handleCreateUser()}
          />
        </div>
        <Button
          onClick={handleCreateUser}
          disabled={isLoading}
          variant="warning"
          style={{ alignSelf: 'flex-end' }}
        >
          Guardar registro
        </Button>
      </div>

      {validationError && (
        <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--np-danger)' }}>
          {validationError}
        </div>
      )}
      {isCreationSuccessful && (
        <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--np-success)' }}>
          ✅ Usuario creado exitosamente.
        </div>
      )}
      {error && !validationError && (
        <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--np-danger)' }}>
          {error}
        </div>
      )}
    </div>
  );
}
