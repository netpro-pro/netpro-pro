export default function VersionHistoryHeader() {
  return (
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
      <span style={{ color: 'var(--np-text)', fontWeight: '400', fontSize: '1.25rem' }}>
        | Historial de Versiones del Proyecto
      </span>
    </header>
  )
}
