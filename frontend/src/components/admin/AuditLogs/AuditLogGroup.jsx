import AuditLogLine from './AuditLogLine'

export default function AuditLogGroup({ timestamp, logs }) {
  return (
    <div
      className="np-fade-up"
      style={{
        marginBottom: '20px',
        borderLeft: '2px solid var(--np-border-strong)',
        paddingLeft: '16px',
      }}
    >
      <div style={{
        fontSize: '0.78rem',
        color: 'var(--np-text-muted)',
        fontFamily: "'JetBrains Mono', monospace",
        marginBottom: '6px',
        letterSpacing: '0.04em',
      }}>
        {timestamp}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {logs.map((log, i) => (
          <AuditLogLine key={log.id_log ?? i} detail={log.detalle_cambio} />
        ))}
      </div>
    </div>
  )
}
