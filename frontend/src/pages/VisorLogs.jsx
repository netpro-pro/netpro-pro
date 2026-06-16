import { useAuditLogs } from '../hooks/useAuditLogs'
import { VIEWS } from '../store/constants'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import SectionTitle from '../components/ui/SectionTitle'
import AuditLogGroup from '../components/admin/AuditLogs/AuditLogGroup'
import AuditLogSkeleton from '../components/admin/AuditLogs/AuditLogSkeleton'

export default function VisorLogs() {
  const { state, actions } = useAuditLogs()
  const { auditLogs, auditLogsFilter, isLoading, error, filteredLogs, groupedLogs } = state
  const { setAuditLogsFilter, exportLogsCsv, clearError, navigateTo } = actions

  return (
    <div className="np-theme-admin" style={{ minHeight: '100vh', background: 'var(--np-bg)' }}>
      <header style={{
        background: 'var(--np-surface)',
        borderBottom: '1px solid var(--np-border-strong)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
          stroke="var(--np-accent)" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10
                   15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span style={{
          color: 'var(--np-text)', fontWeight: '700',
          fontSize: '1.25rem', letterSpacing: '0.04em',
        }}>
          NETPRO
        </span>
        <span style={{
          color: 'var(--np-text)', fontWeight: '400',
          fontSize: '1.25rem',
        }}>
          | Visor de Logs de Auditoría
        </span>
      </header>

      <main style={{ padding: '28px 28px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <Input
              placeholder="Filtrar eventos por dispositivo o tipo de cambio..."
              value={auditLogsFilter}
              onChange={e => setAuditLogsFilter(e.target.value)}
            />
          </div>

          <Button
            variant="ghost"
            onClick={() => navigateTo(VIEWS.PROJECT_MANAGEMENT)}
          >
            Volver
          </Button>

          <Button
            variant="primary"
            onClick={exportLogsCsv}
            disabled={auditLogs.length === 0}
            style={{ background: 'var(--np-gold)' }}
          >
            Exportar Logs (CSV)
          </Button>
        </div>

        {error && (
          <div style={{
            marginBottom: '16px', padding: '10px 14px',
            background: 'rgba(212,15,15,0.15)',
            border: '1px solid var(--np-danger)',
            borderRadius: '6px', color: 'var(--np-danger)', fontSize: '0.82rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>{error}</span>
            <button
               onClick={clearError}
              style={{ background: 'none', border: 'none', color: 'var(--np-danger)', cursor: 'pointer', fontSize: '1rem' }}
            >✕</button>
          </div>
        )}

        <div style={{
          background: 'var(--np-surface)',
          border: '1px solid var(--np-border-strong)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--np-border-strong)',
          }}>
            <SectionTitle>Historial de Eventos Técnicos</SectionTitle>
          </div>

          <div style={{
            padding: '20px',
            minHeight: '200px',
            maxHeight: '60vh',
            overflowY: 'auto',
          }}>
             {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {[1, 2, 3].map(i => <AuditLogSkeleton key={i} />)}
              </div>
            ) : groupedLogs.length === 0 ? (
              <div style={{
                padding: '40px', textAlign: 'center',
                color: 'var(--np-text-muted)', fontSize: '0.85rem',
              }}>
                 {auditLogsFilter
                  ? 'No se encontraron eventos que coincidan con el filtro.'
                  : 'No hay logs registrados en este proyecto todavía.'}
              </div>
            ) : (
              groupedLogs.map(([timestamp, logs]) => (
                <AuditLogGroup key={timestamp} timestamp={timestamp} logs={logs} />
              ))
            )}
          </div>
        </div>

           {!isLoading && auditLogs.length > 0 && (
          <div style={{
            marginTop: '10px',
            fontSize: '0.75rem',
            color: 'var(--np-text-muted)',
            textAlign: 'right',
          }}>
             {auditLogsFilter
              ? `${filteredLogs.length} de ${auditLogs.length} eventos`
                              : `${auditLogs.length} eventos totales`}
          </div>
        )}
      </main>
    </div>
  )
}
