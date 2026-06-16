export default function AuditLogSkeleton() {
  return (
    <div style={{
      borderLeft: '2px solid var(--np-border)',
      paddingLeft: '16px',
      opacity: 0.5,
      animation: 'np-pulse 1.5s ease-in-out infinite',
    }}>
      <div style={{
        background: 'var(--np-elevated)',
        height: '12px',
        width: '140px',
        borderRadius: '4px',
        marginBottom: '8px',
      }} />
      {[1, 2].map(i => (
        <div key={i} style={{
          background: 'var(--np-elevated)',
          height: '14px',
          width: `${60 + i * 15}%`,
          borderRadius: '4px',
          marginBottom: '5px',
        }} />
      ))}
    </div>
  )
}
