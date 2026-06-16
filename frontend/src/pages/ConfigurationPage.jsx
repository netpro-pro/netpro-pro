import React from 'react';
import { useNetProStore } from '../store/useNetProStore';
import { VIEWS } from '../store/constants';
import Button from '../components/ui/Button';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useUserManagement } from '../hooks/useUserManagement';
import UserCreateForm from '../components/admin/UserCreateForm';
import UserTable from '../components/admin/UserTable';

export default function ConfigurationPage() {
  const { state, actions } = useUserManagement();
  const { userName, userToDelete } = state;

  return (
    <div className="np-theme-admin" style={{ minHeight: '100vh', background: 'var(--np-bg)' }}>
      <header style={{
        background: 'var(--np-surface)',
        borderBottom: '1px solid var(--np-border-strong)',
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="var(--np-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span style={{ color: 'var(--np-text)', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '0.04em' }}>
            NETPRO
          </span>
          <span style={{ color: 'var(--np-text-muted)', fontSize: '0.82rem' }}>
            | Monitor de Usuarios | Admin. {userName}
          </span>
        </div>
        <Button variant="warning" onClick={actions.logout}>
          Cerrar Sesion
        </Button>
      </header>

      <main style={{ padding: '24px 20px', maxWidth: '860px', margin: '0 auto' }}>
        <UserCreateForm state={state} actions={actions} />
        <UserTable state={state} actions={actions} />

        <div style={{ marginTop: '20px' }}>
          <Button
            onClick={() => actions.navigateTo(VIEWS.MONITOR)}
            style={{ width: '100%' }}
          >
            Volver al Monitor
          </Button>
        </div>
      </main>

      <ConfirmModal
        open={!!userToDelete}
        title="¿Eliminar usuario?"
        message={`¿Estás seguro de que deseas eliminar a ${userToDelete?.nombre}? Esta acción es permanente y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        destructive={true}
        onConfirm={actions.handleDeleteUser}
        onCancel={() => actions.setUserToDelete(null)}
      />
    </div>
  );
}
