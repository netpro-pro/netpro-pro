import React from 'react'
import { useWorkspace } from '../hooks/useWorkspace'
import WorkspaceHeader from '../components/layout/WorkspaceHeader'
import WorkspaceEditor from '../components/editor/WorkspaceEditor'
import TopologyCanvas from '../components/simulation/TopologyCanvas'
import SaveSuccessOverlay from '../components/ui/SaveSuccessOverlay'
import ErrorBanner from '../components/ui/ErrorBanner'

export default function Workspace() {
  const { state, actions } = useWorkspace()
  const {
    isLoading,
    error,
    saveSuccess,
    canvasNodes,
    canvasLinks,
    canvasObstacles,
  } = state

  return (
    <div style={{ minHeight: '100vh', background: 'var(--np-bg)', display: 'flex', flexDirection: 'column' }}>
      
      {saveSuccess && <SaveSuccessOverlay />}

      <WorkspaceHeader state={state} actions={actions} />

      {error && <ErrorBanner error={error} onClear={actions.clearError} />}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        
        <WorkspaceEditor state={state} actions={actions} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
          <div style={{
            background: 'var(--np-elevated)',
            borderBottom: '1px solid var(--np-border)',
            padding: '6px 14px',
            fontSize: '0.7rem',
            color: 'var(--np-text-muted)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.04em',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>LIENZO VISUAL — Topología en tiempo real</span>
            <span style={{ color: 'var(--np-text-dim)' }}>
              {canvasNodes.length} nodos · {canvasLinks.length} enlaces{canvasObstacles.length > 0 ? ` · ${canvasObstacles.length} pared(es)` : ''}
            </span>
          </div>

          <div style={{ flex: '1 0 0', overflow: 'hidden', background: 'var(--np-bg)', position: 'relative', minHeight: 0 }}>
            {isLoading ? (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--np-text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
                Cargando versión…
              </div>
            ) : (
              <TopologyCanvas
                nodes={canvasNodes}
                links={canvasLinks}
                obstacles={canvasObstacles}
                onClickNode={actions.openEditor}
              />
            )}
          </div>

          <div style={{
            borderTop: '1px solid var(--np-border)',
            background: 'var(--np-elevated)',
            padding: '6px 14px',
            display: 'flex',
            gap: '16px',
            flexShrink: 0,
          }}>
            {[
              { color: '#53EEFF', label: 'Fiber' },
              { color: '#8D5D04', label: 'Copper' },
              { color: '#3fb950', label: 'Online' },
              { color: 'var(--np-danger)', label: 'Error' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '12px', height: '2px', background: item.color }} />
                <span style={{ fontSize: '0.67rem', color: 'var(--np-text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {item.label}
                </span>
              </div>
            ))}
            <div style={{ marginLeft: 'auto', fontSize: '0.67rem', color: 'var(--np-text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              Click en un nodo para editar sus propiedades
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
