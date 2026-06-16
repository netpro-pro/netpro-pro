export default function VersionTableHeaders() {
  const headers = ['SELECCIONAR', 'ITERACIÓN (VERSIÓN)', 'ACCIÓN INDIVIDUAL']
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '100px 1fr 180px',
      padding: '10px 20px',
      borderBottom: '1px solid var(--np-border-strong)',
      background: 'var(--np-elevated)',
    }}>
      {headers.map(h => (
        <span key={h} style={{
          fontSize: '0.72rem', fontWeight: '700',
          color: 'var(--np-text)',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          textAlign: h === 'ACCIÓN INDIVIDUAL' ? 'right' : 'left',
        }}>
          {h}
        </span>
      ))}
    </div>
  )
}
