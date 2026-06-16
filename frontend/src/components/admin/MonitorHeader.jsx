import Button from '../ui/Button'

export default function MonitorHeader({ userName, userRole, ROLES, onLogout, onConfig }) {
  return (
    <header
      style={{
        background: 'var(--np-surface)',
        borderBottom: '1px solid var(--np-border-strong)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--np-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span
          style={{
            color: 'var(--np-text)',
            fontWeight: '700',
            fontSize: '0.9rem',
            letterSpacing: '0.04em',
          }}
        >
          NETPRO
        </span>
        <span style={{ color: 'var(--np-text-muted)', fontSize: '0.82rem' }}>
          | Monitor de Usuarios | Admin. {userName}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {Number(userRole) === ROLES.SUPERADMIN && (
          <Button variant="warning" onClick={onConfig}>
            Configuracion
          </Button>
        )}
        <Button variant="warning" onClick={onLogout}>
          Cerrar Sesion
        </Button>
      </div>
    </header>
  )
}