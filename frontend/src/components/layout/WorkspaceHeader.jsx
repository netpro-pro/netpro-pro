import React from 'react'
import Button from '../ui/Button'
import { VIEWS } from '../../store/constants'

export default function WorkspaceHeader({ state, actions }) {
  const { userName, projectName, currentVersion, isSaving, isLoading, canReport } = state
  const { navigateTo, handleSave } = actions

  return (
    <header style={{
      background: 'var(--np-surface)',
      borderBottom: '1px solid var(--np-border-strong)',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--np-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span style={{ color: 'var(--np-text)', fontWeight: '700', fontSize: '0.88rem', letterSpacing: '0.04em' }}>NETPRO</span>
        <span style={{ color: 'var(--np-text-muted)', fontSize: '0.78rem' }}>
          | Workspace | {projectName || '—'} {currentVersion ? `| ${currentVersion.numero_version}` : ''}
        </span>
        {userName && (
          <span style={{ color: 'var(--np-text-dim)', fontSize: '0.78rem' }}>| Ing. {userName}</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button variant="ghost" onClick={() => navigateTo('dashboard')}>Volver</Button>
        <Button
          variant={canReport ? 'primary' : 'ghost'}
          onClick={() => canReport && navigateTo(VIEWS.REPORT)}
          disabled={!canReport}
          title={canReport ? 'Generar reporte' : 'No hay datos para reportar — corre una simulación primero'}
        >
          Reporte
        </Button>
        <Button variant="primary" onClick={() => navigateTo(VIEWS.SIMULATION)}>Simular</Button>
        <Button
          variant={isSaving ? 'ghost' : 'primary'}
          onClick={handleSave}
          disabled={isSaving || isLoading}
        >
          {isSaving ? 'Guardando…' : 'Guardar'}
        </Button>
      </div>
    </header>
  )
}
