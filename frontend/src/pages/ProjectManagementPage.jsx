import { VIEWS } from '../store/constants'
import { useProjectManagementLogic } from '../hooks/useProjectManagement'
import Button from '../components/ui/Button'
import SkeletonRow from '../components/ui/SkeletonRow'
import ActivityRow from '../components/admin/ActivityRow'

export default function ProjectManagementPage() {
  const {
    managedProjectId,
    managedProjectName,
    recentActivities,
    isLoading,
    error,
    reloadActivities,
    navigateTo,
    logout,
    clearError,
    handleGoToLogs,
    handleGoToVersions,
  } = useProjectManagementLogic()

  return (
    <div className="np-theme-admin" style={{ minHeight: '100vh', background: 'var(--np-bg)' }}>
      <header style={{
        background: 'var(--np-surface)',
        borderBottom: '1px solid var(--np-border-strong)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke="var(--np-accent)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10
                     15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span style={{
            color: 'var(--np-text)', fontWeight: '700',
            fontSize: '1rem', letterSpacing: '0.06em',
          }}>
            NETPRO
          </span>
          <span style={{ color: 'var(--np-text-muted)', fontSize: '0.82rem' }}>
            | Administración de Proyectos de Usuario
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
           <Button
             variant="ghost"
             size="sm"
             onClick={() => navigateTo(VIEWS.MONITOR)}
           >
             Volver
           </Button>

           <Button
             variant="warning"
             size="sm"
             onClick={logout}
           >
             Cerrar Sesión
           </Button>
        </div>
      </header>

      <main style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
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
               style={{
                 background: 'none', border: 'none', color: 'var(--np-danger)',
                 cursor: 'pointer', fontSize: '1rem', lineHeight: 1,
               }}
            >
              ✕
            </button>
          </div>
        )}

        <div style={{
          background: 'var(--np-surface)',
          border: '1px solid var(--np-border-strong)',
          borderRadius: '10px',
          padding: '28px 28px 24px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '22px',
            flexWrap: 'wrap',
          }}>
            <div>
              <h2 style={{
                margin: 0,
                color: 'var(--np-text)',
                fontWeight: '700',
                fontSize: '1.1rem',
              }}>
                 Proyecto:{' '}
                 <span style={{ color: 'var(--np-text)' }}>
                   {managedProjectName ?? '—'}
                 </span>
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
               <Button
                 variant="ghost"
                 size="md"
                 onClick={handleGoToLogs}
               >
                 Logs
               </Button>

               <Button
                 variant="warning"
                 size="md"
                 onClick={handleGoToVersions}
               >
                 Historial de Versiones
               </Button>
            </div>
          </div>

          <div>
            <p style={{
              margin: '0 0 14px',
              color: 'var(--np-text)',
              fontWeight: '700',
              fontSize: '0.9rem',
            }}>
              Actividades Recientes (Máx. 5)
            </p>

             {isLoading && recentActivities.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '10px',
              }}>
                {[1, 2, 3].map(i => (
                  <SkeletonRow key={i} />
                ))}
              </div>
             ) : recentActivities.length === 0 ? (
              <div style={{
                padding: '24px',
                textAlign: 'center',
                color: 'var(--np-text-muted)',
                fontSize: '0.85rem',
                border: '1px dashed var(--np-border-strong)',
                borderRadius: '6px',
              }}>
                No hay actividades registradas en este proyecto todavía.
              </div>
             ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {recentActivities.map((act) => (
                   <ActivityRow key={act.id_log} detail={act.detalle_cambio} />
                 ))}
              </div>
             )}
          </div>

           {!isLoading && managedProjectId && (
            <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={reloadActivities}
                style={{
                  background: 'none',
                  border: '1px solid var(--np-border-strong)',
                  borderRadius: '5px',
                  color: 'var(--np-text-muted)',
                  padding: '5px 12px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                  transition: 'color 150ms, border-color 150ms',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--np-text)'
                  e.currentTarget.style.borderColor = 'var(--np-accent)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--np-text-muted)'
                  e.currentTarget.style.borderColor = 'var(--np-border-strong)'
                }}
              >
                ↻ Actualizar
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
