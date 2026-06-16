import React from 'react'
import MonacoEditor from '@monaco-editor/react'

export default function WorkspaceEditor({ state, actions }) {
  const { code, sessionLogs, tab } = state
  const { updateCode, setTab } = actions
  const lines = code.split('\n')

  return (
    <div style={{
      width: '48%',
      minWidth: '320px',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--np-border-strong)',
    }}>
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
        <span>EDITOR DSL — NetPro Topology Language</span>
        <span style={{ color: 'var(--np-text-dim)' }}>{lines.length} líneas</span>
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <MonacoEditor
          height="100%"
          defaultLanguage="plaintext"
          value={code}
          onChange={val => updateCode(val || '')}
          theme="vs-dark"
          options={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            lineHeight: 24,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            padding: { top: 12, bottom: 12 },
            scrollbar: { verticalScrollbarSize: 6 },
          }}
        />
      </div>

      <div style={{
        height: '140px',
        borderTop: '1px solid var(--np-border-strong)',
        background: 'var(--np-elevated)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <div style={{ padding: '4px 10px', borderBottom: '1px solid var(--np-border)', display: 'flex', gap: '12px' }}>
          {['canvas', 'logs'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: tab === t ? 'var(--np-cyan)' : 'var(--np-text-muted)',
              fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              borderBottom: tab === t ? '1px solid var(--np-cyan)' : '1px solid transparent',
              padding: '2px 0',
            }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '6px 10px' }}>
          {tab === 'logs' ? (
            sessionLogs.length === 0 ? (
              <span style={{ color: 'var(--np-text-muted)', fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace' }}>
                Sin actividad reciente. Usa Simular o Guardar.
              </span>
            ) : (
              [...sessionLogs].reverse().map((log, i) => (
                <div key={i} style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--np-text-dim)', marginBottom: '2px' }}>
                  <span style={{ color: 'var(--np-text-muted)', marginRight: '6px' }}>
                    {log.ts.split('T')[1].slice(0, 8)}
                  </span>
                  {log.msg}
                </div>
              ))
            )
          ) : (
            <div style={{ height: '100%' }} /> 
            /* The canvas view is handled by the other panel, 
               but the original code had this tab system in the editor panel 
               where 'canvas' just showed nothing in that small bottom area. */
          )}
        </div>
      </div>
    </div>
  )
}
